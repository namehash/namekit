import { MobileSectionDivider, WalletIcon } from "@/components/atoms";
import { ComingSoonSection, ComingSoonSectionProps } from "./ComingSoonSection";

import dangerous_name_config_img from "../../../public/assets/dangerous_name_configuration.svg";
import autorenew_img from "../../../public/assets/ens_autorenew.svg";
import ens_webfont_img from "../../../public/assets/ens_webfont.svg";
import ens_completion_score_img from "../../../public/assets/completion_score.svg";
import the_unknown_img from "../../../public/assets/making_the_unknown.svg";
import { Fragment } from "react";

export const ComingSoonSections = () => {
  return (
    <>
      {comingSoonSections.map((item, index) => {
        return (
          <Fragment key={index}>
            <ComingSoonSection {...item} />
            <MobileSectionDivider />
          </Fragment>
        );
      })}
    </>
  );
};

const comingSoonSections: ComingSoonSectionProps[] = [
  {
    sectionTargetSvg: <WalletIcon />,
    sectionTargetClientMessage: "For wallets and dApps",
    sectionHeader: (
      <>
        Identify dangerous name <br className="hidden md:block" />
        configurations
      </>
    ),
    sectionDescription:
      "Safeguard your community from improperly configured resolver records with ENS HealthChecks. These checks shield against major issues, spanning significant irreversible losses to web3 profiles that are incorrectly formatted and may not load properly.",
    sectionBackgroundName: "bg-purple_background",
    isTextOnTheLeft: true,
    badgeText: "Coming soon",
    imageSpecifics: {
      source: dangerous_name_config_img.src,
      tagWidth: 960,
      tagHeight: 682,
    },
  },

  {
    sectionTargetSvg: <WalletIcon />,
    sectionTargetClientMessage: "For wallets and dApps",
    sectionHeader: (
      <>
        Never lose a name you love with <br className="hidden md:block" />
        ENS AutoRenew
      </>
    ),
    sectionDescription:
      "In the hustle and bustle of life, ENS name renewals can slip through the cracks. Give your community peace of mind (and earn recurring revenue!) with ENS AutoRenew. What’s more, it also helps everyone save on gas fees, intelligently initiating renewal transactions at the most cost-effective moments. ",
    sectionBackgroundName: "bg-green_background",
    isTextOnTheLeft: false,
    badgeText: "Planned",
    imageSpecifics: {
      source: autorenew_img.src,
      tagWidth: 1160,
      tagHeight: 626,
    },
  },

  {
    sectionTargetSvg: <WalletIcon />,
    sectionTargetClientMessage: "For wallets and dApps",
    sectionHeader: <>ENS webfont</>,
    sectionDescription:
      "Unicode is a complex beast. Are you certain you are prepared to handle the display of all possible ENS names in your UI? ENS Webfont not only enhances security against homograph attacks but also expands rendering support for emojis and other unique graphemes.",
    sectionBackgroundName: "bg-purple_background",
    isTextOnTheLeft: true,
    badgeText: "Planned",
    imageSpecifics: {
      source: ens_webfont_img.src,
      tagWidth: 1440,
      tagHeight: 958,
    },
  },

  {
    sectionTargetSvg: <WalletIcon />,
    sectionTargetClientMessage: "For wallets and dApps",
    sectionHeader: <>ENS profile completion score</>,
    sectionDescription:
      "Boost social engagement and retention by encouraging your community to make the most of their ENS identity. Build gamified user journeys tailored to your app that incentivize users to boost their ENS profile completion score and join the ‘100% Club’.",
    sectionBackgroundName: "bg-green_background",
    isTextOnTheLeft: false,
    badgeText: "Planned",
    imageSpecifics: {
      source: ens_completion_score_img.src,
      tagWidth: 968,
      tagHeight: 738,
      styles: "md:pl-8",
    },
  },
  {
    sectionTargetSvg: <WalletIcon />,
    sectionTargetClientMessage: "For wallets and dApps",
    sectionHeader: <>Making the unknown, known</>,
    sectionDescription:
      "Many ENS domains are known to technically exist as a node in ENS, however the actual names for these domains is currently unknown. The ENS Subgraph helps to resolve some of these, but NameGuard goes further to resolve unknown names with a more powerful solution that learns from the community across time.",
    sectionBackgroundName: "bg-purple_background",
    isTextOnTheLeft: true,
    badgeText: "Planned",
    imageSpecifics: {
      source: the_unknown_img.src,
      tagWidth: 1228,
      tagHeight: 814,
    },
  },
];
