"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
// The meshline library may export MeshLine, MeshLineMaterial, etc.
import { MeshLine, MeshLineMaterial } from "three.meshline";
// Optionally GSAP for animations
import { gsap } from "gsap";
import { createRoot } from 'react-dom/client';
import { Heading, Text } from "@namehash/namekit-react";

export default function Animation() {
  const containerRef = useRef();

  useEffect(() => {
    // ----- Only run on client side -----
    if (!containerRef.current) return;

    let animationFrameId;

    // ----------------------
    // Setup Renderer/Scene
    // ----------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.zIndex = '10'; // Keep canvas behind the text
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000,
    );
    camera.position.set(0, 0, 10);

    // ----------------------
    // Handle Resize
    // ----------------------
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize);

    // ----------------------
    // Create the "WindLine" mesh
    // (mirroring your code from CodePen)
    // ----------------------
    function getRandomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const COLORS = ["#0080BC", "#CEE1E8", "#007C23", "#F53293"];

    class WindLine extends THREE.Mesh {
      constructor({
        nbrOfPoints = getRandomFloat(3, 5),
        length = getRandomFloat(5, 8),
        speed = 0.003,
        color = "#000",
      } = {}) {
        // Create the points
        const points = [];
        const segmentLength = length / nbrOfPoints;
        points.push(new THREE.Vector3(0, 0, 0));
        for (let i = 0; i < nbrOfPoints; i++) {
          const pos = segmentLength * i;
          points.push(
            new THREE.Vector3(
              pos - getRandomFloat(-2.1, 2.1),
              pos + segmentLength * i,
              0,
            ),
          );
        }

        // Use a THREE.Curve => SplineCurve => geometry
        const curve = new THREE.SplineCurve(points);
        const path = new THREE.Path(curve.getPoints(50));
        const pointsArray = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(pointsArray);
        // The MeshLine library
        const line = new MeshLine();
        line.setGeometry(geometry);

        // Create a MeshLineMaterial
        const dashArray = 2;
        const dashRatio = 0.99;
        const dashOffsetStart = dashArray * dashRatio;
        super(
          line.geometry,
          new MeshLineMaterial({
            lineWidth: 0.05,
            dashArray,
            dashRatio,
            dashOffset: dashOffsetStart,
            opacity: 0,
            transparent: true,
            depthWrite: false,
            color: new THREE.Color(color),
          }),
        );

        // Modify the random z position to have a wider range
        this.position.set(
          getRandomFloat(-10, 10),
          getRandomFloat(-6, 5),
          getRandomFloat(-10, 10), // Changed from (-2, 10) to (-10, 10) for more depth variation
        );
        this.speed = speed;
        // Where we consider the "line done"
        this.dyingOffset = 1.01;
      }

      update() {
        const mat = this.material.uniforms;
        mat.dashOffset.value -= this.speed;

        // Fade in/out logic
        const isAboveDying = mat.dashOffset.value > this.dyingOffset + 0.25;
        const targetOpacity = isAboveDying ? 1 : 0;
        mat.opacity.value += (targetOpacity - mat.opacity.value) * 0.08;
      }

      isDied() {
        return this.material.uniforms.dashOffset.value < this.dyingOffset;
      }
    }

    // ----------------------
    // Group of lines
    // ----------------------
    class Wind extends THREE.Object3D {
      constructor() {
        super();
        this.lines = [];
        this.lineCount = 0;
      }
      addWindLine() {
        const c = COLORS[getRandomInt(0, COLORS.length - 1)];
        const line = new WindLine({ color: c });
        this.lines.push(line);
        this.add(line);
        this.lineCount++;
      }
      removeWindLine() {
        this.remove(this.lines[0]);
        this.lines.shift();
        this.lineCount--;
      }
      update() {
        // 65% chance to add new line
        if (Math.random() < 0.65) {
          this.addWindLine();
        }
        // Update existing lines
        for (let i = this.lineCount - 1; i >= 0; i--) {
          const line = this.lines[i];
          line.update();
          // If line is done, remove
          if (line.isDied()) {
            this.removeWindLine();
          }
        }
      }
    }

    // ----------------------
    // Setup the text
    // (requires a font asset)
    // ----------------------
    class AnimatedText {
      constructor() {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.width = '100%';
        container.style.opacity = '0';
        container.style.zIndex = '20'; // Increased z-index to be higher than the canvas
        container.style.pointerEvents = 'none';
        containerRef.current.appendChild(container);
        this.container = container;

        // Create a root using createRoot
        this.root = createRoot(container);
        
        // Use root.render instead of ReactDOM.render
        this.root.render(
          <div className="space-y-3 text-center px-5">
            <div>
              <Heading as="h1" className="text-white lg:!text-6xl max-w-[600px] mx-auto">
                Enable new ENS user experiences
              </Heading>
              <Heading as="h1" className="text-white lg:!text-6xl">
                
              </Heading>
            </div>
            <Text className="text-gray-400">What will you build?</Text>
          </div>
        );
      }

      show(duration = 0.6) {
        gsap.to(this.container, {
          opacity: 1,
          y: 0,
          duration,
          ease: "back.out(2)",
          from: { opacity: 0, y: 20 }
        });
      }
    }

    // Create "wind lines" group
    const wind = new Wind();
    scene.add(wind);

    // Create the text after some delay
    setTimeout(() => {
      const text = new AnimatedText();
      text.show();
    }, 1000);

    // ----------------------
    // Basic camera parallax
    // ----------------------
    const lookAt = new THREE.Vector3(0, 0, 0);
    const mouse = { x: 0, y: 0 };
    function onMouseMove(e) {
      mouse.x = -(e.clientX / window.innerWidth - 0.5) * 8;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 4;
    }
    document.body.addEventListener("mousemove", onMouseMove);

    // ----------------------
    // Animation Loop
    // ----------------------
    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      // update wind lines
      wind.update();

      // simple camera easing to mouse
      camera.position.x += (mouse.x - camera.position.x) * 0.05;
      camera.position.y += (mouse.y - camera.position.y) * 0.05;
      camera.lookAt(lookAt);

      renderer.render(scene, camera);
    }
    animate();

    // ----------------------
    // Cleanup on Unmount
    // ----------------------
    const cleanup = () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onWindowResize);
      document.body.removeEventListener("mousemove", onMouseMove);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        const textContainer = containerRef.current.querySelector('[data-animated-text]');
        if (textContainer && this.root) {
          this.root.unmount();
          textContainer.remove();
        }
      }
      renderer.dispose();
    };
    return cleanup;
  }, []); // run once on mount

  return (
    <div 
      id="animated-text" 
      ref={containerRef} 
      style={{ 
        width: "100%", 
        height: "100%",
        position: "relative" // Add this to establish a stacking context
      }}
    >
      {/* The Three.js canvas will be appended here */}
    </div>
  );
}
