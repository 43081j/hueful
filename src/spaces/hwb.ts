import { parseComponent, parseFunction } from '../parse.js';
import { alphaUnits, angleUnits, toAlpha, toDegrees } from '../units.js';

const names = ['hwb'];
const percentUnits = ['%'];

export function parse(
  input: string,
): [h: number, w: number, b: number, alpha?: number] | null {
  const args = parseFunction(input, names);
  if (args === null) {
    return null;
  }

  const hue = parseComponent(args[0]!, angleUnits);
  const whiteness = parseComponent(args[1]!, percentUnits);
  const blackness = parseComponent(args[2]!, percentUnits);
  if (hue === null || whiteness === null || blackness === null) {
    return null;
  }

  const h = toDegrees(hue[0], hue[1]);

  if (args[3] === undefined) {
    return [h, whiteness[0], blackness[0]];
  }

  const alpha = parseComponent(args[3], alphaUnits);
  if (alpha === null) {
    return null;
  }
  const a = toAlpha(alpha[0], alpha[1]);

  return [h, whiteness[0], blackness[0], a];
}

export function format(
  h: number,
  w: number,
  b: number,
  alpha?: number,
): string {
  const hwb = `${Math.round(h)} ${Math.round(w)}% ${Math.round(b)}%`;
  if (alpha === undefined || alpha === 1) {
    return `hwb(${hwb})`;
  }
  return `hwb(${hwb} / ${alpha})`;
}
