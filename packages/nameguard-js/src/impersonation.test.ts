import { describe, it, expect } from "vitest";
import {
  computeImpersonationStatus,
  ImpersonationStatus,
} from "./impersonation";

describe("Impersonation", () => {
  it("should return impersonation status", () => {
    expect(computeImpersonationStatus("nick.eth")).toBe(
      ImpersonationStatus.UNLIKELY,
    );
    expect(computeImpersonationStatus("nićk.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("vitalik.eth")).toBe(
      ImpersonationStatus.UNLIKELY,
    );
    expect(computeImpersonationStatus("vitalìk.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("٧٣٧.eth")).toBe(
      ImpersonationStatus.UNLIKELY,
    );
    expect(computeImpersonationStatus("exampleprimary.cb.id")).toBe(
      ImpersonationStatus.UNLIKELY,
    );
    expect(computeImpersonationStatus("888‍‍.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("‍‍❤‍‍.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("٠٠۱.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("۸۸۷۵۴۲.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("୨୨୨୨୨.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("┣▇▇▇═─.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("сбер.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("vitȧlik.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("vıtalik.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
    expect(computeImpersonationStatus("vincξnt.eth")).toBe(
      ImpersonationStatus.UNLIKELY,
    );
    expect(computeImpersonationStatus("hello<world>!.eth")).toBe(
      ImpersonationStatus.POTENTIAL,
    );
  });
});
