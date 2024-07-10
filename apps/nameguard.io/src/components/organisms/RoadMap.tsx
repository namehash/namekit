import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  RoadmapNegativeShield,
  RoadmapPositiveShield,
  RoadmapWarningShield,
} from "@/components/atoms";
import cc from "classcat";

type RoadMapElement = {
  stageOfCompletion: "launched" | "in progress" | "planned";
  headerText: string;
  commentSentences: string[] | React.ReactNode[];
};

export function RoadMap() {
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const launchedBadge = (
    <span className="relative inline-flex items-center justify-center rounded-[10px] sm:rounded-xl bg-black px-[10px] sm:px-3 py-0.5 text-center font-medium text-white not-italic text-xs leading-4 sm:text-sm sm:leading-5">
      Launched
    </span>
  );

  const inProgressBadge = (
    <span className="relative inline-flex w-fit h-auto items-center whitespace-nowrap justify-center rounded-[10px] sm:rounded-xl border border-black bg-white px-[10px] sm:px-3 py-0.5 text-center font-medium text-black not-italic text-xs leading-4 sm:text-sm sm:leading-5">
      In progress
    </span>
  );

  const plannedBadge = (
    <span className="relative inline-flex items-center justify-center rounded-[10px] sm:rounded-xl bg-black bg-opacity-5 px-[10px] sm:px-3 py-0.5 text-center font-medium text-black not-italic text-xs leading-4 sm:text-sm sm:leading-5">
      Planned
    </span>
  );

  const badgesMap = new Map<string, React.ReactNode>([
    ["launched", launchedBadge],
    ["in progress", inProgressBadge],
    ["planned", plannedBadge],
  ]);

  const roadMapElements: RoadMapElement[] = [
    {
      stageOfCompletion: "launched",
      headerText: "ENS Normalize Python",
      commentSentences: [
        <span key="ENSFontDataFragment">
          Supported the ENS DAO&apos;s approval of ENS Name Normalization
          (ENSIP-15) through the creation of{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/ens-normalize-python"
            target="_blank"
            rel="noopener noreferrer"
          >
            ENS Normalize Python
          </a>
          , the first independent implementation of the proposed standard.
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "ENS Font Data",
      commentSentences: [
        <span key="ENSFontDataFragment">
          Created{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/ens-font-data"
            target="_blank"
            rel="noopener noreferrer"
          >
            cross-platform font rendering metadata analysis
          </a>{" "}
          of graphemes that may appear in normalized ENS names.
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "ENS Label Inspector",
      commentSentences: [
        <span key="ENSLabelInspectorFragment">
          Developed an extensible framework for{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/ens-label-inspector"
            target="_blank"
            rel="noopener noreferrer"
          >
            detailed inspections of the labels in ENS names.
          </a>
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "NameGuard Library",
      commentSentences: [
        <span key="NGLibraryFragment">
          Build{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/nameguard/tree/main/api"
            target="_blank"
            rel="noopener noreferrer"
          >
            framework
          </a>{" "}
          for combining and summarizing the inspection results across all
          graphemes and labels in an ENS name.
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "NameGuard APIs",
      commentSentences: [
        <span key="NGAPIsFragment">
          Provided a{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://api.nameguard.io/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            HTTP / REST API
          </a>{" "}
          to the NameGuard Library.
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "NameGuard DevOps",
      commentSentences: [
        <span key="NGDevOpsFragment">
          Made it easy for anyone to{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/nameguard/blob/main/api/serverless.yml"
            target="_blank"
            rel="noopener noreferrer"
          >
            deploy their own NameGuard API
          </a>{" "}
          instance to the cloud or their own infrastructure.
        </span>,
      ],
    },

    {
      stageOfCompletion: "launched",
      headerText: "NameGuard Client SDK",
      commentSentences: [
        <span key="NGClientSDKFragment">
          Offered a more convenient method for{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/nameguard/tree/main/packages/sdk"
            target="_blank"
            rel="noopener noreferrer"
          >
            interacting with NameGuard APIs.
          </a>
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "NameGuard Figma UI Kit",
      commentSentences: [
        <span key="NGFigmaUIKitFragment">
          Designed{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://www.figma.com/file/aVlWccl7J2MyP8IE56lDMb/NameGuard-UI-Kit---23-11-2023"
            target="_blank"
            rel="noopener noreferrer"
          >
            example user interfaces
          </a>{" "}
          for interacting with NameGuard data.
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "NameGuard React UI Kit",
      commentSentences: [
        <span key="NGReactUIKitFragment">
          Implemented{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/nameguard/tree/main/packages/nameguard-react"
            target="_blank"
            rel="noopener noreferrer"
          >
            reusable UI components
          </a>{" "}
          for integrators to easily build user experiences using NameGuard data.
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "ENS Name Parser",
      commentSentences: [
        <span key="ENSNameParserFragment">
          Created a{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/ens-utils/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            toolkit for parsing ENS names from user input.
          </a>
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "Impersonation Attack Protections",
      commentSentences: [
        <span key="IAPFragment">
          Identified the risk of impersonation attacks. Built protections in the
          form of a new{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://api.nameguard.io/docs#/secure_primary_name"
            target="_blank"
            rel="noopener noreferrer"
          >
            “Secure &quot;Primary Name&quot; lookup.
          </a>
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "Example App for Impersonation Attack Protections",
      commentSentences: [
        <span key="ExampleAppFragment">
          Built and released an{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://nameguard-examples-nextjs.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            example app
          </a>{" "}
          showing how “Secure Primary Name” lookups through NameGuard can help
          protect the community.
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "NameGuard Website",
      commentSentences: [
        <span key="NGWebsiteFragment">
          Created an{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://nameguard.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            interactive website
          </a>{" "}
          for the community that provides an example UI for inspecting ENS
          names.
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "Fake ENS NFT Checks",
      commentSentences: [
        <span key="FakeENSNFTFragment">
          Implemented methods for generic NFT marketplaces such as LooksRare or
          OpenSea to{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://api.nameguard.io/docs#/fake-eth-name-check"
            target="_blank"
            rel="noopener noreferrer"
          >
            flag and filter NFTs
          </a>{" "}
          that are pretending to be ENS names.
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "Confusable Grapheme Detection & Mapping",
      commentSentences: [
        "Proposed a refined approach for identifying confusables for a grapheme.",
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "Canonicalization Algorithm",
      commentSentences: [
        "Defined a method for approximating the “canonical” form of a grapheme / label / name which is useful for cases included potential impersonation attacks.",
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "ens_cure Algorithm",
      commentSentences: [
        <span key="ENSCureAlgFragment">
          Implemented a method for further{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/ens-normalize-python/blob/main/README.md#ens_cure"
            target="_blank"
            rel="noopener noreferrer"
          >
            improving the UX for user input of ENS names.
          </a>
        </span>,
      ],
    },
    {
      stageOfCompletion: "launched",
      headerText: "Cross-chain Support",
      commentSentences: ["Integrated mainnet, and sepolia."],
    },
    {
      stageOfCompletion: "launched",
      headerText: "ENS Webfont Alpha",
      commentSentences: [
        <span key="ENSWebfontFragment">
          Released an{" "}
          <a
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            href="https://github.com/namehash/nameguard/pull/139"
            target="_blank"
            rel="noopener noreferrer"
          >
            initial teaser
          </a>{" "}
          that increases grapheme disambiguation and supports rendering of a
          wider array of graphemes.
        </span>,
      ],
    },
    {
      stageOfCompletion: "in progress",
      headerText: "Additional NameGuard Checks",
      commentSentences: [
        "Name Ruggability.",
        "Namewrapper Fuses.",
        "Improve handling of more ENS edge cases.",
        "Multi-grapheme confusables.",
        "Separate checks into two subcategories: risks vs limitations.",
      ],
    },
    {
      stageOfCompletion: "planned",
      headerText: "ENS Name Healthchecks",
      commentSentences: [
        "Identify serious risks such as the need to update deposit addresses after purchasing a name on the secondary market.",
        "Identify maintenance opportunities such as improperly formatted resolver records.",
      ],
    },
    {
      stageOfCompletion: "planned",
      headerText: "User Education",
      commentSentences: [
        "User-friendly (non-technical) help content for each check and check result.",
        "Improved storytelling for DNS compatible versions of ENS names.",
      ],
    },
    {
      stageOfCompletion: "planned",
      headerText: "ENS Profile Completion Score",
      commentSentences: [
        "Boost social engagement and retention by encouraging your community to make the most of their ENS identity.",
      ],
    },
    {
      stageOfCompletion: "planned",
      headerText: "ENS Name Auto-Renewal",
      commentSentences: [
        "Enable automated renewals of ENS names with credit cards.",
        "Provide additional revenue generation incentives for wallets and dApps that deeply integrate ENS onboarding & retention user journeys.",
      ],
    },
    {
      stageOfCompletion: "planned",
      headerText: "ENS Webfont v1",
      commentSentences: [
        "Add a configurable range of “base” fonts to align with the needs of more brands.",
        "Optimize rendering of normalized graphemes.",
      ],
    },
    {
      stageOfCompletion: "planned",
      headerText: "Internationalization",
      commentSentences: [
        "Support multiple languages in all NameGuard messages and UIs.",
      ],
    },
    {
      stageOfCompletion: "planned",
      headerText: "Enhanced unknown label resolution",
      commentSentences: [
        "Create universal pool of label preimages across networks.",
        "Build systems to dynamically discover more labels from community feedback.",
      ],
    },
  ];

  const leftSideShields = [
    <RoadmapPositiveShield key="leftShieldSVG0" />,
    <RoadmapNegativeShield key="leftShieldSVG1" />,
    <RoadmapWarningShield key="leftShieldSVG2" />,
    <RoadmapPositiveShield key="leftShieldSVG3" />,
    <RoadmapWarningShield key="leftShieldSVG4" />,
    <RoadmapNegativeShield key="leftShieldSVG5" />,
    <RoadmapWarningShield key="leftShieldSVG6" />,
    <RoadmapPositiveShield key="leftShieldSVG7" />,
    <RoadmapNegativeShield key="leftShieldSVG8" />,
    <RoadmapPositiveShield key="leftShieldSVG0" />,
    <RoadmapNegativeShield key="leftShieldSVG1" />,
    <RoadmapWarningShield key="leftShieldSVG2" />,
    <RoadmapPositiveShield key="leftShieldSVG3" />,
    <RoadmapWarningShield key="leftShieldSVG4" />,
    <RoadmapNegativeShield key="leftShieldSVG5" />,
    <RoadmapWarningShield key="leftShieldSVG6" />,
    <RoadmapPositiveShield key="leftShieldSVG7" />,
    <RoadmapNegativeShield key="leftShieldSVG8" />,
  ];
  const rightSideShields = [
    <RoadmapNegativeShield key="rightShieldSVG0" />,
    <RoadmapPositiveShield key="rightShieldSVG1" />,
    <RoadmapWarningShield key="rightShieldSVG2" />,
    <RoadmapNegativeShield key="rightShieldSVG3" />,
    <RoadmapPositiveShield key="rightShieldSVG4" />,
    <RoadmapWarningShield key="rightShieldSVG5" />,
    <RoadmapNegativeShield key="rightShieldSVG6" />,
    <RoadmapPositiveShield key="rightShieldSVG7" />,
    <RoadmapWarningShield key="rightShieldSVG8" />,
    <RoadmapNegativeShield key="rightShieldSVG0" />,
    <RoadmapPositiveShield key="rightShieldSVG1" />,
    <RoadmapWarningShield key="rightShieldSVG2" />,
    <RoadmapNegativeShield key="rightShieldSVG3" />,
    <RoadmapPositiveShield key="rightShieldSVG4" />,
    <RoadmapWarningShield key="rightShieldSVG5" />,
    <RoadmapNegativeShield key="rightShieldSVG6" />,
    <RoadmapPositiveShield key="rightShieldSVG7" />,
    <RoadmapWarningShield key="rightShieldSVG8" />,
  ];

  return (
    <section className="relative bg-white w-full h-full px-5 md:pt-24 md:pb-12 md:px-10 xl:px-32 flex flex-row items-center justify-center z-10 gap-10">
      <div className="hidden w-1/6 h-full relative -top-20 md:flex flex-col justify-center items-center gap-[10.5rem]">
        {leftSideShields.map((shield, idx) => (
          <div
            key={`left-${idx}-Shield`}
            className={cc([
              "w-full h-full flex flex-row items-center",
              idx % 2 === 1 ? "justify-start" : "justify-end",
            ])}
          >
            <div className="inline-flex items-start p-5 gap-[10px] border rounded-full border-gray-200 shadow-sm">
              {shield}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full sm:w-4/6 h-full flex flex-col items-center justify-center pt-10 sm:pt-0 pb-5 sm:pb-0 gap-5 sm:gap-20">
        <div className="inline-flex h-fit w-full flex-col items-center gap-5 sm:gap-2 z-10">
          <h1 className="text-black text-center not-italic font-bold text-2xl leading-8 sm:text-4xl sm:leading-[52px]">
            NameGuard roadmap
          </h1>
          <p className="text-center text-gray-500 text-lg leading-7 font-normal not-italic sm:text-base sm:font-light">
            NameGuard has a mission to keep the ENS community safe and encourage
            optimal use of ENS names.
          </p>
        </div>
        <div className="h-fit w-full max-w-[1050px]">
          <ul role="list" className="space-y-4 w-full h-full flex-shrink-0">
            {roadMapElements.map((roadmapElement, idx) => (
              <li key={idx} className="relative flex gap-x-4">
                <div
                  className={classNames(
                    idx === roadMapElements.length - 1 ? "h-4/5" : "h-full",
                    "-bottom-6",
                    "absolute left-0 top-0 flex w-6 justify-center mt-2",
                  )}
                >
                  <div
                    className={cc([
                      "w-[2px] mt-5 mb-3",
                      roadmapElement.stageOfCompletion === "launched"
                        ? "bg-black"
                        : "bg-gray-200",
                    ])}
                  />
                </div>
                <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                  {roadmapElement.stageOfCompletion === "launched" ? (
                    <CheckCircleIcon
                      className="h-6 w-6 my-2 text-black"
                      aria-hidden="true"
                    />
                  ) : (
                    <div
                      className={cc([
                        "h-2 w-2 rounded-full",
                        roadmapElement.stageOfCompletion === "in progress"
                          ? "bg-black"
                          : "bg-gray-200",
                      ])}
                    />
                  )}
                </div>
                <div className="w-full h-fit flex flex-col items-start gap-2 pb-6">
                  <div className="relative -top-2 w-full h-fit inline-flex flex-row justify-between items-start self-stretch py-1.5">
                    <h1 className="text-black text-lg leading-6 font-semibold not-italic pr-2">
                      {roadmapElement.headerText}
                    </h1>
                    {badgesMap.get(roadmapElement.stageOfCompletion)}
                  </div>
                  <div className="relative -top-2 w-full h-fit flex flex-col items-start self-stretch rounded-lg border border-gray-200 bg-gray-50 p-5">
                    <ul
                      role="list"
                      className="list-disc list-outside ml-[15px]"
                    >
                      {roadmapElement.commentSentences.map(
                        (sentence, sentenceIdx) => (
                          <li
                            key={`${idx}${sentenceIdx}`}
                            className="box-border text-sm leading-6 text-gray-500 font-normal not-italic"
                          >
                            {sentence}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden w-1/6 h-full relative top-4 md:flex flex-col justify-center items-center gap-[10.5rem]">
        {rightSideShields.map((shield, idx) => (
          <div
            key={`left-${idx}-Shield`}
            className={cc([
              "w-full h-full flex flex-row items-center",
              idx % 2 === 0 ? "justify-start" : "justify-end",
            ])}
          >
            <div className="inline-flex items-start p-5 gap-[10px] border rounded-full border-gray-200 shadow-sm">
              {shield}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
