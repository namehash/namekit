import { Fragment } from "react";
import { ListSectionBadge } from "../atoms/ListSectionBadge";
import {
  CloudOutlineIcon,
  FigmaIcon,
  FileIcon,
  FontIcon,
  GearWheelIcon,
  GithubIconDevelopers,
  GithubIconSmall,
  RedirectIcon,
  DeveloperSectionTitle,
  DeveloperSectionWrapper,
  DeveloperSectionIconWrapper,
} from "@components/atoms";
import cc from "classcat";
import { ListSectionElement } from "@/types/listSectionTypes";

export function DevelopersSection() {
  const cellStyle =
    "group w-full md:w-[602px] h-full sm:min-w-[602px] max-w-[602px] box-border flex flex-row items-start justify-start bg-white p-5 gap-4 rounded-xl border border-gray-200";
  const cellTextStyle =
    "self-stretch not-italic z-10 text-gray-500 text-left text-sm leading-6 font-normal";
  const hoverCellStyle = cc([
    "group w-full md:w-[602px] h-full sm:min-w-[602px] max-w-[602px] box-border flex flex-row items-start justify-start bg-white p-5 gap-4 rounded-xl border border-gray-200 sm:hover:cursor-pointer sm:hover:border-gray-300 sm:hover:shadow-sm transition relative",
  ]);

  const devElements: ListSectionElement[] = [
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>NameGuard library</DeveloperSectionTitle>
        </DeveloperSectionWrapper>
      ),
      text: <Fragment>Security &quot;x-ray&quot; for ENS names.</Fragment>,
      icon: (
        <DeveloperSectionIconWrapper>
          <GithubIconDevelopers />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://github.com/namehash/nameguard/tree/main/api",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>NameGuard Client SDK</DeveloperSectionTitle>
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>Thin client SDK for making API calls to NameGuard.</Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <GithubIconDevelopers />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://github.com/namehash/nameguard/tree/main/packages/sdk",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>NameGuard React UI Kit</DeveloperSectionTitle>
          <ListSectionBadge width={53} height={20} text="Alpha" />
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>
          React components for building nice interfaces with NameGuard data.
        </Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <GithubIconDevelopers />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://github.com/namehash/nameguard/tree/main/packages/nameguard-react",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>Figma UI kit</DeveloperSectionTitle>
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>
          Customize NameKit user interfaces to match your unique app.
        </Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <FigmaIcon />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://www.figma.com/file/aVlWccl7J2MyP8IE56lDMb/NameGuard-UI-Kit---23-11-2023",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>ENS Label Inspector</DeveloperSectionTitle>
        </DeveloperSectionWrapper>
      ),
      text: <Fragment>Detailed inspection of labels in ENS names.</Fragment>,
      icon: (
        <DeveloperSectionIconWrapper>
          <GithubIconDevelopers />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://github.com/namehash/ens-label-inspector",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>ENS Font Data</DeveloperSectionTitle>
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>
          Metadata for graphemes that may appear in ENS names.
        </Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <GithubIconDevelopers />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://github.com/namehash/ens-font-data",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>ENS Normalize Python</DeveloperSectionTitle>
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>
          Python implementation of the ENS name normalization standard.
        </Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <GithubIconDevelopers />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://github.com/namehash/ens-normalize-python",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>ENS Name Parser</DeveloperSectionTitle>
          <ListSectionBadge width={53} height={20} text="Alpha" />
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>Utilities for parsing ENS names from user input.</Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <GithubIconDevelopers />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://github.com/namehash/ens-utils/blob/main/README.md",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>Open public API</DeveloperSectionTitle>
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>
          Connect to the NameGuard instance running in AWS for community use.
        </Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <CloudOutlineIcon />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://api.nameguard.io/docs",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>
            NameGuard DevOps Scripts
          </DeveloperSectionTitle>
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>
          Easily deploy your own instance of NameGuard into your own AWS cloud.
        </Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <GearWheelIcon />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://github.com/namehash/nameguard/blob/main/api/serverless.yml",
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>Detailed documentation</DeveloperSectionTitle>
          <ListSectionBadge width={96} height={20} text="Coming soon" />
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>
          Step-by-step guides to help developers make the most of NameGuard.
        </Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <FileIcon />
        </DeveloperSectionIconWrapper>
      ),
    },
    {
      header: (
        <DeveloperSectionWrapper>
          <DeveloperSectionTitle>ENS Webfont</DeveloperSectionTitle>
          <ListSectionBadge width={96} height={20} text="Alpha" />
        </DeveloperSectionWrapper>
      ),
      text: (
        <Fragment>
          Increase rendering support for emojis and other special graphemes.
        </Fragment>
      ),
      icon: (
        <DeveloperSectionIconWrapper>
          <FontIcon />
        </DeveloperSectionIconWrapper>
      ),
      link: "https://github.com/namehash/nameguard/tree/main/packages/ens-webfont",
    },
  ];

  return (
    <section className="relative z-10 w-full h-full box-border flex flex-col py-10 px-5 items-center justify-center self-stretch gap-[32px] bg-white sm:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] sm:[background-size:24px_24px] md:px-[100px]">
      <div className="flex flex-col justify-center items-center gap-5 max-w-[608px]">
        <div className="inline-flex px-4 py-2 bg-black bg-opacity-5 rounded-3xl gap-2 justify-center items-center z-10">
          <GithubIconSmall />
          <span className="text-black text-center text-sm leading-5 not-italic font-medium z-10">
            Developer resources
          </span>
        </div>
        <h1 className="text-black text-center not-italic z-10 text-2xl leading-8 font-bold md:text-4xl md:leading-10">
          NameGuard 🤝 Developers
        </h1>
        <p className="text-center not-italic text-gray-500 text-lg leading-7 font-normal sm:font-light">
          All resources are open sourced and freely licensed for the community.
        </p>
      </div>
      <div className="w-full h-full flex flex-col md:flex-row md:flex-wrap max-w-[1840px] items-center justify-center content-between gap-4">
        {devElements.map((elem, idx) => {
          let elementLink = elem.link;

          return elementLink == undefined ? (
            <div key={`NameGuardCheck#${idx}`} className={cellStyle}>
              {elem.icon}
              <div>
                {elem.header}
                <p className={cellTextStyle}>{elem.text}</p>
              </div>
            </div>
          ) : (
            <a
              key={`NameGuardCheck#${idx}`}
              href={elementLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-fit h-fit"
            >
              <div className={hoverCellStyle}>
                <RedirectIcon className="hidden sm:group-hover:block absolute z-10 top-[18px] right-[18px]" />
                {elem.icon}
                <div>
                  {elem.header}
                  <p className={cellTextStyle}>{elem.text}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
