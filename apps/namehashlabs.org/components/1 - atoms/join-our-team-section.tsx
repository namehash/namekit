"use client";

import { Link } from "@namehash/namekit-react";
import Image from "next/image";
import Balancer from "react-wrap-balancer";

export const JoinOurTeamSection = () => {
  return (
    <section
      id="joinOurTeam"
      className="px-5 lg:px-[50px] pb-5 pt-[60px] mx-auto lg:py-[86px]"
    >
      <div className="m-auto max-w-[1216px] flex flex-col lg:flex-row justify-between items-center ">
        <div className="mt-6 mx-auto flex justify-center">
          <Image
            src="/images/join-our-team.svg"
            alt="Join our team"
            className="w-[335px] h-[231px] md:!min-w-[368px] md:!h-[254px] xl:!min-w-[588px] xl:!h-[400px]"
            height={800}
            width={1166}
          />
        </div>
        <div className="text-center lg:text-left lg:ml-20">
          <h3 className="mb-3 text-xs font-medium text-gray-500">
            LOOKING FOR GROUP
          </h3>
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">Join our team</h2>
          <div className="mb-6 text-lg text-gray-500 font-light">
            <p>
              Work on leading open-source technologies for the ENS Protocol and
              make an impact on the future of identity.
            </p>
            <br />
            <div className="inline space-x-1">
              <Balancer>
                <p className="inline">
                  We&apos;re actively seeking talented people of all backgrounds
                  to apply to join our team. Interested? Send an email with your
                  details to{" "}
                </p>
                <Link
                  variant="underline"
                  size="large"
                  href="mailto:hello@namehashlabs.org"
                >
                  hello@namehashlabs.org
                </Link>
              </Balancer>
            </div>
            <br />
            <br />
            <p>We look forward to hearing from you.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
