"use client";

import { ENSName, buildENSName } from "@namehash/ens-utils";
import { DisplayedName, Text } from "@namehash/nameguard-react";

export default function DisplayedNamePage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      <div className="max-w-[600px] mx-auto">
        <h1 className="justify-center flex font-bold text-2xl my-8">
          {"<"}Text {"/>"} and {"<"}DisplayedName {"/>"} documentation
        </h1>

        <h2 className="text-lg font-bold w-full text-center border-b-2 border-t-2 py-4">
          {"<"}Text {"/>"} component
        </h2>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5 text-center font-medium">
            <div className="font-semibold">Component usage</div>
            <div className="font-semibold">Example</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<Text name />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <Text
                string={
                  getExampleDisplayedName(DisplayedNameExample.SHORT_NAME).name
                }
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<Text name \n stringClasses='text-purple-400' />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <Text
                stringClasses="text-purple-400"
                string={
                  getExampleDisplayedName(DisplayedNameExample.LONG_NAME).name
                }
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<Text name \n maxTooltipWidth={100} />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <Text
                maxTooltipWidth={100}
                string={
                  getExampleDisplayedName(DisplayedNameExample.LONG_NAME).name
                }
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {"<Text name \n displayTooltipWhenNameClamps={false} />"}
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <Text
                displayTooltipWhenNameClamps={false}
                string={
                  getExampleDisplayedName(DisplayedNameExample.WITHOUT_TOOLTIP)
                    .name
                }
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<Text name \n maxDisplayWidth={60} />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <Text
                maxDisplayWidth={60}
                string={
                  getExampleDisplayedName(DisplayedNameExample.SHORT_MAX_WIDTH)
                    .name
                }
              />
            </div>
          </div>
        </div>
        <h2 className="text-lg font-bold w-full text-center border-b-2 border-t-2 py-4 mt-10">
          {"<"}DisplayedName {"/>"} component
        </h2>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5 text-center font-medium">
            <div className="font-semibold">Component usage</div>
            <div className="font-semibold">Example</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<DisplayedName name />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                name={getExampleDisplayedName(DisplayedNameExample.SHORT_NAME)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {"<DisplayedName name\n stylingClasses='text-purple-400' />"}
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                stylingClasses="text-purple-400"
                name={getExampleDisplayedName(DisplayedNameExample.SHORT_NAME)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<DisplayedName name\n maxTooltipWidth={100} />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                maxTooltipWidth={100}
                name={getExampleDisplayedName(DisplayedNameExample.LONG_NAME)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<DisplayedName name />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                name={getExampleDisplayedName(DisplayedNameExample.LONG_NAME)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {
                  "<DisplayedName name \n displayTooltipWhenNameClamps={false} />"
                }
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                displayTooltipWhenNameClamps={false}
                name={getExampleDisplayedName(
                  DisplayedNameExample.WITHOUT_TOOLTIP,
                )}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {"<DisplayedName name \n displayUnnormalizedNames={true} />"}
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                displayUnnormalizedNames={true}
                name={getExampleDisplayedName(
                  DisplayedNameExample.DISPLAY_UNNORMALIZED_NAMES,
                )}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {"<DisplayedName name \n displayUnnormalizedNames={false} />"}
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                displayUnnormalizedNames={false}
                name={getExampleDisplayedName(
                  DisplayedNameExample.DISPLAY_UNNORMALIZED_NAMES,
                )}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<DisplayedName name \n maxDisplayWidth={60} />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                maxDisplayWidth={60}
                name={getExampleDisplayedName(
                  DisplayedNameExample.SHORT_MAX_WIDTH,
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

enum DisplayedNameExample {
  SHORT_NAME = "SHORT_NAME",
  LONG_NAME = "LONG_NAME",
  WITHOUT_TOOLTIP = "WITHOUT_TOOLTIP",
  SHORT_MAX_WIDTH = "SHORT_MAX_WIDTH",
  DISPLAY_UNNORMALIZED_NAMES = "DISPLAY_UNNORMALIZED_NAMES",
}

const getExampleDisplayedName = (example: DisplayedNameExample): ENSName => {
  switch (example) {
    case DisplayedNameExample.SHORT_NAME:
      return buildENSName("lightwalker.eth");
    case DisplayedNameExample.LONG_NAME:
    case DisplayedNameExample.WITHOUT_TOOLTIP:
      return buildENSName("thisìsaveryveryveryveryveryverylongname.eth");
    case DisplayedNameExample.DISPLAY_UNNORMALIZED_NAMES:
      return buildENSName("‍420.eth");
    case DisplayedNameExample.SHORT_MAX_WIDTH:
      return buildENSName("thisìsaveryveryveryveryveryverylongname.eth");
  }
};
