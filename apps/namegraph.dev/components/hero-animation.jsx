import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
// Import post-processing passes:
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export const ThreeJSAnimation = () => {
  useEffect(() => {
    let scene, camera, renderer, cloud, material, controls, gui;
    let canvas, ctx, texture;
    let animationFrameId;
    let composer;
    
    // Initialize the scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(40, 0, -40);
    camera.lookAt(scene.position);
  
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0x000000)); // Background color
    // renderer.setClearColor(new THREE.Color(0xffffff)); // Background color
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    const webglContainer = document.getElementById('webgl');
    webglContainer.appendChild(renderer.domElement);

    // Setup post-processing for a more subtle bloom (neon glow) effect
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    // Adjust these parameters to make the glow more subtle:
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8,  // reduced bloom strength
      0.3,  // reduced bloom radius
      0.0   // bloom threshold remains the same
    );
    composer.addPass(bloomPass);

    // Create a radial gradient texture for uniformly colored, glowy particles
    canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    ctx = canvas.getContext('2d');

    // Use a uniform particle color.
    const particleColor = "114, 152, 248"; // RGB for cyan
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, 
      canvas.height / 2, 
      0, 
      canvas.width / 2, 
      canvas.height / 2, 
      canvas.width / 2
    );
    // Nearly the whole circle is a solid color then fades out at the very edge.
    gradient.addColorStop(0, `rgba(${particleColor},1)`);    // Center fully opaque
    gradient.addColorStop(0.8, `rgba(${particleColor},1)`);    // Uniform color for most of the area
    gradient.addColorStop(1, `rgba(${particleColor},0)`);      // Fade to transparent at the edge

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();

    texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Controls for the geometry
    controls = new function () {
      this.radius = 40;
      this.tube = 40;
      this.radialSegments = 250;
      this.tubularSegments = 20;
      this.p = 9;
      this.q = 14;
      this.redraw = () => {
        // Store the current rotation if cloud exists
        let currentRotation = { x: 0, y: 0, z: 0 };
        if (cloud) {
          currentRotation.x = cloud.rotation.x;
          currentRotation.y = cloud.rotation.y;
          currentRotation.z = cloud.rotation.z;
          scene.remove(cloud);
        }
        
        const geo = new THREE.TorusKnotGeometry(
          controls.radius, 
          controls.tube, 
          Math.round(controls.radialSegments), 
          Math.round(controls.tubularSegments), 
          Math.round(controls.p), 
          Math.round(controls.q)
        );
        material = new THREE.PointsMaterial({
          color: 0xffffff, // Use white so that the texture color is not altered.
          size: 0.2,
          sizeAttenuation: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
          map: texture,
          depthWrite: false,
        });

        // Inject shader code to discard fragments outside a circle.
        // This ensures each point appears round.
        material.onBeforeCompile = shader => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <alphatest_fragment>',
            `
              vec2 c = gl_PointCoord - vec2(0.5);
              if(dot(c, c) > 0.25) discard;
            `
          );
        };

        cloud = new THREE.Points(geo, material);
        
        // Apply the stored rotation to the new cloud
        cloud.rotation.x = currentRotation.x;
        cloud.rotation.y = currentRotation.y;
        cloud.rotation.z = currentRotation.z;
        
        scene.add(cloud);
      };
    };

    // GUI for interaction
    // gui = new dat.GUI();
    // gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
    // gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
    // gui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
    // gui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
    // gui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
    // gui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
    // controls.redraw();

    // Setup initial values and target values:
    const initialRadius = controls.radius;  // 40
    const initialTube = controls.tube;        // 40
    const targetRadius = 1;                   // Final radius value
    const targetTube = 10;                    // Final tube value
    const delayBeforeAnimation = 3000;        // 3 seconds delay before animation starts
    const automationDuration = 5000;          // 5 seconds in milliseconds
    const automationStartTime = performance.now() + delayBeforeAnimation;

    // Initialize the geometry with initial values
    controls.redraw();

    // Add lighting
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, -5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Animation render function
    const render = () => {
      // Animate radius and tube after a 3-second delay
      const currentTime = performance.now();
      const elapsed = currentTime - automationStartTime;
      
      if (elapsed >= 0 && elapsed < automationDuration) {
        // Use a smooth easing function (ease-in-out)
        const t = elapsed / automationDuration; // Normalized time from 0 to 1
        const smoothT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        
        // Interpolate each value:
        const newRadius = initialRadius * (1 - smoothT) + targetRadius * smoothT;
        const newTube = initialTube * (1 - smoothT) + targetTube * smoothT;
        
        // Only redraw if there's a significant change to reduce performance impact
        if (Math.abs(controls.radius - newRadius) > 0.01 || Math.abs(controls.tube - newTube) > 0.01) {
          controls.radius = newRadius;
          controls.tube = newTube;
          controls.redraw();
        }
      }
      
      // Always rotate the cloud for continuous animation
      if (cloud) {
        cloud.rotation.x += 0.0001;
        cloud.rotation.z += 0.001;
      }
      
      composer.render();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Window resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup when component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of renderer, gui, and remove the canvas from the DOM if needed
      if (renderer && renderer.domElement) {
        webglContainer.removeChild(renderer.domElement);
        renderer.dispose();
      }
      if (gui) {
        gui.destroy();
      }
    };
  }, []);

  return <div className='lg:animate-fadeInAndMoveLeft animate-fadeIn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' id="webgl" style={{ width: '100%', height: '100%' }} />;
}; 

