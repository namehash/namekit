/**
 * Map from string -> ValueType with a LRU (Least recently used) eviction policy.
 *
 * @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
 */
export class LruStringMap<ValueType> extends Map<string, ValueType> {
  public readonly maxSize: number;

  public constructor(maxSize: number) {
    super();

    if (maxSize < 0) throw new Error(`LruMap requires maxSize greater than 0 but maxSize of ${maxSize} requested`);

    this.maxSize = maxSize;
  }

  public override set(key: string, value: ValueType) {
    super.set(key, value);

    if (this.size > this.maxSize) {
      const oldestKey = this.keys().next().value;
      this.delete(oldestKey);
    }

    return this;
  }

  public override get(key: string) {
    const value = super.get(key);
    if (value) {
      // The key is already in the cache, move it to the end (most recent)
      this.delete(key);
      this.set(key, value);
    }
    return value;
  }
}