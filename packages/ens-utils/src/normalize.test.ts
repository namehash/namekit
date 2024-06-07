import { describe, it, expect } from 'vitest';
import { beautifyLabel, isNormalizedLabel, normalizeLabel } from './normalize';

describe('normalizeLabel', () => {

  it('normalizes an empty label', () => {
    const label = '';
    const result = normalizeLabel(label);

    expect(result).toEqual('');
  });

  it('throws an Error if given more than 1 label', () => {
    const label = 'label1.label2';

    expect(() => {
      normalizeLabel(label);
    }).toThrow();
  });

  it('throws an Error if given a label that cannot be normalized', () => {
    const label = 'unnormalizable|label';

    expect(() => {
      normalizeLabel(label);
    }).toThrow();
  });

  it('normalizes a normalizable label', () => {
    const label = 'UNNORMALIZEDLABEL';
    const result = normalizeLabel(label);

    expect(result).toEqual('unnormalizedlabel');
  });

  it('normalizes a normalized label', () => {
    const label = 'normalizedlabel';
    const result = normalizeLabel(label);

    expect(result).toEqual(label);
  });

  it('properly handles cached errors', () => {
    const label = 'unnormalizable|label';

    try {
      normalizeLabel(label);
    } catch (error) {
      // ignore
    }

    expect(() => {
      normalizeLabel(label);
    }).toThrow();
  });

  it('properly handles cached normalizations', () => {
    const label = 'UNNORMALIZEDLABEL';

    let result = normalizeLabel(label);
    result = normalizeLabel(label);
    expect(result).toEqual('unnormalizedlabel');
  });
});

describe('beautifyLabel', () => {

  it('beautifies an empty label', () => {
    const label = '';
    const result = beautifyLabel(label);

    expect(result).toEqual('');
  });

  it('throws an Error if given more than 1 label', () => {
    const label = 'label1.label2';

    expect(() => {
      beautifyLabel(label);
    }).toThrow();
  });

  it('throws an Error if given a label that cannot be normalized', () => {
    const label = 'unnormalizable|label';

    expect(() => {
      beautifyLabel(label);
    }).toThrow();
  });

  it('beautifies a normalizable label', () => {
    const label = 'UNNORMALIZEDLABEL';
    const result = beautifyLabel(label);

    expect(result).toEqual('unnormalizedlabel');
  });

  it('beautifies a normalized label', () => {
    const label = 'normalizedlabel';
    const result = beautifyLabel(label);

    expect(result).toEqual(label);
  });

  it('beautifies a normalizable label where the beautified label is distinct from the normalized label', () => {
    const label = 'ξsk3ndEr';
    const result = beautifyLabel(label);

    expect(result).toEqual('Ξsk3nder');
  });

  it('properly handles cached errors', () => {
    const label = 'unnormalizable|label';

    try {
      beautifyLabel(label);
    } catch (error) {
      // ignore
    }

    expect(() => {
      beautifyLabel(label);
    }).toThrow();
  });

  it('properly handles cached beautifications', () => {
    const label = 'ξsk3ndEr';

    let result = beautifyLabel(label);
    result = beautifyLabel(label);
    expect(result).toEqual('Ξsk3nder');
  });
});

describe('isNormalizedLabel', () => {

  it('returns true for an empty label', () => {
    const label = '';
    const result = isNormalizedLabel(label);
    expect(result).toEqual(true);
  });

  it('returns false more than 1 label', () => {
    const label = 'label1.label2';
    const result = isNormalizedLabel(label);
    expect(result).toEqual(false);
  });

  it('returns false for a label that cannot be normalized', () => {
    const label = 'unnormalizable|label';
    const result = isNormalizedLabel(label);
    expect(result).toEqual(false);
  });

  it('returns false for a normalizable label', () => {
    const label = 'UNNORMALIZEDLABEL';
    const result = isNormalizedLabel(label);
    expect(result).toEqual(false);
  });

  it('returns true a normalized label', () => {
    const label = 'normalizedlabel';
    const result = isNormalizedLabel(label);
    expect(result).toEqual(true);
  });
});
