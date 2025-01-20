import { CalendarButton } from "@namehash/internal";
import { Heading, Text } from "@namehash/namekit-react";
import Image from "next/image";
interface GetYourWeb3NameSectionProps {
  title: string;
  description: string;
  buttonText: string;
}

export const GetYourWeb3NameSection = ({
  title,
  description,
  buttonText,
}: GetYourWeb3NameSectionProps) => {
  return (
    <section className="px-[20px] lg:px-[112px] pb-[22px] lg:pb-[62px]">
      <div className="relative rounded-[8px] py-[60px] overflow-hidden justify-center max-w-[1216px] mx-auto flex-col items-center w-full flex bg-black text-white">
        <div
          className="z-10 w-full h-full absolute top-0"
          style={{
            backgroundImage:
              "radial-gradient(black 0%, black 35%, transparent 80%, transparent 100%)",
          }}
        ></div>
        {getYourWeb3NameImages.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className={image.className}
          />
        ))}
        <div className="p-[20px] flex justify-center items-center flex-col z-20">
          <Heading className="mb-4 text-[24px] leading-[32px] lg:text-4xl lg:leading-10 font-bold text-center">
            {title}
          </Heading>

          <Text className="leading-[24px] text-[14px] lg:text-lg lg:leading-8 font-normal mb-6 max-w-[638px] text-center">
            {description}
          </Text>
          <CalendarButton
            className="text-sm lg:text-[16px] leading-[24px] mt-5 bg-white z-20 text-black px-[16px] py-[9px] lg:px-[25px] lg:py-[13px] rounded-[8px] hover:bg-gray-50 transition-colors duration-200"
            variant="secondary"
            link="namehashlabs/namekit"
          >
            {buttonText ?? `Schedule a call`}
          </CalendarButton>
        </div>
      </div>
    </section>
  );
};

interface getYourWeb3NameImagesProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}

const getYourWeb3NameImages: getYourWeb3NameImagesProps[] = [
  {
    src: "/images/explore-web3/CTA-section/phoenix.png",
    alt: "phoenix nft",
    width: 175,
    height: 175,
    className: "absolute left-0 top-0",
  },
  {
    src: "/images/explore-web3/CTA-section/super-woman.png",
    alt: "super-woman nft",
    width: 200,
    height: 200,
    className: "absolute left-[50px] top-0",
  },
  {
    src: "/images/explore-web3/CTA-section/squid.png",
    alt: "squid nft",
    width: 110,
    height: 110,
    className: "absolute left-[150px] top-[100px]",
  },
  {
    src: "/images/explore-web3/CTA-section/skeleton-bike-full.png",
    alt: "skeleton bike nft",
    width: 200,
    height: 200,
    className: "absolute left-[250px] bottom-0",
  },
  {
    src: "/images/explore-web3/CTA-section/running-man.png",
    alt: "running man nft",
    width: 125,
    height: 125,
    className: "absolute top-0 left-[265px]",
  },
  {
    src: "/images/explore-web3/CTA-section/woman-dancing-small.png",
    alt: "woman dancing nft",
    width: 100,
    height: 100,
    className: "absolute bottom-[70px] left-[30px]",
  },
  {
    src: "/images/explore-web3/CTA-section/3d-goggles.png",
    alt: "3d-goggles nft",
    width: 200,
    height: 200,
    className: "absolute bottom-0 left-0",
  },
  {
    src: "/images/explore-web3/CTA-section/running-man.png",
    alt: "running man nft",
    width: 125,
    height: 125,
    className: "absolute bottom-[20px] left-[135px]",
  },
  {
    src: "/images/explore-web3/CTA-section/yellow-man.png",
    alt: "yellow man nft",
    width: 100,
    height: 100,
    className: "absolute right-[101px] top-[36px]",
  },
  {
    src: "/images/explore-web3/CTA-section/bored-monkey.png",
    alt: "bored monkey nft",
    width: 125,
    height: 125,
    className: "absolute right-[70px] bottom-[80px]",
  },
  {
    src: "/images/explore-web3/CTA-section/skeleton-bike.png",
    alt: "skeleton bike nft",
    width: 125,
    height: 125,
    className: "absolute right-0 top-0",
  },
  {
    src: "/images/explore-web3/CTA-section/woman-dancing.png",
    alt: "woman dancing nft",
    width: 175,
    height: 175,
    className: "absolute right-0 bottom-[26px]",
  },
  {
    src: "/images/explore-web3/CTA-section/legs-dancing.png",
    alt: "legs dancing nft",
    width: 125,
    height: 125,
    className: "absolute top-0 right-0",
  },
  {
    src: "/images/explore-web3/CTA-section/zeus.png",
    alt: "zeus nft",
    width: 100,
    height: 100,
    className: "absolute bottom-0 right-[150px]",
  },
  {
    src: "/images/explore-web3/CTA-section/human-purple.png",
    alt: "purple human nft",
    width: 300,
    height: 300,
    className: "absolute bottom-0 right-[150px]",
  },
  {
    src: "/images/explore-web3/CTA-section/undefined-humanoid.png",
    alt: "humanoid nft",
    width: 125,
    height: 125,
    className: "absolute bottom-[20px] right-[350px]",
  },
  {
    src: "/images/explore-web3/CTA-section/yellow-diamond.png",
    alt: "yellow diamond nft",
    width: 225,
    height: 225,
    className: "absolute top-0 right-[250px]",
  },
];
