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
  XMTPIcon,
} from "@components/atoms";
import impersonation_attack_img from "../../../public/assets/impersonation_attack.svg";
import fake_NFT_filter_img from "../../../public/assets/fake_NFT_filter.svg";
import surface_risks_img from "../../../public/assets/surface_risks.svg";

import { ReadySection, ReadySectionProps } from "./ReadySection";
import { Fragment } from "react";

export const ReadySections = () => {
  return (
    <>
      {readySections.map((item, index) => {
        return (
          <Fragment key={index}>
            <ReadySection {...item} />
            <MobileSectionDivider />
          </Fragment>
        );
      })}
    </>
  );
};

const readySections: ReadySectionProps[] = [
  {
    sectionTargetSvg: <MessageIcon />,
    sectionTargetClientMessage: "For Web3 messengers",
    sectionHeader: (
      <>
        Alert from deceptive <br className="hidden md:block" />
        impersonation attacks
      </>
    ),
    sectionDescription: (
      <>
        Inbound messages from deceptive look-alike names can exploit trusted
        relationships. NameGuard&apos;s homograph and canonical name algorithms
        help you handle higher-risk messages.
      </>
    ),
    sectionBackgroundName: "bg-green_background",
    isCodeOnTheLeft: false,
    codeSnippet: `import { nameguard } from "@namehash/nameguard";

    const address = "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776";
    const result = await nameguard.getSecurePrimaryName(address);`,
    integrationsPanel: (
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
    ),
    imageSpecifics: {
      source: impersonation_attack_img.src,
      tagWidth: 956,
      tagHeight: 814,
    },
  },

  {
    sectionTargetSvg: <ShoppingCartIcon />,
    sectionTargetClientMessage: "For NFT Marketplaces",
    sectionHeader: <>Filter out fake ENS NFTs</>,
    sectionDescription: (
      <>
        Just because a NFT names itself &quot;nick.eth&quot; doesn&apos;t mean
        it&apos;s an ENS name. NameGuard makes it easy to stop{" "}
        <a
          className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
          href="https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/61995921128521442959106650131462633744885269624153038309795231243542768648193"
          target="_blank"
          rel="noopener noreferrer"
        >
          fake ENS NFTs
        </a>{" "}
        from being sold on NFT marketplaces. Let&apos;s put an end to these
        scams !
      </>
    ),
    sectionBackgroundName: "bg-purple_background",
    isCodeOnTheLeft: false,
    codeSnippet: `import { nameguard } from "@namehash/nameguard";

    const contract = "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776";
    const tokenId = "619959211285214429591066501314626337448852696
                    24153038309795231243542768648193";

    const result = await nameguard.fakeEthNameCheck(contract, tokenId, {
      "title": "nick.eth"
    })`,
    integrationsPanel: (
      <div className="inline-flex items-center gap-6 z-10">
        <p className="text-gray-500 text-lg leading-6 font-normal not-italic whitespace-nowrap">
          Composable integrations include
        </p>
        <OpenSeaIcon />
        <RaribleIcon />
        <CoinbaseIcon />
      </div>
    ),
    imageSpecifics: {
      source: fake_NFT_filter_img.src,
      tagWidth: 924,
      tagHeight: 680,
    },
  },

  {
    sectionTargetSvg: <ShoppingCartIcon />,
    sectionTargetClientMessage: "For ENS Registrars & Marketplaces",
    sectionHeader: (
      <>
        Surface hidden risks or limitations <br className="hidden md:block" />
        before final checkout
      </>
    ),
    sectionDescription: (
      <>
        NameGuard offers a detailed 12 point-inspection on any ENS name,
        including NameWrapper fuses, offchain names, and DNS compatibility.
        Ensure no shocking disappointments after purchase.
      </>
    ),
    sectionBackgroundName: "bg-green_background",
    isCodeOnTheLeft: false,
    codeSnippet: `import { nameguard } from "@namehash/nameguard";

    const name = "abc123🚀.eth";
    const result = await nameguard.inspectName(name);

    const names = ["abc.eth", "123.eth", "xyz.eth"];
    const results = await nameguard.bulkInspectNames(names);`,
    imageSpecifics: {
      source: surface_risks_img.src,
      tagWidth: 884,
      tagHeight: 682,
    },
  },
];
