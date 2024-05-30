"use client";

import { ENSName, buildENSName } from "@namehash/ens-utils";
import { DisplayedName } from "@namehash/nameguard-react";

export default function DisplayedNamePage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      <div className="max-w-[600px] mx-auto">
        <h1 className="justify-center flex font-bold text-2xl my-8">
          {"<"}DisplayedName {"/>"} documentation
        </h1>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5 text-center font-medium">
            <div>Component usage</div>
            <div>Example</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<DisplayedName ensName />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                ensName={getExampleDisplayedName(
                  DisplayedNameExample.SHORT_NAME,
                )}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<DisplayedName ensName />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                ensName={getExampleDisplayedName(
                  DisplayedNameExample.LONG_NAME,
                )}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {
                  "<DisplayedName ensName \n displayTooltipWhenNameClamps={false} />"
                }
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                displayTooltipWhenNameClamps={false}
                ensName={getExampleDisplayedName(
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
                {"<DisplayedName ensName \n displayUnnormalizedNames={true} />"}
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                displayUnnormalizedNames={true}
                ensName={getExampleDisplayedName(
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
                {
                  "<DisplayedName ensName \n displayUnnormalizedNames={false} />"
                }
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                displayUnnormalizedNames={false}
                ensName={getExampleDisplayedName(
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
                {"<DisplayedName ensName \n maxEnsNameDisplayWidth={60} />"}
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                maxEnsNameDisplayWidth={60}
                ensName={getExampleDisplayedName(
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
