import { Fragment } from "react";

import impersonation_attack_img from "../../public/assets/impersonation_attack.svg";
import fake_NFT_filter_img from "../../public/assets/fake_NFT_filter.svg";
import surface_risks_img from "../../public/assets/surface_risks.svg";
import dangerous_name_config_img from "../../public/assets/dangerous_name_configuration.svg";
import autorenew_img from "../../public/assets/ens_autorenew.svg";
import ens_webfont_img from "../../public/assets/ens_webfont.svg";
import ens_completion_score_img from "../../public/assets/completion_score.svg";
import the_unknown_img from "../../public/assets/making_the_unknown.svg";
import { Metadata } from "next";
import {
  ChecksSection,
  ComingSoonSection,
  DevelopersSection,
  ExploreTheEcosystemSection,
  Hero,
  NewExitSection,
  ReadySection,
  RoadMap,
} from "@/components/organisms";
import {
  CoinbaseIcon,
  FarcasterLogo,
  LensProtocolIcon,
  MessageIcon,
  MobileSectionDivider,
  OpenSeaIcon,
  PushIcon,
  RaribleIcon,
  ShoppingCartIcon,
  WalletConnectIcon,
  WalletIcon,
  XMTPIcon,
} from "@/components/atoms";

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
            <div className="hidden sm:inline-flex flex-col items-center lg:items-start justify-center gap-4 z-10">
              <p className="text-gray-500 text-lg leading-6 font-normal not-italic whitespace-nowrap">
                Composable integrations include
              </p>
              <div className="w-full h-fit flex flex-row justify-around lg:justify-start items-center gap-6 flex-wrap lg:flex-nowrap">
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
                className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
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
