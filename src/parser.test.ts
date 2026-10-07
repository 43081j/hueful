import { describe, expect, it } from 'vitest';
import {
  hueChannel,
  parseColor,
  parseComponent,
  parseFunction,
  percentChannel,
  scaledChannel,
} from './parser.js';
import { angleUnits } from './units.js';

describe('parseFunction', () => {
  const names = ['rgb', 'rgba'];

  it('parses space separated arguments', () => {
    expect(parseFunction('rgb(1 2 3)', names)).toEqual(['1', '2', '3']);
  });

  it('parses an alpha argument after a slash', () => {
    expect(parseFunction('rgb(1 2 3 / 0.5)', names)).toEqual([
      '1',
      '2',
      '3',
      '0.5',
    ]);
    expect(parseFunction('rgb(1 2 3/0.5)', names)).toEqual([
      '1',
      '2',
      '3',
      '0.5',
    ]);
  });

  it('matches function names case-insensitively', () => {
    expect(parseFunction('RGB(1 2 3)', names)).toEqual(['1', '2', '3']);
    expect(parseFunction('rgba(1 2 3)', names)).toEqual(['1', '2', '3']);
  });

  it('accepts any CSS whitespace between arguments', () => {
    expect(parseFunction('rgb(  1\t2\n3\r\f )', names)).toEqual([
      '1',
      '2',
      '3',
    ]);
  });

  it('returns null for unknown function names', () => {
    expect(parseFunction('hsl(1 2 3)', names)).toBeNull();
    expect(parseFunction('rgb (1 2 3)', names)).toBeNull();
  });

  it('returns null for malformed parentheses', () => {
    expect(parseFunction('rgb 1 2 3', names)).toBeNull();
    expect(parseFunction('rgb(1 2 3', names)).toBeNull();
    expect(parseFunction('rgb(1 2 3) ', names)).toBeNull();
  });

  it('returns null for too few or too many arguments', () => {
    expect(parseFunction('rgb()', names)).toBeNull();
    expect(parseFunction('rgb(1 2)', names)).toBeNull();
    expect(parseFunction('rgb(1 2 3 4)', names)).toBeNull();
    expect(parseFunction('rgb(1 2 / 0.5)', names)).toBeNull();
  });

  it('returns null for multiple slashes', () => {
    expect(parseFunction('rgb(1 2 3 / 0.5 / 1)', names)).toBeNull();
  });

  it('returns null for an empty alpha', () => {
    expect(parseFunction('rgb(1 2 3 /)', names)).toBeNull();
    expect(parseFunction('rgb(1 2 3 /  )', names)).toBeNull();
  });

  it('does not split on commas by default', () => {
    expect(parseFunction('rgb(1, 2, 3)', names)).toEqual(['1,', '2,', '3']);
  });

  describe('with allowCommas', () => {
    it('parses comma separated arguments', () => {
      expect(parseFunction('rgb(1, 2, 3)', names, true)).toEqual([
        '1',
        '2',
        '3',
      ]);
      expect(parseFunction('rgb(1,2,3)', names, true)).toEqual(['1', '2', '3']);
    });

    it('parses a fourth comma separated argument as alpha', () => {
      expect(parseFunction('rgb(1, 2, 3, 0.5)', names, true)).toEqual([
        '1',
        '2',
        '3',
        '0.5',
      ]);
    });

    it('still parses space separated arguments', () => {
      expect(parseFunction('rgb(1 2 3 / 0.5)', names, true)).toEqual([
        '1',
        '2',
        '3',
        '0.5',
      ]);
    });

    it('returns null for too many arguments', () => {
      expect(parseFunction('rgb(1, 2, 3, 0.5, 1)', names, true)).toBeNull();
      expect(parseFunction('rgb(1 2 3 4)', names, true)).toBeNull();
    });
  });
});

describe('parseComponent', () => {
  it('parses unitless numbers', () => {
    expect(parseComponent('50', ['%'])).toEqual([50, null]);
  });

  it('parses numbers in various forms', () => {
    expect(parseComponent('0.5', [])?.[0]).toBe(0.5);
    expect(parseComponent('.5', [])?.[0]).toBe(0.5);
    expect(parseComponent('-1', [])?.[0]).toBe(-1);
    expect(parseComponent('+1', [])?.[0]).toBe(1);
    expect(parseComponent('1e3', [])?.[0]).toBe(1000);
    expect(parseComponent('1E-2', [])?.[0]).toBe(0.01);
  });

  it('parses numbers with an allowed unit', () => {
    expect(parseComponent('50%', ['%'])).toEqual([50, '%']);
    expect(parseComponent('1.5turn', angleUnits)).toEqual([1.5, 'turn']);
  });

  it('lowercases units', () => {
    expect(parseComponent('90DEG', angleUnits)).toEqual([90, 'deg']);
  });

  it('resolves none to 0', () => {
    expect(parseComponent('none', [])).toEqual([0, null]);
    expect(parseComponent('NONE', [])).toEqual([0, null]);
  });

  it('returns null for units not in the allowed list', () => {
    expect(parseComponent('50px', ['%'])).toBeNull();
    expect(parseComponent('50%', [])).toBeNull();
  });

  it('returns null for invalid numbers', () => {
    expect(parseComponent('', [])).toBeNull();
    expect(parseComponent('abc', [])).toBeNull();
    expect(parseComponent('%', ['%'])).toBeNull();
    expect(parseComponent('1.', [])).toBeNull();
    expect(parseComponent('1e', [])).toBeNull();
    expect(parseComponent('1.2.3', [])).toBeNull();
    expect(parseComponent('--1', [])).toBeNull();
  });
});

describe('parseColor', () => {
  const lab = scaledChannel(125);

  it('parses channels without transforms', () => {
    expect(
      parseColor(
        'test(1 2% 3)',
        ['test'],
        percentChannel,
        percentChannel,
        percentChannel,
      ),
    ).toEqual([1, 2, 3]);
  });

  it('applies channel transforms', () => {
    expect(
      parseColor(
        'lch(50% 50% 0.5turn)',
        ['lch'],
        percentChannel,
        lab,
        hueChannel,
      ),
    ).toEqual([50, 62.5, 180]);
  });

  it('leaves unitless values untransformed in scaled channels', () => {
    expect(parseColor('lab(50 40 -20)', ['lab'], lab, lab, lab)).toEqual([
      50, 40, -20,
    ]);
  });

  it('parses alpha as a number or percentage', () => {
    expect(parseColor('lab(1 2 3 / 0.5)', ['lab'], lab, lab, lab)).toEqual([
      1, 2, 3, 0.5,
    ]);
    expect(parseColor('lab(1 2 3 / 25%)', ['lab'], lab, lab, lab)).toEqual([
      1, 2, 3, 0.25,
    ]);
  });

  it('resolves none channels to 0', () => {
    expect(parseColor('lab(none 2 3 / none)', ['lab'], lab, lab, lab)).toEqual([
      0, 2, 3, 0,
    ]);
  });

  it('parses legacy comma syntax when allowed', () => {
    expect(
      parseColor(
        'hsl(120, 50%, 50%, 0.5)',
        ['hsl'],
        hueChannel,
        percentChannel,
        percentChannel,
        true,
      ),
    ).toEqual([120, 50, 50, 0.5]);
  });

  it('returns null for legacy comma syntax when not allowed', () => {
    expect(
      parseColor(
        'hsl(120, 50%, 50%)',
        ['hsl'],
        hueChannel,
        percentChannel,
        percentChannel,
      ),
    ).toBeNull();
  });

  it('returns null when the function does not parse', () => {
    expect(parseColor('lab(1 2)', ['lab'], lab, lab, lab)).toBeNull();
    expect(parseColor('rgb(1 2 3)', ['lab'], lab, lab, lab)).toBeNull();
  });

  it('returns null for an invalid channel', () => {
    expect(parseColor('lab(1 2deg 3)', ['lab'], lab, lab, lab)).toBeNull();
    expect(parseColor('lch(1 2 3%)', ['lch'], lab, lab, hueChannel)).toBeNull();
  });

  it('returns null for an invalid alpha', () => {
    expect(parseColor('lab(1 2 3 / 1deg)', ['lab'], lab, lab, lab)).toBeNull();
    expect(parseColor('lab(1 2 3 / x)', ['lab'], lab, lab, lab)).toBeNull();
  });
});
