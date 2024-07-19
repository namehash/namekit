
export const BigIntSerializer = {
  test: (val) => typeof val === 'bigint',
  print: (val) => `${val.toString()}n`,
};
