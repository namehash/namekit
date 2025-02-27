import { PreSectionText, SectionText, SectionTitle } from "../../1 - atoms";
import { Balancer } from "react-wrap-balancer";
import { SupporterCategory } from "./SupporterCategory";
import {
  daoAdvocates,
  dAppBuilders,
  decentralizationAdvocates,
  ensFoundation,
  ensLabsStaff,
  publicGoodsAdvocates,
  walletBuilders,
  web3ProtocolBuilders,
} from "./ens-profiles";
import { OtherSupporters } from "./OtherSupporters";

export const OurSuportersSection = () => {
  return (
    <section
      id="ourSuportersSection"
      className="lg:px-[50px] w-full flex flex-col items-center bg-gray-50 justify-center px-5 py-20 border-t border-b border-gray-200"
    >
      <div className="flex flex-col gap-3">
        <PreSectionText>ETHEREUM COMMUNITY SUPPORTED</PreSectionText>
        <SectionTitle>Our supporters</SectionTitle>
        <SectionText className="text-center">
          <Balancer>
            Thank you to our amazing supporters who also believe in helping ENS
            grow.
          </Balancer>
        </SectionText>
      </div>

      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-20 place-content-stretch w-full max-w-[1216px]">
        <SupporterCategory {...ensFoundation} />
        <SupporterCategory {...walletBuilders} />
        <SupporterCategory {...web3ProtocolBuilders} />
        <SupporterCategory {...publicGoodsAdvocates} />
        <OtherSupporters />
        <SupporterCategory {...decentralizationAdvocates} />
        <SupporterCategory {...daoAdvocates} />
        <SupporterCategory {...dAppBuilders} />
        <SupporterCategory {...ensLabsStaff} />
      </div>
    </section>
  );
};
