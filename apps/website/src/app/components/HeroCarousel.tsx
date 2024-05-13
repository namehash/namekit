import { nameguard } from "@namehash/nameguard";
import { buildENSName } from "@namehash/ens-utils";
import { HeroReportBadge } from "./HeroReportBadge";

const examples = [
  "culturecafé.eth",
  "моёт.eth",
  "batman十robin.eth",
  "‍420.eth",
  "0x🥷🏼.eth",
  "metaverse‌.eth",
  "🪼jellyfish.eth",
  "español.eth",
  "‍‍‍‍‍‍😎.eth",
  "gm‍.eth",
  "vitalik‍‍‍.eth",
  "♪♪♪.eth",
  "unknоwn.eth",
  "john🇺🇸",
  "7️⃣7️⃣7️⃣.eth",
  "culturecafé.eth",
  "моёт.eth",
  "batman十robin.eth",
  "‍420.eth",
  "0x🥷🏼.eth",
  "metaverse‌.eth",
  "🪼jellyfish.eth",
  "español.eth",
  "‍‍‍‍‍‍😎.eth",
  "gm‍.eth",
  "vitalik‍‍‍.eth",
  "♪♪♪.eth",
  "unknоwn.eth",
  "john🇺🇸",
  "7️⃣7️⃣7️⃣.eth",
];

export async function HeroCarousel() {
  const ensNames = examples.map((n) => buildENSName(n));
  const data = await nameguard.bulkInspectNames(examples);

  return (
    <div className="w-[200%] group flex flex-nowrap justify-center items-center space-x-1 animate-carousel group-hover:pause-on-hover">
      {data?.results?.map((report, index) => (
        <HeroReportBadge
          key={`carousel-item-${index}`}
          ensName={ensNames[index]}
          data={report}
        />
      ))}
    </div>
  );
}
