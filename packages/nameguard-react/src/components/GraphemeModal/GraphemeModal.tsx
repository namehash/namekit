import React, { Fragment, forwardRef, type Ref } from "react";
import useSWR from "swr";
import { type GraphemeGuardReport, nameguard } from "@namehash/nameguard";

import { useGraphemeModalStore } from "../../stores/grapheme";
import { Slideover } from "../Slideover/Slideover";
import { CheckResultCard } from "../Report/CheckResultCard";
import { Shield } from "../Report/Shield";
import { RatedBox } from "../RatedBox/RatedBox";
// import { LabelList } from "../Report/LabelList";

export const GraphemeModal = forwardRef((_, ref: Ref<HTMLDivElement>) => {
  const { isGraphemeModalOpen, closeGraphemeModal, currentGrapheme } =
    useGraphemeModalStore();

  const { data, isLoading } = useSWR<GraphemeGuardReport>(
    currentGrapheme,
    (g: string) => nameguard.inspectGrapheme(g)
  );

  return (
    <Slideover
      title={data?.grapheme_name ?? "Loading"}
      isOpen={isGraphemeModalOpen}
      onClose={closeGraphemeModal}
      ref={ref}
    >
      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6 space-y-8 w-full">
          <RatedBox rating={data?.rating}>
            <div className="px-5 pt-7 pb-10 rounded-xl md:py-7 lg:pt-8 lg:pb-10 md:px-[30px] flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Shield status={data?.rating} size="small" />
                  <span className="text-black text-sm">{data?.title}</span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center space-y-5">
                <h2 className="text-[82px] text-black font-extrabold leading-[60px]">
                  {data?.grapheme}
                </h2>
                <p className="text-black text-lg leading-7 font-semibold">
                  {data?.grapheme_name}
                </p>
              </div>

              <div className="flex items-start justify-center space-x-10 border-t border-gray-200 mt-10 pt-10">
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">Codepoints</p>
                  <p className="text-black text-sm font-semibold">
                    {data?.codepoints}
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
            <div className="space-y-1">
              <p className="text-black font-semibold text-lg leading-6">
                Could be confused with
              </p>
              <p className="text-gray-500 text-sm leading-6">
                Some people could visually confuse this charracter for a
                different character.
              </p>

              {/* <LabelList items={data?.} /> */}
            </div>
          )}

          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
      )}
    </Slideover>
  );
});
