import { checksumAddress } from "viem";
import { describe, it, expect } from "vitest";
import { buildAddress, isAddressEqual, truncateAddress } from "./address";
import { MAINNET } from "./chain";

describe("buildAddress() function", () => {
  it("doesn't begin with 0x", () => {
    const address = "0000000000000000000000000000000000000000";

    expect(() => buildAddress(address)).toThrow();
  });

  it("too few digits", () => {
    const address = "0x000000000000000000000000000000000000000";

    expect(() => buildAddress(address)).toThrow();
  });

  it("too many digits", () => {
    const address = "0x00000000000000000000000000000000000000000";

    expect(() => buildAddress(address)).toThrow();
  });

  it("valid address, checksum wrong but not strict", () => {
    const address = "0x80C9A4104F594029F3F7F9E4FDE5BC25E9E64CDF";
    const expectedAddress = checksumAddress(address, MAINNET.chainId);

    const result = buildAddress(address);
    expect(result.address).toBe(expectedAddress);
  });

  it("valid address, checksum wrong and strict", () => {
    const address = "0x80C9A4104F594029F3F7F9E4FDE5BC25E9E64CDF";

    expect(() => buildAddress(address, true, MAINNET)).toThrow();
  });

  it("valid address, checksum right and strict", () => {
    const address = "0x80C9a4104F594029F3F7f9e4Fde5bc25E9E64cdf";

    const result = buildAddress(address, true, MAINNET);
    expect(result.address).toBe(address);
  });
});

describe("truncateAddress() function", () => {
  it("truncate address", () => {
    const address = buildAddress("0x80C9A4104F594029F3F7F9E4FDE5BC25E9E64CDF");

    const result = truncateAddress(address);
    expect(result).toBe("0x80C9...4cdf");
  });
});

describe("isAddressEqual() function", () => {
  it("equal addresses", () => {
    const a = buildAddress("0x80C9A4104F594029F3F7F9E4FDE5BC25E9E64CDF");
    const b = buildAddress("0x80c9a4104f594029f3f7f9e4fde5bc25e9e64cdf");

    const result = isAddressEqual(a, b);
    expect(result).toBe(true);
  });

  it("non-equal addresses", () => {
    const a = buildAddress("0x80C9A4104F594029F3F7F9E4FDE5BC25E9E64CDF");
    const b = buildAddress("0x80c9a4104f594029f3f7f9e4fde5bc25e9e64cd0");

    const result = isAddressEqual(a, b);
    expect(result).toBe(false);
  });
});
