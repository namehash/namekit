"use client";

import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import cc from "classcat";
import { checkResultCodeTextColor } from "@namehash/nameguard-react";
import { CheckResultCode } from "@namehash/nameguard";
import { Fragment } from "react";

import { FigmaIcon } from "@/app/atoms/icons/FigmaIcon";
import { RedirectIcon } from "@/app/atoms/icons/RedirectIcon";
import { GithubIconSmall } from "@/app/atoms/icons/GithubIconSmall";
import { CheckShieldGrayOutline } from "@/app/atoms/icons/CheckShieldGrayOutline";
import { GithubIconDevelopers } from "@/app/atoms/icons/GithubIconDevelopers";
import { CloudOutlineIcon } from "@/app/atoms/icons/CloudOutlineIcon";
import { GearWheelIcon } from "@/app/atoms/icons/GearWheelIcon";
import { FileIcon } from "@/app/atoms/icons/FileIcon";
import { FontIcon } from "@/app/atoms/icons/FontIcon";

type ListSectionElement = {
  header: React.ReactNode;
  text: React.ReactNode;
  icon: React.ReactNode;
  link?: string;
};

type ListBadgeProps = {
  text: string;
  width: number;
  height: number;
};

export function ListSectionBadge(props: ListBadgeProps) {
  const badgeStyle = cc([
    `w-[${props.width}px]`,
    `h-[${props.height}px]`,
    "flex justify-center items-center flex-shrink-0 py-[2px] px-[10px] bg-green-100 rounded-[10px] text-center text-green-800 text-xs leading-4 font-medium",
  ]);
  return <span className={badgeStyle}>{props.text}</span>;
}

export function DevelopersSection() {
  const iconWrapperStyle =
    "w-11 h-11 p-[10px] flex justify-center items-center flex-shrink-0 bg-black rounded-lg";
  const cellStyle =
    "group w-full md:w-[602px] h-full sm:min-w-[602px] max-w-[602px] box-border flex flex-row items-start justify-start bg-white p-5 gap-4 rounded-xl border border-gray-200";
  const cellTextStyle =
    "self-stretch not-italic z-10 text-gray-500 text-left text-sm leading-6 font-normal";
  const headerStyle =
    "self-stretch not-italic z-10 text-black text-left text-sm leading-6 font-semibold whitespace-nowrap";
  const headerWrapperStyle =
    "flex flex-row items-center justify-start gap-x-2 gap-y-1 flex-wrap";
  const redirectStyle =
    "hidden gt_mobile:group-hover:block absolute z-10 top-[18px] right-[18px]";
  const hoverCellStyle = cc([
    cellStyle,
    "gt_mobile:hover:cursor-pointer gt_mobile:hover:border-gray-300 gt_mobile:hover:shadow-sm transition relative",
  ]);

  const devElements: ListSectionElement[] = [
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>NameGuard library</h3>
        </div>
      ),
      text: <Fragment>Security &quot;x-ray&quot; for ENS names.</Fragment>,
      icon: (
        <div className={iconWrapperStyle}>
          <GithubIconDevelopers />
        </div>
      ),
      link: "https://github.com/namehash/nameguard/tree/main/api",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>NameGuard Client SDK</h3>
        </div>
      ),
      text: (
        <Fragment>Thin client SDK for making API calls to NameGuard.</Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <GithubIconDevelopers />
        </div>
      ),
      link: "https://github.com/namehash/nameguard/tree/main/packages/nameguard-sdk",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>NameGuard React UI Kit</h3>
          <ListSectionBadge width={53} height={20} text="Alpha" />
        </div>
      ),
      text: (
        <Fragment>
          React components for building nice interfaces with NameGuard data.
        </Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <GithubIconDevelopers />
        </div>
      ),
      link: "https://github.com/namehash/nameguard/tree/main/packages/nameguard-react",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>Figma UI kit</h3>
        </div>
      ),
      text: (
        <Fragment>
          Customize NameKit user interfaces to match your unique app.
        </Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <FigmaIcon />
        </div>
      ),
      link: "https://www.figma.com/file/aVlWccl7J2MyP8IE56lDMb/NameGuard-UI-Kit---23-11-2023",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>ENS Label Inspector</h3>
        </div>
      ),
      text: <Fragment>Detailed inspection of labels in ENS names.</Fragment>,
      icon: (
        <div className={iconWrapperStyle}>
          <GithubIconDevelopers />
        </div>
      ),
      link: "https://github.com/namehash/ens-label-inspector",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>ENS Font Data</h3>
        </div>
      ),
      text: (
        <Fragment>
          Metadata for graphemes that may appear in ENS names.
        </Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <GithubIconDevelopers />
        </div>
      ),
      link: "https://github.com/namehash/ens-font-data",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>ENS Normalize Python</h3>
        </div>
      ),
      text: (
        <Fragment>
          Python implementation of the ENS name normalization standard.
        </Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <GithubIconDevelopers />
        </div>
      ),
      link: "https://github.com/namehash/ens-normalize-python",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>ENS Name Parser</h3>
          <ListSectionBadge width={53} height={20} text="Alpha" />
        </div>
      ),
      text: (
        <Fragment>Utilities for parsing ENS names from user input.</Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <GithubIconDevelopers />
        </div>
      ),
      link: "https://github.com/namehash/nameguard/blob/main/packages/ens-utils/src/nameparser.ts",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>Open public API</h3>
        </div>
      ),
      text: (
        <Fragment>
          Connect to the NameGuard instance running in AWS for community use.
        </Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <CloudOutlineIcon />
        </div>
      ),
      link: "https://api.nameguard.io/docs",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>NameGuard DevOps Scripts</h3>
        </div>
      ),
      text: (
        <Fragment>
          Easily deploy your own instance of NameGuard into your own AWS cloud.
        </Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <GearWheelIcon />
        </div>
      ),
      link: "https://github.com/namehash/nameguard/blob/main/api/serverless.yml",
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>Detailed documentation</h3>
          <ListSectionBadge width={96} height={20} text="Coming soon" />
        </div>
      ),
      text: (
        <Fragment>
          Step-by-step guides to help developers make the most of NameGuard.
        </Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <FileIcon />
        </div>
      ),
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>ENS Webfont</h3>
          <ListSectionBadge width={96} height={20} text="Alpha" />
        </div>
      ),
      text: (
        <Fragment>
          Increase rendering support for emojis and other special graphemes.
        </Fragment>
      ),
      icon: (
        <div className={iconWrapperStyle}>
          <FontIcon />
        </div>
      ),
      link: "https://github.com/namehash/nameguard/tree/main/packages/ens-webfont",
    },
  ];

  return (
    <section className="relative z-10 w-full h-full box-border flex flex-col py-10 px-5 items-center justify-center self-stretch gap-[32px] bg-white gt_mobile:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] gt_mobile:[background-size:24px_24px] md:px-[100px]">
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
        <p className="text-center not-italic text-gray-500 text-lg leading-7 font-normal gt_mobile:font-light">
          All resources are open sourced and freely licensed for the community.
        </p>
      </div>
      <div className="w-full h-full flex flex-col md:flex-row md:flex-wrap max-w-[1840px] items-center justify-center content-between gap-4">
        {devElements.map((elem, idx) => {
          return elem.link == undefined ? (
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
              href={elem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-fit h-fit"
            >
              <div className={hoverCellStyle}>
                <RedirectIcon className={redirectStyle} />
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

export function ChecksSection() {
  const checkCircle = (
    <div className="w-12 h-12 flex justify-center items-center flex-shrink-0 p-[14px] bg-white rounded-[40px] border border-gray-200">
      <CheckCircleIcon
        className={cc([
          "w-5 h-5",
          checkResultCodeTextColor(CheckResultCode.pass),
        ])}
      />
    </div>
  );
  const questionmarkCircle = (
    <div className="w-12 h-12 flex justify-center items-center flex-shrink-0 p-[14px] bg-white rounded-[40px] border border-gray-200 border-dashed">
      <QuestionMarkCircleIcon className="text-gray-400 w-5 h-5" />
    </div>
  );

  const headerStyle =
    "self-stretch not-italic z-10 text-black text-left text-sm leading-6 font-semibold";

  const headerWrapperStyle = "flex flex-row items-center justify-start gap-2";

  const checkElements: ListSectionElement[] = [
    {
      header: <h3 className={headerStyle}>Potential Impersonation</h3>,
      text: (
        <Fragment>
          Protect from inbound messages that may appear to be from someone you
          trust.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>Confusable Characters</h3>,
      text: (
        <Fragment>
          Identify characters with a higher risk for visual confusion with other
          characters.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>Cross-Device Font Support</h3>,
      text: (
        <Fragment>
          Detect if characters have limited support to be viewed on popular
          operating systems.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>Invisible Characters</h3>,
      text: (
        <Fragment>
          Reveal any invisible characters that might otherwise be hiding in a
          name.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>Typing Difficulty</h3>,
      text: (
        <Fragment>
          Offer usability suggestions for users picking a name to register.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>Mixed Scripts</h3>,
      text: (
        <Fragment>
          Detect higher risk combinations of multiple scripts in a name.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>NameWrapper Compatibility</h3>,
      text: (
        <Fragment>
          Warn if the name being registered cannot be supported by the ENS Name
          Wrapper.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>ENSIP-15 Name Normalization</h3>,
      text: (
        <Fragment>
          Check if the name is normalized according to ENSIP-15.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>DNS Punycode Compatibility</h3>,
      text: (
        <Fragment>
          Warn during registration if a name will have DNS compatibility
          limitations.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>Unknown Labels</h3>,
      text: (
        <Fragment>
          Identify if the name contains unknown labels (e.g. [0123abcd...].eth).
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>Name Ruggability</h3>
          <ListSectionBadge width={96} height={20} text="Coming soon" />
        </div>
      ),
      text: (
        <Fragment>
          Warn buyers on secondary markets if a name can potentially be taken
          away.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: (
        <div className={headerWrapperStyle}>
          <h3 className={headerStyle}>NameWrapper Fuses</h3>
          <ListSectionBadge width={96} height={20} text="Coming soon" />
        </div>
      ),
      text: (
        <Fragment>
          Protect buyers on secondary markets from NameWrapper fuse
          configurations.
        </Fragment>
      ),
      icon: checkCircle,
    },
    {
      header: <h3 className={headerStyle}>Have a check suggestion?</h3>,
      text: (
        <Fragment>
          <a
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
            href="mailto:hello@namehashlabs.org"
          >
            Reach out to us
          </a>{" "}
          with your suggestions about which checks you want us to add
        </Fragment>
      ),
      icon: questionmarkCircle,
    },
  ];

  const cellStyle =
    "z-20 sm:w-[394px] box-border flex flex-row items-center justify-start bg-white p-5 gap-4 rounded-md border border-gray-200";
  const cellTextStyle =
    "self-stretch not-italic z-10 text-gray-500 text-left text-sm leading-6 font-normal";

  return (
    <section className="relative z-10 w-full h-full box-border flex flex-col py-10 px-5 items-center justify-center self-stretch gap-[32px] md:pt-[100px] md:pb-[48px] md:gap-0 bg-white gt_mobile:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] gt_mobile:[background-size:24px_24px] search_bar_change:px-28">
      <div className="flex flex-col justify-center items-center gap-5 max-w-[608px]">
        <div className="inline-flex px-4 py-2 bg-black bg-opacity-5 rounded-3xl gap-2 justify-center items-center z-10">
          <CheckShieldGrayOutline />
          <span className="text-black text-center text-sm leading-5 not-italic font-medium z-10">
            Advanced inspections
          </span>
        </div>
        <h1 className="text-black text-center not-italic z-10 text-2xl leading-8 font-bold md:text-4xl md:leading-10">
          Checks NameGuard Performs
        </h1>
        <p className="text-center not-italic text-gray-500 text-lg leading-7 font-normal gt_mobile:font-light">
          Elevate your security standards. Get next-level protection with a
          rigorous 12-Point inspection on ENS names, meticulously scrutinizing
          each label and grapheme for enhanced safety.
        </p>
      </div>
      <div className="relative flex flex-col items-center justify-center gap-4 py-10 w-full">
        <div
          className="w-full h-full absolute top-0 left-0"
          style={{
            background:
              "radial-gradient(44.37% 50% at 50% 50%, rgba(255, 255, 255, 0.00) 0%, #FFF 100%), linear-gradient(180deg, #FDC46A 0%, #2ED3C6 32.29%, #6DFFB7 70.83%, #6DFFB7 95.83%)",
            opacity: "0.1",
          }}
        />
        <div className="max-w-[1820px] grid min-[1420px]:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
          {checkElements.map((elem, idx) => {
            return (
              idx < checkElements.length - 1 && (
                <div key={`NameGuardCheck#${idx}`} className={cellStyle}>
                  {elem.icon}
                  <div>
                    {elem.header}
                    <p className={cellTextStyle}>{elem.text}</p>
                  </div>
                </div>
              )
            );
          })}
        </div>
        <div key="NameGuardCheck#questionmark" className={cellStyle}>
          {checkElements[checkElements.length - 1].icon}
          <div>
            {checkElements[checkElements.length - 1].header}
            <p className={cellTextStyle}>
              {checkElements[checkElements.length - 1].text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
