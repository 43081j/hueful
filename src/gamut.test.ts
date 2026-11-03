import { describe, expect, it } from 'vitest';
import type { ParsedColor } from './convert.js';
import { inGamut, toGamut } from './gamut.js';
import type { Space } from './spaces/index.js';

function expectClose(
  actual: ParsedColor<Space>,
  expected: ParsedColor<Space>,
): void {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((value, i) => expect(value).toBeCloseTo(expected[i]!, 4));
}

describe('inGamut', () => {
  it('accepts sRGB colours', () => {
    expect(inGamut('rgb', [255, 0, 0])).toBe(true);
    expect(inGamut('rgb', [0, 0, 0, 0.5])).toBe(true);
  });

  it('tolerates conversion error', () => {
    expect(inGamut('hsl', [0, 100, 50])).toBe(true);
    expect(inGamut('hwb', [240, 0, 0])).toBe(true);
    expect(inGamut('oklch', [1, 0, 0])).toBe(true);
    expect(inGamut('cmyk', [1, 1, 0, 0])).toBe(true);
  });

  it('rejects out of range colours', () => {
    expect(inGamut('rgb', [300, 0, 0])).toBe(false);
    expect(inGamut('rgb', [0, -1, 0])).toBe(false);
    expect(inGamut('oklch', [0.7, 0.4, 30])).toBe(false);
    expect(inGamut('lab', [50, 120, 0])).toBe(false);
  });
});

describe('toGamut', () => {
  it('returns in gamut colours unchanged', () => {
    const color: ParsedColor<'oklch'> = [0.6, 0.1, 200];
    expect(toGamut('oklch', color)).toBe(color);
  });

  it('reduces chroma, keeping lightness and hue', () => {
    const [l, c, h] = toGamut('oklch', [0.7, 0.4, 30]);
    expect(inGamut('oklch', [l, c, h])).toBe(true);
    expect(c).toBeLessThan(0.4);
    expect(c).toBeGreaterThan(0.1);
    expect(l).toBeCloseTo(0.7, 1);
    expect(Math.abs(h - 30)).toBeLessThan(2);
  });

  it('maps display-p3 yellow as in the spec example', () => {
    // color(display-p3 1 1 0), i.e. oklch(0.96476 0.24503 110.23), maps to
    // roughly oklch(0.96476 0.21094 110.23)
    const [l, c, h] = toGamut('oklch', [0.96476, 0.24503, 110.23]);
    expect(l).toBeCloseTo(0.965, 2);
    expect(c).toBeCloseTo(0.211, 2);
    expect(h).toBeCloseTo(110.2, 0);
  });

  it('maps lightness at or above 1 to white', () => {
    expectClose(toGamut('oklch', [1.2, 0.2, 30]), [1, 0, 0]);
    expectClose(toGamut('rgb', [300, 300, 300]), [255, 255, 255]);
  });

  it('maps lightness at or below 0 to black', () => {
    expectClose(toGamut('rgb', [-10, -10, -10]), [0, 0, 0]);
  });

  it('returns the input space and preserves alpha', () => {
    const result = toGamut('lch', [60, 150, 40, 0.5]);
    expect(result).toHaveLength(4);
    expect(result[3]).toBe(0.5);
    expect(inGamut('lch', result)).toBe(true);
  });

  it('clips colours inGamut tolerates', () => {
    expect(inGamut('rgb', [255.0000001, 0, 0])).toBe(true);
    const result = toGamut('rgb', [255.0000001, 0, 0]);
    expect(result[0]).toBe(255);
    expectClose(result, [255, 0, 0]);
  });

  it('maps rgb into 0-255', () => {
    const result = toGamut('rgb', [300, 0, 0]);
    for (const channel of result) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(255);
    }
  });

  it('handles cmyk via sRGB', () => {
    const result = toGamut('cmyk', [-0.2, 0, 0, 0]);
    expect(result).toHaveLength(4);
    expect(inGamut('cmyk', result)).toBe(true);
  });
});
