import { parseComponent, parseFunction } from '../parse.js';
import { angleUnits, toDegrees } from '../units.js';

const names = ['hsl', 'hsla'];
const percentUnits = ['%'];

export function parse(
  input: string,
): [h: number, s: number, l: number, alpha?: number] | null {
  const args = parseFunction(input, names, true);
  if (args === null) {
    return null;
  }

  const hue = parseComponent(args[0]!, angleUnits);
  const saturation = parseComponent(args[1]!, percentUnits);
  const lightness = parseComponent(args[2]!, percentUnits);
  if (hue === null || saturation === null || lightness === null) {
    return null;
  }

  const h = toDegrees(hue[0], hue[1]);

  if (args[3] === undefined) {
    return [h, saturation[0], lightness[0]];
  }

  const alpha = parseComponent(args[3], percentUnits);
  if (alpha === null) {
    return null;
  }
  const a = alpha[1] === '%' ? alpha[0] / 100 : alpha[0];

  return [h, saturation[0], lightness[0], a];
}

export function format(
  h: number,
  s: number,
  l: number,
  alpha?: number,
): string {
  const hsl = `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
  if (alpha === undefined || alpha === 1) {
    return `hsl(${hsl})`;
  }
  return `hsl(${hsl} / ${alpha})`;
}
