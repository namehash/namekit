"use client";

import React, { useEffect } from "react";

export default function VideoAsciiAnimation() {
  useEffect(() => {
    const video = document.getElementById("input") as HTMLVideoElement | null;
    const canvas = document.getElementById(
      "prerender",
    ) as HTMLCanvasElement | null;
    const output = document.getElementById("output") as HTMLDivElement | null;

    if (!video || !canvas || !output) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // 🎨 Original ASCII Character Set
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

    let animationFrameId: number;
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS for smoothness
    let lastDrawTime = 0;

    function updateCanvas(timestamp: number) {
      if (timestamp - lastDrawTime < FRAME_INTERVAL) {
        animationFrameId = requestAnimationFrame(updateCanvas);
        return;
      }

      const w = canvas!.width;
      const h = canvas!.height;
      if (!w || !h || !video || video.paused) {
        animationFrameId = requestAnimationFrame(updateCanvas);
        return;
      }

      ctx!.drawImage(video, 0, 0, w, h);
      const data = ctx!.getImageData(0, 0, w, h).data;

      // Create a document fragment to batch DOM updates
      const fragment = document.createDocumentFragment();
      for (let y = 0; y < h; y++) {
        const row = document.createElement("div");
        for (let x = 0; x < w; x++) {
          const index = (x + y * w) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const c = (r + g + b) / 3; // Calculate brightness
          const charIndex = Math.floor((charsLength * c) / MAX_COLOR_INDEX);
          const result = chars[charIndex];
          const char = Array.isArray(result)
            ? result[Math.floor(Math.random() * result.length)]
            : result;

          const span = document.createElement("span");
          span.style.color = `rgb(${r}, ${g}, ${b})`;
          span.textContent = char ?? " ";
          row.appendChild(span);
        }
        fragment.appendChild(row);
      }

      // Update the output element in one operation using replaceChildren
      output!.replaceChildren(fragment);

      lastDrawTime = timestamp;
      animationFrameId = requestAnimationFrame(updateCanvas);
    }

    video.play().then(() => {
      animationFrameId = requestAnimationFrame(updateCanvas);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absoulute top-0 left-0 w-full h-full  bg-white">
      <div
        id="output"
        className="relative bg-white top-0 left-0 w-full h-full font-mono leading-none"
      />

      <video
        id="input"
        autoPlay
        muted
        loop
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      >
        <source
          src="https://assets.codepen.io/907471/rainbow_s.mp4"
          type="video/mp4"
        />
      </video>

      <canvas
        id="prerender"
        width="120"
        height="40"
        className="hidden bg-red-500"
      ></canvas>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: white;
          font-family: "Courier New", monospace;
        }
        #output {
          text-align: center;
          font-size: 23.6px; /* Raised from 7px to 14px for bigger characters */
          white-space: pre;
          line-height: 21px; /* Adjusted line-height accordingly */
          /* Alternatively, you could use a CSS transform:
          transform: scale(2);
          transform-origin: top left;
          */
        }
        #output span {
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
