import { ens_normalize } from "@adraffy/ens-normalize";

export interface Profile {
  ensName: string; // always a normalized ENS name
  title: string;
  displayName?: string;
  twitterProfile?: string;
  address?: `0x${string}`;
}

export function buildProfile(params: {
  ensName: string;
  title: string;
  displayName?: string;
  twitterProfile?: string;
  address?: `0x${string}`;
}): Profile {
  return {
    ensName: ens_normalize(params.ensName), // guarantee the ensName of all Profile objects is normalized
    title: params.title,
    displayName: params.displayName,
    twitterProfile: params.twitterProfile,
    address: params.address,
  };
}

export const getCachedProfile = (ensName: string): Profile => {
  let ensNameProfile: Profile | undefined;

  const normalizedName = ens_normalize(ensName);

  for (let value of EnsProfiles.values()) {
    if (value.ensName === normalizedName) ensNameProfile = value;
  }

  if (!ensNameProfile)
    throw new Error("No cached ENS Profile for name: " + ensName);

  return ensNameProfile;
};

const EnsProfiles = new Map<`0x${string}`, Profile>([
  [
    "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
    buildProfile({
      ensName: "nick.eth",
      title: "Founder and Lead Developer of ENS & Ethereum Foundation Alumni",
      displayName: "Nick Johnson",
      twitterProfile: "https://x.com/nicksdjohnson",
      address: "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
    }),
  ],
  [
    "0x809FA673fe2ab515FaA168259cB14E2BeDeBF68e",
    buildProfile({
      ensName: "avsa.eth",
      title: "Ethereum Foundation Alumni & Co-founder of ENS",
      displayName: "Alex Van de Sande",
      twitterProfile: "https://x.com/avsa",
      address: "0x809FA673fe2ab515FaA168259cB14E2BeDeBF68e",
    }),
  ],
  [
    "0x82eB45562F991329ED2867F43fc60F0Ba52C3Dab",
    buildProfile({
      ensName: "validator.eth",
      title: "Community and Ecosystem Lead at ENS",
      displayName: "Kevin Gaspar",
      twitterProfile: "https://x.com/ValidatorEth",
      address: "0x82eB45562F991329ED2867F43fc60F0Ba52C3Dab",
    }),
  ],
  [
    "0x7a3d05c70581bD345fe117c06e45f9669205384f",
    buildProfile({
      ensName: "rainbowwallet.eth",
      title:
        "The fun, simple, & secure way to explore Web3, NFTs, & Ethereum 🌈",
      displayName: "Rainbow",
      twitterProfile: "https://x.com/rainbowdotme",
      address: "0x7a3d05c70581bD345fe117c06e45f9669205384f",
    }),
  ],
  [
    "0x5D25E3Ebb10f4DEbF1D7b76Eb94302d2D74C7035",
    buildProfile({
      ensName: "mikedemarais.eth",
      title: "Co-founder of Rainbow Wallet",
      displayName: "Mike Demarais",
      twitterProfile: "https://x.com/mikedemarais",
      address: "0x5D25E3Ebb10f4DEbF1D7b76Eb94302d2D74C7035",
    }),
  ],
  [
    "0xd1324aDA7e026211D0CacD90CAe5777E340dE948",
    buildProfile({
      ensName: "inzhoop.eth",
      title: "Independent startup working on smart mobile wallet for Ethereum",
      twitterProfile: "https://x.com/inzhoop",
      address: "0xd1324aDA7e026211D0CacD90CAe5777E340dE948",
    }),
  ],
  [
    "0xB94B57A92aB7c6406519A48C0dd1e26FD6D45D88",
    buildProfile({
      ensName: "spencecoin.eth",
      title:
        "Director of Marketing and Strategic Initiatives at Metamask and Consensys",
      displayName: "Jordan Spence",
      twitterProfile: "https://x.com/spencecoin",
      address: "0xB94B57A92aB7c6406519A48C0dd1e26FD6D45D88",
    }),
  ],
  [
    "0x983110309620D911731Ac0932219af06091b6744",
    buildProfile({
      ensName: "brantly.eth",
      title:
        "Building Ethereum Follow Protocol & Creator of Sign-In w/ Ethereum",
      displayName: "Brantly Millegan",
      twitterProfile: "https://x.com/BrantlyMillegan",
      address: "0x983110309620D911731Ac0932219af06091b6744",
    }),
  ],
  [
    "0x190473B3071946df65306989972706A4c006A561",
    buildProfile({
      ensName: "chainlinkgod.eth",
      title: "Chainlink Community Liaison",
      twitterProfile: "https://x.com/ChainLinkGod",
      address: "0x190473B3071946df65306989972706A4c006A561",
    }),
  ],
  [
    "0xBdB41BfF7E828E2DC2d15EB67257455db818F1DC",
    buildProfile({
      ensName: "cory.eth",
      title: "Founder of OpenAvatar",
      displayName: "Cory Gabrielsen",
      twitterProfile: "https://x.com/cory_eth",
      address: "0xBdB41BfF7E828E2DC2d15EB67257455db818F1DC",
    }),
  ],
  [
    "0xf6B6F07862A02C85628B3A9688beae07fEA9C863",
    buildProfile({
      ensName: "poap.eth",
      title: "Bookmarks for your life",
      displayName: "Proof of Attendance Protocol",
      twitterProfile: "https://x.com/poapxyz",
      address: "0xf6B6F07862A02C85628B3A9688beae07fEA9C863",
    }),
  ],
  [
    "0x839395e20bbb182fa440d08f850e6c7a8f6f0780",
    buildProfile({
      ensName: "griff.eth",
      title:
        "Cofounder Giveth, CommonsStack, GeneralMagic, Dappnode & DECENTRAL",
      displayName: "Griff Green",
      twitterProfile: "https://x.com/thegrifft",
      address: "0x839395e20bbb182fa440d08f850e6c7a8f6f0780",
    }),
  ],
  [
    "0x1D5460F896521aD685Ea4c3F2c679Ec0b6806359",
    buildProfile({
      ensName: "coltron.eth",
      title: "ENS Public Goods Steward, Gov Analyst at Karpatkey",
      twitterProfile: "https://x.com/Coltron_eth",
      address: "0x1D5460F896521aD685Ea4c3F2c679Ec0b6806359",
    }),
  ],
  [
    "0x54BeCc7560a7Be76d72ED76a1f5fee6C5a2A7Ab6",
    buildProfile({
      ensName: "simona.eth",
      title: "ENS Public Goods Steward, Advisor at DELV & Optimism",
      twitterProfile: "https://x.com/Sim_Pop",
      address: "0x54BeCc7560a7Be76d72ED76a1f5fee6C5a2A7Ab6",
    }),
  ],
  [
    "0x48A63097E1Ac123b1f5A8bbfFafA4afa8192FaB0",
    buildProfile({
      ensName: "ceresstation.eth",
      title: "Co-founder of Gitcoin and General Partner at Public Works",
      displayName: "Scott Moore",
      twitterProfile: "https://x.com/notscottmoore",
      address: "0x48A63097E1Ac123b1f5A8bbfFafA4afa8192FaB0",
    }),
  ],
  [
    "0xd5D171a9AA125AF13216C3213B5A9Fc793FcCF2c",
    buildProfile({
      ensName: "liubenben.eth",
      title: "Building ensuser.com for the Chinese ENS Community",
      twitterProfile: "https://x.com/forlbb",
      address: "0xd5D171a9AA125AF13216C3213B5A9Fc793FcCF2c",
    }),
  ],
  [
    "0x4D982788c01402C4E0f657E1192d7736084AE5a8",
    buildProfile({
      ensName: "garypalmerjr.eth",
      title: "ENS Advocate and Founder of Web3Domains",
      twitterProfile: "https://x.com/garypalmerjr",
      address: "0x4D982788c01402C4E0f657E1192d7736084AE5a8",
    }),
  ],
  [
    "0x7265a60acAeaf3A5E18E10BC1128e72F27B2e176",
    buildProfile({
      ensName: "master.eth",
      title: "ENS Advocate",
      twitterProfile: "https://x.com/seekmine",
      address: "0x7265a60acAeaf3A5E18E10BC1128e72F27B2e176",
    }),
  ],
  [
    "0x399e0ae23663f27181ebb4e66ec504b3aab25541",
    buildProfile({
      ensName: "superphiz.eth",
      title: "Ethereum Decentralization Advocate",
      twitterProfile: "https://x.com/superphiz",
      address: "0x399e0ae23663f27181ebb4e66ec504b3aab25541",
    }),
  ],
  [
    "0xe11da9560b51f8918295edc5ab9c0a90e9ada20b",
    buildProfile({
      ensName: "jalil.eth",
      title: "Gardener at Visualize Value",
      displayName: "Jalil Wahdatehagh",
      twitterProfile: "https://x.com/jalilwahdat",
      address: "0xe11da9560b51f8918295edc5ab9c0a90e9ada20b",
    }),
  ],
  [
    "0x30C7F4F7504D6366916f669cd8E731ED4dF6C702",
    buildProfile({
      ensName: "bosco.eth",
      title: "Love Freedom and Public Goods 💚",
      twitterProfile: "https://x.com/amboscoboinik",
      address: "0x30C7F4F7504D6366916f669cd8E731ED4dF6C702",
    }),
  ],
  [
    "0xC6058667a57374cd350280Fcf06a5f0517682BEB",
    buildProfile({
      ensName: "krypto.eth",
      title: "Poland ENS Master",
      twitterProfile: "https://x.com/CryptoDodoPL",
      address: "0xC6058667a57374cd350280Fcf06a5f0517682BEB",
    }),
  ],
  [
    "0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab",
    buildProfile({
      ensName: "wslyvh.eth",
      title: "Events at Ethereum Foundation",
      displayName: "Wesley",
      twitterProfile: "https://x.com/wslyvh",
      address: "0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab",
    }),
  ],
  [
    "0x8b1f85a93Ac6E4F62695Ea8EF2410d248605FEff",
    buildProfile({
      ensName: "premm.eth",
      title: "Founder at Unruggable Labs, ENS Fellow",
      displayName: "Prem Makeig",
      twitterProfile: "https://x.com/nxt3d",
      address: "0x8b1f85a93Ac6E4F62695Ea8EF2410d248605FEff",
    }),
  ],
  [
    "0x5BFCB4BE4d7B43437d5A0c57E908c048a4418390",
    buildProfile({
      ensName: "fireeyesdao.eth",
      title: "Delegate for Optimism, ENS, GitCoin, Rocket Pool, & Safe",
      displayName: "Fire Eyes DAO",
      twitterProfile: "https://x.com/fireeyesgov",
      address: "0x5BFCB4BE4d7B43437d5A0c57E908c048a4418390",
    }),
  ],
  [
    "0x7Ae94d7712b7EDB9BB2C0Ee6D71081a6D8710c0b",
    buildProfile({
      ensName: "spikewatanabe.eth",
      title: "ENS Delegate & experienced investment banker",
      twitterProfile: "https://x.com/spikewatanabe",
      address: "0x7Ae94d7712b7EDB9BB2C0Ee6D71081a6D8710c0b",
    }),
  ],
  [
    "0x76A6D08b82034b397E7e09dAe4377C18F132BbB8",
    buildProfile({
      ensName: "alextnetto.eth",
      title: "Executive Director of Blockful & ENS Meta-Gov Steward",
      displayName: "Alex Netto",
      twitterProfile: "https://x.com/alextnetto",
      address: "0x76A6D08b82034b397E7e09dAe4377C18F132BbB8",
    }),
  ],
  [
    "0xBcE35d5A3e89995730B3C979a01319D06E41776f",
    buildProfile({
      ensName: "elbagococina.eth",
      title:
        "Co-founder Karpatkey, Core Treasury for GnosisDAO, Balancer, ENS, CoWSwap, and Lido",
      twitterProfile: "https://x.com/elbagococina",
      address: "0xBcE35d5A3e89995730B3C979a01319D06E41776f",
    }),
  ],
  [
    "0xed11e5eA95a5A3440fbAadc4CC404C56D0a5bb04",
    buildProfile({
      ensName: "she256.eth",
      title:
        "Nonprofit dedicated to increasing diversity in the blockchain space",
      twitterProfile: "https://x.com/she_256",
      address: "0xed11e5eA95a5A3440fbAadc4CC404C56D0a5bb04",
    }),
  ],
  [
    "0xA7860E99e3ce0752D1ac53b974E309fFf80277C6",
    buildProfile({
      ensName: "limes.eth",
      title:
        "ENS DAO Steward & Secretary - Building transparency with SafeNotes",
      twitterProfile: "https://x.com/limes_eth",
      address: "0xA7860E99e3ce0752D1ac53b974E309fFf80277C6",
    }),
  ],
  [
    "0x4e675ceB415fC41700fb821fF3B43cE5C8B9a83B",
    buildProfile({
      ensName: "nimi.eth",
      title: "Your personal web3 page",
      twitterProfile: "https://x.com/0xNimi",
      address: "0x4e675ceB415fC41700fb821fF3B43cE5C8B9a83B",
    }),
  ],
  [
    "0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12",
    buildProfile({
      ensName: "lefteris.eth",
      title:
        "Founder of Rotki, the portfolio tracker that protects your privacy",
      displayName: "Lefteris Karapetsas",
      twitterProfile: "https://x.com/LefterisJP",
      address: "0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12",
    }),
  ],
  [
    "0x8F73bE66CA8c79382f72139be03746343Bf5Faa0",
    buildProfile({
      ensName: "mihal.eth",
      title: "Blockchain Engineer",
      displayName: "David Mihal",
      twitterProfile: "https://x.com/dmihal",
      address: "0x8F73bE66CA8c79382f72139be03746343Bf5Faa0",
    }),
  ],
  [
    "0x029183bd9A47CDD7f5df8Fb64382022C4b681b63",
    buildProfile({
      ensName: "ethlimo.eth",
      title: "Privacy-preserving ENS gateway",
      twitterProfile: "https://x.com/eth_limo",
      address: "0x029183bd9A47CDD7f5df8Fb64382022C4b681b63",
    }),
  ],
  [
    "0x179A862703a4adfb29896552DF9e307980D19285",
    buildProfile({
      ensName: "gregskril.eth",
      title: "Developer Relations at ENS Labs",
      displayName: "Greg Skriloff",
      twitterProfile: "https://x.com/gregskril",
      address: "0x179A862703a4adfb29896552DF9e307980D19285",
    }),
  ],
  [
    "0x8e8Db5CcEF88cca9d624701Db544989C996E3216",
    buildProfile({
      ensName: "taytems.eth",
      title: "Developer at ENS Labs",
      twitterProfile: "https://x.com/taytemss",
      address: "0x8e8Db5CcEF88cca9d624701Db544989C996E3216",
    }),
  ],
  [
    "0xc28de09AD1a20737B92834943558DdfcC88d020D",
    buildProfile({
      ensName: "184.eth",
      title: "Support Lead at ENS Labs",
      twitterProfile: "https://x.com/184eth",
      address: "0xc28de09AD1a20737B92834943558DdfcC88d020D",
    }),
  ],
  [
    "0x5A384227B65FA093DEC03Ec34e111Db80A040615",
    buildProfile({
      ensName: "matoken.eth",
      title: "Developer at ENS Labs",
      displayName: "Makoto Inoue",
      twitterProfile: "https://x.com/makoto_inoue",
      address: "0x5A384227B65FA093DEC03Ec34e111Db80A040615",
    }),
  ],
  [
    "0x866B3c4994e1416B7C738B9818b31dC246b95eEE",
    buildProfile({
      ensName: "jefflau.eth",
      title: "ENS Cofounder & Core Team Leader",
      displayName: "Jeff Lau",
      twitterProfile: "https://x.com/_jefflau",
      address: "0x866B3c4994e1416B7C738B9818b31dC246b95eEE",
    }),
  ],
  [
    "0x6Dc43be93a8b5Fd37dC16f24872BaBc6dA5E5e3E",
    buildProfile({
      ensName: "james.eth",
      title: "DAO Governance",
      twitterProfile: "https://x.com/blockchainjames",
      address: "0x6Dc43be93a8b5Fd37dC16f24872BaBc6dA5E5e3E",
    }),
  ],
  [
    "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
    buildProfile({
      ensName: "lightwalker.eth",
      title: "Founder at NameHash Labs",
      twitterProfile: "https://x.com/lightwalker_eth",
      address: "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
    }),
  ],
  [
    "0x9A41C5549Bcc7d3F8D80e639714a4823de559134",
    buildProfile({
      ensName: "caldonia.eth",
      title: "Founder at NameHash Labs",
      twitterProfile: "https://x.com/caldonia_eth",
      address: "0x9A41C5549Bcc7d3F8D80e639714a4823de559134",
    }),
  ],
  [
    "0x35b3Ab43ebE7709F4aef1a9c3E6D1f99Be343128",
    buildProfile({
      ensName: "kwrobel.eth",
      title: "Engineering",
      twitterProfile: "https://x.com/kwrobel_eth",
      address: "0x35b3Ab43ebE7709F4aef1a9c3E6D1f99Be343128",
    }),
  ],
  [
    "0xf81bc66316A3f2A60Adc258F97F61dFcBdd23Bb1",
    buildProfile({
      ensName: "notrab.eth",
      title: "Engineering",
      displayName: "Jamie Barton",
      twitterProfile: "https://x.com/notrab",
      address: "0xf81bc66316A3f2A60Adc258F97F61dFcBdd23Bb1",
    }),
  ],
  [
    "0x6D99E3D9287C0e7f39d24472a066B4DE24Bfe657",
    buildProfile({
      ensName: "theloner.eth",
      title: "UX/UI Design",
      twitterProfile: "https://x.com/theloner_eth",
      address: "0x6D99E3D9287C0e7f39d24472a066B4DE24Bfe657",
    }),
  ],
  [
    "0x6148bB313D42f2B72f8992f739a15dF984236F23",
    buildProfile({
      ensName: "karbowski.eth",
      title: "Engineering",
      displayName: "Jakub Karbowski",
      address: "0x6148bB313D42f2B72f8992f739a15dF984236F23",
    }),
  ],
  [
    "0x1E7F4DF4Abe4bd01E0D7271AF11A2607969bB5b2",
    buildProfile({
      ensName: "goader.eth",
      title: "Engineering",
      displayName: "Mykola Haltiuk",
      address: "0x1E7F4DF4Abe4bd01E0D7271AF11A2607969bB5b2",
    }),
  ],
  [
    "0x7d14899c8a26cCA70E8e1A51c3558a5DB1219B15",
    buildProfile({
      ensName: "apohllo.eth",
      title: "Engineering",
      address: "0x7d14899c8a26cCA70E8e1A51c3558a5DB1219B15",
    }),
  ],
  [
    "0xdf696B8a034416b4725793388ed8A232195C1ce9",
    buildProfile({
      ensName: "byczong.eth",
      title: "Engineering",
      address: "0xdf696B8a034416b4725793388ed8A232195C1ce9",
    }),
  ],
  [
    "0x89F8e4020c0dd384F13c288bc5743F963F9D8fdF",
    buildProfile({
      ensName: "duds.eth",
      title: "Engineering",
      address: "0x89F8e4020c0dd384F13c288bc5743F963F9D8fdF",
    }),
  ],
  [
    "0x26A1BC2b06DD438669094bD68f1E2481F47FEC5b",
    buildProfile({
      ensName: "y3drk.eth",
      title: "Engineering",
      address: "0x26A1BC2b06DD438669094bD68f1E2481F47FEC5b",
    }),
  ],
  [
    "0x69A193cf78a6CBb48084797A69164ca409EBb285",
    buildProfile({
      ensName: "sebban.eth",
      title: "Engineering",
      address: "0x69A193cf78a6CBb48084797A69164ca409EBb285",
    }),
  ],
  [
    "0xbD4cd9Ae5BfF533bF4Ee926EEddC3DCA5e2cDb4C",
    buildProfile({
      ensName: "shrugs.eth",
      title: "Engineering",
      displayName: "one of the many matts",
      twitterProfile: "https://x.com/1ofthemanymatts",
      address: "0xbD4cd9Ae5BfF533bF4Ee926EEddC3DCA5e2cDb4C",
    }),
  ],
  [
    "0x8d3B2c5B93716508639E3CcFE2A3DB58AF540B66",
    buildProfile({
      ensName: "tko.box",
      title: "Engineering",
      displayName: "Tomasz Kopacki",
      twitterProfile: "https://x.com/0xTko",
      address: "0x8d3B2c5B93716508639E3CcFE2A3DB58AF540B66",
    }),
  ],
]);
