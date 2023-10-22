import { describe, it, expect } from "vitest";
import { isEthereumAddress } from "./utils";

describe("isEthereumAddress", () => {  

    it("valid EthereumAddress: with prefix all lowercase", () => {
        const result = isEthereumAddress("0x0123456789abcdef0123456789abcdef01234567");

        expect(result).toBe(true);
    });

    it("valid EthereumAddress: with prefix mixed case", () => {
        const result = isEthereumAddress("0X0123456789ABCDEF0123456789abcdef01234567");

        expect(result).toBe(true);
    });

    it("invalid EthereumAddress: missing prefix", () => {
        const result = isEthereumAddress("0123456789abcdef0123456789abcdef01234567");

        expect(result).toBe(false);
    });

    it("invalid EthereumAddress: too long", () => {
        const result = isEthereumAddress("0x0123456789abcdef0123456789abcdef012345678");

        expect(result).toBe(false);
    });

    it("invalid EthereumAddress: too short", () => {
        const result = isEthereumAddress("0x0123456789abcdef0123456789abcdef0123456");

        expect(result).toBe(false);
    });

    it("invalid EthereumAddress: invalid character", () => {
        const result = isEthereumAddress("0xx123456789abcdef0123456789abcdef01234567");

        expect(result).toBe(false);
    });

});

