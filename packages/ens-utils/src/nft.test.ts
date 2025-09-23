import { describe, it, expect } from "vitest";

import {
  buildNFTRef,
  convertNFTRefToString,
  buildNFTReferenceFromString,
  buildTokenId,
} from "./nft";
import { MAINNET } from "./chain";
import { buildContractRef } from "./contract";
import { buildAddress } from "./address";

describe("buildTokenId() function", () => {
  it("Non-integer tokenId", () => {
    const tokenId = "x";

    expect(() => buildTokenId(tokenId)).toThrow();
  });

  it("Negative tokenId", () => {
    const tokenId = -1n;

    expect(() => buildTokenId(tokenId)).toThrow();
  });

  it("Min allowed tokenId value", () => {
    const tokenId = 0n;

    const result = buildTokenId(tokenId);

    expect(result).toStrictEqual({
      tokenId: tokenId,
    });
  });

  it("Max allowed tokenId value", () => {
    const tokenId = 2n ** 256n - 1n;

    const result = buildTokenId(tokenId);

    expect(result).toStrictEqual({
      tokenId: tokenId,
    });
  });

  it("tokenId value overflow", () => {
    const tokenId = 2n ** 256n;

    expect(() => buildTokenId(tokenId)).toThrow();
  });
});

describe("buildNFTRef() function", () => {
  it("buildNFTRef", () => {
    const chain = MAINNET;
    const contractAddress = buildAddress(
      "0x1234567890123456789012345678901234567890",
    );
    const token = buildTokenId(1234567890123456789012345678901234567890n);

    const contract = buildContractRef(chain, contractAddress);
    const result = buildNFTRef(contract, token);

    expect(result).toStrictEqual({
      contract: contract,
      token: token,
    });
  });
});

describe("convertNFTRefToString() function", () => {
  it("convertNFTRefToString", () => {
    const chain = MAINNET;
    const contractAddress = buildAddress(
      "0x1234567890123456789012345678901234567890",
    );
    const token = buildTokenId(1234567890123456789012345678901234567890n);

    const contract = buildContractRef(chain, contractAddress);
    const nft = buildNFTRef(contract, token);

    const result = convertNFTRefToString(nft);

    expect(result).toEqual(
      "1:0x1234567890123456789012345678901234567890:1234567890123456789012345678901234567890",
    );
  });
});

describe("buildNFTReferenceFromString() function", () => {
  it("too few params", () => {
    expect(() => buildNFTReferenceFromString(":")).toThrow();
  });

  it("too many params", () => {
    expect(() => buildNFTReferenceFromString(":::")).toThrow();
  });

  it("valid params", () => {
    const result = buildNFTReferenceFromString(
      "1:0x1234567890123456789012345678901234567890:1234567890123456789012345678901234567890",
    );

    const chain = MAINNET;
    const contractAddress = buildAddress(
      "0x1234567890123456789012345678901234567890",
    );
    const contract = buildContractRef(chain, contractAddress);
    const token = buildTokenId(1234567890123456789012345678901234567890n);
    const nft = buildNFTRef(contract, token);

    expect(result).toStrictEqual(nft);
  });
});
