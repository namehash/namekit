import React, { forwardRef, type Ref } from "react";
import useSWR from "swr";
import { type GraphemeGuardReport, nameguard } from "@namehash/nameguard";

import { useGraphemeModalStore } from "../../stores/grapheme";
import { Slideover } from "../Slideover/Slideover";
import { CheckResultCard } from "../Report/CheckResultCard";
import { RatingIcon, RatingIconSize } from "../Report/RatingIcon";
import { RatedBox } from "../RatedBox/RatedBox";
import { ConfusableList } from "./ConfusableList";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Tooltip } from "@namehash/namekit-react";

export const GraphemeModal = forwardRef((_, ref: Ref<HTMLDivElement>) => {
  const { isGraphemeModalOpen, closeGraphemeModal, currentGrapheme } =
    useGraphemeModalStore();

  const { data, isLoading } = useSWR<GraphemeGuardReport>(
    currentGrapheme,
    (g: string) => nameguard.inspectGrapheme(g),
  );

  const totalCodepoints = data?.codepoints?.length ?? 0;
  const [firstCodepoint] = data?.codepoints ?? [];

  const handleClose = () => {
    closeGraphemeModal(currentGrapheme);
  };

  return (
    <Slideover
      title={
        data?.grapheme_name ?? (
          <div className="ng-w-56 ng-h-3 ng-rounded ng-bg-gradient-to-r ng-from-gray-300 ng-to-gray-100 ng-animate-pulse"></div>
        )
      }
      isOpen={isGraphemeModalOpen}
      onClose={handleClose}
      ref={ref}
    >
      {isLoading || !data ? (
        <LoadingSkeleton />
      ) : (
        <div className="ng-p-6 ng-space-y-8 ng-w-full">
          <RatedBox rating={data?.rating}>
            <div className="ng-px-5 ng-pt-7 ng-pb-10 md:ng-py-7 lg:ng-pt-8 lg:ng-pb-10 md:ng-px-[30px] ng-flex ng-flex-col">
              <div className="ng-flex ng-items-center ng-justify-between">
                <div className="ng-flex ng-items-center ng-space-x-2.5">
                  <RatingIcon
                    rating={data?.rating}
                    size={RatingIconSize.small}
                  />
                  <span className="ng-text-black ng-text-sm">
                    {data?.title}
                  </span>
                </div>
              </div>

              <div className="ng-flex ng-flex-col ng-justify-center ng-items-center ng-space-y-8">
                <h2 className="ng-text-[82px] ng-text-black ng-font-extrabold ng-leading-[60px] ng-ens-webfont">
                  {data?.grapheme}
                </h2>
                <p className="ng-text-black ng-text-lg ng-leading-7 ng-font-semibold">
                  {data?.grapheme_name}
                </p>
              </div>

              <div className="ng-flex ng-items-start ng-justify-center ng-space-x-10 ng-border-t ng-border-gray-200 ng-mt-10 ng-pt-10">
                <div className="ng-space-y-1">
                  <p className="ng-text-gray-500 ng-text-sm">Codepoints</p>
                  <p className="ng-text-sm ng-font-semibold">
                    <span className="ng-text-black">{firstCodepoint}</span>
                    <span className="ng-text-gray-500">
                      {totalCodepoints > 1 && ` + ${totalCodepoints - 1} more`}
                    </span>
                  </p>
                </div>
                <div className="ng-space-y-1">
                  <p className="ng-text-gray-500 ng-text-sm">Type</p>
                  <p className="ng-text-black ng-text-sm ng-font-semibold">
                    {data?.grapheme_description}
                  </p>
                </div>
              </div>
            </div>
          </RatedBox>

          <div className="ng-space-y-4 md:ng-space-y-5">
            <p className="ng-text-black ng-font-semibold ng-text-lg ng-leading-6">
              {data?.risk_count} of {data?.checks.length} risks found
            </p>

            <div className="ng-grid ng-gap-4">
              {data?.checks.map((check, index) => (
                <CheckResultCard key={index} {...check} />
              ))}
            </div>
          </div>

          {data?.confusables?.length > 0 && (
            <div className="ng-space-y-4 md:ng-space-y-5">
              <div className="ng-flex ng-items-center ng-justify-between">
                <div className="ng-space-y-1">
                  <p className="ng-text-black ng-font-semibold ng-text-lg ng-leading-6">
                    Could be confused with
                  </p>
                  <p className="ng-text-gray-500 ng-text-sm ng-leading-6">
                    Some people could visually confuse this character for a
                    different character.
                  </p>
                </div>
                <div className="ng-hidden md:ng-block">
                  <Tooltip
                    placement="left"
                    trigger={
                      <p className="ng-text-black ng-underline ng-text-sm ng-leading-6 ng-cursor-default">
                        Why it matters?
                      </p>
                    }
                  >
                    <div className="ng-max-w-[480px]">
                      If someone types the wrong character when writing a name
                      <p>
                        it can send crypto, NFTs, messages, or other valuables
                        to the wrong person.
                      </p>
                    </div>
                  </Tooltip>
                </div>
              </div>

              <ConfusableList items={data?.confusables} />
            </div>
          )}
        </div>
      )}
    </Slideover>
  );
});
