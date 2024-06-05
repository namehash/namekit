import { describe, it, expect } from "vitest";
import { getNameGuardURLForENSname, isEthereumAddress } from "./utils.js";
import { buildENSName } from "@namehash/ens-utils";
import { toUnicode } from "punycode";

describe("isEthereumAddress", () => {
  it("valid EthereumAddress: with prefix all lowercase", () => {
    const result = isEthereumAddress(
      "0x0123456789abcdef0123456789abcdef01234567",
    );

    expect(result).toBe(true);
  });

  it("valid EthereumAddress: with prefix mixed case", () => {
    const result = isEthereumAddress(
      "0X0123456789ABCDEF0123456789abcdef01234567",
    );

    expect(result).toBe(true);
  });

  it("invalid EthereumAddress: missing prefix", () => {
    const result = isEthereumAddress(
      "0123456789abcdef0123456789abcdef01234567",
    );

    expect(result).toBe(false);
  });

  it("invalid EthereumAddress: too long", () => {
    const result = isEthereumAddress(
      "0x0123456789abcdef0123456789abcdef012345678",
    );

    expect(result).toBe(false);
  });

  it("invalid EthereumAddress: too short", () => {
    const result = isEthereumAddress(
      "0x0123456789abcdef0123456789abcdef0123456",
    );

    expect(result).toBe(false);
  });

  it("invalid EthereumAddress: invalid character", () => {
    const result = isEthereumAddress(
      "0xx123456789abcdef0123456789abcdef01234567",
    );

    expect(result).toBe(false);
  });
});

describe("getNameGuardURLForENSname", () => {
  it("should return correct NameGuard inspect name page URL for notrab.eth", () => {
    const result = getNameGuardURLForENSname(buildENSName("notrab.eth"));
    const expectedResult = "https://nameguard.io/inspect/notrab.eth";

    expect(result).toBe(expectedResult);
  });
  it("should return correct NameGuard inspect name page URL for 🐈‍⬛.eth", () => {
    const result = getNameGuardURLForENSname(buildENSName("🐈‍⬛.eth"));
    const expectedResult = `https://nameguard.io/inspect/%F0%9F%90%88%E2%80%8D%E2%AC%9B.eth`;

    expect(result).toBe(expectedResult);
  });
});
