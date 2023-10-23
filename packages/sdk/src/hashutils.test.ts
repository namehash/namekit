import { describe, it, expect } from "vitest";
import {
  isEncodedLabelhash,
  isKeccak256Hash,
  normalizeEncodedLabelhash,
  normalizeKeccak256Hash,
} from "./hashutils";

describe("isKeccak256Hash", () => {
  it("valid Keccak256Hash: with prefix all lowercase", () => {
    const result = isKeccak256Hash(
      "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );

    expect(result).toBe(true);
  });

  it("valid Keccak256Hash: without prefix all lowercase", () => {
    const result = isKeccak256Hash(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );

    expect(result).toBe(true);
  });

  it("valid Keccak256Hash: with prefix mixed case", () => {
    const result = isKeccak256Hash(
      "0X0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef"
    );

    expect(result).toBe(true);
  });

  it("valid Keccak256Hash: without prefix mixed case", () => {
    const result = isKeccak256Hash(
      "0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef"
    );

    expect(result).toBe(true);
  });

  it("invalid Keccak256Hash: too long", () => {
    const result = isKeccak256Hash(
      "0x0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef0"
    );

    expect(result).toBe(false);
  });

  it("invalid Keccak256Hash: too short", () => {
    const result = isKeccak256Hash(
      "0x0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcde"
    );

    expect(result).toBe(false);
  });

  it("invalid Keccak256Hash: invalid character", () => {
    const result = isKeccak256Hash(
      "0xx123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef"
    );

    expect(result).toBe(false);
  });
});

describe("isEncodedLabelhash", () => {
  it("valid EncodedLabelhash: with prefix all lowercase", () => {
    const result = isEncodedLabelhash(
      "[0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]"
    );

    expect(result).toBe(true);
  });

  it("valid EncodedLabelhash: without prefix all lowercase", () => {
    const result = isEncodedLabelhash(
      "[0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]"
    );

    expect(result).toBe(true);
  });

  it("valid EncodedLabelhash: with prefix mixed case", () => {
    const result = isEncodedLabelhash(
      "[0X0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef]"
    );

    expect(result).toBe(true);
  });

  it("valid EncodedLabelhash: without prefix mixed case", () => {
    const result = isEncodedLabelhash(
      "[0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef]"
    );

    expect(result).toBe(true);
  });

  it("invalid EncodedLabelhash: too long", () => {
    const result = isEncodedLabelhash(
      "[0x0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef0]"
    );

    expect(result).toBe(false);
  });

  it("invalid EncodedLabelhash: too short", () => {
    const result = isEncodedLabelhash(
      "[0x0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcde]"
    );

    expect(result).toBe(false);
  });

  it("invalid EncodedLabelhash: invalid character", () => {
    const result = isEncodedLabelhash(
      "[0xx123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef]"
    );

    expect(result).toBe(false);
  });

  it("invalid EncodedLabelhash: missing square brackets", () => {
    const result = isEncodedLabelhash(
      "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );

    expect(result).toBe(false);
  });

  it("invalid EncodedLabelhash: extra outsie of square brackets", () => {
    const result = isEncodedLabelhash(
      "[[0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]]"
    );

    expect(result).toBe(false);
  });
});

describe("normalizeKeccak256Hash", () => {
  it("normalizeKeccak256Hash: invalid hash", () => {
    expect(() => {
      normalizeKeccak256Hash("0x1234567890abcdef");
    }).toThrow("Invalid Keccak-256 hash format: 0x1234567890abcdef");
  });

  it("normalizeKeccak256Hash: identity -> with prefix", () => {
    const result = normalizeKeccak256Hash(
      "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      true
    );

    expect(result).toBe(
      "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );
  });

  it("normalizeKeccak256Hash: no prefix -> with prefix", () => {
    const result = normalizeKeccak256Hash(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      true
    );

    expect(result).toBe(
      "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );
  });

  it("normalizeKeccak256Hash: no prefix mixed case -> with prefix", () => {
    const result = normalizeKeccak256Hash(
      "0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef",
      true
    );

    expect(result).toBe(
      "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );
  });

  it("normalizeKeccak256Hash: uppercase prefix -> with prefix", () => {
    const result = normalizeKeccak256Hash(
      "0X0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      true
    );

    expect(result).toBe(
      "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );
  });

  it("normalizeKeccak256Hash: identity -> without prefix", () => {
    const result = normalizeKeccak256Hash(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      false
    );

    expect(result).toBe(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );
  });

  it("normalizeKeccak256Hash: with prefix -> without prefix", () => {
    const result = normalizeKeccak256Hash(
      "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      false
    );

    expect(result).toBe(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );
  });

  it("normalizeKeccak256Hash: no prefix mixed case -> without prefix", () => {
    const result = normalizeKeccak256Hash(
      "0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef",
      false
    );

    expect(result).toBe(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );
  });

  it("normalizeKeccak256Hash: uppercase prefix -> without prefix", () => {
    const result = normalizeKeccak256Hash(
      "0X0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      false
    );

    expect(result).toBe(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    );
  });
});

describe("normalizeEncodedLabelhash", () => {
  it("normalizeEncodedLabelhash: invalid encoded labelhash", () => {
    expect(() => {
      normalizeEncodedLabelhash("0x1234567890abcdef");
    }).toThrow("Invalid EncodedLabelhash format: 0x1234567890abcdef");
  });

  it("normalizeEncodedLabelhash: with prefix", () => {
    const result = normalizeEncodedLabelhash(
      "[0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]"
    );

    expect(result).toBe(
      "[0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]"
    );
  });

  it("normalizeEncodedLabelhash: without prefix", () => {
    const result = normalizeEncodedLabelhash(
      "[0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]"
    );

    expect(result).toBe(
      "[0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]"
    );
  });

  it("normalizeEncodedLabelhash: no prefix mixed case", () => {
    const result = normalizeEncodedLabelhash(
      "[0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef]"
    );

    expect(result).toBe(
      "[0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]"
    );
  });

  it("normalizeEncodedLabelhash: uppercase prefix", () => {
    const result = normalizeEncodedLabelhash(
      "[0X0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]"
    );

    expect(result).toBe(
      "[0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]"
    );
  });
});
