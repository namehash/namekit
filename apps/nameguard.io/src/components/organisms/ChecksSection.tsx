"use client";

import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import cc from "classcat";
import { checkResultCodeTextColor } from "@namehash/nameguard-react";
import { CheckResultCode } from "@namehash/nameguard";
import { Fragment } from "react";
import { ListSectionElement } from "@/types/listSectionTypes";
import { CheckShieldGrayOutline, ListSectionBadge } from "@/components/atoms";

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
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
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
    <section className="relative z-10 w-full h-full box-border flex flex-col py-10 px-5 items-center justify-center self-stretch gap-[32px] md:pt-[100px] md:pb-[48px] md:gap-0 bg-white sm:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] sm:[background-size:24px_24px] lg:px-28">
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
        <p className="text-center not-italic text-gray-500 text-lg leading-7 font-normal sm:font-light">
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
