import { ColorfulBg } from "../1 - atoms/colorful-bg";
import Image from "next/image";
import { RoleCard } from "../2 - molecules/role-card";
import { ExternalLinkIcon } from "../1 - atoms";
import { Role } from "@/types";
import { getRelatedRoles } from "@/lib/utils/careers";
import Link from "next/link";
import rolesData from "@/data/rolesData";
import { FrontendBanner } from "../1 - atoms/career-banners/frontend-banner";

const MAX_RELATED_ROLES = 3;

export const RolePage = (role: Role) => {
  return (
    <section className="w-full pt-20 lg:pb-20 pb-5">
      <ColorfulBg className="absolute top-0 left-0 w-full z-[-1]" />
      <div className="flex lg:flex-row flex-col items-start lg:items-center gap-[60px] lg:gap-4 justify-between w-full max-w-[1216px] border-b m-auto lg:mt-[100px] lg:pb-[120px] py-[60px]">
        <div className="flex flex-col items-start lg:gap-3 gap-2">
          <p className="text-xs leading-4 font-medium tracking-wide uppercase text-gray-500">
            Join the team
          </p>
          <h1 className="font-bold text-[52px] leading-[52px]">{role.title}</h1>
        </div>
        <div>{role.category.banner}</div>
      </div>
      <div className="justify-between w-full flex lg:flex-row flex-col lg:pt-20 pt-10 m-auto gap-10 max-w-[1216px]">
        {role.description}
        <div className="flex flex-col gap-5 lg:max-w-[440px]">
          <JoinOurTeam />
        </div>
      </div>
      <div className="flex pt-10 m-auto gap-10 max-w-[1216px]">
        <MoreRoles role={role} />
      </div>
    </section>
  );
};

const JoinOurTeam = () => {
  return (
    <div className="w-full flex flex-col gap-4 justify-between items-center p-5 bg-gradient-to-l from-black to-gray-800 rounded-[12px]">
      <div className="max-w-[1216px]">
        <h3 className="text-2xl leading-8 font-semibold text-white">
          Join our team
        </h3>
        <p className="text-lg leading-7 font-normal text-gray-500">
          Interested? Send an email with your CV and a few sentences about why
          you wanna join NameHash Labs to{" "}
          <Link
            href="mailto:hello@namehashlabs.org"
            className="underline hover:text-white duration-200"
          >
            hello@namehashlabs.org
          </Link>
        </p>
      </div>
      <a
        href="mailto:hello@namehashlabs.org"
        className="px-4 cursor-pointer flex items-center gap-3 py-2 rounded-[8px] bg-white flex-nowrap hover:bg-gray-100 transition-colors duration-200 w-full justify-center "
      >
        <p className="text-base leading-6 font-medium whitespace-nowrap">
          Email Us
        </p>
        <ExternalLinkIcon className="w-5 h-5" />
      </a>
    </div>
  );
};

const MoreRoles = ({ role }: { role: Role }) => {
  const relatedRoles = getRelatedRoles(
    role,
    rolesData.roles,
    true,
    MAX_RELATED_ROLES
  );

  return (
    <div className="flex flex-col gap-5 w-full max-w-[1216px] mx-auto">
      {!!relatedRoles.length && (
        <h3 className="text-2xl leading-8 font-bold">More roles</h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {relatedRoles.map((role) => {
          return (
            <RoleCard key={role.title} role={role} additionalClassNames="" />
          );
        })}
      </div>
    </div>
  );
};
