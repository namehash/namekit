import { describe, it, expect } from "vitest";
import {
  Registrar,
  UNWRAPPED_MAINNET_ETH_REGISTRAR,
  WRAPPED_MAINNET_ETH_REGISTRAR,
  buildNFTRefFromENSName,
} from "./ethregistrar";
import { ENSName, buildENSName } from "./ensname";
import { MAINNET, SEPOLIA } from "./chain";
import { buildNFTRef } from "./nft";

// TODO: add a lot more unit tests here

function testNFTRefFromRegistrar(
  name: ENSName,
  registrar: Registrar,
  isWrapped: boolean,
): void {
  const expectedToken = registrar.getTokenId(name, isWrapped);
  const expectedNFT = buildNFTRef(registrar.contract, expectedToken);
  const result = buildNFTRefFromENSName(
    name,
    registrar.contract.chain,
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
    const registrar = WRAPPED_MAINNET_ETH_REGISTRAR;
    const isWrapped = true;
    testNFTRefFromRegistrar(name, registrar, isWrapped);
  });

  it("unwrapped subname of a .eth subname", () => {
    expect(() =>
      buildNFTRefFromENSName(buildENSName("x.foo.eth"), MAINNET, false),
    ).toThrow();
  });

  it("wrapped subname of a .eth subname", () => {
    const name = buildENSName("x.foo.eth");
    const registrar = WRAPPED_MAINNET_ETH_REGISTRAR;
    const isWrapped = true;
    testNFTRefFromRegistrar(name, registrar, isWrapped);
  });

  it("unwrapped direct subname of .eth", () => {
    const name = buildENSName("foo.eth");
    const registrar = UNWRAPPED_MAINNET_ETH_REGISTRAR;
    const isWrapped = false;
    testNFTRefFromRegistrar(name, registrar, isWrapped);
  });

  it("wrapped direct subname of .eth", () => {
    const name = buildENSName("foo.eth");
    const registrar = WRAPPED_MAINNET_ETH_REGISTRAR;
    const isWrapped = true;
    testNFTRefFromRegistrar(name, registrar, isWrapped);
  });
});
