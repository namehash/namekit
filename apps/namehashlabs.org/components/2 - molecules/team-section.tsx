"use client";

import NextLink from "next/link";

import { PreSectionText } from "../1 - atoms/pre-section-text";
import { SectionText } from "../1 - atoms/section-text";
import { SectionTitle } from "../1 - atoms/section-title";
import { Balancer } from "react-wrap-balancer";
import { AvatarSize } from "./avatar-with-tooltip";
import { getCachedProfile } from "@/data/ensProfiles";
import { UltimateENSAvatar } from ".";
import { getNameHashLabsAvatarCallbacks } from "@/lib/client/nh-labs-avatar";
import { Button } from "@namehash/namekit-react";

const namehashLabsTeam = {
  profiles: [
    getCachedProfile("lightwalker.eth"),
    getCachedProfile("caldonia.eth"),
    getCachedProfile("kwrobel.eth"),
    getCachedProfile("notrab.eth"),
    getCachedProfile("theloner.eth"),
    getCachedProfile("frankind.eth"),
    getCachedProfile("karbowski.eth"),
    getCachedProfile("goader.eth"),
    getCachedProfile("apohllo.eth"),
    getCachedProfile("byczong.eth"),
    getCachedProfile("edulennert.eth"),
    getCachedProfile("y3drk.eth"),
    getCachedProfile("sebban.eth"),
    getCachedProfile("ilfurioso.eth"),
    getCachedProfile("santapolukord.eth"),
  ],
};

export const TeamSection = () => {
  return (
    <section
      id="meetOurTeamSection"
      className=" justify-center lg:flex px-5 lg:px-[112px] w-full xl:justify-between lg:border-none"
    >
      <div className="max-w-[1216px] xl:flex m-auto w-full border-b border-gray-200 py-6 lg:py-20">
        <div className="flex flex-col max-[635px] items-center justify-center mb-[60px] xl:max-w-[448px] xl:justify-start xl:items-start">
          <PreSectionText>WHO WE ARE</PreSectionText>
          <SectionTitle className="my-3">Our team</SectionTitle>
          <SectionText className="w-full flex items-center justify-center text-center mb-5 xl:text-left">
            <Balancer>
              NameHash Labs is a team of builders dedicated to the growth of
              ENS. Wanna be here? We&apos;re actively searching for special
              talents and would be happy to hear from you.
            </Balancer>
          </SectionText>
          <Button asChild>
            <NextLink href="/careers">Join our team</NextLink>
          </Button>
        </div>
        <div className="grid lg:grid-cols-5 grid-cols-3 m-auto md:grid-cols-5 sm:grid-cols-3 place-items-center lg:gap-x-auto gap-6 lg:gap-8 lg:ml-auto lg:max-w-[1216px]">
          {namehashLabsTeam.profiles.map((member) => {
            return (
              <UltimateENSAvatar
                avatarQueries={getNameHashLabsAvatarCallbacks(member)}
                size={AvatarSize.MEDIUM}
                key={member.ensName}
                profile={member}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
