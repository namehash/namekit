"use client";

import { Rating } from "@namehash/nameguard";
import { RatingIcon, RatingIconSize } from "@namehash/nameguard-react";

export default function RatingShieldsPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      <div className="divide-y divide-gray-100">
        <h1 className="justify-center flex font-bold text-2xl mb-4">
          {"<"}RatingIcon {"/>"} documentation
        </h1>

        <div className="grid grid-cols-4 gap-x-6 py-5 text-center font-medium mt-12">
          <div></div>
          <div>Rating.pass</div>
          <div>Rating.warn</div>
          <div>Rating.alert</div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-4 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{`<RatingIcon large />`}</pre>
            </div>

            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.pass} size={RatingIconSize.large} />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.warn} size={RatingIconSize.large} />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.alert} size={RatingIconSize.large} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{`<RatingIcon medium />`}</pre>
            </div>

            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.pass} size={RatingIconSize.medium} />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.warn} size={RatingIconSize.medium} />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.alert} size={RatingIconSize.medium} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{`<RatingIcon small />`}</pre>
            </div>

            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.pass} size={RatingIconSize.small} />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.warn} size={RatingIconSize.small} />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.alert} size={RatingIconSize.small} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{`<RatingIcon micro />`}</pre>
            </div>

            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.pass} size={RatingIconSize.micro} />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.warn} size={RatingIconSize.micro} />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon rating={Rating.alert} size={RatingIconSize.micro} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{`<RatingIcon isNotInteractive />`}</pre>
            </div>

            <div className="flex items-center justify-center">
              <RatingIcon
                rating={Rating.pass}
                isNotInteractive={true}
                size={RatingIconSize.medium}
              />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon
                rating={Rating.warn}
                isNotInteractive={true}
                size={RatingIconSize.medium}
              />
            </div>
            <div className="flex items-center justify-center">
              <RatingIcon
                rating={Rating.alert}
                isNotInteractive={true}
                size={RatingIconSize.medium}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
