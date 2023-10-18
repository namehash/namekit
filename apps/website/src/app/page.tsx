'use client'

import Image from "next/image";
import { Highlight, themes } from "prism-react-renderer";
import { PrismTheme } from "prism-react-renderer";
import chat_img from "../../public/assets/chat.png";

export default function Home() {
    const exampleCode =
        `<figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800"/>
            <img class="w-24 h-24 md:w-48 md:h-auto md:rounded-none 
            rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="384" 
            height="512">
                <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
                    <blockquote>
                        <p class="text-lg font-medium">`;
  return (
    <>
      <div className="md:p-32 relative">
        <p>This is the landing page</p>
        <ReadySection
            sectionTargetSvgPath={"M7.1875 10C7.1875 10.1726 7.04759 10.3125 6.875 10.3125C6.70241 10.3125 6.5625 10.1726 6.5625 10C6.5625 9.82741 6.70241 9.6875 6.875 9.6875C7.04759 9.6875 7.1875 9.82741 7.1875 10ZM7.1875 10H6.875M10.3125 10C10.3125 10.1726 10.1726 10.3125 10 10.3125C9.82741 10.3125 9.6875 10.1726 9.6875 10C9.6875 9.82741 9.82741 9.6875 10 9.6875C10.1726 9.6875 10.3125 9.82741 10.3125 10ZM10.3125 10H10M13.4375 10C13.4375 10.1726 13.2976 10.3125 13.125 10.3125C12.9524 10.3125 12.8125 10.1726 12.8125 10C12.8125 9.82741 12.9524 9.6875 13.125 9.6875C13.2976 9.6875 13.4375 9.82741 13.4375 10ZM13.4375 10H13.125M17.5 10C17.5 13.797 14.1421 16.875 10 16.875C9.26044 16.875 8.54588 16.7769 7.87098 16.5941C7.05847 17.1649 6.06834 17.5 5 17.5C4.83398 17.5 4.6698 17.4919 4.50806 17.4761C4.375 17.4631 4.24316 17.4449 4.11316 17.4216C4.5161 16.9461 4.80231 16.3689 4.92824 15.734C5.00378 15.3531 4.81725 14.9832 4.53903 14.7124C3.27475 13.4818 2.5 11.8238 2.5 10C2.5 6.20304 5.85786 3.125 10 3.125C14.1421 3.125 17.5 6.20304 17.5 10Z"}
            sectionTargetClientMessage={"For Web3 messengers"}
            sectionHeader={`Protect from\nimpersonation attacks`}
            sectionDescription={`Current primary name lookups still display deceptive look-alike
              names such as "vitalík.eth" that go undetected during
              \`ens_normalize\` checks. NameGuard's advanced
              'canonical name' algorithm exposes copycat attempts
              and ensures a safe messaging experience for all.`}
            sectionBackgroundName={"bg-green_background"}
            isCodeOnTheLeft={false}
            codeSnippet={exampleCode}
        />
      <ReadySection
          sectionTargetSvgPath={"M7.1875 10C7.1875 10.1726 7.04759 10.3125 6.875 10.3125C6.70241 10.3125 6.5625 10.1726 6.5625 10C6.5625 9.82741 6.70241 9.6875 6.875 9.6875C7.04759 9.6875 7.1875 9.82741 7.1875 10ZM7.1875 10H6.875M10.3125 10C10.3125 10.1726 10.1726 10.3125 10 10.3125C9.82741 10.3125 9.6875 10.1726 9.6875 10C9.6875 9.82741 9.82741 9.6875 10 9.6875C10.1726 9.6875 10.3125 9.82741 10.3125 10ZM10.3125 10H10M13.4375 10C13.4375 10.1726 13.2976 10.3125 13.125 10.3125C12.9524 10.3125 12.8125 10.1726 12.8125 10C12.8125 9.82741 12.9524 9.6875 13.125 9.6875C13.2976 9.6875 13.4375 9.82741 13.4375 10ZM13.4375 10H13.125M17.5 10C17.5 13.797 14.1421 16.875 10 16.875C9.26044 16.875 8.54588 16.7769 7.87098 16.5941C7.05847 17.1649 6.06834 17.5 5 17.5C4.83398 17.5 4.6698 17.4919 4.50806 17.4761C4.375 17.4631 4.24316 17.4449 4.11316 17.4216C4.5161 16.9461 4.80231 16.3689 4.92824 15.734C5.00378 15.3531 4.81725 14.9832 4.53903 14.7124C3.27475 13.4818 2.5 11.8238 2.5 10C2.5 6.20304 5.85786 3.125 10 3.125C14.1421 3.125 17.5 6.20304 17.5 10Z"}
          sectionTargetClientMessage={"For Web3 messengers"}
          sectionHeader={`Protect from\nimpersonation attacks`}
          sectionDescription={`Current primary name lookups still display deceptive look-alike
          names such as "vitalík.eth" that go undetected during
          \`ens_normalize\` checks. NameGuard's advanced
          'canonical name' algorithm exposes copycat attempts
          and ensures a safe messaging experience for all.`}
          sectionBackgroundName={"bg-purple_background"}
          isCodeOnTheLeft={true}
          codeSnippet={exampleCode}
      />
          <ComingSoonSection
              sectionTargetSvgPath={"M7.1875 10C7.1875 10.1726 7.04759 10.3125 6.875 10.3125C6.70241 10.3125 6.5625 10.1726 6.5625 10C6.5625 9.82741 6.70241 9.6875 6.875 9.6875C7.04759 9.6875 7.1875 9.82741 7.1875 10ZM7.1875 10H6.875M10.3125 10C10.3125 10.1726 10.1726 10.3125 10 10.3125C9.82741 10.3125 9.6875 10.1726 9.6875 10C9.6875 9.82741 9.82741 9.6875 10 9.6875C10.1726 9.6875 10.3125 9.82741 10.3125 10ZM10.3125 10H10M13.4375 10C13.4375 10.1726 13.2976 10.3125 13.125 10.3125C12.9524 10.3125 12.8125 10.1726 12.8125 10C12.8125 9.82741 12.9524 9.6875 13.125 9.6875C13.2976 9.6875 13.4375 9.82741 13.4375 10ZM13.4375 10H13.125M17.5 10C17.5 13.797 14.1421 16.875 10 16.875C9.26044 16.875 8.54588 16.7769 7.87098 16.5941C7.05847 17.1649 6.06834 17.5 5 17.5C4.83398 17.5 4.6698 17.4919 4.50806 17.4761C4.375 17.4631 4.24316 17.4449 4.11316 17.4216C4.5161 16.9461 4.80231 16.3689 4.92824 15.734C5.00378 15.3531 4.81725 14.9832 4.53903 14.7124C3.27475 13.4818 2.5 11.8238 2.5 10C2.5 6.20304 5.85786 3.125 10 3.125C14.1421 3.125 17.5 6.20304 17.5 10Z"}
              sectionTargetClientMessage={"For wallets and dApps"}
              sectionHeader={"Identify dangerous name\nconfigurations "}
              sectionDescription={"Changes in ownership of ENS names does not automatically update deposit addresses. This can result in considerable harm and lead to irreversible losses. " +
                  "ENS Name Healthchecks instantly detect all potential issues, including warnings for ENS resolver records that are improperly formatted."}
              sectionBackgroundName={"bg-purple_background"}
              isTextOnTheLeft={true}
          />
          <ComingSoonSection
              sectionTargetSvgPath={"M7.1875 10C7.1875 10.1726 7.04759 10.3125 6.875 10.3125C6.70241 10.3125 6.5625 10.1726 6.5625 10C6.5625 9.82741 6.70241 9.6875 6.875 9.6875C7.04759 9.6875 7.1875 9.82741 7.1875 10ZM7.1875 10H6.875M10.3125 10C10.3125 10.1726 10.1726 10.3125 10 10.3125C9.82741 10.3125 9.6875 10.1726 9.6875 10C9.6875 9.82741 9.82741 9.6875 10 9.6875C10.1726 9.6875 10.3125 9.82741 10.3125 10ZM10.3125 10H10M13.4375 10C13.4375 10.1726 13.2976 10.3125 13.125 10.3125C12.9524 10.3125 12.8125 10.1726 12.8125 10C12.8125 9.82741 12.9524 9.6875 13.125 9.6875C13.2976 9.6875 13.4375 9.82741 13.4375 10ZM13.4375 10H13.125M17.5 10C17.5 13.797 14.1421 16.875 10 16.875C9.26044 16.875 8.54588 16.7769 7.87098 16.5941C7.05847 17.1649 6.06834 17.5 5 17.5C4.83398 17.5 4.6698 17.4919 4.50806 17.4761C4.375 17.4631 4.24316 17.4449 4.11316 17.4216C4.5161 16.9461 4.80231 16.3689 4.92824 15.734C5.00378 15.3531 4.81725 14.9832 4.53903 14.7124C3.27475 13.4818 2.5 11.8238 2.5 10C2.5 6.20304 5.85786 3.125 10 3.125C14.1421 3.125 17.5 6.20304 17.5 10Z"}
              sectionTargetClientMessage={"For wallets and dApps"}
              sectionHeader={"Identify dangerous name\nconfigurations "}
              sectionDescription={"Changes in ownership of ENS names does not automatically update deposit addresses. This can result in considerable harm and lead to irreversible losses. " +
                  "ENS Name Healthchecks instantly detect all potential issues, including warnings for ENS resolver records that are improperly formatted."}
              sectionBackgroundName={"bg-green_background"}
              isTextOnTheLeft={false}
          />
          <Footer />
      </div>

      <div className="fixed inset-0 z-0 h-full w-full bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
    </>
  );
}

export type CodeSnippetProps = {
    codeSnippet: string;
}

export function CodeSnippet(props: CodeSnippetProps) {
    const figmaTheme: PrismTheme = {
        plain: {
            backgroundColor: "transparent",
            color: "hsl(220, 14%, 71%)",
            textShadow: "0 1px rgba(0, 0, 0, 0.3)",
        },
        styles: [
            {
                types: ["comment", "prolog", "cdata"],
                style: {
                    color: "rgba(255,255,255, 1)",
                },
            },
            {
                types: ["doctype", "punctuation", "entity"],
                style: {
                    color: "rgba(255,255,255, 1)",
                },
            },
            {
                types: [
                    "attr-name",
                    "class-name",
                    "maybe-class-name",
                    "boolean",
                    "constant",
                    "number",
                    "atrule",
                ],
                style: { color: "rgba(255,255,255, 1)" },
            },
            {
                types: ["keyword"],
                style: { color: "rgba(255,255,255, 1)" },
            },
            {
                types: ["property", "tag", "symbol", "deleted", "important"],
                style: {
                    color: "rgba(255,255,255, 1)",
                },
            },

            {
                types: [
                    "selector",
                    "string",
                    "char",
                    "builtin",
                    "inserted",
                    "regex",
                    "attr-value",
                ],
                style: {
                    color: "rgba(255,255,255, 1)",
                },
            },
            {
                types: ["variable", "operator", "function"],
                style: {
                    color: "rgba(255,255,255, 1)",
                },
            },
            {
                types: ["url"],
                style: {
                    color: "rgba(255,255,255, 1)",
                },
            },
            {
                types: ["deleted"],
                style: {
                    textDecorationLine: "line-through",
                },
            },
            {
                types: ["inserted"],
                style: {
                    textDecorationLine: "underline",
                },
            },
            {
                types: ["italic"],
                style: {
                    fontStyle: "italic",
                },
            },
            {
                types: ["important", "bold"],
                style: {
                    fontWeight: "bold",
                },
            },
            {
                types: ["important"],
                style: {
                    color: "rgba(255,255,255, 1)",
                },
            },
        ],
    }
    return (
        <div className="hidden mobile:block bg-black rounded-xl pb-8 w-fit h-fit bg-gradient-to-b from-figma-black to-black z-10">
        <div className="flex flex-col gap-2.5 px-2.5 py-3">
            <div className="flex justify-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="5" fill="#434446"/>
                    <circle cx="5" cy="5" r="5" fill="#434446"/>
                    <circle cx="5" cy="5" r="5" fill="#434446"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="5" fill="#434446"/>
                    <circle cx="5" cy="5" r="5" fill="#434446"/>
                    <circle cx="5" cy="5" r="5" fill="#434446"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="5" fill="#434446"/>
                    <circle cx="5" cy="5" r="5" fill="#434446"/>
                    <circle cx="5" cy="5" r="5" fill="#434446"/>
                </svg>
            </div>
        </div>
        <hr className="border-code-gray"/>
        <div className="py-4 px-5">
            <Highlight
                theme={figmaTheme}
                code={`${props.codeSnippet}`}
                language="html"
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={"max-w-3xl"} style={style}>
                                {tokens.map((line, i) => (
                                    <div key={i} {...getLineProps({ line })}>
                                        <span className="pr-8 text-code-gray">{i + 1}</span>
                                        {line.map((token, key) => (
                                            <span key={key} {...getTokenProps({ token })} />
                                        ))}
                                    </div>
                                ))}
                              </pre>
                )}
            </Highlight>
        </div>
    </div>);
}

export type ReadySectionProps = {
    sectionTargetClientMessage: string;
    sectionTargetSvgPath: string;
    sectionHeader: string;
    sectionDescription: string;
    sectionBackgroundName: string;
    isCodeOnTheLeft: boolean;
    codeSnippet: string;
}

export function ReadySection(props: ReadySectionProps){
  return (
      <section className={`w-full h-full py-24 flex flex-col items-center justify-center`}>
          <div className="max-w-full mx-auto px-6 flex flex-col items-center gap-3">
          <div className="flex flex-col gap-5 items-center w-1/2">
            <div className="inline-flex px-4 py-2 bg-black bg-opacity-5 rounded-3xl gap-2 justify-center items-center z-10">
              <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d={props.sectionTargetSvgPath}
                    stroke="#808080"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
              </svg>
              <span className="text-black text-center text-sm not-italic font-medium z-10">
                      {props.sectionTargetClientMessage}
                    </span>
            </div>

            <h1 className="text-black text-center text-4xl font-bold not-italic z-10">
                {props.sectionHeader}
            </h1>

            <p className="text-gray-500 text-lg not-italic font-normal text-center w-4/5 z-10">
                {props.sectionDescription}
            </p>
          </div>
              {props.isCodeOnTheLeft ? (
                  <div className={`flex sm:flex-col xl:flex-row justify-center rounded-none items-center gap-10 w-full h-3/4 py-16 px-10 ${props.sectionBackgroundName} bg-center bg-no-repeat bg-cover` }>
                      <CodeSnippet codeSnippet={props.codeSnippet}/>
                      <Image className={"z-10"} src={chat_img} alt={"chat image for layout testing"} width={440} height={418}/>
                  </div>
              ) : (
                  <div className={`flex flex-col xl:flex-row justify-center items-center gap-10 w-full h-3/4 py-16 px-10 rounded-none ${props.sectionBackgroundName} bg-center bg-no-repeat bg-cover`}>
                    <Image className={"z-10"} src={chat_img} alt={"chat image for layout testing"} width={440} height={418}/>
                    <CodeSnippet codeSnippet={props.codeSnippet} />
                  </div>
              )}
        </div>
  </section>);
}

export type ComingSoonSectionProps = {
    sectionTargetClientMessage: string;
    sectionTargetSvgPath: string;
    sectionHeader: string;
    sectionDescription: string;
    sectionBackgroundName: string;
    isTextOnTheLeft: boolean;
}

export function ComingSoonSection(props: ComingSoonSectionProps) {
    return (
        <section className={`w-full h-1/2 py-24 flex flex-row items-center justify-center gap-10`}>
            {!props.isTextOnTheLeft &&
                <div className={`${props.sectionBackgroundName} rounded-none px-20 py-24 bg-origin-border bg-center bg-no-repeat bg-cover`}>
                    <Image className={"relative z-10"}
                           src={chat_img} alt={"chat image for layout testing"}
                           width={440} height={418} />
                </div>
                }
            <div className="flex flex-col gap-5 items-start w-1/2 h-full">
                <div className="inline-flex px-4 py-2 bg-black bg-opacity-5 rounded-3xl gap-2 justify-center items-center z-10">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d={props.sectionTargetSvgPath}
                            stroke="#808080"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="text-black text-center text-sm not-italic font-medium z-10">
                        {props.sectionTargetClientMessage}
                    </span>
                </div>
                <h1 className="text-black text-left text-4xl font-bold not-italic z-10">
                    {props.sectionHeader}
                    <span className="relative -top-1 inline-flex items-center justify-center rounded-xl bg-green-100 mx-3 px-3 py-0.5 text-center font-medium text-green-800 font-medium not-italic text-sm">
                        Coming soon
                    </span>
                </h1>
                <p className="text-gray-500 text-lg not-italic font-normal text-left w-4/5 z-10">
                    {props.sectionDescription}
                </p>

            </div>
            {props.isTextOnTheLeft && <div className={`${props.sectionBackgroundName} rounded-none px-20 py-24 bg-origin-border bg-opacity-20 bg-center bg-no-repeat bg-contain`}>
                <Image className={"relative z-10"}
                       src={chat_img} alt={"chat image for layout testing"} width={440} height={418} />
            </div>}
        </section>
    );
}

export function Footer(){
    return (<footer className={"absolute bot-0 flex flex-row justify-between items-center px-6 "}>
        <p className={"not-italic font-normal text-gray-500 text-footer_text"}>&copy; NameHash Labs.</p>
        <p className={"not-italic font-normal text-gray-500 text-footer_text"}>Made with &heart; by <u className={"text-black"}>NameHash</u></p>
    </footer>)
}
