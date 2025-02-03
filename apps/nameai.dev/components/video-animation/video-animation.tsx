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

      const w = canvas?.width ?? 0;
      const h = canvas?.height ?? 0;
      if (!w || !h || !ctx || !video || video.paused) return;

      ctx.drawImage(video, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;

      const fragment = document.createDocumentFragment(); // Batch DOM updates
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
          span.style.color = `rgb(${r},${g},${b})`;
          span.textContent = char ?? " ";
          row.appendChild(span);
        }
        fragment.appendChild(row);
      }

      output!.innerHTML = "";
      output!.appendChild(fragment);

      lastDrawTime = timestamp;
      animationFrameId = requestAnimationFrame(updateCanvas);
    }

    video.play().then(() => {
      animationFrameId = requestAnimationFrame(updateCanvas);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="top-0 left-0 w-full h-full z-[-1]">
      <div
        id="output"
        className="relative top-0 left-0 w-full h-full font-mono leading-none"
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
        className="hidden"
      ></canvas>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: black;
          font-family: "Courier New", monospace;
        }
        #output {
          text-align: center;
          font-size: 7px; /* Adjust font size to match ASCII size */
          white-space: pre;
          line-height: 5px;
        }
        #output span {
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
