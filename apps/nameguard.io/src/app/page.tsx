import { Fragment } from "react";
import Image from "next/image";
import cc from "classcat";

import impersonation_attack_img from "../../public/assets/impersonation_attack.svg";
import fake_NFT_filter_img from "../../public/assets/fake_NFT_filter.svg";
import surface_risks_img from "../../public/assets/surface_risks.svg";
import dangerous_name_config_img from "../../public/assets/dangerous_name_configuration.svg";
import autorenew_img from "../../public/assets/ens_autorenew.svg";
import ens_webfont_img from "../../public/assets/ens_webfont.svg";
import ens_completion_score_img from "../../public/assets/completion_score.svg";
import the_unknown_img from "../../public/assets/making_the_unknown.svg";
import explore_ecosystem_img from "../../public/assets/ecosystem_scheme.png";
import { highlight } from "sugar-high";
import { CalButton } from "@/app/atoms/CalButton";
import { PushIcon } from "@/app/atoms/icons/PushIcon";
import { WalletConnectIcon } from "@/app/atoms/icons/WalletConnectIcon";
import { IntegrationIcon } from "@/app/atoms/icons/IntegrationIcon";
import { RoadmapPositiveShield } from "@/app/atoms/icons/RoadmapPositiveShield";
import { RoadmapWarningShield } from "@/app/atoms/icons/RoadmapWarningShield";
import { RoadmapNegativeShield } from "@/app/atoms/icons/RoadmapNegativeShield";
import { MessageIcon } from "@/app/atoms/icons/MessageIcon";
import { XMTPIcon } from "@/app/atoms/icons/XMTPIcon";
import { LensProtocolIcon } from "@/app/atoms/icons/LensProtocolIcon";
import { ShoppingCartIcon } from "@/app/atoms/icons/ShoppingCartIcon";
import { FarcasterLogo } from "@/app/atoms/icons/FarcasterLogo";
import { OpenSeaIcon } from "@/app/atoms/icons/OpenSeaIcon";
import { RaribleIcon } from "@/app/atoms/icons/RaribleIcon";
import { CoinbaseIcon } from "@/app/atoms/icons/CoinbaseIcon";
import { WalletIcon } from "@/app/atoms/icons/WalletIcon";
import { Hero } from "./components/Hero";
import { NGSearch } from "./components/NGSearch";
import { Metadata } from "next";
import { ChecksSection, DevelopersSection } from "./components/ContentSections";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const getSecurePrimaryName = `import { nameguard } from "@namehash/nameguard";

const address = "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776";
const result = await nameguard.getSecurePrimaryName(address);`;

const fakeEthNameCheck = `import { nameguard } from "@namehash/nameguard";

const contract = "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776";
const tokenId = "619959211285214429591066501314626337448852696
                 24153038309795231243542768648193";

const result = await nameguard.fakeEthNameCheck(contract, tokenId, {
  "title": "nick.eth"
})`;

const bulkInspectNames = `import { nameguard } from "@namehash/nameguard";

const name = "abc123🚀.eth";
const result = await nameguard.inspectName(name);

const names = ["abc.eth", "123.eth", "xyz.eth"];
const results = await nameguard.bulkInspectNames(names);`;

const title = "NameGuard - Protect your community with NameGuard for ENS";

export const metadata: Metadata = {
  title,
  keywords: ["nameguard", "normalization", "ens", "web3", "eth"],
};

export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative">
        <ReadySection
          sectionTargetSvg={<MessageIcon />}
          sectionTargetClientMessage="For Web3 messengers"
          sectionHeader={
            <Fragment>
              Alert from deceptive <br className="hidden md:block" />
              impersonation attacks
            </Fragment>
          }
          sectionDescription={
            <Fragment>
              Inbound messages from deceptive look-alike names can exploit
              trusted relationships. NameGuard&apos;s homograph and canonical
              name algorithms help you handle higher-risk messages.
            </Fragment>
          }
          sectionBackgroundName="bg-green_background"
          isCodeOnTheLeft={false}
          codeSnippet={getSecurePrimaryName}
          integrationsPanel={
            <div className="hidden gt_mobile:inline-flex flex-col items-center search_bar_change:items-start justify-center gap-4 z-10">
              <p className="text-gray-500 text-lg leading-6 font-normal not-italic whitespace-nowrap">
                Composable integrations include
              </p>
              <div className="w-full h-fit flex flex-row justify-around search_bar_change:justify-start items-center gap-6 flex-wrap search_bar_change:flex-nowrap">
                <XMTPIcon />
                <LensProtocolIcon />
                <FarcasterLogo />
                <PushIcon />
                <WalletConnectIcon />
              </div>
            </div>
          }
          imageSpecifics={{
            source: impersonation_attack_img.src,
            tagWidth: 956,
            tagHeight: 814,
          }}
        />
        <MobileSectionDivider />
        <ReadySection
          sectionTargetSvg={<ShoppingCartIcon />}
          sectionTargetClientMessage="For NFT Marketplaces"
          sectionHeader={<Fragment>Filter out fake ENS NFTs</Fragment>}
          sectionDescription={
            <Fragment>
              Just because a NFT names itself &quot;nick.eth&quot; doesn&apos;t
              mean it&apos;s an ENS name. NameGuard makes it easy to stop{" "}
              <a
                className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
                href="https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/61995921128521442959106650131462633744885269624153038309795231243542768648193"
                target="_blank"
                rel="noopener noreferrer"
              >
                fake ENS NFTs
              </a>{" "}
              from being sold on NFT marketplaces. Let&apos;s put an end to
              these scams !
            </Fragment>
          }
          sectionBackgroundName="bg-purple_background"
          isCodeOnTheLeft={true}
          codeSnippet={fakeEthNameCheck}
          integrationsPanel={
            <div className="inline-flex items-center gap-6 z-10">
              <p className="text-gray-500 text-lg leading-6 font-normal not-italic whitespace-nowrap">
                Composable integrations include
              </p>
              <OpenSeaIcon />
              <RaribleIcon />
              <CoinbaseIcon />
            </div>
          }
          imageSpecifics={{
            source: fake_NFT_filter_img.src,
            tagWidth: 924,
            tagHeight: 680,
          }}
        />
        <MobileSectionDivider />
        <ReadySection
          sectionTargetSvg={<ShoppingCartIcon />}
          sectionTargetClientMessage="For ENS Registrars & Marketplaces"
          sectionHeader={
            <Fragment>
              Surface hidden risks or limitations{" "}
              <br className="hidden md:block" />
              before final checkout
            </Fragment>
          }
          sectionDescription={
            <Fragment>
              NameGuard offers a detailed 12 point-inspection on any ENS name,
              including NameWrapper fuses, offchain names, and DNS
              compatibility. Ensure no shocking disappointments after purchase.
            </Fragment>
          }
          sectionBackgroundName="bg-green_background"
          isCodeOnTheLeft={false}
          codeSnippet={bulkInspectNames}
          imageSpecifics={{
            source: surface_risks_img.src,
            tagWidth: 884,
            tagHeight: 682,
          }}
        />
        <MobileSectionDivider />
        <ComingSoonSection
          sectionTargetSvg={<WalletIcon />}
          sectionTargetClientMessage="For wallets and dApps"
          sectionHeader={
            <Fragment>
              Identify dangerous name <br className="hidden md:block" />
              configurations
            </Fragment>
          }
          sectionDescription="Safeguard your community from improperly configured resolver records with ENS HealthChecks. These checks shield against major issues, spanning significant irreversible losses to web3 profiles that are incorrectly formatted and may not load properly."
          sectionBackgroundName="bg-purple_background"
          isTextOnTheLeft={true}
          badgeText="Coming soon"
          imageSpecifics={{
            source: dangerous_name_config_img.src,
            tagWidth: 960,
            tagHeight: 682,
          }}
        />
        <MobileSectionDivider />
        <ComingSoonSection
          sectionTargetSvg={<WalletIcon />}
          sectionTargetClientMessage="For wallets and dApps"
          sectionHeader={
            <Fragment>
              Never lose a name you love with <br className="hidden md:block" />
              ENS AutoRenew
            </Fragment>
          }
          sectionDescription="In the hustle and bustle of life, ENS name renewals can slip through the cracks. Give your community peace of mind (and earn recurring revenue!) with ENS AutoRenew. What’s more, it also helps everyone save on gas fees, intelligently initiating renewal transactions at the most cost-effective moments. "
          sectionBackgroundName="bg-green_background"
          isTextOnTheLeft={false}
          badgeText="Planned"
          imageSpecifics={{
            source: autorenew_img.src,
            tagWidth: 11600,
            tagHeight: 626,
          }}
        />
        <MobileSectionDivider />
        <ComingSoonSection
          sectionTargetSvg={<WalletIcon />}
          sectionTargetClientMessage="For wallets and dApps"
          sectionHeader={<Fragment>ENS webfont</Fragment>}
          sectionDescription="Unicode is a complex beast. Are you certain you are prepared to handle the display of all possible ENS names in your UI? ENS Webfont not only enhances security against homograph attacks but also expands rendering support for emojis and other unique graphemes."
          sectionBackgroundName="bg-purple_background"
          isTextOnTheLeft={true}
          badgeText="Planned"
          imageSpecifics={{
            source: ens_webfont_img.src,
            tagWidth: 1440,
            tagHeight: 958,
          }}
        />
        <MobileSectionDivider />
        <ComingSoonSection
          sectionTargetSvg={<WalletIcon />}
          sectionTargetClientMessage="For wallets and dApps"
          sectionHeader={<Fragment>ENS profile completion score</Fragment>}
          sectionDescription="Boost social engagement and retention by encouraging your community to make the most of their ENS identity. Build gamified user journeys tailored to your app that incentivize users to boost their ENS profile completion score and join the ‘100% Club’."
          sectionBackgroundName="bg-green_background"
          isTextOnTheLeft={false}
          badgeText="Planned"
          imageSpecifics={{
            source: ens_completion_score_img.src,
            tagWidth: 968,
            tagHeight: 738,
            styles: "md:pl-8",
          }}
        />
        <MobileSectionDivider />
        <ComingSoonSection
          sectionTargetSvg={<WalletIcon />}
          sectionTargetClientMessage="For wallets and dApps"
          sectionHeader={<Fragment>Making the unknown, known</Fragment>}
          sectionDescription="Many ENS domains are known to technically exist as a node in ENS, however the actual names for these domains is currently unknown. The ENS Subgraph helps to resolve some of these, but NameGuard goes further to resolve unknown names with a more powerful solution that learns from the community across time."
          sectionBackgroundName="bg-purple_background"
          isTextOnTheLeft={true}
          badgeText="Planned"
          imageSpecifics={{
            source: the_unknown_img.src,
            tagWidth: 1228,
            tagHeight: 814,
          }}
        />
        <MobileSectionDivider />
        <ChecksSection />
        <MobileSectionDivider />
        <DevelopersSection />
        <MobileSectionDivider />
      </div>
      <ExploreTheEcosystemSection />
      <RoadMap />
      <NewExitSection />
    </>
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
    <div className="hidden gt_mobile:block bg-black rounded-xl pb-4 max-w-full h-fit bg-gradient-to-b from-figma-black to-black z-10">
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

type ImageCharacteristics = {
  source: string;
  tagWidth: number;
  tagHeight: number;
  styles?: string;
};

type ReadySectionProps = {
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

function ReadySection(props: ReadySectionProps) {
  const mediaDiv =
    "flex sm:flex-col xl:flex-row justify-center border-0 rounded-none items-center gap-12 w-full h-full xl:h-3/4 py-16 px-10 flex-shrink-0 gt_mobile:gap-10";
  const backgroundDiv = cc([
    "absolute z-0 top-[40%] gt_mobile:top-[30%] left-[10%] h-[60%] w-[80%] bg-center bg-no-repeat bg-cover [opacity:0.4]",
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
    <section className="relative w-full h-full py-10 px-5 flex flex-col items-center justify-center bg-white gt_mobile:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] gt_mobile:[background-size:24px_24px] md:py-24 gt_mobile:px-0">
      <div className="max-w-full flex flex-col items-center gt_mobile:mx-auto gt_mobile:px-6 gt_mobile:gap-3">
        <div className="w-full flex flex-col gap-5 items-center max-w-2xl mx-auto">
          <div className="inline-flex px-4 py-2 bg-black bg-opacity-5 rounded-[20px] gap-2 justify-center items-center z-10">
            {props.sectionTargetSvg}
            <span className="text-black text-center text-sm not-italic font-medium z-10 leading-5">
              {props.sectionTargetClientMessage}
            </span>
          </div>

          <h1 className="text-black text-center not-italic z-10 text-2xl leading-8 font-semibold gt_mobile:text-4xl gt_mobile:font-bold gt_mobile:leading-10">
            {props.sectionHeader}
          </h1>

          <p className="z-10 text-gray-500 text-center not-italic font-normal text-lg leading-7 gt_mobile:text-lg gt_mobile:leading-7 gt_mobile:font-light">
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

type ComingSoonSectionProps = {
  sectionTargetClientMessage: string;
  sectionTargetSvg: React.ReactNode;
  sectionHeader: React.ReactNode;
  sectionDescription: string;
  sectionBackgroundName: string;
  isTextOnTheLeft: boolean;
  badgeText: string;
  imageSpecifics: ImageCharacteristics;
};

function ComingSoonSection(props: ComingSoonSectionProps) {
  const get_mobile_bg = () => {
    if (props.sectionBackgroundName.includes("purple")) {
      return "bg-purple_background_mobile";
    }
    return "bg-green_background_mobile";
  };

  const rightImageDiv = cc([
    "relative hidden gt_mobile:flex flex-row justify-center items-center w-full max-w-2xl xl:w-1/2 rounded-none bg-origin-border flex-shrink-0 xl:right-[50px]",
  ]);
  const mobileImageDiv = cc([
    "flex gt_mobile:hidden flex-row justify-center items-center w-full h-full rounded-none py-5 bg-origin-border bg-center bg-no-repeat bg-contain flex-shrink-0",
    get_mobile_bg(),
  ]);

  const leftImageDiv = cc([
    "relative hidden xl:flex flex-row justify-center items-center w-full max-w-2xl xl:w-1/2 rounded-none bg-origin-border flex-shrink-0 box-border pr-20",
  ]);

  const rightBackgroundDiv = cc([
    "absolute z-0 top-0 left-0 h-[105%] w-full search_bar_change:w-[110%] bg-center bg-no-repeat bg-cover [opacity:0.3]",
    props.sectionBackgroundName,
  ]);

  const leftBackgroundDiv = cc([
    "absolute z-0 h-[195%] w-full search_bar_change:w-[115%] bg-center bg-no-repeat bg-cover [opacity:0.3]",
    props.sectionBackgroundName,
  ]);

  const baseTextDiv =
    "flex flex-col gap-5 h-full w-full max-w-3xl items-center xl:items-start xl:w-1/2 md:px-[72px] xl:px-0";

  const baseImageStyles = "relative z-10 w-full h-full";

  return (
    <section className="w-full flex flex-col xl:flex-row items-center justify-center h-full py-10 px-5 bg-white gt_mobile:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] gt_mobile:[background-size:24px_24px] gt_mobile:h-1/2 md:py-20">
      {!props.isTextOnTheLeft && (
        <div className={leftImageDiv}>
          <div className={leftBackgroundDiv} />
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
        <h1 className="hidden gt_mobile:block text-black font-bold not-italic z-10 text-center xl:text-left text-4xl leading-10">
          {props.sectionHeader}&nbsp;{" "}
          <span className="hidden gt_mobile:relative gt_mobile:-top-1 gt_mobile:inline-flex items-center justify-center rounded-xl bg-green-100 px-3 py-0.5 text-center text-green-800 font-medium not-italic text-sm leading-5">
            {props.badgeText}
          </span>
        </h1>
        <div className="flex flex-col items-center gap-3 gt_mobile:hidden">
          <h1 className="gt_mobile:hidden text-black font-bold not-italic z-10 text-center text-2xl leading-8">
            {props.sectionHeader}
          </h1>
          <span className="gt_mobile:hidden inline-flex items-center justify-center rounded-xl bg-green-100 mx-3 px-3 py-0.5 text-center text-green-800 font-medium not-italic text-sm leading-5">
            {props.badgeText}
          </span>
        </div>
        <p className="text-gray-500 not-italic font-normal z-10 text-center text-lg leading-7 xl:text-left gt_mobile:text-lg gt_mobile:w-4/5 gt_mobile:leading-7 gt_mobile:font-light">
          {props.sectionDescription}
        </p>
      </div>
      {props.isTextOnTheLeft ? (
        <div className={rightImageDiv}>
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
      ) : (
        <div className={cc([rightImageDiv, "xl:hidden pt-8"])}>
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
      )}
      <div className={mobileImageDiv}>
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

function NewExitSection() {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center py-5 px-5 gap-5 z-10 bg-white md:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] md:[background-size:24px_24px] md:px-[112px] lg:pt-10 lg:pb-[45px] lg:flex-row lg:gap-10">
      <div className="m-auto flex items-center justify-center flex-col lg:flex-row w-full max-w-[1216px] gap-10">
        <div className="flex flex-col justify-center items-center h-full max-h-[334px] md:max-h-[315px] w-full max-w-3xl rounded-xl border border-gray-200 bg-generate_raport_background bg-no-repeat bg-top bg-[length:180%_200%] lg:bg-[length:100%_250%]">
          <div className="w-full h-full flex flex-col justify-center items-center gap-6 py-[63px] px-5 box-border lg:py-[60px] lg:max-w-[508px] lg:w-full lg:px-10">
            <div className="flex flex-col gap-4 items-center">
              <h1 className="text-center text-black not-italic text-3xl leading-9 font-bold ">
                Generate a report
              </h1>
              <p className="text-center text-gray-500 not-italic text-lg leading-7 font-normal gt_mobile:font-light lg:leading-8">
                Search for any ENS name to generate a report. Share NameGuard
                reports with frENS.{" "}
              </p>
            </div>
            <NGSearch />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center h-full max-h-[334px] md:max-h-[315px] w-full max-w-3xl rounded-xl border border-gray-200 bg-in_touch_background bg-no-repeat bg-top bg-[length:180%_200%] lg:bg-[length:100%_250%]">
          <div className="h-full w-full inline-flex flex-col justify-center items-center gap-10 py-10 px-5 box-border flex-shrink-0 lg:max-w-[508px] lg:w-full lg:px-10">
            <div className="flex flex-col h-fit w-full max-w-[295px] gt_mobile:max-w-full items-center justify-center gap-6">
              <div className="flex flex-col gap-4 items-center">
                <h1 className="text-center text-black not-italic text-3xl leading-9 font-bold ">
                  Get in touch
                </h1>
                <p className="text-center text-gray-500 not-italic text-lg leading-7 font-normal gt_mobile:font-light lg:leading-8">
                  Keep your users safe with NameGuard, the choice of leading
                  web3 teams. Ready for seamless integration into your web3 app?
                  Our team is here to assist you.
                </p>
              </div>
              <CalButton className="max-h-12 flex justify-center items-center px-[25px] py-[13px] rounded-lg border border-gray-300 bg-white z-10 shadow-sm transition hover:bg-gray-100 cursor-pointer text-black not-italic font-medium text-base leading-6">
                Schedule a call
              </CalButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type RoadMapElement = {
  stageOfCompletion: "launched" | "in progress" | "planned";
  headerText: string;
  commentSentences: string[] | React.ReactNode[];
};

function RoadMap() {
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const launchedBadge = (
    <span className="relative inline-flex items-center justify-center rounded-[10px] gt_mobile:rounded-xl bg-black px-[10px] gt_mobile:px-3 py-0.5 text-center font-medium text-white not-italic text-xs leading-4 gt_mobile:text-sm gt_mobile:leading-5">
      Launched
    </span>
  );

  const inProgressBadge = (
    <span className="relative inline-flex w-fit h-auto items-center whitespace-nowrap justify-center rounded-[10px] gt_mobile:rounded-xl border border-black bg-white px-[10px] gt_mobile:px-3 py-0.5 text-center font-medium text-black not-italic text-xs leading-4 gt_mobile:text-sm gt_mobile:leading-5">
      In progress
    </span>
  );

  const plannedBadge = (
    <span className="relative inline-flex items-center justify-center rounded-[10px] gt_mobile:rounded-xl bg-black bg-opacity-5 px-[10px] gt_mobile:px-3 py-0.5 text-center font-medium text-black not-italic text-xs leading-4 gt_mobile:text-sm gt_mobile:leading-5">
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
            href="https://github.com/namehash/nameguard/tree/main/packages/nameguard-sdk"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
            href="https://github.com/namehash/nameguard/blob/main/packages/ens-utils/src/nameparser.ts"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
            href="https://examples.nameguard.io"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
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
      commentSentences: ["Integrated mainnet and sepolia."],
    },
    {
      stageOfCompletion: "launched",
      headerText: "ENS Webfont Alpha",
      commentSentences: [
        <span key="ENSWebfontFragment">
          Released an{" "}
          <a
            className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
            href="https://github.com/namehash/nameguard/tree/main/packages/ens-webfont"
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
      <div className="w-full gt_mobile:w-4/6 h-full flex flex-col items-center justify-center pt-10 gt_mobile:pt-0 pb-5 gt_mobile:pb-0 gap-5 gt_mobile:gap-20">
        <div className="inline-flex h-fit w-full flex-col items-center gap-5 gt_mobile:gap-2 z-10">
          <h1 className="text-black text-center not-italic font-bold text-2xl leading-8 gt_mobile:text-4xl gt_mobile:leading-[52px]">
            NameGuard roadmap
          </h1>
          <p className="text-center text-gray-500 text-lg leading-7 font-normal not-italic gt_mobile:text-base gt_mobile:font-light">
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
                    "absolute left-0 top-0 flex w-6 justify-center mt-2"
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
                        )
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

function ExploreTheEcosystemSection() {
  return (
    <section className="relative z-10 hidden search_bar_change:flex flex-col justify-end items-center gap-[60px] pt-[100px] pb-20 bg-gray-50 box-border">
      <div className="flex flex-col items-center max-w-[1216px] gap-[60px]">
        <div className="flex flex-col justify-center items-center gap-5 max-w-[608px]">
          <div className="inline-flex px-4 py-2 bg-black bg-opacity-5 rounded-3xl gap-2 justify-center items-center z-10">
            <IntegrationIcon />
            <span className="text-black text-center text-sm leading-5 not-italic font-medium z-10">
              Architecture Overview
            </span>
          </div>
          <h1 className="text-black text-center not-italic z-10 text-2xl leading-8 font-bold md:text-4xl md:leading-10">
            Explore the NameGuard ecosystem
          </h1>
          <p className="text-center not-italic text-gray-500 text-lg leading-7 font-normal gt_mobile:font-light">
            NameGuard is an ecosystem of libraries and services that work
            together to help keep the web3 community safe.
          </p>
        </div>
        <Image
          src={explore_ecosystem_img.src}
          alt="ecosystem image"
          className="z-10 relative w-full h-full max-w-[1820px]"
          width={2592}
          height={1614}
          quality={100}
        />
      </div>
    </section>
  );
}

function MobileSectionDivider() {
  return (
    <div className="flex gt_mobile:hidden items-center justify-center w-full h-fit px-5">
      <span className="bg-gray-200 h-[1px] w-full"></span>
    </div>
  );
}

//TODO: for all icons make them take props (later refactor, especially when moving them to /atoms/icons)
