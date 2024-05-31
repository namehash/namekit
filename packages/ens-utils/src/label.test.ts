import { describe, it, expect } from "vitest";
import { LabelComparisonStrategy, LabelSeparatorInterpretationStrategy, buildLabel, labelsEqual } from "./label";
import { NormalizationStrategy } from "./normalize";
import { build } from "tsup";
import { EncodedLabelHashInterpretationStrategy } from "./labelhash";

describe('buildLabel', () => {

  it('builds normalized result for an empty label', () => {
    const label = '';

    const result = buildLabel(label);

    expect(result).toEqual({
      "displayLabel": "",
      "label": "",
      "labelHash": {
        "labelHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      },
      "normalization": "normalized",
    });
  });

  it('throws an Error if the label contains a LABEL_SEPERATOR', () => {
    const label = 'label1.label2';

    expect(() => {
      buildLabel(label);
    }).toThrow();
  });

  it('allows labels containing one or more LABEL_SEPERATOR if using LabelSeparatorInterpretationStrategy.Literal', () => {
    const label = 'label1.label2..label4';
    const options = {
      labelSeparatorInterpretationStrategy: LabelSeparatorInterpretationStrategy.Literal,
    };

    const result = buildLabel(label, options);

    expect(result).toEqual({
      "displayLabel": "[9878f061d9983580fa42934852f0adb52d6a3c8d3904dfffaaf8c20bba517246]",
      "label": "label1.label2..label4",
      "labelHash": {
        "labelHash": "0x9878f061d9983580fa42934852f0adb52d6a3c8d3904dfffaaf8c20bba517246",
      },
      "normalization": "unnormalized",
    });
  });


  it('throws an Error if the label is not normalizable and using NormalizationStrategy.RequireNormalize', () => {
    const label = 'not|normalizable';

    const options = {
      normalizationStrategy: NormalizationStrategy.RequireNormalize,
    };

    expect(() => {
      buildLabel(label, options);
    }).toThrow();
  });

  it('throws an Error if the label is unnormalized and using NormalizationStrategy.RequireNormalize', () => {
    const label = 'UNNORMALIZED';

    const options = {
      normalizationStrategy: NormalizationStrategy.RequireNormalize,
    };

    expect(() => {
      buildLabel(label, options);
    }).toThrow();
  });

  it('throws an Error if the label is an encoded labelhash and using NormalizationStrategy.RequireNormalize', () => {
    const label = '[4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';

    const options = {
      normalizationStrategy: NormalizationStrategy.RequireNormalize,
    };

    expect(() => {
      buildLabel(label, options);
    }).toThrow();
  });

  it('returns normalized and beautified result if the label is normalized and using NormalizationStrategy.RequireNormalize', () => {
    const label = 'ξsk3nder';

    const options = {
      normalizationStrategy: NormalizationStrategy.RequireNormalize,
    };

    const result = buildLabel(label, options);

    expect(result).toEqual({
      "displayLabel": "Ξsk3nder",
      "label": "ξsk3nder",
      "labelHash": {
        "labelHash": "0x1ceadec2c14a126f4eb6bf58e232d9be85a632ccc479b831a856eacd6d702683",
      },
      "normalization": "normalized",
    });
  });

  it('returns unnormalized result if the label is not normalizable', () => {
    const label = 'not|normalizable';

    const result = buildLabel(label);

    expect(result).toEqual({
      "displayLabel": "[d76270204f767605a65ccb49fc43c2a9f3fcaf3e0022bfd19629338639ee6a24]",
      "label": "not|normalizable",
      "labelHash": {
        "labelHash": "0xd76270204f767605a65ccb49fc43c2a9f3fcaf3e0022bfd19629338639ee6a24",
      },
      "normalization": "unnormalized",
    });
  });

  it('returns normalized and beautified result if the label is unnormalized', () => {
    const label = 'ξsk3ndEr';

    const result = buildLabel(label);

    expect(result).toEqual({
      "displayLabel": "Ξsk3nder",
      "label": "ξsk3nder",
      "labelHash": {
        "labelHash": "0x1ceadec2c14a126f4eb6bf58e232d9be85a632ccc479b831a856eacd6d702683",
      },
      "normalization": "normalized",
    });
  });

  it('returns normalized and beautified result if the label is normalized', () => {
    const label = 'ξsk3nder';

    const result = buildLabel(label);

    expect(result).toEqual({
      "displayLabel": "Ξsk3nder",
      "label": "ξsk3nder",
      "labelHash": {
        "labelHash": "0x1ceadec2c14a126f4eb6bf58e232d9be85a632ccc479b831a856eacd6d702683",
      },
      "normalization": "normalized",
    });
  });

  it('returns unknown and beautified result if the label is an unnormalized encoded labelhash', () => {
    const label = '[0x4F5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';

    const result = buildLabel(label);

    expect(result).toEqual({
      "displayLabel": "[4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]",
      "label": "[4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]",
      "labelHash": {
        "labelHash": "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
      },
      "normalization": "unknown",
    });
  });

  it('returns unknown and beautified result if the label is an unnormalized encoded labelhash and using EncodedLabelHashInterpretationStrategy.UnknownLabel', () => {
    const label = '[0x4F5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';

    const options = {
      encodedLabelhashInterpretationStrategy: EncodedLabelHashInterpretationStrategy.UnknownLabel,
    };
    
    const result = buildLabel(label, options);

    expect(result).toEqual({
      "displayLabel": "[4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]",
      "label": "[4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]",
      "labelHash": {
        "labelHash": "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
      },
      "normalization": "unknown",
    });
  });

  it('returns unnormalized result if the label is an unnormalized encoded labelhash and using EncodedLabelHashInterpretationStrategy.Literal', () => {
    const label = '[0x4F5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';

    const options = {
      encodedLabelhashInterpretationStrategy: EncodedLabelHashInterpretationStrategy.Literal,
    };
    
    const result = buildLabel(label, options);

    expect(result).toEqual({
      "displayLabel": "[35cdc4a2eebddc1a3425b1f6afb2dc96a73951c3c057cb53848a34a33753e546]",
      "label": "[0x4F5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]",
      "labelHash": {
        "labelHash": "0x35cdc4a2eebddc1a3425b1f6afb2dc96a73951c3c057cb53848a34a33753e546",
      },
      "normalization": "unnormalized",
    });
  });


  it('returns unnormalized result if the label is unnormalized and using NormalizationStrategy.SkipNormalize', () => {
    const label = 'ξsk3ndEr';

    const options = {
      normalizationStrategy: NormalizationStrategy.SkipNormalize,
    };

    const result = buildLabel(label, options);

    expect(result).toEqual({
      "displayLabel": "[dc2c24215c5d1f25994d74c586038a016a0f3ce46f7f6ef944810554a97bc3b9]",
      "label": "ξsk3ndEr",
      "labelHash": {
        "labelHash": "0xdc2c24215c5d1f25994d74c586038a016a0f3ce46f7f6ef944810554a97bc3b9",
      },
      "normalization": "unnormalized",
    });
  });

  it('returns unknown and unbeautified result if the label is an unnormalized encoded labelhash and using NormalizationStrategy.SkipNormalize', () => {
    const label = '[0x4F5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';

    const options = {
      normalizationStrategy: NormalizationStrategy.SkipNormalize,
    };

    const result = buildLabel(label, options);

    expect(result).toEqual({
      "displayLabel": label,
      "label": label,
      "labelHash": {
        "labelHash": "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
      },
      "normalization": "unknown",
    });
  });

});


describe('labelsEqual', () => {

  it('returns false for labels with unequal hashes and unequal label values when using LabelComparisonStrategy.LabelHashOnly', () => {
    const label1 = buildLabel('test1');
    const label2 = buildLabel('test2');

    expect(label1.label).not.toEqual(label2.label);
    expect(label1.labelHash).not.toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2, LabelComparisonStrategy.LabelHashOnly)).toEqual(false);
  });

  it('returns false for labels with unequal hashes and unequal label values when using LabelComparisonStrategy.LabelValueOnly', () => {
    const label1 = buildLabel('test1');
    const label2 = buildLabel('test2');

    expect(label1.label).not.toEqual(label2.label);
    expect(label1.labelHash).not.toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2, LabelComparisonStrategy.LabelValueOnly)).toEqual(false);
  });

  it('returns false for labels with unequal hashes and unequal label values when using LabelComparisonStrategy.FullEquality (as default)', () => {
    const label1 = buildLabel('test1');
    const label2 = buildLabel('test2');

    expect(label1.label).not.toEqual(label2.label);
    expect(label1.labelHash).not.toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2)).toEqual(false);
  });

  it('returns true for labels with equal hashes but unequal label values when using LabelComparisonStrategy.LabelHashOnly', () => {
    const label = 'test';
    const label1 = buildLabel(label);
    const label2 = buildLabel(`[${label1.labelHash.labelHash}]`);

    expect(label1.label).not.toEqual(label2.label);
    expect(label1.labelHash).toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2, LabelComparisonStrategy.LabelHashOnly)).toEqual(true);
  });

  it('returns false for labels with equal hashes but unequal label values when using LabelComparisonStrategy.LabelValueOnly', () => {
    const label = 'test';
    const label1 = buildLabel(label);
    const label2 = buildLabel(`[${label1.labelHash.labelHash}]`);

    expect(label1.label).not.toEqual(label2.label);
    expect(label1.labelHash).toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2, LabelComparisonStrategy.LabelValueOnly)).toEqual(false);
  });

  it('returns false for labels with equal hashes but unequal label values when using LabelComparisonStrategy.FullEquality (as default)', () => {
    const label = 'test';
    const label1 = buildLabel(label);
    const label2 = buildLabel(`[${label1.labelHash.labelHash}]`);

    expect(label1.label).not.toEqual(label2.label);
    expect(label1.labelHash).toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2)).toEqual(false);
  });

  it('returns false for labels with equal values but unequal hashes when using LabelComparisonStrategy.LabelHashOnly', () => {
    const label = '[4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';
    const label1 = buildLabel(label, {
      encodedLabelhashInterpretationStrategy: EncodedLabelHashInterpretationStrategy.Literal,
    });
    const label2 = buildLabel(label, {
      encodedLabelhashInterpretationStrategy: EncodedLabelHashInterpretationStrategy.UnknownLabel,
    });

    expect(label1.label).toEqual(label2.label);
    expect(label1.labelHash).not.toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2, LabelComparisonStrategy.LabelHashOnly)).toEqual(false);
  });

  it('returns true for labels with equal values but unequal hashes when using LabelComparisonStrategy.LabelValueOnly', () => {
    const label = '[4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';
    const label1 = buildLabel(label, {
      encodedLabelhashInterpretationStrategy: EncodedLabelHashInterpretationStrategy.Literal,
    });
    const label2 = buildLabel(label, {
      encodedLabelhashInterpretationStrategy: EncodedLabelHashInterpretationStrategy.UnknownLabel,
    });

    expect(label1.label).toEqual(label2.label);
    expect(label1.labelHash).not.toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2, LabelComparisonStrategy.LabelValueOnly)).toEqual(true);
  });

  it('returns false for labels with equal values but unequal hashes when using LabelComparisonStrategy.FullEquality (as default)', () => {
    const label = '[4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0]';
    const label1 = buildLabel(label, {
      encodedLabelhashInterpretationStrategy: EncodedLabelHashInterpretationStrategy.Literal,
    });
    const label2 = buildLabel(label, {
      encodedLabelhashInterpretationStrategy: EncodedLabelHashInterpretationStrategy.UnknownLabel,
    });

    expect(label1.label).toEqual(label2.label);
    expect(label1.labelHash).not.toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2)).toEqual(false);
  });

  it('returns true for labels with equal hashes and equal label values when using LabelComparisonStrategy.LabelHashOnly', () => {
    const label1 = buildLabel('test');
    const label2 = buildLabel('test');

    expect(label1.label).toEqual(label2.label);
    expect(label1.labelHash).toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2, LabelComparisonStrategy.LabelHashOnly)).toEqual(true);
  });

  it('returns true for labels with equal hashes and equal label values when using LabelComparisonStrategy.LabelValueOnly', () => {
    const label1 = buildLabel('test');
    const label2 = buildLabel('test');

    expect(label1.label).toEqual(label2.label);
    expect(label1.labelHash).toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2, LabelComparisonStrategy.LabelValueOnly)).toEqual(true);
  });

  it('returns true for labels with equal hashes and equal label values when using LabelComparisonStrategy.FullEquality (as default)', () => {
    const label1 = buildLabel('test');
    const label2 = buildLabel('test');

    expect(label1.label).toEqual(label2.label);
    expect(label1.labelHash).toEqual(label2.labelHash);
    expect(labelsEqual(label1, label2)).toEqual(true);
  });

});