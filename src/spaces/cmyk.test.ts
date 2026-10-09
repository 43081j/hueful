import { describe, expect, it } from 'vitest';
import { format, fromRGB, parse, toRGB } from './cmyk.js';

function expectClose(actual: readonly number[], expected: readonly number[]) {
  expect(actual).toHaveLength(expected.length);
  for (let i = 0; i < expected.length; i++) {
    expect(actual[i]).toBeCloseTo(expected[i]!);
  }
}

describe('parse', () => {
  it('parses numbers and percentages', () => {
    expect(parse('device-cmyk(0 0.81 0.81 0.3)')).toEqual([0, 0.81, 0.81, 0.3]);
    expect(parse('device-cmyk(0% 81% 81% 30%)')).toEqual([0, 0.81, 0.81, 0.3]);
  });

  it('parses alpha', () => {
    expect(parse('device-cmyk(0 0 0 1 / 0.5)')).toEqual([0, 0, 0, 1, 0.5]);
    expect(parse('device-cmyk(0 0 0 1 / 25%)')).toEqual([0, 0, 0, 1, 0.25]);
  });

  it('resolves none to 0', () => {
    expect(parse('DEVICE-CMYK(none 0 0 1 / none)')).toEqual([0, 0, 0, 1, 0]);
  });

  it('returns null for invalid input', () => {
    expect(parse('device-cmyk(0 0 0)')).toBeNull();
    expect(parse('device-cmyk(0 0 0 0 0)')).toBeNull();
    expect(parse('device-cmyk(0 0 0 1deg)')).toBeNull();
    expect(parse('cmyk(0 0 0 0)')).toBeNull();
    expect(parse('device-cmyk(0, 0.5, 1, 0)')).toBeNull();
  });
});

describe('format', () => {
  it('formats as percentages', () => {
    expect(format(0, 0.81, 0.81, 0.3)).toBe('device-cmyk(0% 81% 81% 30%)');
  });

  it('includes alpha when not opaque', () => {
    expect(format(0, 0, 0, 1, 1)).toBe('device-cmyk(0% 0% 0% 100%)');
    expect(format(0, 0, 0, 1, 0.5)).toBe('device-cmyk(0% 0% 0% 100% / 0.5)');
  });
});

describe('conversion', () => {
  it('converts to RGB', () => {
    expectClose(toRGB(0, 1, 1, 0), [255, 0, 0]);
    expectClose(toRGB(0, 0, 0, 1), [0, 0, 0]);
    expectClose(toRGB(0, 0.5, 1, 0.5), [127.5, 63.75, 0]);
  });

  it('converts from RGB', () => {
    expectClose(fromRGB(255, 0, 0), [0, 1, 1, 0]);
    expectClose(fromRGB(255, 255, 255), [0, 0, 0, 0]);
    expectClose(fromRGB(0, 0, 0), [0, 0, 0, 1]);
  });

  it('round trips through RGB', () => {
    expectClose(toRGB(...fromRGB(51, 102, 153)), [51, 102, 153]);
  });
});
