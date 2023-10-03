import { nameguard } from "@namehash/nameguard";

export default async function Home() {
  const data = await nameguard.inspectName("vitalik.eth");

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
