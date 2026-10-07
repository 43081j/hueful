import { describe, expect, it } from 'vitest';
import {
  contrast,
  contrastLevel,
  isDark,
  isLight,
  luminance,
} from './analysis.js';

describe('luminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(luminance('rgb', [0, 0, 0])).toBeCloseTo(0, 6);
    expect(luminance('rgb', [255, 255, 255])).toBeCloseTo(1, 6);
  });

  it('matches WCAG for pure red', () => {
    expect(luminance('rgb', [255, 0, 0])).toBeCloseTo(0.2126, 4);
  });

  it('accepts other spaces', () => {
    expect(luminance('hsl', [0, 100, 50])).toBeCloseTo(0.2126, 4);
  });
});

describe('contrast', () => {
  it('is 21 between black and white', () => {
    expect(contrast('rgb', [0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 4);
  });

  it('is symmetric', () => {
    const a = [255, 136, 0] as const;
    const b = [20, 40, 60] as const;
    expect(contrast('rgb', a, b)).toBeCloseTo(contrast('rgb', b, a), 10);
  });
});

describe('contrastLevel', () => {
  it('classifies ratios', () => {
    expect(contrastLevel('rgb', [0, 0, 0], [255, 255, 255])).toBe('AAA');
    expect(contrastLevel('rgb', [118, 118, 118], [255, 255, 255])).toBe('AA');
    expect(contrastLevel('rgb', [200, 200, 200], [255, 255, 255])).toBe(null);
  });
});

describe('isDark / isLight', () => {
  it('classifies colours', () => {
    expect(isDark('rgb', [0, 0, 128])).toBe(true);
    expect(isLight('rgb', [255, 255, 0])).toBe(true);
    expect(isDark('rgb', [255, 255, 0])).toBe(false);
  });
});
