/**
 * Looks up the primary name associated with the given address using ENS node API.
 *
 * @param address - The address to lookup.
 * @param network - The network to query ("mainnet" or "sepolia").
 * @returns A Promise that resolves to the primary name associated with the address, or null if not found.
 */
export async function lookupPrimaryName(
  address: string,
  network: "mainnet" | "sepolia",
): Promise<string | null> {
  const baseUrl = network === "mainnet"
    ? process.env.ENSNODE_URL_MAINNET || "https://api.alpha.ensnode.io"
    : process.env.ENSNODE_URL_SEPOLIA || "https://api.alpha-sepolia.ensnode.io";

  const chainId = network === "mainnet" ? 1 : 11155111;
  const url = `${baseUrl}/api/resolve/primary-name/${address}/${chainId}`;

  try {
    const response = await fetch(`${url}?accelerate=true`);
    
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`ENS node API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.name || null;
  } catch (error) {
    throw new Error(`Failed to lookup primary name: ${error}`);
  }
}
