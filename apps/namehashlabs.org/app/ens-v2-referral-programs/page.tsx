import { type Metadata } from "next";
import Image from "next/image";
import { ProductComponent } from "@/components/2 - molecules/product-component";
import { defaultMetaOpengraph, defaultMetaTwitter } from "../shared-metadata";

const title = "ENSv2 Referral Programs";
const description =
  "Join the discussion about an ENS Referral Program and help ENS grow.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["ens", "web3", "eth", "referral program"],
  openGraph: {
    ...defaultMetaOpengraph,
    title,
    description,
    url: "/ens-v2-referral-programs",
  },
  twitter: {
    ...defaultMetaTwitter,
    title,
    description,
  },
};

export default function Page() {
  return (
    <main className="flex w-full flex-col items-center justify-between">
      <div className="mt-20 w-full">
        <div className="w-full lg:px-[50px] px-5 bg-gray-50 flex items-center justify-center">
          <section className="w-full max-w-[1216px]">
            <ProductComponent
              title="ENSv2 Referral Programs"
              subtitle="ENSv2 and Namechain unblock practical feasibility for ENS Referral Programs. The future of ENSv2 Referral Programs is not only permissionless to participate in, but also permissionless to create and fund."
              illustration={
                <Image
                  quality={100}
                  width={1056}
                  height={820}
                  className="w-full h-auto max-w-[600px]"
                  src="/images/ens-incentive.png"
                  alt="hero"
                />
              }
              greenLabelText="Permissionless"
              buttonText="Check it out"
              buttonUrl="https://github.com/namehash/ens-v2-referral-programs"
              showCalendarButton={false}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
