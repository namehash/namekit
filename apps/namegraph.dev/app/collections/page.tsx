"use client";

import {
  NameGraphCollection,
  NameGraphFindCollectionsResponse,
} from "@namehash/namegraph-sdk/utils";
import { findCollectionsByString, getRandomColor } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DebounceInput } from "react-debounce-input";
import { useEffect, useState } from "react";
import { Label, Pie, PieChart } from "recharts";
import { NumberedListIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartConfig = {
  number_of_names: {
    label: "Number of names",
    icon: NumberedListIcon,
  },
} satisfies ChartConfig;

interface NameGraphCollectionInPieChart extends NameGraphCollection {
  fill: string;
}

export default function ExploreCollectionsPage() {
  /**
   * findCollectionsRes state:
   *
   * undefined is set when component never tried querying collections
   * null is set when component tried querying collections but failed
   * NameGraphFindCollectionsResponse is set when collections were successfully queried
   */
  const [findCollectionsRes, setFindCollectionsRes] = useState<
    undefined | null | NameGraphFindCollectionsResponse
  >(undefined);

  useEffect(() => {
    if (findCollectionsRes) {
      let groupedCollections: NameGraphCollection[] = [];

      const otherCollections = findCollectionsRes.other_collections;
      const relatedCollections = findCollectionsRes.related_collections;

      /**
       * Unites "other" and "related" collections, from NameGraph SDK
       */
      groupedCollections = [...otherCollections, ...relatedCollections];

      /**
       * Adds a random color for each collection for Pie Chart later displaying
       */
      let coloredCollections: NameGraphCollectionInPieChart[] = [];
      groupedCollections.forEach((_, idx) => {
        const randomColor = getRandomColor();

        coloredCollections.push({
          ...groupedCollections[idx],
          fill: randomColor,
        });
      });

      setCollections(coloredCollections);
      setLoadingCollections(false);
    } else {
      setCollections(undefined);
    }
  }, [findCollectionsRes]);

  /**
   * collections state:
   *
   * undefined is set when component never tried querying collections
   * null is set when no collections was retrieved from NameGraph SDK for debouncedValue
   * NameGraphCollectionInPieChart[] is set when collections that were retrieved were grouped and state was set
   */
  const [collections, setCollections] = useState<
    undefined | null | NameGraphCollectionInPieChart[]
  >(undefined);

  const [loadingCollections, setLoadingCollections] = useState(true);

  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    if (debouncedValue) {
      let query = debouncedValue;
      if (debouncedValue.includes(".")) {
        query = debouncedValue.split(".")[0];
      }

      setFindCollectionsRes(undefined);
      setLoadingCollections(true);
      findCollectionsByString(query)
        .then((res) => setFindCollectionsRes(res))
        .catch(() => setFindCollectionsRes(null));
    } else {
      setLoadingCollections(false);
    }
  }, [debouncedValue]);

  return (
    <div className="mx-auto py-8 w-full">
      <div className="flex flex-col">
        <div className="flex-1">
          <div className="container mx-auto px-6">
            <div className="px-5 md:px-10 lg:px-[60px]">
              <h1 className="text-3xl font-bold text-center w-full mb-4 mt-12">
                🔎 Discover the power of +400.000 name ideas 🌐
              </h1>
              <h1 className="text-xl font-semibold text-center w-full mb-12">
                ✨ Do it with a single SDK call 📡
              </h1>
            </div>
            <p className="text-sm font-bold text-gray-400 text-center mb-2">
              Imagine your are a user looking for a great profile name:
            </p>
            <div className="flex space-x-2 items-center max-w-3xl mx-auto relative">
              {/** Query input ⬇️ */}
              <DebounceInput
                id="query"
                type="text"
                name="query"
                placeholder="Type something"
                autoComplete="off"
                debounceTimeout={300}
                onChange={(e) => setDebouncedValue(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 px-4 placeholder:font-medium text-center"
              />

              {/** Collections query status icons ⬇️ */}
              <div className="absolute right-2 top-[13px]">
                {loadingCollections ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : debouncedValue ? (
                  <svg
                    className="w-6 h-6 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                ) : null}
              </div>
            </div>
          </div>
          <div className="min-h-[400px] mt-6">
            {collections?.length ? (
              <>
                <Card className="bg-transparent shadow-none border-none flex flex-col">
                  <CardHeader className="items-center pb-0">
                    <CardTitle>
                      {collections.length} name collections queried
                    </CardTitle>
                    <CardDescription>
                      for{" "}
                      <strong className="mr-1">
                        {debouncedValue.includes(".")
                          ? debouncedValue.split(".")[0]
                          : debouncedValue}
                      </strong>
                      search
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-0">
                    {/** Chart with query results ⬇️ */}
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[400px] -mt-4"
                    >
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={collections}
                          dataKey="number_of_names"
                          nameKey="title"
                          innerRadius={60}
                          strokeWidth={5}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                "cx" in viewBox &&
                                "cy" in viewBox
                              ) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      className="fill-foreground text-3xl font-bold"
                                    >
                                      {collections.reduce(
                                        (accumulator, currentValue) =>
                                          accumulator +
                                          currentValue.number_of_names,
                                        0,
                                      )}
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 24}
                                      className="fill-muted-foreground"
                                    >
                                      Name ideas
                                    </tspan>
                                  </text>
                                );
                              }
                            }}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
