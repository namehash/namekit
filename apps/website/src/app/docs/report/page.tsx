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
            <div>hasLoadingError</div>
            <div>no data</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon data={getExampleReportData(Rating.pass)} />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon data={getExampleReportData(Rating.warn)} />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon data={getExampleReportData(Rating.alert)} />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(undefined, true)}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon name={getExampleReportName(undefined, true)} />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon onClick />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                data={getExampleReportData(Rating.pass)}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                data={getExampleReportData(Rating.warn)}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                data={getExampleReportData(Rating.alert)}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                hadLoadingError={true}
                name={getExampleReportName(undefined, true)}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(undefined, true)}
                onClick={() => alert("Clicked")}
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
              name={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.alert)}
              data={getExampleReportData(Rating.alert)}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(undefined, true)}
              hadLoadingError={true}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge name={getExampleReportName()} />
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
              name={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.alert)}
              data={getExampleReportData(Rating.alert)}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              hadLoadingError={true}
              name={getExampleReportName(Rating.pass, true)}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName()}
              onClick={() => alert("Clicked")}
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
): string => {
  if (compWithError) return "notrab.eth";

  if (!rating) return "loading.eth";

  switch (rating) {
    case Rating.pass:
      return "lightwalker.eth";
    case Rating.warn:
      return "culturecafé.eth";
    case Rating.alert:
      return "‍420.eth";
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
        name: "thequickbrownfoxjumpsoverthelazydòg.eth",
        namehash:
          "0x90f86b68361b1034db95680f02f209314e0c9024fb7a60ad323e2530a0c18513",
        normalization: Normalization.normalized,
        title: "Some Risk",
        subtitle: "Review risks before proceeding",
        beautiful_name: "thequickbrownfoxjumpsoverthelazydòg.eth",
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
