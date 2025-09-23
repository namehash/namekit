import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";

const AlchemyURL = process.env.NEXT_PUBLIC_ALCHEMY_URL;

if (!AlchemyURL) throw new Error("Missing NEXT_PUBLIC_ALCHEMY_URL");

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(AlchemyURL),
  },
});
