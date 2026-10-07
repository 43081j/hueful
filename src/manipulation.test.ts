import { describe, expect, it } from 'vitest';
import { convert } from './convert.js';
import {
  darken,
  desaturate,
  fadeIn,
  fadeOut,
  grayscale,
  lighten,
  mix,
  rotateHue,
  saturate,
} from './manipulation.js';
import type { ColorLike } from './types.js';

function expectClose(actual: ColorLike, expected: ColorLike): void {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((value, i) => expect(value).toBeCloseTo(expected[i]!, 4));
}

describe('lighten', () => {
  it('scales OKLCH lightness', () => {
    expectClose(lighten('oklch', [0.5, 0.1, 120], 0.2), [0.6, 0.1, 120]);
  });

  it('returns the input space and preserves alpha', () => {
    const red: ColorLike = [255, 0, 0, 0.5];
    const result = lighten('rgb', red, 0.1);
    const [l] = convert('rgb', 'oklch', red);
    const [rl] = convert('rgb', 'oklch', result);
    expect(rl).toBeCloseTo(l * 1.1, 6);
    expect(result[3]).toBe(0.5);
  });

  it('leaves black unchanged', () => {
    expectClose(lighten('rgb', [0, 0, 0], 0.5), [0, 0, 0]);
  });
});

describe('darken', () => {
  it('scales OKLCH lightness down', () => {
    expectClose(darken('oklch', [0.5, 0.1, 120], 0.2), [0.4, 0.1, 120]);
  });
});

describe('saturate / desaturate', () => {
  it('scales OKLCH chroma', () => {
    expectClose(saturate('oklch', [0.5, 0.1, 120], 0.5), [0.5, 0.15, 120]);
    expectClose(desaturate('oklch', [0.5, 0.1, 120], 0.5), [0.5, 0.05, 120]);
  });
});

describe('grayscale', () => {
  it('produces equal sRGB channels', () => {
    const [r, g, b] = grayscale('rgb', [255, 136, 0]);
    expect(r).toBeCloseTo(g, 4);
    expect(g).toBeCloseTo(b, 4);
  });
});

describe('rotateHue', () => {
  it('wraps around 360', () => {
    expectClose(rotateHue('oklch', [0.5, 0.1, 350], 20), [0.5, 0.1, 10]);
    expectClose(rotateHue('oklch', [0.5, 0.1, 10], -20), [0.5, 0.1, 350]);
  });
});

describe('fadeOut / fadeIn', () => {
  it('treats a missing alpha as opaque when fading out', () => {
    expect(fadeOut([1, 2, 3], 0.25)).toEqual([1, 2, 3, 0.75]);
  });

  it('leaves a missing alpha alone when fading in', () => {
    expect(fadeIn([1, 2, 3], 0.25)).toEqual([1, 2, 3]);
  });

  it('clamps alpha to 0-1', () => {
    expect(fadeIn([1, 2, 3, 0.8], 1)).toEqual([1, 2, 3, 1]);
    expect(fadeOut([1, 2, 3, 0.8], 2)).toEqual([1, 2, 3, 0]);
  });
});

describe('mix', () => {
  it('returns either input at the extremes', () => {
    expectClose(mix('rgb', [255, 0, 0], [0, 0, 255], 0), [255, 0, 0]);
    expectClose(mix('rgb', [255, 0, 0], [0, 0, 255], 1), [0, 0, 255]);
  });

  it('interpolates in OKLab', () => {
    expectClose(mix('oklab', [0.2, 0.1, -0.1], [0.8, -0.1, 0.1]), [0.5, 0, 0]);
  });

  it('uses premultiplied alpha', () => {
    expectClose(mix('oklab', [0.2, 0, 0, 1], [0.8, 0, 0, 0]), [0.2, 0, 0, 0.5]);
  });
});
