import { nameguard } from "@namehash/nameguard";

export default async function Home() {
  const data = await nameguard.name("vitalik.eth");

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
