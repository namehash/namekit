import Image from "next/image";
import cc from "classcat";
import { ImageCharacteristics } from "@/types/imageTypes";

export type ComingSoonSectionProps = {
  sectionTargetClientMessage: string;
  sectionTargetSvg: React.ReactNode;
  sectionHeader: React.ReactNode;
  sectionDescription: string;
  sectionBackgroundName: string;
  isTextOnTheLeft: boolean;
  badgeText: string;
  imageSpecifics: ImageCharacteristics;
};

export function ComingSoonSection(props: ComingSoonSectionProps) {
  const get_mobile_bg = () => {
    if (props.sectionBackgroundName.includes("purple")) {
      return "bg-purple_background_mobile";
    }
    return "bg-green_background_mobile";
  };

  const rightImageDiv = cc([
    "relative hidden sm:flex flex-row justify-center items-center w-full max-w-2xl xl:w-1/2 rounded-none bg-origin-border flex-shrink-0 xl:right-[50px]",
  ]);

  const rightBackgroundDiv = cc([
    "absolute z-0 top-0 left-0 h-[105%] w-full lg:w-[110%] bg-center bg-no-repeat bg-cover [opacity:0.3]",
    props.sectionBackgroundName,
  ]);

  const baseTextDiv =
    "flex flex-col gap-5 h-full w-full max-w-3xl items-center xl:items-start xl:w-1/2 md:px-[72px] xl:px-0";

  const baseImageStyles = "relative z-10 w-full h-full";

  return (
    <section className="w-full flex flex-col xl:flex-row items-center justify-center h-full py-10 px-5 bg-white sm:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] sm:[background-size:24px_24px] sm:h-1/2 md:py-20">
      {!props.isTextOnTheLeft && (
        <div
          className={cc([
            "relative hidden xl:flex flex-row justify-center items-center w-full max-w-2xl xl:w-1/2 rounded-none bg-origin-border flex-shrink-0 box-border pr-20",
          ])}
        >
          <div
            className={cc([
              "absolute z-0 h-[195%] w-full lg:w-[115%] bg-center bg-no-repeat bg-cover [opacity:0.3]",
              props.sectionBackgroundName,
            ])}
          />
          <Image
            className={
              props.imageSpecifics.styles !== undefined
                ? cc([baseImageStyles, props.imageSpecifics.styles])
                : baseImageStyles
            }
            src={props.imageSpecifics.source}
            alt="chat image"
            width={props.imageSpecifics.tagWidth}
            height={props.imageSpecifics.tagHeight}
            quality={100}
          />
        </div>
      )}
      <div
        className={cc([
          baseTextDiv,
          props.isTextOnTheLeft ? "xl:pl-[72px]" : "xl:pr-[72px]",
        ])}
      >
        <div className="inline-flex px-4 py-2 bg-black bg-opacity-5 rounded-3xl gap-2 justify-center items-center z-10">
          {props.sectionTargetSvg}
          <span className="text-black text-center text-sm leading-5 not-italic font-medium z-10">
            {props.sectionTargetClientMessage}
          </span>
        </div>
        <h1 className="hidden sm:block text-black font-bold not-italic z-10 text-center xl:text-left text-4xl leading-10">
          {props.sectionHeader}&nbsp;{" "}
          <span className="hidden sm:relative sm:-top-1 sm:inline-flex items-center justify-center rounded-xl bg-green-100 px-3 py-0.5 text-center text-green-800 font-medium not-italic text-sm leading-5">
            {props.badgeText}
          </span>
        </h1>
        <div className="flex flex-col items-center gap-3 sm:hidden">
          <h1 className="sm:hidden text-black font-bold not-italic z-10 text-center text-2xl leading-8">
            {props.sectionHeader}
          </h1>
          <span className="sm:hidden inline-flex items-center justify-center rounded-xl bg-green-100 mx-3 px-3 py-0.5 text-center text-green-800 font-medium not-italic text-sm leading-5">
            {props.badgeText}
          </span>
        </div>
        <p className="text-gray-500 not-italic font-normal z-10 text-center text-lg leading-7 xl:text-left sm:text-lg sm:w-4/5 sm:leading-7 sm:font-light">
          {props.sectionDescription}
        </p>
      </div>

      <div
        className={cc([
          rightImageDiv,
          !props.isTextOnTheLeft && "xl:hidden pt-8",
        ])}
      >
        <div className={rightBackgroundDiv} />
        <Image
          className={
            props.imageSpecifics.styles !== undefined
              ? cc([baseImageStyles, props.imageSpecifics.styles])
              : baseImageStyles
          }
          src={props.imageSpecifics.source}
          alt="chat image"
          width={props.imageSpecifics.tagWidth}
          height={props.imageSpecifics.tagHeight}
          quality={100}
        />
      </div>
      <div
        className={cc([
          "flex sm:hidden flex-row justify-center items-center w-full h-full rounded-none py-5 bg-origin-border bg-center bg-no-repeat bg-contain flex-shrink-0",
          get_mobile_bg(),
        ])}
      >
        <Image
          className={
            props.imageSpecifics.styles !== undefined
              ? cc([baseImageStyles, props.imageSpecifics.styles])
              : baseImageStyles
          }
          src={props.imageSpecifics.source}
          alt="chat image"
          width={props.imageSpecifics.tagWidth}
          height={props.imageSpecifics.tagHeight}
          quality={100}
        />
      </div>
    </section>
  );
}
