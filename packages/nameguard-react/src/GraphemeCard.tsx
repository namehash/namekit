import React from "react";
import { ConsolidatedGraphemeGuardReport } from "@namehash/nameguard";
import { Check } from "./Check";

export function GraphemeCard(props: ConsolidatedGraphemeGuardReport) {
  return (
    <div className="grid grid-cols-8 md:grid-cols-12 gap-4 py-5 pl-6">
      <div className="flex md:items-center justify-center">
        <p className="text-4xl text-black font-bold">{props.grapheme}</p>
      </div>
      <div className="md:grid md:grid-cols-7 md:gap-4 col-span-7 md:col-span-11">
        <div className="md:col-span-3">
          <p className="text-black text-sm font-medium">
            {props.grapheme_name}
          </p>
          <p className="hidden md:inline-block text-gray-500 text-sm font-normal">
            {props.grapheme_description}
          </p>
        </div>

        <div className="md:col-span-4 flex space-between space-x-3">
          <div className="flex items-center flex-row-reverse md:flex-row md:space-between justify-between md:justify-start space-y-1 md:space-y-0 md:space-x-2 flex-1 pr-6 md:pr-0">
            <div className="flex-shrink-0 flex items-center justify-center">
              <Check code={props.rating} />
            </div>
            <p className="md:font-medium text-gray-500 md:text-black text-sm">
              {props.rating === "pass"
                ? props.title
                : props.highest_risk?.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
