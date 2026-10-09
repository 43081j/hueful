import { convert, type ParsedColor } from './convert.js';
import type { Space } from './spaces/index.js';
import * as rgb from './spaces/rgb.js';

// Luminance at which a colour has equal contrast against black and white
const darkThreshold = Math.sqrt(1.05 * 0.05) - 0.05;

/**
 * Computes WCAG relative luminance
 */
export function luminance<T extends Space>(
  space: T,
  color: ParsedColor<T>,
): number {
  const [r, g, b] = convert(space, 'rgb', color);
  return rgb.toXYZ(r, g, b)[1];
}

/**
 * Computes the WCAG 2 contrast ratio between two colours
 */
export function contrast<T extends Space>(
  space: T,
  a: ParsedColor<T>,
  b: ParsedColor<T>,
): number {
  const la = luminance(space, a);
  const lb = luminance(space, b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Computes the WCAG 2 level
 */
export function contrastLevel<T extends Space>(
  space: T,
  a: ParsedColor<T>,
  b: ParsedColor<T>,
): 'AAA' | 'AA' | null {
  const ratio = contrast(space, a, b);
  if (ratio >= 7) {
    return 'AAA';
  }
  if (ratio >= 4.5) {
    return 'AA';
  }
  return null;
}

/**
 * Whether a colour contrasts more against white than against black.
 */
export function isDark<T extends Space>(
  space: T,
  color: ParsedColor<T>,
): boolean {
  return luminance(space, color) < darkThreshold;
}

/**
 * Whether a colour contrasts at least as much against black as against
 * white.
 */
export function isLight<T extends Space>(
  space: T,
  color: ParsedColor<T>,
): boolean {
  return !isDark(space, color);
}
