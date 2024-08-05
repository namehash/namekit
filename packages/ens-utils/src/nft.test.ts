import { describe, it, expect } from "vitest";
import {
    buildNFTRef,
    convertNFTRefToString,
    buildNFTReferenceFromString,
    buildTokenId,
    NFTIssuer,
    buildNFTRefFromENSName,
    MAINNET_NAMEWRAPPER,
    MAINNET_ETH_BASE_REGISTRAR_IMPLEMENTATION,
} from "./nft";
import { MAINNET, SEPOLIA } from "./chain";
import { buildContractRef } from "./contract";
import { buildAddress } from "./address";
import { buildENSName, ENSName } from "./ensname";

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
    const tokenId = (2n ** 256n) - 1n;

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
        const contractAddress = buildAddress("0x1234567890123456789012345678901234567890");
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
        const contractAddress = buildAddress("0x1234567890123456789012345678901234567890");
        const token = buildTokenId(1234567890123456789012345678901234567890n);

        const contract = buildContractRef(chain, contractAddress);
        const nft = buildNFTRef(contract, token);

        const result = convertNFTRefToString(nft);
    
        expect(result).toEqual("1:0x1234567890123456789012345678901234567890:1234567890123456789012345678901234567890");
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
        const result = buildNFTReferenceFromString("1:0x1234567890123456789012345678901234567890:1234567890123456789012345678901234567890");

        const chain = MAINNET;
        const contractAddress = buildAddress("0x1234567890123456789012345678901234567890");
        const contract = buildContractRef(chain, contractAddress);
        const token = buildTokenId(1234567890123456789012345678901234567890n);
        const nft = buildNFTRef(contract, token);

        expect(result).toStrictEqual(nft);
    });

});

function testNFTRefFromIssuer(
  name: ENSName,
  issuer: NFTIssuer,
  isWrapped: boolean,
): void {
  const expectedToken = issuer.getTokenId(name, isWrapped);
  const expectedNFT = buildNFTRef(issuer.getNftContract(), expectedToken);
  const result = buildNFTRefFromENSName(
    name,
    issuer.getNftContract().chain,
    isWrapped,
  );
  expect(result).toStrictEqual(expectedNFT);
}

describe("buildNFTRefFromENSName", () => {
  it("unrecognized registrar", () => {
    expect(() =>
      buildNFTRefFromENSName(buildENSName("foo.eth"), SEPOLIA, false),
    ).toThrow();
  });

  it("unwrapped non-.eth TLD", () => {
    expect(() =>
      buildNFTRefFromENSName(buildENSName("foo.com"), MAINNET, false),
    ).toThrow();
  });

  it("wrapped non-.eth TLD", () => {
    const name = buildENSName("foo.com");
    const registrar = MAINNET_NAMEWRAPPER;
    const isWrapped = true;
    testNFTRefFromIssuer(name, registrar, isWrapped);
  });

  it("unwrapped subname of a .eth subname", () => {
    expect(() =>
      buildNFTRefFromENSName(buildENSName("x.foo.eth"), MAINNET, false),
    ).toThrow();
  });

  it("wrapped subname of a .eth subname", () => {
    const name = buildENSName("x.foo.eth");
    const registrar = MAINNET_NAMEWRAPPER;
    const isWrapped = true;
    testNFTRefFromIssuer(name, registrar, isWrapped);
  });

  it("unwrapped direct subname of .eth", () => {
    const name = buildENSName("foo.eth");
    const registrar = MAINNET_ETH_BASE_REGISTRAR_IMPLEMENTATION;
    const isWrapped = false;
    testNFTRefFromIssuer(name, registrar, isWrapped);
  });

  it("wrapped direct subname of .eth", () => {
    const name = buildENSName("foo.eth");
    const registrar = MAINNET_NAMEWRAPPER;
    const isWrapped = true;
    testNFTRefFromIssuer(name, registrar, isWrapped);
  });
});