declare module "global" {
  interface BigInt {
    toJSON: () => string;
  }
}
