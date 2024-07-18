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
                ensName={getExampleReportName()}
                size={RatingIconSize.large}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName()}
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
                ensName={getExampleReportName()}
                size={RatingIconSize.medium}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName()}
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
                ensName={getExampleReportName()}
                size={RatingIconSize.small}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName()}
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
                ensName={getExampleReportName()}
                size={RatingIconSize.micro}
                hadLoadingError={true}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName()}
                size={RatingIconSize.micro}
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon \n   onIconClickOverride />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                hadLoadingError={true}
                ensName={getExampleReportName()}
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName()}
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportIcon \n   onTooltipClickOverride />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                hadLoadingError={true}
                ensName={getExampleReportName()}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName()}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>
                {
                  "<ReportIcon \n   onIconClickOverride\n   onTooltipClickOverride />"
                }
              </pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.pass)}
                data={getExampleReportData(Rating.pass)}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.warn)}
                data={getExampleReportData(Rating.warn)}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName(Rating.alert)}
                data={getExampleReportData(Rating.alert)}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                hadLoadingError={true}
                ensName={getExampleReportName()}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportIcon
                ensName={getExampleReportName()}
                onTooltipClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - tooltip click`)
                }
                onIconClickOverride={(ensName: ENSName) =>
                  alert(`${ensName.name} - icon click`)
                }
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
              ensName={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
            />
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              data={getExampleReportData(Rating.alert)}
              ensName={getExampleReportName(Rating.alert)}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName()}
              hadLoadingError={true}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge ensName={getExampleReportName()} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6 py-5 border-t border-gray-100">
          <div className="flex items-center col-span-3">
            <div className="flex items-center font-mono">
              <pre>{"<ReportBadge \n   onBadgeClickOverride />"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
            />
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              data={getExampleReportData(Rating.alert)}
              ensName={getExampleReportName(Rating.alert)}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              hadLoadingError={true}
              ensName={getExampleReportName()}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName()}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 py-5 border-t border-gray-100">
          <div className="flex items-center col-span-3">
            <div className="flex items-center font-mono">
              <pre>{"<ReportBadge \n   onIconClickOverride />"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
            />
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              data={getExampleReportData(Rating.alert)}
              ensName={getExampleReportName(Rating.alert)}
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              hadLoadingError={true}
              ensName={getExampleReportName()}
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName()}
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 py-5 border-t border-gray-100">
          <div className="flex items-center col-span-3">
            <div className="flex items-center font-mono">
              <pre>{"<ReportBadge \n   onTooltipClickOverride />"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
            />
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              data={getExampleReportData(Rating.alert)}
              ensName={getExampleReportName(Rating.alert)}
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              hadLoadingError={true}
              ensName={getExampleReportName()}
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName()}
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 py-5 border-t border-gray-100">
          <div className="flex items-center col-span-3">
            <div className="flex items-center font-mono">
              <pre>
                {
                  "<ReportBadge \n   onTooltipClickOverride\n   onIconClickOverride\n   onBadgeClickOverride />"
                }
              </pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
            />
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              data={getExampleReportData(Rating.alert)}
              ensName={getExampleReportName(Rating.alert)}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              hadLoadingError={true}
              ensName={getExampleReportName()}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              ensName={getExampleReportName()}
              onBadgeClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - badge click`)
              }
              onIconClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - icon click`)
              }
              onTooltipClickOverride={(ensName: ENSName) =>
                alert(`${ensName.name} - tooltip click`)
              }
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
              ensName={getExampleReportName(Rating.pass)}
              data={getExampleReportData(Rating.pass)}
            />
          </div>
          <div className="col-span-3 flex items-center justify-center ml-16">
            <ReportBadge
              ensName={getExampleReportName(Rating.warn)}
              data={getExampleReportData(Rating.warn)}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              displayUnnormalizedNames={true}
              data={getExampleReportData(Rating.alert)}
              ensName={getExampleReportName(Rating.alert)}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <ReportBadge
              hadLoadingError={true}
              ensName={getExampleReportName()}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge ensName={getExampleReportName()} />
          </div>
        </div>
      </div>
    </div>
  );
}

const getExampleReportName = (rating?: Rating): ENSName => {
  if (!rating) {
    return buildENSName(getExampleReportData(Rating.pass).name);
  }

  return buildENSName(getExampleReportData(rating).name);
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
        name: "thisìsaveryveryveryveryveryverylongname.eth",
        namehash:
          "0x368edb7de4b5ad933a67148a18a7e65e1310a160ff4dce43c68ff563b8439a14",
        normalization: Normalization.normalized,
        title: "Some Risk",
        subtitle: "Review risks before proceeding",
        beautiful_name: "thisìsaveryveryveryveryveryverylongname.eth",
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
