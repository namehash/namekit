import { createClient } from "@namehash/nameguard";
import { createLocalProvider } from "@namehash/nameguard-js";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { headers } from "next/headers";

// This is a server component, so your secrets are safe
const PROVIDER_URI_MAINNET = process.env.PROVIDER_URI_MAINNET;

// You can use your own client
const publicClient = createPublicClient({
  chain: mainnet,
  // For example, put your own URI here
  transport: http(PROVIDER_URI_MAINNET)
});

const nameguard = createClient({
  localProviders: new Map([
    // Register a local provider for mainnet using a given client
    ["mainnet", createLocalProvider({ publicClient })]
  ])
});

type Props = {
  address: string;
};

export async function ImpersonationBadgeContent({ address }: Props) {
  // This is a workaround to disable static generation for this component.
  // Without this, Next.js would render this at build time.
  headers();

  // This function does not use the NameGuard API server
  const data = await nameguard.getSecurePrimaryNameLocal(address);

  const pillColor =
    data.impersonation_status === "potential" ?
      "bg-red-300" :
      data.impersonation_status === "unlikely" ?
        "bg-green-300" :
        "bg-yellow-300";

  const pillText =
    data.impersonation_status === "potential" ?
      "Potential impersonation!" :
      data.impersonation_status === "unlikely" ?
        "Name is secure" :
        "No primary name!";

  return (
    <>
      <span className="absolute bottom-6 left-0 text-xs">
        {data.display_name}
      </span>
      <span className={"absolute top-6 left-0 text-xs rounded-full px-2 " + pillColor}>
        {pillText}
      </span>
    </>
  );
}
