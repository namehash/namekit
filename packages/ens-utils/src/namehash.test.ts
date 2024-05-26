import { describe, it, expect } from "vitest";
import { ENS_ROOT_NODE, isEqualNodes, namehash } from "./namehash";
import { isKeccak256Hash } from "./hashutils";

describe("namehash", () => {

  it("returns the expected node for ENS root", () => {
    const name = "";
    const result = namehash(name);
    
    expect(result).toStrictEqual(ENS_ROOT_NODE);
  });

  it("returns values that are valid keccak-256 hashes", () => {
    const name = "namehash.eth";
    const node = namehash(name);
    const result = isKeccak256Hash(node.node);
    
    expect(result).toStrictEqual(true);
  });

  it("returns different values for normalized / unnormalized versions of a name", () => {
    const unnormalizedName = "NAMEHASH.ETH";
    const unnormalizedNode = namehash(unnormalizedName);

    const normalizedName = "namehash.eth";
    const normalizedNode = namehash(normalizedName);

    const result = isEqualNodes(unnormalizedNode, normalizedNode);
    
    expect(result).toStrictEqual(false);
  });

});