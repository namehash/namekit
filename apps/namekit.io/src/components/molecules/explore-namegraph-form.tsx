"use client";

import { useState } from "react";

export const ExploreNameGraphForm = () => {
  const [exploreNameGraphInput, setExploreNameGraphInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exploreNameGraphInput.trim()) return;

    const encodedSearch = encodeURIComponent(exploreNameGraphInput);
    window.open(
      `https://www.namegraph.dev/collections?search=${encodedSearch}`,
      "_blank",
    );
  };

  return (
    <div className="bg-gray-50 py-4 px-5 rounded-[12px] my-5">
      <p className="mb-1 text-lg font-semibold">Explore the NameGraph</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row lg:space-x-3 lg:my-4"
      >
        <input
          onChange={(e) => setExploreNameGraphInput(e.target.value)}
          className="ens-webfont my-3 focus:outline-none hover:border-gray-400 transition lg:my-0 rounded-lg placeholder:text-gray-400 py-2.5 px-3 w-full border border-gray-300"
          placeholder="Your search..."
          name="exploreNameGraph"
          type="text"
          value={exploreNameGraphInput}
        />
        <button
          type="submit"
          className="hover:bg-gray-800 transition w-full lg:w-[224px] font-medium text-white bg-black rounded-xl shadow py-2.5"
        >
          Get Name Ideas
        </button>
      </form>
    </div>
  );
};
