import { describe, it, expect, beforeAll } from "vitest";
import { computeImpersonationEstimate } from "./impersonation";
import { initializeData } from "./data";

describe("Impersonation", () => {
  beforeAll(() => {
    initializeData();
  });

  it("should return impersonation estimate", () => {
    expect(computeImpersonationEstimate("nick.eth")).toBe("unlikely");
    expect(computeImpersonationEstimate("nićk.eth")).toBe("potential");
    expect(computeImpersonationEstimate("vitalik.eth")).toBe("unlikely");
    expect(computeImpersonationEstimate("vitalìk.eth")).toBe("potential");
    expect(computeImpersonationEstimate("٧٣٧.eth")).toBe("unlikely");
    expect(computeImpersonationEstimate("exampleprimary.cb.id")).toBe("unlikely");
    expect(computeImpersonationEstimate("888‍‍.eth")).toBe("potential");
    expect(computeImpersonationEstimate("‍‍❤‍‍.eth")).toBe("potential");
    expect(computeImpersonationEstimate("٠٠۱.eth")).toBe("potential");
    expect(computeImpersonationEstimate("۸۸۷۵۴۲.eth")).toBe("potential");
    expect(computeImpersonationEstimate("୨୨୨୨୨.eth")).toBe("potential");
    expect(computeImpersonationEstimate("┣▇▇▇═─.eth")).toBe("potential");
    expect(computeImpersonationEstimate("сбер.eth")).toBe("potential");
    expect(computeImpersonationEstimate("vitȧlik.eth")).toBe("potential");
    expect(computeImpersonationEstimate("vıtalik.eth")).toBe("potential");
    expect(computeImpersonationEstimate("vincξnt.eth")).toBe("unlikely");
    expect(computeImpersonationEstimate("hello<world>!.eth")).toBe("potential");
  });
});
