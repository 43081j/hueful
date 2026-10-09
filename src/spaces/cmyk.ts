import type { Coords } from '../math.js';
import { parseComponent, parseFunction } from '../parser.js';
import { alphaUnits, toAlpha } from '../units.js';
import * as rgb from './rgb.js';

export const channelCount = 4;

type CMYK = readonly [c: number, m: number, y: number, k: number];
type CMYKAlpha = readonly [...CMYK, alpha?: number];

const names = ['device-cmyk'];
const channelUnits = ['%'];

function parseChannel(token: string): number | null {
  const component = parseComponent(token, channelUnits);
  if (component === null) {
    return null;
  }
  return component[1] === '%' ? component[0] / 100 : component[0];
}

/**
 * Parses `device-cmyk(C M Y K[ / A])` into 0-1 channels.
 */
export function parse(input: string): CMYKAlpha | null {
  const args = parseFunction(input, names, false, 4);
  if (args === null) {
    return null;
  }

  const c = parseChannel(args[0]!);
  const m = parseChannel(args[1]!);
  const y = parseChannel(args[2]!);
  const k = parseChannel(args[3]!);
  if (c === null || m === null || y === null || k === null) {
    return null;
  }

  if (args[4] === undefined) {
    return [c, m, y, k];
  }

  const alpha = parseComponent(args[4], alphaUnits);
  if (alpha === null) {
    return null;
  }

  return [c, m, y, k, toAlpha(alpha[0], alpha[1])];
}

export const format: (...args: CMYKAlpha) => string = (c, m, y, k, alpha) => {
  const cmyk = [c, m, y, k].map((v) => `${Math.round(v * 100)}%`).join(' ');
  if (alpha === undefined || alpha === 1) {
    return `device-cmyk(${cmyk})`;
  }
  return `device-cmyk(${cmyk} / ${alpha})`;
};

/**
 * Converts 0-1 CMYK channels to 0-255 sRGB channels
 * @see {@link https://drafts.csswg.org/css-color-5/#cmyk-rgb}
 */
export const toRGB: (...args: CMYK) => Coords = (c, m, y, k) => {
  const scale = (1 - k) * 255;
  return [(1 - c) * scale, (1 - m) * scale, (1 - y) * scale];
};

/**
 * Converts 0-255 sRGB channels to 0-1 CMYK channels. Black has 0 for each
 * of cyan, magenta and yellow.
 */
export const fromRGB: (...args: Coords) => CMYK = (r, g, b) => {
  const max = Math.max(r, g, b) / 255;
  const k = 1 - max;
  if (max === 0) {
    return [0, 0, 0, 1];
  }
  return [1 - r / 255 / max, 1 - g / 255 / max, 1 - b / 255 / max, k];
};

export const toXYZ: (...args: CMYK) => Coords = (c, m, y, k) => {
  return rgb.toXYZ(...toRGB(c, m, y, k));
};

export const fromXYZ: (...args: Coords) => CMYK = (x, y, z) => {
  return fromRGB(...rgb.fromXYZ(x, y, z));
};
