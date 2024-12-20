"use client";

import { Balancer } from "react-wrap-balancer";
import { PreSectionText } from "@/components/1 - atoms";
import { QuoteIcon } from "@/components/1 - atoms/icons/quote-icon";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { AvatarSize } from "./avatar-with-tooltip";
import { Navigation, Autoplay } from "swiper/modules";
import { Profile, getCachedProfile } from "@/data/ensProfiles";
import { UltimateENSAvatar } from ".";
import { getNameHashLabsAvatarCallbacks } from "@/lib/client/nh-labs-avatar";
import { Heading, Text } from "@namehash/namekit-react";

const testimonials: Testimonial[] = [
  {
    text: (
      <>
        “<span className="font-semibold">Namehash Labs</span> have a track
        record of building{" "}
        <span className="font-semibold">useful infrastructure</span>, and
        furthermore of giving careful thought to what needs are not being served
        well by existing solutions.”
      </>
    ),
    author: getCachedProfile("nick.eth"),
  },
  {
    text: (
      <>
        &quot;I have been following{" "}
        <span className="font-semibold">NameHash development</span> closely for
        over a year and was lucky enough to have a demo of their ENS
        registration website last year and{" "}
        <span className="font-semibold">I was blown away</span>.&quot;
      </>
    ),
    author: getCachedProfile("avsa.eth"),
  },
  {
    text: (
      <>
        &quot;NameHash Labs have already shown themselves to be{" "}
        <span className="font-semibold">very capable</span> with the
        contributions they&apos;ve already made, with{" "}
        <span className="font-semibold">lots of great work planned</span> going
        into the future.&quot;
      </>
    ),
    author: getCachedProfile("brantly.eth"),
  },
  {
    text: (
      <>
        &quot;The NameHash team have{" "}
        <span className="font-semibold">
          already shipped a significant amount of impact
        </span>{" "}
        to ENS through different services & infrastructure and have a{" "}
        <span className="font-semibold">well-laid-out roadmap</span> ...&quot;
      </>
    ),
    author: getCachedProfile("james.eth"),
  },
  {
    text: (
      <>
        &quot;The team has made{" "}
        <span className="font-semibold">many contributions</span> on various ENS
        related toolsets ...&quot;
      </>
    ),
    author: getCachedProfile("matoken.eth"),
  },
  {
    text: (
      <>
        &quot;... notable of course are the modular tools like NameKit and
        NameGuard that create a broader application potential within the ENS
        ecosystem.{" "}
        <span className="font-semibold">Solid delivery track record</span>{" "}
        ...&quot;
      </>
    ),
    author: getCachedProfile("simona.eth"),
  },
  {
    text: (
      <>
        &quot;... this is a{" "}
        <span className="font-semibold">strong support</span> because they are{" "}
        <span className="font-semibold">100% focused on improving ENS</span>. I
        would like to see them continue developing NameGuard ... and develop a
        method for ENS referrals.&quot;
      </>
    ),
    author: getCachedProfile("coltron.eth"),
  },
];

export interface Testimonial {
  author: Profile;
  text: React.ReactNode;
}

export interface Author {
  title: string;
  ensName: string;
}

export const TestimonialsSection = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isAutoplayRunning, setIsAutoplayRunning] = useState(false);

  const handleSlideChange = (swiper: SwiperClass) => {
    const nextIndex = swiper.realIndex;
    setCurrentTestimonialIndex(nextIndex);
  };

  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current;

      const onAutoplayStop = () => {
        setIsAutoplayRunning(false);
      };

      const onAutoplayStart = () => {
        setIsAutoplayRunning(true);
      };

      swiperInstance.on("autoplayStop", onAutoplayStop);
      swiperInstance.on("autoplayStart", onAutoplayStart);

      return () => {
        swiperInstance.off("autoplayStop", onAutoplayStop);
        swiperInstance.off("autoplayStart", onAutoplayStart);
      };
    }
  }, [swiperRef]);

  useEffect(() => {
    const slider = document.querySelector("#slider-projects");
    swiperRef.current?.autoplay.stop();
    if (slider) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          swiperRef.current?.autoplay.start();
          setIsAutoplayRunning(true);
          observer.disconnect();
        }
      });
      observer.observe(slider);

      return () => {
        if (slider) {
          observer.unobserve(slider);
          setIsAutoplayRunning(false);
        }
      };
    }
  }, []);

  const handlePillClick = (index: number) => {
    setCurrentTestimonialIndex(index);
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
      setIsAutoplayRunning(false);
      swiperRef.current.slideToLoop(index);
    }
  };

  return (
    <section
      className="lg:px-[110px] px-5 py-[108px] w-full"
      id="ensOnboardingSection"
    >
      <div className="w-full flex flex-col items-center gap-20 max-w-[1216px] m-auto">
        <div className="flex flex-col items-center gap-3">
          <PreSectionText>WHAT PEOPLE ARE SAYING</PreSectionText>
          <Heading>Testimonials</Heading>
        </div>
        <div className="flex flex-col gap-10 items-center w-full relative">
          <div
            className="absolute w-full h-full"
            style={{
              opacity: "8%",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.00) 0%, #FFF 100%), linear-gradient(180deg, #FBA600 24.22%, #F112D9 48.69%, #4C3FA0 77.9%, #2ED3C6 96.84%)",
            }}
          ></div>

          <QuoteIcon />

          {/* Part of the styles of the below component lives inside styles/globals.css */}
          <Swiper
            id="slider-projects"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            navigation={true}
            modules={[Navigation, Autoplay]}
            onSlideChange={handleSlideChange}
            className="rewind w-full"
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            watchSlidesProgress={true}
          >
            {testimonials.map((testimonial, index) => {
              return (
                <SwiperSlide key={testimonial.author.ensName}>
                  <div className="w-full flex flex-col gap-10">
                    <div className="flex justify-between gap-10 items-center w-full relative lg:px-20">
                      <Text
                        as="p"
                        className="text-3xl font-light text-center leading-[44px] m-auto"
                      >
                        <Balancer>{testimonial.text}</Balancer>
                      </Text>
                    </div>

                    <div className="flex gap-5 w-full mx-auto items-center justify-center sm:max-w-[350px] md:max-w-[2000px]">
                      <div className="shrink-0">
                        <UltimateENSAvatar
                          size={AvatarSize.SMALL}
                          profile={testimonial.author}
                          avatarQueries={getNameHashLabsAvatarCallbacks(
                            testimonial.author,
                          )}
                        />
                      </div>

                      <div className="flex flex-col shrink">
                        <Text
                          as="p"
                          className="text-2xl font-semibold ens-webfont"
                        >
                          {testimonial.author.ensName}
                        </Text>

                        <Text as="p" className="text-lg text-gray-500">
                          {testimonial.author.title}
                        </Text>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}

            <div className="navigation-pills flex items-center justify-center lg:mt-[64px] mt-8 gap-1 m-auto w-full">
              {testimonials.map((_, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handlePillClick(index)}
                    className="flex h-10 items-center justify-center group cursor-pointer"
                  >
                    <div
                      key={index}
                      className={`lg:w-20 w-10 h-2 transition duration-200 transform-all ${
                        index === currentTestimonialIndex
                          ? "bg-gray-300"
                          : "bg-gray-300"
                      } group-hover:scale-y-250 cursor-pointer`}
                    >
                      {index === currentTestimonialIndex && (
                        <div
                          className={`bg-black h-2 ${
                            isAutoplayRunning ? "animate-widen" : "w-full"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};
