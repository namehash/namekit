import { describe, it, expect } from "vitest";
import { buildTxnHash } from "./transaction";

describe("buildTxnHash() function", () => {
  it("doesn't begin with 0x", () => {
    const hash =
      "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

    expect(() => buildTxnHash(hash)).toThrow();
  });

  it("too few digits", () => {
    const hash =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde";

    expect(() => buildTxnHash(hash)).toThrow();
  });

  it("too many digits", () => {
    const hash =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1";

    expect(() => buildTxnHash(hash)).toThrow();
  });

  it("valid hash", () => {
    const hash =
      "0x1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF";

    const result = buildTxnHash(hash);
    expect(result.hash).toStrictEqual(hash.toLowerCase());
  });
});
