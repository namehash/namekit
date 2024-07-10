import { createClient } from "@namehash/nameguard-js";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { headers } from "next/headers";

// This is a server component, so your secrets are safe
const PROVIDER_URI_MAINNET = process.env.PROVIDER_URI_MAINNET;

// You can use your own client
const publicClient = createPublicClient({
  chain: mainnet,
  // For example, put your own URI here
  transport: http(PROVIDER_URI_MAINNET),
});

const nameguard = createClient({ publicClient });

interface Props {
  address: string;
}

export async function SecurePrimaryName({ address }: Props) {
  // This is a workaround to disable static generation for this component.
  // Without this, Next.js would render this at build time.
  headers();

  // This function does not use the NameGuard API server
  const data = await nameguard.getSecurePrimaryName(address);

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
    <div className="flex flex-col items-start flex-1 overflow-hidden">
      <div className="text-xs">
        {data.display_name}
      </div>

      <div className="self-stretch truncate">
        {address}
      </div>

      <div className={"text-xs rounded-full px-2 " + pillColor}>
        {pillText}
      </div>
    </div>
  );
}
