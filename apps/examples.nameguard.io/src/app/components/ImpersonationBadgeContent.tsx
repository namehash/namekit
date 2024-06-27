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

  return (
    <>
      <span className="absolute bottom-6 left-0 text-xs">
        {data.display_name}
      </span>
      {data.impersonation_status === "potential" ? (
        <span className="absolute top-6 left-0 bg-red-300 text-xs rounded-full px-1">
          Potential impersonation!
        </span>
      ) : data.impersonation_status === null ? (
        <span className="absolute top-6 left-0 bg-yellow-300 text-xs rounded-full px-1">
          No primary name!
        </span>
      ) : null}
    </>
  );
}
