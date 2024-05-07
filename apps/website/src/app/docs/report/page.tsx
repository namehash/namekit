"use client";

import {
  CheckResultCode,
  ConsolidatedNameGuardReport,
  Normalization,
  Rating,
} from "@namehash/nameguard";
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
            <div>Unknown</div>
            <div>Loading</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon data={getReportExampleData(Rating.pass)} />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon data={getReportExampleData(Rating.warn)} />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon data={getReportExampleData(Rating.alert)} />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon name="notrab.eth" hadLoadingError={true} />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon name="notrab.eth" />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon onClick />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                data={getReportExampleData(Rating.pass)}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                data={getReportExampleData(Rating.warn)}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                data={getReportExampleData(Rating.alert)}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                hadLoadingError={true}
                name="notrab.eth"
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon name="notrab.eth" onClick={() => alert("Clicked")} />
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
            <div>hasLoadingError</div>
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
              name="lightwalker.eth"
              data={getReportExampleData(Rating.pass)}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name="culturecafé.eth"
              data={getReportExampleData(Rating.warn)}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name="‍420.eth"
              data={getReportExampleData(Rating.alert)}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge name="notrab.eth" hadLoadingError={true} />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge name="loading.eth" />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center">
            <div className="flex items-center font-mono">
              <pre>{"<ReportBadge onClick />"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ReportBadge
              name="lightwalker.eth"
              data={getReportExampleData(Rating.pass)}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name="culturecafé.eth"
              data={getReportExampleData(Rating.warn)}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name="‍420.eth"
              data={getReportExampleData(Rating.alert)}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              hadLoadingError={true}
              name="notrab.eth"
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge name="loading.eth" onClick={() => alert("Clicked")} />
          </div>
        </div>
      </div>
    </div>
  );
}

const getReportExampleData = (rating: Rating): ConsolidatedNameGuardReport => {
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
