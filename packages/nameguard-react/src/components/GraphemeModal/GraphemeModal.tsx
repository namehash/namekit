import React, { forwardRef, type Ref } from "react";
import useSWR from "swr";
import { type GraphemeGuardReport, nameguard } from "@namehash/nameguard";

import { Link } from "@namehash/namekit-react";

import { useGraphemeModalStore } from "../../stores/grapheme";
import { Slideover } from "../Slideover/Slideover";
import { CheckResultCard } from "../Report/CheckResultCard";
import { RatingIcon, RatingIconSize } from "../Report/RatingIcon";
import { RatedBox } from "../RatedBox/RatedBox";
import { ConfusableList } from "./ConfusableList";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Tooltip } from "../Tooltip/Tooltip";

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
          <div className="w-56 h-3 rounded bg-gradient-to-r from-gray-300 to-gray-100 animate-pulse"></div>
        )
      }
      isOpen={isGraphemeModalOpen}
      onClose={handleClose}
      ref={ref}
    >
      {isLoading || !data ? (
        <LoadingSkeleton />
      ) : (
        <div className="p-6 space-y-8 w-full">
          <RatedBox rating={data?.rating}>
            <div className="px-5 pt-7 pb-10 md:py-7 lg:pt-8 lg:pb-10 md:px-[30px] flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <RatingIcon
                    rating={data?.rating}
                    size={RatingIconSize.small}
                  />
                  <span className="text-black text-sm">{data?.title}</span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center space-y-8">
                <h2 className="text-[82px] text-black font-extrabold leading-[60px] ens-webfont">
                  {data?.grapheme}
                </h2>
                <p className="text-black text-lg leading-7 font-semibold">
                  {data?.grapheme_name}
                </p>
              </div>

              <div className="flex items-start justify-center space-x-10 border-t border-gray-200 mt-10 pt-10">
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">Codepoints</p>
                  <p className="text-sm font-semibold">
                    <span className="text-black">{firstCodepoint}</span>
                    <span className="text-gray-500">
                      {totalCodepoints > 1 && ` + ${totalCodepoints - 1} more`}
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="text-black text-sm font-semibold">
                    {data?.grapheme_description}
                  </p>
                </div>
              </div>
            </div>
          </RatedBox>

          <div className="space-y-4 md:space-y-5">
            <p className="text-black font-semibold text-lg leading-6">
              {data?.risk_count} of {data?.checks.length} risks found
            </p>

            <div className="grid gap-4">
              {data?.checks.map((check, index) => (
                <CheckResultCard key={index} {...check} />
              ))}
            </div>
          </div>

          {data?.confusables?.length > 0 && (
            <div className="space-y-4 md:space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-black font-semibold text-lg leading-6">
                    Could be confused with
                  </p>
                  <p className="text-gray-500 text-sm leading-6">
                    Some people could visually confuse this character for a
                    different character.
                  </p>
                </div>
                <div className="hidden md:block">
                  <Tooltip
                    placement="left"
                    trigger={
                      <Link
                        variant="underline"
                        className="!cursor-default"
                        size="small"
                      >
                        Why it matters?
                      </Link>
                    }
                  >
                    <div className="max-w-[480px]">
                      <p>
                        If someone types the wrong character when writing a name
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
