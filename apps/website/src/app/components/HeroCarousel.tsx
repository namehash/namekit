import { nameguard } from "@namehash/nameguard";
import { parseName } from "@namehash/nameparser";

import { HeroNameBadge } from "./HeroNameBadge";

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
];

export async function HeroCarousel() {
  const parsedNames = examples.map((n) => parseName(n));
  const data = await nameguard.bulkInspectNames(
    parsedNames.map((n) => n.outputName.name)
  );

  return (
    <div className="w-[200%] flex flex-nowrap justify-center items-center space-x-1 animate-carousel group-hover:pause-on-hover">
      {data?.results?.map((report, index) => (
        <HeroNameBadge key={`carousel-item-${index}`} data={report} />
      ))}
      {data?.results?.map((report, index) => (
        <HeroNameBadge key={`carousel-item-2-${index}`} data={report} />
      ))}
    </div>
  );
}
