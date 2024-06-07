import { describe, it, expect } from "vitest";
import { LruStringMap } from "./lru";

describe("LruStringMap", () => {

    it("throws Error if maxSize < 0", () => {
        const maxSize = -1;
        expect(() => {new LruStringMap<string>(maxSize)}).toThrow();
      });

  it("maintains maxSize 0", () => {
    const maxSize = 0;
    const lru = new LruStringMap<string>(maxSize);

    lru.set("key1", "value");

    expect(lru.size).toBe(maxSize);
  });

  it("maintains maxSize 1", () => {
    const maxSize = 1;
    const lru = new LruStringMap<string>(maxSize);

    lru.set("key1", "value");
    lru.set("key2", "value");

    expect(lru.size).toBe(maxSize);
  });

  it("maintains maxSize > 1", () => {
    const maxSize = 2;
    const lru = new LruStringMap<string>(maxSize);

    lru.set("key1", "value");
    lru.set("key2", "value");
    lru.set("key3", "value");

    expect(lru.size).toBe(maxSize);
  });

  it("remembers up to maxSize most recently read keys", () => {
    const maxSize = 2;
    const lru = new LruStringMap<string>(maxSize);

    lru.set("key1", "value");
    lru.set("key2", "value");
    lru.get("key1");
    lru.set("key3", "value");

    expect(lru.get("key1")).toBeDefined();
    expect(lru.get("key2")).toBeUndefined();
    expect(lru.get("key3")).toBeDefined();
  });

});