import { describe, it, expect } from "vitest";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { SecurePrimaryNameResult } from "@namehash/nameguard";
import { securePrimaryName } from "./securePrimaryName";

const PROVIDER_URI_MAINNET = process.env.PROVIDER_URI_MAINNET;
const TEST_TIMEOUT = 30000;

describe("secure primary name", () => {
  it("should detect impersonation", async () => {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(PROVIDER_URI_MAINNET),
    });
    const tests = [
      [
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "unlikely",
        "normalized",
        "vitalik.eth",
        "vitalik.eth",
        "vitalik.eth",
        false,
        "vitalik.eth",
      ],
      [
        "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776",
        "potential",
        "normalized",
        "vitalìk.eth",
        "vitalìk.eth",
        "vitalik.eth",
        true,
        "vitalìk.eth",
      ],
      [
        "0x8B7863d67e1083EE1becbDD277cbBFf1c1CCB631",
        "unlikely",
        "normalized",
        "٧٣٧.eth",
        "٧٣٧.eth",
        "٧٣٧.eth",
        false,
        "٧٣٧.eth",
      ],
      [
        "0xFD9eE68000Dc92aa6c67F8f6EB5d9d1a24086fAd",
        "unlikely",
        "normalized",
        "exampleprimary.cb.id",
        "exampleprimary.cb.id",
        "exampleprimary.cb.id",
        false,
        "exampleprimary.cb.id",
      ],
      [
          '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046',
          null,
          'no_primary_name',
          null,
          'Unnamed d8da',
          null,
          false,
          null,
      ],
      [
          '0xfA9A134f997b3d48e122d043E12d04E909b11073',
          null,
          'unnormalized',
          null,
          'Unnamed fa9a',
          null,
          false,
          '888‍‍.eth',
      ],
      [
          '0x76fd9b1B2d8F2cd9Ba06c925506627883F97B97C',
          null,
          'unnormalized',
          null,
          'Unnamed 76fd',
          null,
          false,
          '‍‍❤‍‍.eth',
      ],
      [
          '0xf537a27F31d7A014c5b8008a0069c61f827fA7A1',
          null,
          'unnormalized',
          null,
          'Unnamed f537',
          null,
          false,
          '٠٠۱.eth',
      ],
      [
          '0x0ebDfD75d33c05025074fd7845848D44966AB367',
          null,
          'unnormalized',
          null,
          'Unnamed 0ebd',
          null,
          false,
          '۸۸۷۵۴۲.eth',
      ],
      [
          '0xaf738F6C83d7D2C46723b727Ce794F9c79Cc47E6',
          null,
          'unnormalized',
          null,
          'Unnamed af73',
          null,
          false,
          '୨୨୨୨୨.eth',
      ],
      [
          '0xb281405429C3bc91e52707a21754cDaCeCbB035E',
          null,
          'unnormalized',
          null,
          'Unnamed b281',
          null,
          false,
          '┣▇▇▇═─.eth',
      ],
      [
          '0x0d756ee0e8C250f88f5e0eDd7C723dc3A0BF75cF',
          null,
          'unnormalized',
          null,
          'Unnamed 0d75',
          null,
          false,
          'сбер.eth',
      ],
      [
          '0x7Da3CdE891a76416ec9D1c3354B8EfE550Bd4e20',
          null,
          'unnormalized',
          null,
          'Unnamed 7da3',
          'vitalik.eth',
          true,
          'vitȧlik.eth',
      ],
      [
          '0xC9f598BC5BB554B6A15A96D19954B041C9FDbF14',
          null,
          'unnormalized',
          null,
          'Unnamed c9f5',
          'vitalik.eth',
          true,
          'vıtalik.eth',
      ],
      [
        "0x7c7160A23b32402ad24ED5a617b8a83f434642d4",
        "unlikely",
        "normalized",
        "vincξnt.eth",
        "vincΞnt.eth",
        "vincξnt.eth",
        false,
        "vincξnt.eth",
      ],
      [
          '0x744Ec0A91D420c257aE3eE471B79B1A6a0312E36',
          null,
          'unnormalized',
          null,
          'Unnamed 744e',
          null,
          false,
          'hello<world>!.eth',
      ],
    ];
    const promises: Promise<SecurePrimaryNameResult>[] = [];
    for (const test of tests) {
      const address = test[0] as string;
      promises.push(securePrimaryName(address, client));
    }
    const results = await Promise.all(promises);
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const test = tests[i];
      const impersonationEstimate = test[1] as string | null;
      const primaryNameStatus = test[2] as string;
      const primaryName = test[3] as string;
      const displayName = test[4] as string;
      expect(r.display_name).toBe(displayName);
      expect(r.impersonation_estimate).toBe(impersonationEstimate);
      expect(r.primary_name_status).toBe(primaryNameStatus);
      expect(r.primary_name).toBe(primaryName);
    }
  }, TEST_TIMEOUT);
});
