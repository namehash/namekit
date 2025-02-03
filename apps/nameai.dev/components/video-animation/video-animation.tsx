"use client";

import React, { useEffect } from "react";

export default function VideoAsciiAnimation() {
  useEffect(() => {
    // Grab the necessary DOM elements.
    const video = document.getElementById("input") as HTMLVideoElement | null;
    const canvas = document.getElementById(
      "prerender",
    ) as HTMLCanvasElement | null;
    const output = document.getElementById("output") as HTMLDivElement | null;
    if (!video || !canvas || !output) return;

    // Add loop handling
    video.addEventListener("timeupdate", () => {
      // If we're near the end of the video (within 0.2 seconds)
      if (video.duration - video.currentTime < 0.2) {
        // Set the current time to 0 before it actually ends
        video.currentTime = 0;
      }
    });

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Define the ASCII character set.
    const charsFixed: (string | string[])[] = [
      "_",
      ".",
      ",",
      "-",
      "=",
      "+",
      ":",
      ";",
      "c",
      "b",
      "a",
      "!",
      "?",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      ["9", "8"],
      ["✚", "✚", "✚", "✚", "✚", "⚛︎"],
      ["☺︎", "☹︎"],
      "☀︎",
      ["@", "#"],
      ["X", "Y", "Z"],
      "'",
    ];
    let chars: (string | string[])[] = [...charsFixed];
    let charsLength = chars.length;
    const MAX_COLOR_INDEX = 255;

    // Function to capture video frames, convert to ASCII, and render.
    let lastDrawTime = 0;
    const FRAME_INTERVAL = 1000 / 24; // Reduced to 24 FPS for better performance
    let animationFrameId: number;

    function updateCanvas(timestamp: number) {
      // Skip frame if too soon
      if (timestamp - lastDrawTime < FRAME_INTERVAL) {
        animationFrameId = requestAnimationFrame(updateCanvas);
        return;
      }

      const w = canvas?.width;
      const h = canvas?.height;
      if (!w || !h || !ctx || !video || video.paused) return;

      try {
        ctx.drawImage(video, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        const rows = [];

        // Process frames in chunks
        for (let y = 0; y < h; y++) {
          const spans = new Array(w);
          for (let x = 0; x < w; x++) {
            const index = (x + y * w) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const c = (r + g + b) / 3;
            const charIndex = Math.floor((charsLength * c) / MAX_COLOR_INDEX);
            const result = chars[charIndex];
            const char = Array.isArray(result)
              ? result[Math.floor(Math.random() * result.length)]
              : result;
            spans[x] =
              `<span style="color: rgb(${r},${g},${b})">${char || "&nbsp;"}</span>`;
          }
          rows.push(`<div>${spans.join("")}</div>`);
        }

        output!.innerHTML = rows.join("");
        output!.style.setProperty(
          "--color",
          `rgb(${data[0]},${data[1]},${data[2]})`,
        );

        lastDrawTime = timestamp;
      } catch (error) {
        console.error("Frame processing error:", error);
      }

      animationFrameId = requestAnimationFrame(updateCanvas);
    }

    // Start the video and begin the animation.
    video.play().then(() => {
      animationFrameId = requestAnimationFrame(updateCanvas);
    });

    // Clean up
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      video.removeEventListener("timeupdate", () => {});
    };
  }, []);

  return (
    <div className=" top-0 left-0 w-full h-full z-[-1]">
      {/* The container where the ASCII art will be rendered */}
      <div id="output" className="fixed top-0 left-0 w-full h-full" />

      {/* Hidden video element used as the source */}
      <video
        id="input"
        autoPlay
        muted
        loop
        playsInline
        crossOrigin="anonymous"
        className="hidden w-full h-full"
      >
        <source
          src="https://bucket.ensrainbow.io/nameai-1.mp4"
          type="video/mp4"
        />
      </video>

      {/* Hidden canvas element used for processing */}
      <canvas id="prerender" width="96" height="32" className="hidden"></canvas>

      {/* CSS styling */}
      <style jsx global>{`
        :root {
          --color-primary: #ee75d2;
          --color-secondary: #75d8ee;
          --color-tertiary: #deee75;
          --color-quaternary: #9375ee;
          --color-surface: #271c22;
          --brightness: 1;
        }
        /* Container for the ASCII animation */
        #output {
          position: relative; /* Part of the normal document flow */
          width: 100vw;
          height: 400px; /* Adjust this value to change the animation's height */
          margin: 0 auto;
          text-align: center;
          font-family: "SF Mono", monospace;
          overflow: hidden;
          /* Removed drop-shadow for a non-neon effect */
          filter: brightness(var(--brightness));
          transition: filter 0.3s linear;
          white-space: nowrap;
          background: black;
        }
        #output div,
        #output span {
          white-space: nowrap;
        }
        /* Optional: Reset body margins/padding */
        body {
          margin: 0;
          padding: 0;
        }
        :root {
          font-size: 60%;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
