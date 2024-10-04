# @namehash/nameguard

## 0.5.0

### Minor Changes

- [#315](https://github.com/namehash/namekit/pull/315) [`82e4dc0`](https://github.com/namehash/namekit/commit/82e4dc044ef9ccf8d44bc0617e3a77f9d7a94ca8) Thanks [@Carbon225](https://github.com/Carbon225)! - Added unicode_version field to ConsolidatedGraphemeGuardReport.

- [#420](https://github.com/namehash/namekit/pull/420) [`c2fdd5f`](https://github.com/namehash/namekit/commit/c2fdd5f83bc575bd1c7632503cc4da9d87c9da1a) Thanks [@djstrong](https://github.com/djstrong)! - Rename "NameGuard result" to "NameGuard report"

- [#387](https://github.com/namehash/namekit/pull/387) [`01236c9`](https://github.com/namehash/namekit/commit/01236c9e547cb0820b682c7064d73f85942698ae) Thanks [@djstrong](https://github.com/djstrong)! - Add a `computeNameGuardReport` parameter to the NameGuard API

### Patch Changes

- [#419](https://github.com/namehash/namekit/pull/419) [`3ce420c`](https://github.com/namehash/namekit/commit/3ce420ce297392f0285265fed01bd8abf2a68313) Thanks [@lightwalker-eth](https://github.com/lightwalker-eth)! - Fix build config

- [#419](https://github.com/namehash/namekit/pull/419) [`3ce420c`](https://github.com/namehash/namekit/commit/3ce420ce297392f0285265fed01bd8abf2a68313) Thanks [@lightwalker-eth](https://github.com/lightwalker-eth)! - Upgrade dependencies

- Updated dependencies [[`ba89172`](https://github.com/namehash/namekit/commit/ba89172f2d22fbb5a32f7b1939926d5e89f3b2cd), [`3ce420c`](https://github.com/namehash/namekit/commit/3ce420ce297392f0285265fed01bd8abf2a68313)]:
  - @namehash/ens-utils@1.17.0

## 0.4.0

### Minor Changes

- 1e677da: build changes
- f7524a8: Introduced uninspected NameGuard reports for performance optimization of exceptionally long names.
- ef3837d: Removed Normalization enum from @namehash/nameguard so unique source of this is @namehash/ens-utils

### Patch Changes

- Updated dependencies [d2b8319]
- Updated dependencies [1e677da]
- Updated dependencies [0156515]
- Updated dependencies [ef3837d]
  - @namehash/ens-utils@1.16.0

## 0.3.1

### Patch Changes

- cb6f36c: Refine package descriptions and homepage

## 0.3.0

### Minor Changes

- 88131ce: Update package descriptions and licenses

## 0.2.0

### Minor Changes

- 6ac5668: Publish changes

## 0.1.0

### Minor Changes

- 20f8676: use cross-fetch
- 6f59606: update license and included files
- 5a22ad2: Added option computeNameGuardReport. Changed network_name to be constant throughout the client lifetime.
