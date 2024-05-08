"use client";

import { ENSName, buildENSName } from "@namehash/ens-utils";
import {
  CheckResultCode,
  ConsolidatedNameGuardReport,
  Normalization,
  Rating,
} from "@namehash/nameguard";
import { RatingIconSize } from "@namehash/nameguard-react";
import { ReportBadge, ReportIcon } from "@namehash/nameguard-react";

export default function RatingShieldsPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      <div className="divide-y divide-gray-100">
        <h1 className="justify-center flex font-bold text-2xl my-8">
          {"<"}ReportIcon {"/>"} documentation
        </h1>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-6 gap-x-6 py-5 text-center font-medium">
            <div></div>
            <div>Success</div>
            <div>Warn</div>
            <div>Alert</div>
            <div>hadLoadingError</div>
            <div>no data</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon large />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                size={RatingIconSize.large}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                size={RatingIconSize.large}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                size={RatingIconSize.large}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(undefined, true)}
                size={RatingIconSize.large}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(undefined, true)}
                size={RatingIconSize.large}
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon medium />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                size={RatingIconSize.medium}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                size={RatingIconSize.medium}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                size={RatingIconSize.medium}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(undefined, true)}
                size={RatingIconSize.medium}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(undefined, true)}
                size={RatingIconSize.medium}
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon small />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                size={RatingIconSize.small}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                size={RatingIconSize.small}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                size={RatingIconSize.small}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(undefined, true)}
                size={RatingIconSize.small}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(undefined, true)}
                size={RatingIconSize.small}
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon micro />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                size={RatingIconSize.micro}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                size={RatingIconSize.micro}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                size={RatingIconSize.micro}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(undefined, true)}
                size={RatingIconSize.micro}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(undefined, true)}
                size={RatingIconSize.micro}
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon \n   onClickOverride />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                onClickOverride={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                onClickOverride={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                onClickOverride={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                hadLoadingError={true}
                ensName={getExampleReportName(undefined, true)}
                onClickOverride={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(undefined, true)}
                onClickOverride={() => alert("Clicked")}
              />
            </div>
          </div>
        </div>

        <h1 className="justify-center flex font-bold text-2xl mb-8 pt-12">
          {"<"}ReportBadge {"/>"} documentation
        </h1>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-6 gap-x-6 py-5 text-center font-medium">
            <div></div>
            <div>Success</div>
            <div>Warn</div>
            <div>Alert</div>
            <div>hadLoadingError</div>
            <div>no data</div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center">
            <div className="flex items-center font-mono">
              <pre>{"<ReportBadge />"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.alert)}
              data={getExampleReportData(Rating.alert)}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(undefined, true)}
              hadLoadingError={true}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge ensName={getExampleReportName()} />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center">
            <div className="flex items-center font-mono">
              <pre>{"<ReportBadge \n   onClickOverride />"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
              onClickOverride={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
              onClickOverride={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.alert)}
              data={getExampleReportData(Rating.alert)}
              onClickOverride={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              hadLoadingError={true}
              ensName={getExampleReportName(Rating.pass, true)}
              onClickOverride={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName()}
              onClickOverride={() => alert("Clicked")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const getExampleReportName = (
  rating?: Rating,
  compWithError = false,
): ENSName => {
  if (compWithError) return buildENSName("notrab.eth");

  if (!rating) return buildENSName("loading.eth");

  switch (rating) {
    case Rating.pass:
      return buildENSName("lightwalker.eth");
    case Rating.warn:
      return buildENSName("culturecafé.eth");
    case Rating.alert:
      return buildENSName("‍420.eth");
  }
};

const getExampleReportData = (rating: Rating): ConsolidatedNameGuardReport => {
  switch (rating) {
    case Rating.pass:
      return {
        rating: Rating.pass,
        risk_count: 0,
        highest_risk: null,
        name: "lightwalker.eth",
        namehash:
          "0x5c1f4e4189d173a562af8d27771e2a1394ccbfa466f0e72b429dd317afce4c06",
        normalization: Normalization.normalized,
        title: "Looks Good",
        subtitle: "All security checks passed!",
        beautiful_name: "lightwalker.eth",
      };
    case Rating.warn:
      return {
        rating: Rating.warn,
        risk_count: 3,
        highest_risk: {
          check: "confusables",
          status: CheckResultCode.warn,
          message: "May be confusable",
          check_name: "Character Recognition",
        },
        name: "culturecafé.eth",
        namehash:
          "0x633b4f6a64d539885d9b85c8730a0bc3479c6248f7a99cd2e302707f49c6d5a5",
        normalization: Normalization.normalized,
        title: "Some Risk",
        subtitle: "Review risks before proceeding",
        beautiful_name: "culturecafé.eth",
      };
    case Rating.alert:
      return {
        rating: Rating.alert,
        risk_count: 3,
        highest_risk: {
          check: "invisible",
          status: CheckResultCode.alert,
          message: "Contains invisible characters",
          check_name: "Character Visibility",
        },
        name: "‍420.eth",
        namehash:
          "0x61ce4b1e75e224233d08821593eaa0615e29bd984bbd39fc2830257ceecfcb40",
        normalization: Normalization.unnormalized,
        title: "High Risk",
        subtitle: "Better not to use this name",
        beautiful_name: "",
      };
  }
};
