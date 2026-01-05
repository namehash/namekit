import { createClient } from "@namehash/nameguard-js";
import { headers } from "next/headers";

// No longer need a public client - we use ENS node API directly
const nameguard = createClient({ network: "mainnet" });

interface Props {
  address: string;
}

export async function SecurePrimaryName({ address }: Props) {
  // This is a workaround to disable static generation for this component.
  // Without this, Next.js would render this at build time.
  headers();

  // This function does not use the NameGuard API server
  const data = await nameguard.getSecurePrimaryName(address, {
    computeNameGuardReport: true,
  });

  const pillColor =
    data.impersonation_estimate === "potential"
      ? "bg-red-300"
      : data.impersonation_estimate === "unlikely"
        ? "bg-green-300"
        : "bg-yellow-300";

  const pillText =
    data.impersonation_estimate === "potential"
      ? "Potential impersonation!"
      : data.impersonation_estimate === "unlikely"
        ? "Name is secure"
        : "No primary name!";

  return (
    <div className="flex flex-col items-start flex-1 overflow-hidden">
      <div className="text-xs">{data.display_name}</div>

      <div className="self-stretch truncate">{address}</div>

      <div className={"text-xs rounded-full px-2 " + pillColor}>{pillText}</div>
    </div>
  );
}
