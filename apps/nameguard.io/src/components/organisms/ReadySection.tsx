import Image from "next/image";
import cc from "classcat";
import { ImageCharacteristics } from "@/types/imageTypes";
import { CodeSnippet } from "@components/molecules";

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

        <div
          className={cc([
            "flex sm:flex-col xl:flex-row justify-center border-0 rounded-none items-center gap-12 w-full h-full xl:h-3/4 py-16 px-10 flex-shrink-0 sm:gap-10",
            props.isCodeOnTheLeft ? "xl:flex-row-reverse" : "",
          ])}
        >
          <div
            className={cc([
              "absolute z-0 top-[40%] sm:top-[30%] left-[10%] h-[60%] w-[80%] bg-center bg-no-repeat bg-cover [opacity:0.4]",
              props.sectionBackgroundName,
            ])}
          />
          <Image
            className="z-10 w-full h-full max-w-[34rem] xl:w-1/3 xl:h-auto"
            src={props.imageSpecifics.source}
            alt="chat image"
            width={props.imageSpecifics.tagWidth}
            height={props.imageSpecifics.tagHeight}
            quality={100}
          />

          <div
            className={
              "hidden flex-col w-full h-full justify-between items-center gap-7 max-w-3xl md:flex"
            }
          >
            <CodeSnippet codeSnippet={props.codeSnippet} />
            {props.integrationsPanel && (
              <div className="inline-flex items-center gap-6">
                {props.integrationsPanel}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
