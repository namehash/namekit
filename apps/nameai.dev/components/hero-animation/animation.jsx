"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
// The meshline library may export MeshLine, MeshLineMaterial, etc.
import { MeshLine, MeshLineMaterial } from "three.meshline";
// Optionally GSAP for animations
import { gsap } from "gsap";

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

    const COLORS = ["#4062BB", "#52489C", "#59C3C3", "#F45B69"];

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

        // Random start position
        this.position.set(
          getRandomFloat(-10, 10),
          getRandomFloat(-6, 5),
          getRandomFloat(-2, 10),
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
      constructor(text, { color = "#000" } = {}) {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.color = color;
        div.style.fontSize = '2rem';
        div.style.fontFamily = 'sans-serif';
        div.style.opacity = '0';
        div.textContent = text;
        containerRef.current.appendChild(div);
        this.element = div;
      }

      show(duration = 0.6) {
        gsap.to(this.element, {
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
      const text = new AnimatedText("Animated Dashed Lines", {
        color: "#ffffff"
      });
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
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onWindowResize);
      document.body.removeEventListener("mousemove", onMouseMove);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      const textElements = containerRef.current.querySelectorAll('#animated-text');
      textElements.forEach(el => el.remove());
    };
  }, []); // run once on mount

  return (
    <div id="animated-text" ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {/* The Three.js canvas will be appended here */}
    </div>
  );
}
