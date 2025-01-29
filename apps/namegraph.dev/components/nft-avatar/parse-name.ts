import { keccak256, labelhash } from "viem";

const initialNode =
  "0000000000000000000000000000000000000000000000000000000000000000";

export const namehash = (inputName: string): string => {
  let node = initialNode;
  if (inputName) {
    const labels = inputName.split(".");
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelSha = keccak(labels[i]);
      node = keccak(Buffer.from(node + labelSha, "hex"));
    }
  }
  return "0x" + node;
};

const keccak = (input: Buffer | string) => {
  let out = null;
  if (Buffer.isBuffer(input)) {
    out = keccak256(input);
  } else {
    out = labelhash(input);
  }
  return out.slice(2); // cut 0x
};
