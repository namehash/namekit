/* eslint-disable @next/next/no-img-element */
import { Heading, Text } from "@namehash/namekit-react";
import { PreSectionText } from "@/components/1 - atoms";
import { ColorfulBg } from "@/components/1 - atoms/colorful-bg";
import { CalendarButton, ContactUsForm } from "@namehash/internal";

export const ContactSection = () => {
  return (
    <section className="w-full max-w-[1216px] py-20 px-5">
      <ColorfulBg className="absolute top-0 left-0 w-full z-[-1]" />
      <div className="lg:mt-[100px] lg:mb-[120px] mt-[60px] mb-[60px]">
        <PreSectionText className="text-start ">Get in touch</PreSectionText>
        <h1 className="font-bold text-[52px] ">Contact</h1>
      </div>

      <div className="w-full flex lg:flex-row flex-col justify-between lg:items-center sm:items-start items-center rounded-[8px] bg-gradient-to-r lg:px-10 lg:py-8 p-5 mb-20 from-[#2D2D2D] to-black">
        <div className="flex flex-col gap-2 mb-4 lg:mb-0">
          <Heading as="h3" className="text-white">
            Discuss an integration
          </Heading>
          <Text className="text-gray-500 !text-lg">
            Schedule a call with us to discuss integration with any of our
            products
          </Text>
        </div>
        <div className="w-full lg:w-auto">
          <CalendarButton
            className="w-full"
            link="namehashlabs/namehashlabs"
            variant="secondary"
          >
            Schedule a call
          </CalendarButton>
        </div>
      </div>
      <div className="w-full flex flex-col lg:flex-row m-auto gap-10 max-w-7xl">
        <div className="lg:w-1/2 w-full flex flex-col gap-3 items-start">
          <Heading as="h1">Let&apos;s chat</Heading>

          <Text as="p" className="text-gray-500 !text-lg font-light">
            If you have questions, ideas, or share a passion for advancing ENS
            growth and would like to explore collaboration, please don&apos;t
            hesitate to reach out.
          </Text>
          <img
            className="hidden lg:block"
            src="/images/paper-airplane.png"
            alt="Paper Airplane Icon"
          />
        </div>
        <div className="lg:w-1/2 w-full bg-gray-50 py-4 px-4 lg:py-8 lg:px-10 border rounded-[8px] flex justify-center items-center">
          <ContactUsForm
            title="Send a message"
            submissionEndpoint="/api/contact-form"
          />
        </div>
      </div>
    </section>
  );
};
