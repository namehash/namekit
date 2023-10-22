// using our own regex for this instead of viem's implementation of `isAddress`
// as we want "0X..." in uppercase to also be considered an address
const ethereumAddressRegex = /^0x[0-9a-f]{40}$/i;
const tokenIdRegex = /^((?:\d+)|(?:0x[0-9a-f]+))$/i;

export function isEthereumAddress(address: string) {
  return ethereumAddressRegex.test(address);
}
  
// TODO: Write tests
export function isTokenId(token_id: string) {
  return tokenIdRegex.test(token_id);
}

// TODO: Write tests
export function countGraphemes(str: string) {
  // TODO verify logic here
  return [...str].length;
}