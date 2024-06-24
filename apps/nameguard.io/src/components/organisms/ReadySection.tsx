import Image from "next/image";
import cc from "classcat";
import { highlight } from "sugar-high";
import { ImageCharacteristics } from "@/types/imageTypes";

export type ReadySectionProps = {
  sectionTargetClientMessage: string;
  sectionTargetSvg: React.ReactNode;
  sectionHeader: React.ReactNode;
  sectionDescription: React.ReactNode;
  sectionBackgroundName: string;
  isCodeOnTheLeft: boolean;
  codeSnippet: string;
  integrationsPanel?: React.ReactNode;
  imageSpecifics: ImageCharacteristics;
};

export function ReadySection(props: ReadySectionProps) {
  const mediaDiv =
    "flex sm:flex-col xl:flex-row justify-center border-0 rounded-none items-center gap-12 w-full h-full xl:h-3/4 py-16 px-10 flex-shrink-0 sm:gap-10";
  const backgroundDiv = cc([
    "absolute z-0 top-[40%] sm:top-[30%] left-[10%] h-[60%] w-[80%] bg-center bg-no-repeat bg-cover [opacity:0.4]",
    props.sectionBackgroundName,
  ]);

  const baseCodeSnippetClass =
    "hidden flex-col w-full h-full justify-between items-center gap-7 max-w-3xl";

  const horizontalLayoutCodeSnippet = cc([baseCodeSnippetClass, "xl:flex"]);
  const verticalLayoutCodeSnippet = cc([
    baseCodeSnippetClass,
    "md:flex xl:hidden",
  ]);
  const rightBasedCodeSnippet = cc([baseCodeSnippetClass, "md:flex"]);

  const getCodeSnippet = (layoutClass: string) => {
    return props.integrationsPanel ? (
      <div className={layoutClass}>
        <CodeSnippet codeSnippet={props.codeSnippet} />
        <div className="inline-flex items-center gap-6">
          {props.integrationsPanel}
        </div>
      </div>
    ) : (
      <div className={layoutClass}>
        <CodeSnippet codeSnippet={props.codeSnippet} />
      </div>
    );
  };

  return (
    <section className="relative w-full h-full py-10 px-5 flex flex-col items-center justify-center bg-white sm:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] sm:[background-size:24px_24px] md:py-24 sm:px-0">
      <div className="max-w-full flex flex-col items-center sm:mx-auto sm:px-6 sm:gap-3">
        <div className="w-full flex flex-col gap-5 items-center max-w-2xl mx-auto">
          <div className="inline-flex px-4 py-2 bg-black bg-opacity-5 rounded-[20px] gap-2 justify-center items-center z-10">
            {props.sectionTargetSvg}
            <span className="text-black text-center text-sm not-italic font-medium z-10 leading-5">
              {props.sectionTargetClientMessage}
            </span>
          </div>

          <h1 className="text-black text-center not-italic z-10 text-2xl leading-8 font-semibold sm:text-4xl sm:font-bold sm:leading-10">
            {props.sectionHeader}
          </h1>

          <p className="z-10 text-gray-500 text-center not-italic font-normal text-lg leading-7 sm:text-lg sm:leading-7 sm:font-light">
            {props.sectionDescription}
          </p>
        </div>
        {props.isCodeOnTheLeft ? (
          <div className={mediaDiv}>
            <div className={backgroundDiv} />
            {getCodeSnippet(horizontalLayoutCodeSnippet)}
            <Image
              className="z-10 w-full h-full max-w-[34rem] xl:w-1/3 xl:h-auto"
              src={props.imageSpecifics.source}
              alt="chat image"
              width={props.imageSpecifics.tagWidth}
              height={props.imageSpecifics.tagHeight}
              quality={100}
            />
            {getCodeSnippet(verticalLayoutCodeSnippet)}
          </div>
        ) : (
          <div className={mediaDiv}>
            <div className={backgroundDiv} />
            <Image
              className="z-10 w-full h-full max-w-[34rem] xl:w-1/3 xl:h-auto"
              src={props.imageSpecifics.source}
              alt="chat image"
              width={props.imageSpecifics.tagWidth}
              height={props.imageSpecifics.tagHeight}
              quality={100}
            />
            {getCodeSnippet(rightBasedCodeSnippet)}
          </div>
        )}
      </div>
    </section>
  );
}

type CodeSnippetProps = {
  codeSnippet: string;
};

function CodeSnippet(props: CodeSnippetProps) {
  const nameGuardMethods = [
    "getSecurePrimaryName",
    "fakeEthNameCheck",
    "inspectName",
    "bulkInspectNames",
  ];

  const findMethods = () => {
    const spans = highlight(props.codeSnippet).split("><");
    const toReplace = /var\(--sh-identifier\)/gi;
    const methodColor = "#2596be";

    return spans
      .map((elem: string) => {
        for (const method of nameGuardMethods) {
          if (elem.includes(method)) {
            return elem.replace(toReplace, methodColor);
          }
        }
        return elem;
      })
      .join("><");
  };

  const code = findMethods();

  return (
    <div className="hidden sm:block bg-black rounded-xl pb-4 max-w-full h-fit bg-gradient-to-b from-figma-black to-black z-10">
      <div className="flex flex-col gap-2.5 px-2.5 py-3">
        <div className="flex justify-start gap-2">
          <div className="rounded-full w-3 h-3 bg-[#434446]"></div>
          <div className="rounded-full w-3 h-3 bg-[#434446]"></div>
          <div className="rounded-full w-3 h-3 bg-[#434446]"></div>
        </div>
      </div>
      <hr className="border-code-gray" />
      <div className="py-4 px-5 max-w-full">
        <pre className="w-full overflow-x-auto pb-4">
          <code
            dangerouslySetInnerHTML={{ __html: code }}
            className="inline-block [overflow-wrap:break-word]"
          />
        </pre>
      </div>
    </div>
  );
}
