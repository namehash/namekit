import { describe, it, expect } from "vitest";
import { MIN_REGISTRATION_PERIOD, Registrar, UNWRAPPED_MAINNET_ETH_REGISTRAR, WRAPPED_MAINNET_ETH_REGISTRAR, buildNFTRefFromENSName, isValidRegistrationPeriod, validateRegistrationPeriod } from "./ethregistrar";
import { ENSName, buildENSName } from "./ensname";
import { MAINNET, SEPOLIA } from "./chain";
import { buildNFTRef } from "./nft";
import { addSeconds, buildDuration, buildTimePeriod, buildTimestampFromDate } from "./time";

// TODO: add a lot more unit tests here

function testNFTRefFromRegistrar(name: ENSName, registrar: Registrar, isWrapped: boolean): void {
    const expectedToken = registrar.getTokenId(name, isWrapped);
    const expectedNFT = buildNFTRef(registrar.contract, expectedToken);
    const result = buildNFTRefFromENSName(name, registrar.contract.chain, isWrapped);
    expect(result).toStrictEqual(expectedNFT);
}

describe("buildNFTRefFromENSName", () => {

    it("unrecognized registrar", () => {
        expect(() => buildNFTRefFromENSName(buildENSName("foo.eth"), SEPOLIA, false)).toThrow();
    });

    it("unwrapped non-.eth TLD", () => {
        expect(() => buildNFTRefFromENSName(buildENSName("foo.com"), MAINNET, false)).toThrow();
    });

    it("wrapped non-.eth TLD", () => {
        const name = buildENSName("foo.com");
        const registrar = WRAPPED_MAINNET_ETH_REGISTRAR;
        const isWrapped = true;
        testNFTRefFromRegistrar(name, registrar, isWrapped);
    });

    it("unwrapped subname of a .eth subname", () => {
        expect(() => buildNFTRefFromENSName(buildENSName("x.foo.eth"), MAINNET, false)).toThrow();
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

describe("isValidRegistrationPeriod", () => {

    it("below minimum", () => {

        const registrationDate = new Date("2024-01-01T00:00:00Z");
        const registrationTimestamp = buildTimestampFromDate(registrationDate);
        const duration = buildDuration(MIN_REGISTRATION_PERIOD.seconds - 1n);
        const expirationTimestamp = addSeconds(registrationTimestamp, duration);
        const registration = buildTimePeriod(registrationTimestamp, expirationTimestamp);

        const result = isValidRegistrationPeriod(registration);
        const expectedResult = false;

        expect(result).toStrictEqual(expectedResult);
    });

    it("exact minimum", () => {

        const registrationDate = new Date("2024-01-01T00:00:00Z");
        const registrationTimestamp = buildTimestampFromDate(registrationDate);
        const duration = MIN_REGISTRATION_PERIOD;
        const expirationTimestamp = addSeconds(registrationTimestamp, duration);
        const registration = buildTimePeriod(registrationTimestamp, expirationTimestamp);

        const result = isValidRegistrationPeriod(registration);
        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
    });

    it("above minimum", () => {

        const registrationDate = new Date("2024-01-01T00:00:00Z");
        const registrationTimestamp = buildTimestampFromDate(registrationDate);
        const duration = buildDuration(MIN_REGISTRATION_PERIOD.seconds + 1n);
        const expirationTimestamp = addSeconds(registrationTimestamp, duration);
        const registration = buildTimePeriod(registrationTimestamp, expirationTimestamp);

        const result = isValidRegistrationPeriod(registration);
        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
    });
});

describe("validateRegistrationPeriod", () => {

    it("below minimum", () => {

        const registrationDate = new Date("2024-01-01T00:00:00Z");
        const registrationTimestamp = buildTimestampFromDate(registrationDate);
        const duration = buildDuration(MIN_REGISTRATION_PERIOD.seconds - 1n);
        const expirationTimestamp = addSeconds(registrationTimestamp, duration);
        const registration = buildTimePeriod(registrationTimestamp, expirationTimestamp);

        expect(() => validateRegistrationPeriod(registration)).toThrow();
    });

    it("exact minimum", () => {

        const registrationDate = new Date("2024-01-01T00:00:00Z");
        const registrationTimestamp = buildTimestampFromDate(registrationDate);
        const duration = MIN_REGISTRATION_PERIOD;
        const expirationTimestamp = addSeconds(registrationTimestamp, duration);
        const registration = buildTimePeriod(registrationTimestamp, expirationTimestamp);

        const result = isValidRegistrationPeriod(registration);
        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
    });

    it("above minimum", () => {

        const registrationDate = new Date("2024-01-01T00:00:00Z");
        const registrationTimestamp = buildTimestampFromDate(registrationDate);
        const duration = buildDuration(MIN_REGISTRATION_PERIOD.seconds + 1n);
        const expirationTimestamp = addSeconds(registrationTimestamp, duration);
        const registration = buildTimePeriod(registrationTimestamp, expirationTimestamp);

        const result = isValidRegistrationPeriod(registration);
        const expectedResult = true;

        expect(result).toStrictEqual(expectedResult);
    });
});