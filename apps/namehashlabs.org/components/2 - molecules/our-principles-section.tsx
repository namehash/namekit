import { PreSectionText, SectionText, SectionTitle } from "../1 - atoms";
import { OpenSourceIcon } from "../1 - atoms/icons/open-source-icon";
import { LockIcon } from "../1 - atoms/icons/lock-icon";
import { EnsIcon } from "../1 - atoms/icons/ens-icon-gray";
import { Link } from "@namehash/namekit-react";

export const OurPrinciplesSection = () => {
  return (
    <section
      id="ourPrinciplesSection"
      className="lg:px-[112px] w-full px-5 md:px-20 py-20"
    >
      <div className="flex flex-col items-center justify-center max-w-[1216px] m-auto">
        <PreSectionText>What Guides us</PreSectionText>
        <SectionTitle className="my-3">Our principles</SectionTitle>
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-10 mt-20 place-content-stretch">
          {principles.map((item) => {
            return (
              <div key={item.title}>
                <div className="p-4 border border-gray-200 rounded-full inline-flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="text-2xl leading-8 font-semibold mt-5 mb-3">
                  {item.title}
                </p>
                <SectionText>{item.description}</SectionText>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface PrinciplesProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const principles: PrinciplesProps[] = [
  {
    icon: <OpenSourceIcon className="text-gray-400 w-5 h-5 shrink-0" />,
    title: "Open sourced",
    description: (
      <>
        Everything we create will be{" "}
        <Link
          href="https://github.com/namehash/"
          target="_blank"
          className="!text-black !text-lg font-normal"
        >
          open sourced
        </Link>
        , ensuring that our technology is accessible and adaptable.
      </>
    ),
  },
  {
    icon: <LockIcon className="text-gray-400 w-5 h-5 shrink-0" />,
    title: "Freely licensed",
    description: (
      <>
        All our work will be released freely under the{" "}
        <Link
          href="https://en.wikipedia.org/wiki/MIT_License"
          target="_blank"
          className="!text-black !text-lg font-normal"
        >
          MIT license
        </Link>
        . This license ensures the freedom to use, modify, and redistribute.
      </>
    ),
  },
  {
    icon: <EnsIcon className="text-gray-400 w-5 h-5 shrink-0" />,
    title: "ENS exclusivity",
    description: (
      <>
        We are exclusively committed to the ENS namespace. We also agree to
        uphold all articles in the{" "}
        <Link
          href="https://docs.ens.domains/v/governance/ens-dao-constitution"
          target="_blank"
          className="!text-black !text-lg font-normal"
        >
          ENS DAO constitution
        </Link>
        .
      </>
    ),
  },
  {
    icon: <EnsIcon className="text-gray-400 w-5 h-5 shrink-0" />,
    title: "ENS interoperability",
    description: (
      <>
        We support the{" "}
        <Link
          href="https://docs.ens.domains/ens-improvement-proposals/"
          target="_blank"
          className="!text-black !text-lg font-normal"
        >
          ENSIP process
        </Link>{" "}
        and the goal of strong interoperable standards for the ENS protocol.
      </>
    ),
  },
];
