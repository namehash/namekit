import { type ConsolidatedNameGuardReport } from "@namehash/nameguard";
import cc from "classcat";
import Link from "next/link";
import { RatingIcon, ratingTextColor } from "@namehash/nameguard-react";
import Skeleton from "../skeleton";
interface Props {
  nameGuardReport?: ConsolidatedNameGuardReport;
}
/**  * @param nameGuardReport - the consolidated NameGuard API report of the given name  */
export const NameGuardSummary = ({ nameGuardReport }: Props) => {
  if (!nameGuardReport) {
    return (
      <div className="w-full md:w-[80%] lg:w-full md:flex-wrap p-4 text-black items-center md:flex md:flex-col md:justify-start md:items-start text-black items-center">
        <div className="flex flex-col">
          <div className="flex items-start space-x-3 font-semibold mb-2 md:mb-0">
            <div className="w-6 h-6 flex justify-center items-center">
              <Skeleton className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="w-[136px] h-6" />
              <div className="pt-3 ml-1">
                <Skeleton className="w-36 h-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="md:mt-[18px] md:ml-10 ml-3 lg:mt-4 lg:mb-0.5 lg:ml-10">
          <Skeleton className="w-40 h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[80%] lg:w-full md:flex-wrap p-4 text-black items-center md:flex md:justify-center md:items-start">
      <div className="w-full mr-auto flex flex-col">
        <div className="flex items-center space-x-3 font-semibold mb-2 md:mb-0">
          <div className="w-5 h-5 flex justify-center items-center">
            <RatingIcon rating={nameGuardReport.rating} />
          </div>
          <div className="flex flex-col space-y-1 lg:flex-row lg:space-x-2 lg:space-y-0">
            <p className={ratingTextColor(nameGuardReport.rating)}>
              {nameGuardReport.title}
            </p>
            <p
              className={cc([
                "hidden lg:block text-gray-500",
                { "lg:hidden": nameGuardReport.risk_count === 0 },
              ])}
            >
              •
            </p>
            {nameGuardReport.risk_count > 0 && (
              <p>
                {nameGuardReport.risk_count}
                {nameGuardReport.risk_count > 1 ? " risks" : " risk"} detected
              </p>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 text-left mb-2 ml-8 md:mt-2 md:mb-0">
          {nameGuardReport.subtitle}
        </p>
      </div>
      <Link
        target="_blank"
        href={`https://nameguard.io/inspect/${encodeURIComponent(nameGuardReport.name)}`}
        className="mr-auto animated-black-underline pb-0.5 font-medium ml-8 mt-4 min-w-[178px] text-right"
      >
        View NameGuard report
      </Link>
    </div>
  );
};
