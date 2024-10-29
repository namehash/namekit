import { describe, it, expect } from "vitest";
import { buildContractRef } from "./contract";
import { MAINNET } from "./chain";
import { buildAddress } from "./address";

describe("buildContractRef() function", () => {

    it("buildContractRef", () => {
      const address = buildAddress("0x1234567890123456789012345678901234567890");

      const result = buildContractRef(MAINNET, address);
  
      expect(result).to.toStrictEqual({
          chain: MAINNET,
          address: address,
      });
    });

});