"use client";

import { CheckResultCode, Normalization, Rating } from "@namehash/nameguard";
import { Shield, ShieldIcon, NameBadge } from "@namehash/nameguard-react";

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
        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center">
            <div className="flex items-center font-mono">
              <pre>{"<Shield />"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Shield name="lightwalker.eth" />
          </div>
          <div className="flex items-center justify-center">
            <Shield name="culturecafé.eth" />
          </div>
          <div className="flex items-center justify-center">
            <Shield name="‍420.eth" />
          </div>
          <div className="flex items-center justify-center"></div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.info} />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center">
            <div className="flex items-center font-mono">
              <pre>{"<Shield>Hello world</Shield>"}</pre>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Shield name="lightwalker.eth">Hello world</Shield>
          </div>
          <div className="flex items-center justify-center">
            <Shield name="culturecafé.eth">Hello world</Shield>
          </div>
          <div className="flex items-center justify-center">
            <Shield name="‍420.eth">Hello world</Shield>
          </div>
          <div className="flex items-center justify-center"></div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.info} />
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{"<NameBadge />"}</pre>
          </div>

          <div className="flex items-center justify-center">
            <NameBadge
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
            <NameBadge
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
            <NameBadge
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
            <NameBadge name="notrab.eth" error="Something went wrong" />
          </div>
          <div className="flex items-center justify-center">
            <NameBadge name="notrab.eth" />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{"<NameBadge onClick />"}</pre>
          </div>

          <div className="flex items-center justify-center">
            <NameBadge
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
            <NameBadge
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
            <NameBadge
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
            <NameBadge
              name="notrab.eth"
              error="Something went wrong"
              onClick={() => alert("Clicked")}
            />
          </div>
          <div className="flex items-center justify-center">
            <NameBadge name="notrab.eth" onClick={() => alert("Clicked")} />
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{`<ShieldIcon large />`}</pre>
          </div>

          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.pass} size="large" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.warn} size="large" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.alert} size="large" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.skip} size="large" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.info} size="large" />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{`<ShieldIcon medium />`}</pre>
          </div>

          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.pass} size="medium" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.warn} size="medium" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.alert} size="medium" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.skip} size="medium" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.info} size="medium" />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{`<ShieldIcon small />`}</pre>
          </div>

          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.pass} size="small" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.warn} size="small" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.alert} size="small" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.skip} size="small" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.info} size="small" />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 py-5">
          <div className="flex items-center font-mono">
            <pre>{`<ShieldIcon micro />`}</pre>
          </div>

          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.pass} size="micro" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.warn} size="micro" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.alert} size="micro" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.skip} size="micro" />
          </div>
          <div className="flex items-center justify-center">
            <ShieldIcon status={CheckResultCode.info} size="micro" />
          </div>
        </div>
      </div>
    </div>
  );
}
