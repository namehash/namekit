"use client";

import { CheckResultCode, Normalization, Rating } from "@namehash/nameguard";
import {
  RatingIcon,
  RatingIconSize,
  LoadingShieldIcon,
  ReportBadge,
  UnknownShieldIcon,
  ReportShield,
} from "@namehash/nameguard-react";

export default function RatingShieldsPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      <div className="divide-y divide-gray-100">
        <div className="grid grid-cols-6 gap-x-6 py-5 text-center font-medium">
          <div></div>
          <div>Success</div>
          <div>Warn</div>
          <div>Alert</div>
          <div>Error</div>
          <div>Loading</div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportShield />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportShield
                data={{
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
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportShield
                data={{
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
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportShield
                data={{
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
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportShield name="notrab.eth" hasLoadingError={true} />
            </div>
            <div className="flex items-center justify-center">
              <ReportShield name="notrab.eth" />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportShield onClick />"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportShield
                data={{
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
                }}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportShield
                data={{
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
                }}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportShield
                data={{
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
                }}
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportShield
                name="notrab.eth"
                error="Something went wrong"
                onClick={() => alert("Clicked")}
              />
            </div>
            <div className="flex items-center justify-center">
              <ReportShield
                name="notrab.eth"
                onClick={() => alert("Clicked")}
              />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-6 py-5">
            <div className="flex items-center font-mono">
              <pre>{"<ReportShield> \n Hello World \n </ReportShield>"}</pre>
            </div>

            <div className="flex items-center justify-center">
              <ReportShield
                data={{
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
                }}
                onClick={() => alert("Clicked")}
              >
                Hello world
              </ReportShield>
            </div>
            <div className="flex items-center justify-center">
              <ReportShield
                data={{
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
                }}
                onClick={() => alert("Clicked")}
              >
                Hello world
              </ReportShield>
            </div>
            <div className="flex items-center justify-center">
              <ReportShield
                data={{
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
                }}
                onClick={() => alert("Clicked")}
              >
                Hello world
              </ReportShield>
            </div>
            <div className="flex items-center justify-center">
              <ReportShield
                name="notrab.eth"
                error="Something went wrong"
                onClick={() => alert("Clicked")}
              >
                Hello world
              </ReportShield>
            </div>
            <div className="flex items-center justify-center">
              <ReportShield name="notrab.eth" onClick={() => alert("Clicked")}>
                Hello world
              </ReportShield>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5 mt-8">
          <div className="flex items-center">
            <div className="flex items-center font-mono">
              <pre>{"<ReportBadge onClick />"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ReportBadge
              name="lightwalker.eth"
              data={{
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
              }}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name="culturecafé.eth"
              data={{
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
              }}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name="‍420.eth"
              data={{
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
              }}
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name="notrab.eth"
              error="Something went wrong"
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge onClick={() => alert("Clicked")} />
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
              data={{
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
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name="culturecafé.eth"
              data={{
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
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge
              name="‍420.eth"
              data={{
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
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge name="notrab.eth" error="Something went wrong" />
          </div>
          <div className="flex items-center justify-center">
            <ReportBadge />
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{`<RatingIcon large />`}</pre>
          </div>

          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.pass} size={RatingIconSize.large} />
          </div>
          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.warn} size={RatingIconSize.large} />
          </div>
          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.alert} size={RatingIconSize.large} />
          </div>
          <div className="flex items-center justify-center">
            <UnknownShieldIcon size={RatingIconSize.large} />
          </div>
          <div className="flex items-center justify-center">
            <LoadingShieldIcon size={RatingIconSize.large} />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{`<RatingIcon medium />`}</pre>
          </div>

          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.pass} size={RatingIconSize.medium} />
          </div>
          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.warn} size={RatingIconSize.medium} />
          </div>
          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.alert} size={RatingIconSize.medium} />
          </div>
          <div className="flex items-center justify-center">
            <UnknownShieldIcon size={RatingIconSize.medium} />
          </div>
          <div className="flex items-center justify-center">
            <LoadingShieldIcon size={RatingIconSize.medium} />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{`<RatingIcon small />`}</pre>
          </div>

          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.pass} size={RatingIconSize.small} />
          </div>
          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.warn} size={RatingIconSize.small} />
          </div>
          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.alert} size={RatingIconSize.small} />
          </div>
          <div className="flex items-center justify-center">
            <UnknownShieldIcon size={RatingIconSize.small} />
          </div>
          <div className="flex items-center justify-center">
            <LoadingShieldIcon size={RatingIconSize.small} />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{`<RatingIcon micro />`}</pre>
          </div>

          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.pass} size={RatingIconSize.micro} />
          </div>
          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.warn} size={RatingIconSize.micro} />
          </div>
          <div className="flex items-center justify-center">
            <RatingIcon rating={Rating.alert} size={RatingIconSize.micro} />
          </div>
          <div className="flex items-center justify-center">
            <UnknownShieldIcon size={RatingIconSize.micro} />
          </div>
          <div className="flex items-center justify-center">
            <LoadingShieldIcon size={RatingIconSize.micro} />
          </div>
        </div>
      </div>
    </div>
  );
}
