import { getCachedProfile } from "@/data/ensProfiles";
import { SupporterCategoryProps } from "./SupporterCategory";

export const ensFoundation: SupporterCategoryProps = {
  title: "ENS Foundation",
  profiles: [
    getCachedProfile("nick.eth"),
    getCachedProfile("avsa.eth"),
    getCachedProfile("validator.eth"),
  ],
};

export const walletBuilders: SupporterCategoryProps = {
  title: "Wallet Builders",
  profiles: [
    getCachedProfile("rainbowwallet.eth"),
    getCachedProfile("mikedemarais.eth"),
    getCachedProfile("inzhoop.eth"),
    getCachedProfile("spencecoin.eth"),
  ],
};

export const web3ProtocolBuilders: SupporterCategoryProps = {
  title: "Web3 Protocol Builders",
  profiles: [
    getCachedProfile("brantly.eth"),
    getCachedProfile("chainlinkgod.eth"),
    getCachedProfile("cory.eth"),
    getCachedProfile("poap.eth"),
  ],
};

export const publicGoodsAdvocates: SupporterCategoryProps = {
  title: "Public Goods Advocates",
  profiles: [
    getCachedProfile("griff.eth"),
    getCachedProfile("coltron.eth"),
    getCachedProfile("simona.eth"),
    getCachedProfile("ceresstation.eth"),
  ],
};

export const decentralizationAdvocates: SupporterCategoryProps = {
  title: "Decentralization Advocates",
  profiles: [
    getCachedProfile("liubenben.eth"),
    getCachedProfile("garypalmerjr.eth"),
    getCachedProfile("master.eth"),
    getCachedProfile("superphiz.eth"),
    getCachedProfile("jalil.eth"),
    getCachedProfile("bosco.eth"),
    getCachedProfile("krypto.eth"),
    getCachedProfile("wslyvh.eth"),
    getCachedProfile("premm.eth"),
  ],
};

export const daoAdvocates: SupporterCategoryProps = {
  title: "DAO Advocates",
  profiles: [
    getCachedProfile("fireeyesdao.eth"),
    getCachedProfile("spikewatanabe.eth"),
    getCachedProfile("alextnetto.eth"),
    getCachedProfile("elbagococina.eth"),
    getCachedProfile("she256.eth"),
    getCachedProfile("limes.eth"),
  ],
};

export const dAppBuilders: SupporterCategoryProps = {
  title: "dApp Builders",
  profiles: [
    getCachedProfile("nimi.eth"),
    getCachedProfile("lefteris.eth"),
    getCachedProfile("mihal.eth"),
    getCachedProfile("ethlimo.eth"),
  ],
};

export const ensLabsStaff: SupporterCategoryProps = {
  title: "ENS Labs Staff",
  profiles: [
    getCachedProfile("gregskril.eth"),
    getCachedProfile("taytems.eth"),
    getCachedProfile("matoken.eth"),
    getCachedProfile("jefflau.eth"),
    getCachedProfile("184.eth"),
  ],
};
