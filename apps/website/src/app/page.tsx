import { nameguard } from "@namehash/nameguard";

export default async function Home() {
  const nameInspection = await nameguard.inspectName("vitalik.eth");
  // const overloaded = await nameguard.inspectName("vitalik.eth", "nick.eth");
  const bulkInspections = await nameguard.inspectBulkNames([
    "vitalik.eth",
    "nick.eth",
  ]);

  // const namehashInspection = await nameguard.inspectNamehash(
  //   "0x787192fc5378cc32aa956ddfdedbf26b24e8d78e40109add0eea2c1a012c3dec"
  // );

  return (
    <pre>{JSON.stringify({ nameInspection, bulkInspections }, null, 2)}</pre>
  );
}
