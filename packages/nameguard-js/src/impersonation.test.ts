import { describe, it, expect } from "vitest";
import { computeImpersonationStatus } from "./impersonation";

describe("Impersonation", () => {
  it("should return impersonation status", () => {
    expect(computeImpersonationStatus("nick.eth")).toBe("unlikely");
    expect(computeImpersonationStatus("nićk.eth")).toBe("potential");
    expect(computeImpersonationStatus("vitalik.eth")).toBe("unlikely");
    expect(computeImpersonationStatus("vitalìk.eth")).toBe("potential");
    expect(computeImpersonationStatus("٧٣٧.eth")).toBe("unlikely");
    expect(computeImpersonationStatus("poet.base.eth")).toBe("unlikely");
    expect(computeImpersonationStatus("exampleprimary.cb.id")).toBe("unlikely");
    expect(computeImpersonationStatus("888‍‍.eth")).toBe("potential");
    expect(computeImpersonationStatus("‍‍❤‍‍.eth")).toBe("potential");
    expect(computeImpersonationStatus("٠٠۱.eth")).toBe("potential");
    expect(computeImpersonationStatus("۸۸۷۵۴۲.eth")).toBe("potential");
    expect(computeImpersonationStatus("୨୨୨୨୨.eth")).toBe("potential");
    expect(computeImpersonationStatus("┣▇▇▇═─.eth")).toBe("potential");
    expect(computeImpersonationStatus("сбер.eth")).toBe("potential");
    expect(computeImpersonationStatus("vitȧlik.eth")).toBe("potential");
    expect(computeImpersonationStatus("vıtalik.eth")).toBe("potential");
    expect(computeImpersonationStatus("vincξnt.eth")).toBe("unlikely");
    expect(computeImpersonationStatus("hello<world>!.eth")).toBe("potential");
  });
});
