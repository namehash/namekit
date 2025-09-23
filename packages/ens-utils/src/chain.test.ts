import { describe, it, expect } from "vitest";
import {
  MAINNET,
  buildChainId,
  getChainByName,
  getChainMetadata,
} from "./chain";

describe("buildChainId() function", () => {
  it("Build from string", () => {
    const chainId = "1";

    const result = buildChainId(chainId);

    expect(result).toStrictEqual(MAINNET);
  });

  it("Build from number", () => {
    const chainId = 1;

    const result = buildChainId(chainId);

    expect(result).toStrictEqual(MAINNET);
  });

  it("Invalid chainId: non-number", () => {
    const chainId = "q";

    expect(() => buildChainId(chainId)).toThrow();
  });

  it("Invalid chainId: chainId non-positive", () => {
    const chainId = 0;

    expect(() => buildChainId(chainId)).toThrow();
  });

  it("Invalid chainId: chainId negative", () => {
    const chainId = -1;

    expect(() => buildChainId(chainId)).toThrow();
  });

  it("Invalid chainId: chainId non-integer", () => {
    const chainId = 1.5;

    expect(() => buildChainId(chainId)).toThrow();
  });

  it("Invalid chainId: chainId non-integer string", () => {
    const chainId = "1.5";

    expect(() => buildChainId(chainId)).toThrow();
  });

  it("Invalid chainId: chainId NaN", () => {
    const chainId = NaN;

    expect(() => buildChainId(chainId)).toThrow();
  });

  it("Invalid chainId: chainId Infinity", () => {
    const chainId = Infinity;

    expect(() => buildChainId(chainId)).toThrow();
  });
});

describe("getChainByName() function", () => {
  it("known chain", () => {
    const name = "mainnet";

    const result = getChainByName(name);

    expect(result).toStrictEqual(MAINNET);
  });

  it("case-insensitive unknown chain", () => {
    const name = "Mainnet";

    expect(() => getChainByName(name)).toThrow();
  });

  it("general unknown chain", () => {
    const name = "unknown";

    expect(() => getChainByName(name)).toThrow();
  });
});

describe("getChainMetadata() function", () => {
  it("known chain", () => {
    const result = getChainMetadata(MAINNET);

    expect(result).toBeDefined();
  });

  it("unknown chain", () => {
    const chainId = buildChainId(1234567890);

    expect(() => getChainMetadata(chainId)).toThrow();
  });
});
