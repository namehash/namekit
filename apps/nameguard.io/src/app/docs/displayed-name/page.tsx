"use client";

import { ENSName, buildENSName } from "@namehash/ens-utils";
import { DisplayedName, TruncatedText } from "@namehash/nameguard-react";

export default function DisplayedNamePage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      <div className="max-w-[600px] mx-auto">
        <h1 className="text-center justify-center flex font-bold text-2xl my-8">
          {"<"}TruncatedText {"/>"} and {"<"}DisplayedName {"/>"} documentation
        </h1>

        <h2 className="text-lg font-bold w-full text-center border-b-2 border-t-2 py-4">
          {"<"}TruncatedText {"/>"} component
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
              <pre>{"<TruncatedText name />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <TruncatedText
                text={getExampleTruncatedText(TruncatedTextExample.SHORT_TEXT)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {
                  "<TruncatedText name \n textStylingClasses='\nens-webfont font-black' />"
                }
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <TruncatedText
                textStylingClasses="ens-webfont font-black"
                text={getExampleTruncatedText(TruncatedTextExample.SHORT_TEXT)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {
                  "<TruncatedText name \n textStylingClasses='\nens-webfont font-black' />"
                }
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <TruncatedText
                tooltipTextStylingClasses="ens-webfont font-black"
                text={getExampleTruncatedText(TruncatedTextExample.LONG_TEXT)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<TruncatedText name \n maxTooltipWidth={100} />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <TruncatedText
                maxTooltipWidth={100}
                text={getExampleTruncatedText(TruncatedTextExample.LONG_TEXT)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<TruncatedText name \n maxTooltipWidth={550} />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <TruncatedText
                maxTooltipWidth={550}
                text={getExampleTruncatedText(TruncatedTextExample.LONG_TEXT)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>{"<TruncatedText name \n maxDisplayWidth={60} />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <TruncatedText
                maxDisplayWidth={60}
                text={getExampleTruncatedText(TruncatedTextExample.LONG_TEXT)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {
                  "<TruncatedText name \n displayTooltipWhenNameOverflows={false}\n maxDisplayWidth={200} />"
                }
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <TruncatedText
                maxDisplayWidth={200}
                displayTooltipWhenTextOverflows={false}
                text={getExampleTruncatedText(TruncatedTextExample.LONG_TEXT)}
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
                {"<DisplayedName name\n textStylingClasses='font-black' />"}
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                textStylingClasses="font-black"
                name={getExampleDisplayedName(DisplayedNameExample.SHORT_NAME)}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-2 gap-x-6 py-5">
            <div className="w-full flex justify-center items-center font-mono">
              <pre>
                {
                  "<DisplayedName name\n tooltipTextStylingClasses='\nfont-black' />"
                }
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                tooltipTextStylingClasses="font-black"
                name={getExampleDisplayedName(DisplayedNameExample.LONG_NAME)}
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
                  "<DisplayedName name \n displayTooltipWhenNameOverflows={false} />"
                }
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <DisplayedName
                displayTooltipWhenNameOverflows={false}
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

enum TruncatedTextExample {
  SHORT_TEXT = "SHORT_TEXT",
  LONG_TEXT = "LONG_TEXT",
}

const getExampleTruncatedText = (example: TruncatedTextExample): string => {
  switch (example) {
    case TruncatedTextExample.SHORT_TEXT:
      return "heyiamsmall";
    case TruncatedTextExample.LONG_TEXT:
      return "heyiamaverylongtextthatkeepsgrowingunstopablyomgiamstillgoingonokdone";
  }
};

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
