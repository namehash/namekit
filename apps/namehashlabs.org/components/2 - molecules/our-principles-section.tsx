import { PreSectionText } from "@/components/1 - atoms";
import { OpenSourceIcon } from "@/components/1 - atoms/icons/open-source-icon";
import { LockIcon } from "@/components/1 - atoms/icons/lock-icon";
import { EnsIcon } from "@/components/1 - atoms/icons/ens-icon-gray";
import { Heading, Link, Text } from "@namehash/namekit-react";

export const OurPrinciplesSection = () => {
  return (
    <section
      id="ourPrinciplesSection"
      className="lg:px-[50px] w-full px-5 md:px-20 py-20"
    >
      <div className="flex flex-col items-center justify-center max-w-[1216px] m-auto">
        <PreSectionText>What Guides us</PreSectionText>
        <Heading as="h1" className="my-3">
          Our principles
        </Heading>
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-10 mt-20 place-content-stretch">
          {principles.map((item) => {
            return (
              <div key={item.title}>
                <div className="p-4 border border-gray-200 rounded-full inline-flex items-center justify-center">
                  {item.icon}
                </div>
                <Heading as="h3" className="mt-5 mb-3">
                  {item.title}
                </Heading>
                <Text as="p" className="text-lg text-gray-500">
                  {item.description}
                </Text>
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
          className="!text-black"
          variant="underline"
          size="large"
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
          size="large"
          className="!text-black"
          variant="underline"
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
          href="https://docs.ens.domains/dao/constitution"
          target="_blank"
          size="large"
          className="!text-black"
          variant="underline"
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
          href="https://docs.ens.domains/ensip"
          target="_blank"
          className="!text-black"
          size="large"
          variant="underline"
        >
          ENSIP process
        </Link>{" "}
        and the goal of strong interoperable standards for the ENS protocol.
      </>
    ),
  },
];
