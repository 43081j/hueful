import { describe, expect, it } from 'vitest';
import { toAlpha, toDegrees } from './units.js';

describe('toAlpha', () => {
  it('returns unitless values as-is', () => {
    expect(toAlpha(0.5, null)).toBe(0.5);
  });

  it('converts percentages to the 0-1 range', () => {
    expect(toAlpha(50, '%')).toBe(0.5);
    expect(toAlpha(0, '%')).toBe(0);
    expect(toAlpha(100, '%')).toBe(1);
  });

  it('does not clamp out of range values', () => {
    expect(toAlpha(150, '%')).toBe(1.5);
    expect(toAlpha(-1, null)).toBe(-1);
  });
});

describe('toDegrees', () => {
  it('treats unitless values as degrees', () => {
    expect(toDegrees(90, null)).toBe(90);
  });

  it('returns degrees as-is', () => {
    expect(toDegrees(90, 'deg')).toBe(90);
  });

  it('converts radians', () => {
    expect(toDegrees(Math.PI, 'rad')).toBeCloseTo(180, 10);
    expect(toDegrees(Math.PI / 2, 'rad')).toBeCloseTo(90, 10);
  });

  it('converts gradians', () => {
    expect(toDegrees(100, 'grad')).toBe(90);
    expect(toDegrees(400, 'grad')).toBe(360);
  });

  it('converts turns', () => {
    expect(toDegrees(0.5, 'turn')).toBe(180);
    expect(toDegrees(1, 'turn')).toBe(360);
  });

  it('does not normalise values outside 0-360', () => {
    expect(toDegrees(2, 'turn')).toBe(720);
    expect(toDegrees(-90, 'deg')).toBe(-90);
  });
});
