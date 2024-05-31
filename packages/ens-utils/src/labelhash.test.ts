import { describe, it, expect } from 'vitest';
import {
  EncodedLabelHashInterpretationStrategy,
  buildLabelHash,
  isEncodedLabelHash,
  normalizeEncodedLabelHashAsEncodedLabelHash,
  normalizeEncodedLabelHashAsLabelHash,
} from './labelhash';

describe('isEncodedLabelHash', () => {
  it('identifies valid encoded LabelHash: with prefix all lowercase', () => {
    const result = isEncodedLabelHash(
      '[0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]'
    );

    expect(result).toBe(true);
  });

  it('identifies valid encoded LabelHash: without prefix all lowercase', () => {
    const result = isEncodedLabelHash(
      '[0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]'
    );

    expect(result).toBe(true);
  });

  it('identifies valid encoded LabelHash: with prefix mixed case', () => {
    const result = isEncodedLabelHash(
      '[0X0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef]'
    );

    expect(result).toBe(true);
  });

  it('identifies valid encoded LabelHash: without prefix mixed case', () => {
    const result = isEncodedLabelHash(
      '[0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef]'
    );

    expect(result).toBe(true);
  });

  it('identifies invalid encoded LabelHash: too long', () => {
    const result = isEncodedLabelHash(
      '[0x0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef0]'
    );

    expect(result).toBe(false);
  });

  it('identifies invalid encoded LabelHash: too short', () => {
    const result = isEncodedLabelHash(
      '[0x0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcde]'
    );

    expect(result).toBe(false);
  });

  it('identifies invalid encoded LabelHash: invalid character', () => {
    const result = isEncodedLabelHash(
      '[0xx123456789ABCDEF0123456789abcdef0123456789abcdef0123456789abcdef]'
    );

    expect(result).toBe(false);
  });

  it('identifies invalid encoded LabelHash: missing square brackets', () => {
    const result = isEncodedLabelHash(
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    );

    expect(result).toBe(false);
  });

  it('identifies invalid encoded LabelHash: extra outside square brackets', () => {
    const result = isEncodedLabelHash(
      '[[0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef]]'
    );

    expect(result).toBe(false);
  });
});

describe('buildLabelHash', () => {
  it('builds correct result for an empty label', () => {
    const label = '';

    const result = buildLabelHash(label);

    expect(result).toEqual({
      labelHash:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    });
  });

  it('builds correct result for a non-empty label', () => {
    const label = 'eth';

    const result = buildLabelHash(label);

    expect(result).toEqual({
      labelHash:
        '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0',
    });
  });

  it('builds correct result for an unnormalized encoded labelhash', () => {
    const label =
      '[0x4F5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';

    const result = buildLabelHash(label);

    expect(result).toEqual({
      labelHash: `0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0`,
    });
  });

  it('builds correct result for an unnormalized encoded labelhash when given EncodedLabelHashInterpretationStrategy.Literal', () => {
    const label =
      '[4F5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';

    const result = buildLabelHash(label, {
      encodedLabelhashInterpretationStrategy:
        EncodedLabelHashInterpretationStrategy.Literal,
    });

    expect(result).toEqual({
      labelHash: `0x37943ea69176a53d6ef915cb332913579a4237e038c81cb46819692500228500`,
    });
  });
});

describe('normalizeEncodedLabelHashAsLabelHash', () => {

  it('throws an Error if given an invalid encoded labelhash', () => {
    const encodedLabelHash = 'notanencodedlabelhash';

    expect(() => {
      normalizeEncodedLabelHashAsLabelHash(encodedLabelHash);
    }).toThrow();
  });

  it('returns expected normalized labelhash', () => {
    const encodedLabelHash = '[4F5B812789FC606BE1B3B16908DB13FC7A9ADF7CA72641F84D75B47069D3D7F0]';

    const result = normalizeEncodedLabelHashAsLabelHash(encodedLabelHash);

    expect(result).toEqual('0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0');
  });
});

describe('normalizeEncodedLabelHashAsEncodedLabelHash', () => {

  it('throws an Error if given an invalid encoded labelhash', () => {
    const encodedLabelHash = 'notanencodedlabelhash';

    expect(() => {
      normalizeEncodedLabelHashAsEncodedLabelHash(encodedLabelHash);
    }).toThrow();
  });

  it('returns expected normalized encoded labelhash', () => {
    const encodedLabelHash = '[0x4F5B812789FC606BE1B3B16908DB13FC7A9ADF7CA72641F84D75B47069D3D7F0]';

    const result = normalizeEncodedLabelHashAsEncodedLabelHash(encodedLabelHash);

    expect(result).toEqual('[4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]');
  });
});