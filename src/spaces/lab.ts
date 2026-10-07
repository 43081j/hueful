import { parseComponent, parseFunction } from '../parse.js';
import { alphaUnits, toAlpha } from '../units.js';

const names = ['lab'];
const percentUnits = ['%'];

/** Percentage reference range for the `a` and `b` axes (100% = 125). */
const abPercentScale = 125 / 100;

export function parse(
  input: string,
): [l: number, a: number, b: number, alpha?: number] | null {
  const args = parseFunction(input, names);
  if (args === null) {
    return null;
  }

  const lightness = parseComponent(args[0]!, percentUnits);
  const aAxis = parseComponent(args[1]!, percentUnits);
  const bAxis = parseComponent(args[2]!, percentUnits);
  if (lightness === null || aAxis === null || bAxis === null) {
    return null;
  }

  const l = lightness[0];
  const a = aAxis[1] === '%' ? aAxis[0] * abPercentScale : aAxis[0];
  const b = bAxis[1] === '%' ? bAxis[0] * abPercentScale : bAxis[0];

  if (args[3] === undefined) {
    return [l, a, b];
  }

  const alpha = parseComponent(args[3], alphaUnits);
  if (alpha === null) {
    return null;
  }
  const alphaValue = toAlpha(alpha[0], alpha[1]);

  return [l, a, b, alphaValue];
}

export function format(
  l: number,
  a: number,
  b: number,
  alpha?: number,
): string {
  if (alpha === undefined || alpha === 1) {
    return `lab(${l}% ${a} ${b})`;
  }
  return `lab(${l}% ${a} ${b} / ${alpha})`;
}
