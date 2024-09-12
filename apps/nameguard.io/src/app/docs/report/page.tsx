"use client";

import { ENSName, buildENSName } from "@namehash/ens-utils";
import {
  CheckResultCode,
  ConsolidatedNameGuardReport,
  Rating,
} from "@namehash/nameguard";
import { OpenReportHandler, RatingIconSize } from "@namehash/nameguard-react";
import { ReportBadge, ReportIcon } from "@namehash/nameguard-react";

const customOpenReportHandler: OpenReportHandler = (name: ENSName) => {
  alert(`Example of custom logic to handle a request to open a NameGuard report for name "${name.displayName}".`);
};

export default function ReportDocsPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      <div>
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
                name={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                size={RatingIconSize.large}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                size={RatingIconSize.large}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                size={RatingIconSize.large}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
                size={RatingIconSize.large}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
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
                name={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                size={RatingIconSize.medium}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                size={RatingIconSize.medium}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                size={RatingIconSize.medium}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
                size={RatingIconSize.medium}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
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
                name={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                size={RatingIconSize.small}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                size={RatingIconSize.small}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                size={RatingIconSize.small}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
                size={RatingIconSize.small}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
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
                name={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                size={RatingIconSize.micro}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                size={RatingIconSize.micro}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                size={RatingIconSize.micro}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
                size={RatingIconSize.micro}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
                size={RatingIconSize.micro}
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon \n   custom onOpenReport />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                onOpenReport={customOpenReportHandler}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                onOpenReport={customOpenReportHandler}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                onOpenReport={customOpenReportHandler}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
                hadLoadingError={true}
                onOpenReport={customOpenReportHandler}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                name={getExampleReportName()}
                onOpenReport={customOpenReportHandler}
              />
            </div>
          </div>
        </div>

        <h1 className="justify-center flex font-bold text-2xl mb-8 pt-12">
          {"<"}ReportBadge {"/>"} documentation
        </h1>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-12 gap-x-6 py-5 text-center font-medium">
            <div className="col-span-3"></div>
            <div>Success</div>
            <div className="col-span-3">Warn</div>
            <div className="col-span-2">Alert</div>
            <div className="col-span-2">hadLoadingError</div>
            <div>no data</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6 py-5 border-t border-gray-100">
          <div className="flex items-center col-span-3">
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
          <div className="col-span-3 flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.alert)}
              data={getExampleReportData(Rating.alert)}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName()}
              hadLoadingError={true}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge name={getExampleReportName()} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6 py-5 border-t border-gray-100">
          <div className="flex items-center col-span-3">
            <div className="flex items-center font-mono">
              <pre>{"<ReportBadge \n   custom onOpenReport />"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
              onOpenReport={customOpenReportHandler}
            />
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
              onOpenReport={customOpenReportHandler}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.alert)}
              data={getExampleReportData(Rating.alert)}
              onOpenReport={customOpenReportHandler}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName()}
              hadLoadingError={true}
              onOpenReport={customOpenReportHandler}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName()}
              onOpenReport={customOpenReportHandler}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 py-5 border-t border-gray-100">
          <div className="flex items-center col-span-3">
            <div className="flex items-center font-mono">
              <pre>{"<ReportBadge\ndisplayUnnormalizedNames={true}\n/>"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center ml-16">
            <ReportBadge
              name={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
            />
          </div>
          <div className="col-span-3 flex items-center justify-center ml-16">
            <ReportBadge
              name={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName(Rating.alert)}
              data={getExampleReportData(Rating.alert)}
              displayUnnormalizedNames={true}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              name={getExampleReportName()}
              hadLoadingError={true}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge name={getExampleReportName()} />
          </div>
        </div>
      </div>
    </div>
  );
}

const getExampleReportName = (rating: Rating = Rating.pass): ENSName => {
  switch (rating) {
    case Rating.pass:
      return buildENSName("lightwalker.eth");
    case Rating.warn:
      return buildENSName("thisìsaveryveryveryveryveryverylongname.eth");
    case Rating.alert:
      return buildENSName("‍420.eth");
  }
};

const getExampleReportData = (rating: Rating): ConsolidatedNameGuardReport => {
  const name = getExampleReportName(rating);

  switch (rating) {
    case Rating.pass:
      return {
        rating: Rating.pass,
        risk_count: 0,
        highest_risk: null,
        name: name.name,
        namehash: name.node,
        normalization: name.normalization,
        title: "Looks Good",
        subtitle: "All security checks passed!",
        beautiful_name: name.displayName,
        inspected: true,
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
        name: name.name,
        namehash: name.node,
        normalization: name.normalization,
        title: "Some Risk",
        subtitle: "Review risks before proceeding",
        beautiful_name: name.displayName,
        inspected: true,
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
        name: name.name,
        namehash: name.node,
        normalization: name.normalization,
        title: "High Risk",
        subtitle: "Better not to use this name",
        beautiful_name: name.displayName,
        inspected: true,
      };
  }
};
