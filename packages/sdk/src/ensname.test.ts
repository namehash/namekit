import { describe, it, expect } from "vitest";
import {
  buildENSName,
  getDecentralizationStatus,
  getDisplayLabels,
  getNamespaceRoot,
  getNormalizationStatus,
  getRegistrationPotential,
  isValidDNSTld,
  labelsEqual,
  tryNormalize,
} from "./ensname";

describe("labelsEqual", () => {
  it("empty labels", () => {
    const result = labelsEqual([], []);

    expect(result).toBe(true);
  });

  it("left longer", () => {
    const result = labelsEqual(["a", "b"], ["a"]);

    expect(result).toBe(false);
  });

  it("right longer", () => {
    const result = labelsEqual(["a"], ["a", "b"]);

    expect(result).toBe(false);
  });

  it("equal contents", () => {
    const result = labelsEqual(["abc", "123"], ["abc", "123"]);

    expect(result).toBe(true);
  });

  it("unequal contents", () => {
    const result = labelsEqual(["abcd", "123"], ["abc", "123"]);

    expect(result).toBe(false);
  });
});

describe("getDisplayLabels", () => {
  it("empty labels", () => {
    const result = getDisplayLabels([]);

    expect(result).toStrictEqual([]);
  });

  it("empty label values", () => {
    const result = getDisplayLabels([""]);

    expect(result).toStrictEqual([""]);
  });

  it("normalized labels", () => {
    const result = getDisplayLabels(["abc", "eth"]);

    expect(result).toStrictEqual(["abc", "eth"]);
  });

  it("normalizable labels", () => {
    const result = getDisplayLabels(["ABC", "ETH"]);

    expect(result).toStrictEqual(["abc", "eth"]);
  });

  it("different beautiful normalizable labels", () => {
    const result = getDisplayLabels(["ξsk3nder", "ETH"]);

    expect(result).toStrictEqual(["Ξsk3nder", "eth"]);
  });

  it("unnormalized labels", () => {
    const result = getDisplayLabels(["invalid|name", "eth"]);

    expect(result).toStrictEqual([
      "[4df76579a9591eddc67216d59dea04a50539665b0fba6c038590357f27f37487]",
      "eth",
    ]);
  });

  it("unknown labels with mixed case and prefix", () => {
    const result = getDisplayLabels([
      "[0X4Df76579a9591eddc67216d59dea04a50539665b0fba6c038590357f27f37487]",
      "eth",
    ]);

    expect(result).toStrictEqual([
      "[4df76579a9591eddc67216d59dea04a50539665b0fba6c038590357f27f37487]",
      "eth",
    ]);
  });

  it("empty labels mid name", () => {
    const result = getDisplayLabels(["abc", "", "123", "eth"]);

    expect(result).toStrictEqual(["abc", "", "123", "eth"]);
  });
});

describe("tryNormalize", () => {
  it("empty labels", () => {
    const result = tryNormalize([]);

    expect(result).toStrictEqual([]);
  });

  it("empty label values", () => {
    const result = tryNormalize([""]);

    expect(result).toStrictEqual([""]);
  });

  it("normalized labels", () => {
    const result = tryNormalize(["abc", "eth"]);

    expect(result).toStrictEqual(["abc", "eth"]);
  });

  it("normalizable labels", () => {
    const result = tryNormalize(["ABC", "ETH"]);

    expect(result).toStrictEqual(["abc", "eth"]);
  });

  it("unnormalized labels", () => {
    const result = tryNormalize(["invalid|name", "eth"]);

    expect(result).toStrictEqual(["invalid|name", "eth"]);
  });

  it("unknown labels with mixed case and prefix", () => {
    const result = tryNormalize([
      "[0X4Df76579a9591eddc67216d59dea04a50539665b0fba6c038590357f27f37487]",
      "eth",
    ]);

    expect(result).toStrictEqual([
      "[4df76579a9591eddc67216d59dea04a50539665b0fba6c038590357f27f37487]",
      "eth",
    ]);
  });
});

describe("getNormalizationStatus", () => {
  it("empty labels", () => {
    const result = getNormalizationStatus([]);

    expect(result).toBe("normalized");
  });

  it("empty label values", () => {
    const result = getNormalizationStatus([""]);

    expect(result).toBe("normalized");
  });

  it("normalized values", () => {
    const result = getNormalizationStatus(["abc", "eth"]);

    expect(result).toBe("normalized");
  });

  it("unnormalized values", () => {
    const result = getNormalizationStatus(["invalid|name", "eth"]);

    expect(result).toBe("unnormalized");
  });

  it("normalizable values", () => {
    const result = getNormalizationStatus(["ABC", "ETH"]);

    expect(result).toBe("unnormalized");
  });

  it("unknown labels", () => {
    const result = getNormalizationStatus([
      "[4df76579a9591eddc67216d59dea04a50539665b0fba6c038590357f27f37487]",
      "eth",
    ]);

    expect(result).toBe("unknown");
  });

  it("unnormalized and unknown values", () => {
    const result = getNormalizationStatus([
      "[4df76579a9591eddc67216d59dea04a50539665b0fba6c038590357f27f37487]",
      "invalid|name",
      "eth",
    ]);

    expect(result).toBe("unnormalized");
  });

  it("empty labels mid name", () => {
    const result = getNormalizationStatus(["abc", "", "123", "eth"]);

    expect(result).toBe("unnormalized");
  });
});

describe("isValidDNSTld", () => {
  it("DNS Root", () => {
    const result = isValidDNSTld("");

    expect(result).toBe(true);
  });

  it("eth TLD", () => {
    const result = isValidDNSTld("eth");

    expect(result).toBe(false);
  });

  it("com TLD", () => {
    const result = isValidDNSTld("com");

    expect(result).toBe(true);
  });

  // temporary test case until we improve DNS tld logic
  it("limo TLD", () => {
    const result = isValidDNSTld("limo");

    expect(result).toBe(undefined);
  });
});

describe("getNamespaceRoot", () => {
  it("empty name", () => {
    const result = getNamespaceRoot(buildENSName(""));

    expect(result).toBe("ens");
  });

  it(".eth TLD root", () => {
    const result = getNamespaceRoot(buildENSName("eth"));

    expect(result).toBe("ens");
  });

  it(".eth name", () => {
    const result = getNamespaceRoot(buildENSName("abc.eth"));

    expect(result).toBe("ens");
  });

  it(".com TLD root", () => {
    const result = getNamespaceRoot(buildENSName("com"));

    expect(result).toBe("dns");
  });

  it(".com name", () => {
    const result = getNamespaceRoot(buildENSName("abc.com"));

    expect(result).toBe("dns");
  });

  // temporary test case until we improve DNS tld logic
  it("other TLD root", () => {
    const result = getNamespaceRoot(buildENSName("limo"));

    expect(result).toBe("unknown");
  });

  // temporary test case until we improve DNS tld logic
  it("other TLD name", () => {
    const result = getNamespaceRoot(buildENSName("eth.limo"));

    expect(result).toBe("unknown");
  });
});

describe("getDecentralizationStatus", () => {
  it("empty name", () => {
    const result = getDecentralizationStatus(buildENSName(""));

    expect(result).toBe("unruggable");
  });

  it(".eth TLD root", () => {
    const result = getDecentralizationStatus(buildENSName("eth"));

    expect(result).toBe("unruggable");
  });

  it(".eth name", () => {
    const result = getDecentralizationStatus(buildENSName("abc.eth"));

    expect(result).toBe("unruggable");
  });

  it(".eth name", () => {
    const result = getDecentralizationStatus(buildENSName("123.abc.eth"));

    expect(result).toBe("unknown");
  });

  it(".com TLD root", () => {
    const result = getDecentralizationStatus(buildENSName("com"));

    expect(result).toBe("icann");
  });

  it(".com name", () => {
    const result = getDecentralizationStatus(buildENSName("abc.com"));

    expect(result).toBe("icann");
  });

  // temporary test case until we improve DNS tld logic
  it("other TLD root", () => {
    const result = getDecentralizationStatus(buildENSName("limo"));

    expect(result).toBe("unknown");
  });

  // temporary test case until we improve DNS tld logic
  it("other name", () => {
    const result = getDecentralizationStatus(buildENSName("eth.limo"));

    expect(result).toBe("unknown");
  });
});

describe("getRegistrationPotential", () => {
  it("empty name", () => {
    const result = getRegistrationPotential(buildENSName(""));

    expect(result).toBe("unregisterable");
  });

  it("DNS tld", () => {
    const result = getRegistrationPotential(buildENSName("com"));

    expect(result).toBe("unregisterable");
  });

  it("ENS tld", () => {
    const result = getRegistrationPotential(buildENSName("eth"));

    expect(result).toBe("unregisterable");
  });

  it("ENS 2nd-level name", () => {
    const result = getRegistrationPotential(buildENSName("abc.eth"));

    expect(result).toBe("registerable");
  });

  it("ENS 2nd-level name too short", () => {
    const result = getRegistrationPotential(buildENSName("ab.eth"));

    expect(result).toBe("unregisterable");
  });

  it("ENS 3nd-level name", () => {
    const result = getRegistrationPotential(buildENSName("123.abc.eth"));

    expect(result).toBe("unknown");
  });

  it("ENS 3nd-level name with 2nd-level label too short", () => {
    const result = getRegistrationPotential(buildENSName("123.ab.eth"));

    expect(result).toBe("unregisterable");
  });

  it("ENS 2nd-level name unnormalized", () => {
    const result = getRegistrationPotential(buildENSName("invalid|name.eth"));

    expect(result).toBe("invalid");
  });

  it("ENS 2nd-level name unknown", () => {
    const result = getRegistrationPotential(
      buildENSName(
        "[0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef].eth"
      )
    );

    expect(result).toBe("unknown");
  });

  // enhance this test in the future
  it("DNS 2nd-level name", () => {
    const result = getRegistrationPotential(buildENSName("abc.com"));

    expect(result).toBe("unknown");
  });

  // enhance this test in the future
  it("unknown 2nd-level name", () => {
    const result = getRegistrationPotential(buildENSName("abc.limo"));

    expect(result).toBe("unknown");
  });
});
