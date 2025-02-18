"use client";

import { Button, Input } from "@namehash/namekit-react";
import { useState } from "react";

export const ExploreNameGraphForm = () => {
  const [exploreNameGraphInput, setExploreNameGraphInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!exploreNameGraphInput.trim()) {
      window.open("https://www.namegraph.io/collections", "_blank");
      return;
    }

    const encodedSearch = encodeURIComponent(exploreNameGraphInput);
    window.open(
      `https://www.namegraph.io/collections?search=${encodedSearch}`,
      "_blank",
    );
  };

  return (
    <div className="bg-gray-50 py-4 px-5 rounded-[12px] my-5 w-full">
      <p className="mb-1 text-lg font-semibold">Explore the NameGraph</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row lg:space-x-3 space-y-3 lg:space-y-0 lg:my-4"
      >
        <div className="flex-1">
          <Input
            onChange={(e) => setExploreNameGraphInput(e.target.value)}
            className="w-full py-3 px-3 min-w-0 flex-1"
            placeholder="Your search..."
            name="exploreNameGraph"
            type="text"
            value={exploreNameGraphInput}
          />
        </div>

        <Button className="justify-center" type="submit" variant="primary">
          Get Name Ideas
        </Button>
      </form>
    </div>
  );
};
