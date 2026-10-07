import { parseComponent, parseFunction } from '../parse.js';
import { alphaUnits, angleUnits, toAlpha, toDegrees } from '../units.js';

const names = ['oklch'];
const percentUnits = ['%'];

/** Percentage reference range for lightness (100% = 1). */
const lightnessPercentScale = 1 / 100;

/** Percentage reference range for chroma (100% = 0.4). */
const chromaPercentScale = 0.4 / 100;

export function parse(
  input: string,
): [l: number, c: number, h: number, alpha?: number] | null {
  const args = parseFunction(input, names);
  if (args === null) {
    return null;
  }

  const lightness = parseComponent(args[0]!, percentUnits);
  const chroma = parseComponent(args[1]!, percentUnits);
  const hue = parseComponent(args[2]!, angleUnits);
  if (lightness === null || chroma === null || hue === null) {
    return null;
  }

  const l =
    lightness[1] === '%' ? lightness[0] * lightnessPercentScale : lightness[0];
  const c = chroma[1] === '%' ? chroma[0] * chromaPercentScale : chroma[0];
  const h = toDegrees(hue[0], hue[1]);

  if (args[3] === undefined) {
    return [l, c, h];
  }

  const alpha = parseComponent(args[3], alphaUnits);
  if (alpha === null) {
    return null;
  }
  const a = toAlpha(alpha[0], alpha[1]);

  return [l, c, h, a];
}

export function format(
  l: number,
  c: number,
  h: number,
  alpha?: number,
): string {
  if (alpha === undefined || alpha === 1) {
    return `oklch(${l} ${c} ${h})`;
  }
  return `oklch(${l} ${c} ${h} / ${alpha})`;
}
