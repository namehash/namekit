import { describe, it, expect, beforeAll } from "vitest";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { SecurePrimaryNameResult } from "@namehash/nameguard";
import { securePrimaryName } from "./securePrimaryName";
import { initializeData } from "./data";

interface Test {
  address: string;
  impersonationEstimate: string | null;
  primaryNameStatus: string;
  primaryName: string | null;
  displayName: string | null;
}

const PROVIDER_URI_MAINNET = process.env.PROVIDER_URI_MAINNET;

if (!PROVIDER_URI_MAINNET) {
  console.warn(
    "PROVIDER_URI_MAINNET is not defined. Defaulting to viem's default provider, which may have rate limiting and other performance limitations.",
  );
}

const TEST_TIMEOUT_MS = 30000;

describe("secure primary name", () => {
  beforeAll(() => {
    initializeData();
  });

  it(
    "should detect impersonation",
    async () => {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(PROVIDER_URI_MAINNET),
      });
      // examples taken from Python Nameguard API tests
      const tests: Test[] = [
        {
          address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          impersonationEstimate: "unlikely",
          primaryNameStatus: "normalized",
          primaryName: "vitalik.eth",
          displayName: "vitalik.eth",
        },
        {
          address: "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776",
          impersonationEstimate: "potential",
          primaryNameStatus: "normalized",
          primaryName: "vitalìk.eth",
          displayName: "vitalìk.eth",
        },
        {
          address: "0x8B7863d67e1083EE1becbDD277cbBFf1c1CCB631",
          impersonationEstimate: "unlikely",
          primaryNameStatus: "normalized",
          primaryName: "٧٣٧.eth",
          displayName: "٧٣٧.eth",
        },
        {
          address: "0x9d32572997DA4948063E3Fc11c2552Eb82F7208E",
          impersonationEstimate: "unlikely",
          primaryNameStatus: "normalized",
          primaryName: "poet.base.eth",
          displayName: "poet.base.eth",
        },
        {
          address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046",
          impersonationEstimate: null,
          primaryNameStatus: "no_primary_name",
          primaryName: null,
          displayName: "Unnamed d8da",
        },
        {
          address: "0xfA9A134f997b3d48e122d043E12d04E909b11073",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed fa9a",
        },
        {
          address: "0x76fd9b1B2d8F2cd9Ba06c925506627883F97B97C",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed 76fd",
        },
        {
          address: "0xf537a27F31d7A014c5b8008a0069c61f827fA7A1",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed f537",
        },
        {
          address: "0x0ebDfD75d33c05025074fd7845848D44966AB367",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed 0ebd",
        },
        {
          address: "0xaf738F6C83d7D2C46723b727Ce794F9c79Cc47E6",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed af73",
        },
        {
          address: "0xb281405429C3bc91e52707a21754cDaCeCbB035E",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed b281",
        },
        {
          address: "0x0d756ee0e8C250f88f5e0eDd7C723dc3A0BF75cF",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed 0d75",
        },
        {
          address: "0x7Da3CdE891a76416ec9D1c3354B8EfE550Bd4e20",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed 7da3",
        },
        {
          address: "0xC9f598BC5BB554B6A15A96D19954B041C9FDbF14",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed c9f5",
        },
        {
          address: "0x7c7160A23b32402ad24ED5a617b8a83f434642d4",
          impersonationEstimate: "unlikely",
          primaryNameStatus: "normalized",
          primaryName: "vincξnt.eth",
          displayName: "vincΞnt.eth",
        },
        {
          address: "0x744Ec0A91D420c257aE3eE471B79B1A6a0312E36",
          impersonationEstimate: null,
          primaryNameStatus: "unnormalized",
          primaryName: null,
          displayName: "Unnamed 744e",
        },
      ];
      const promises: Promise<SecurePrimaryNameResult>[] = [];
      for (const test of tests) {
        promises.push(securePrimaryName(test.address, client));
      }
      const results = await Promise.all(promises);
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        const test = tests[i];
        expect(r.display_name).toBe(test.displayName);
        expect(r.impersonation_estimate).toBe(test.impersonationEstimate);
        expect(r.primary_name_status).toBe(test.primaryNameStatus);
        expect(r.primary_name).toBe(test.primaryName);
      }
    },
    TEST_TIMEOUT_MS,
  );
});
