import type { Coords } from '../math.js';
import { hueChannel, parseColor, percentChannel } from '../parser.js';
import * as hsl from './hsl.js';
import * as rgb from './rgb.js';

export const channelCount = 3;

type HWB = readonly [h: number, w: number, b: number];
type HWBAlpha = readonly [...HWB, alpha?: number];

const names = ['hwb'];

export function parse(input: string): HWBAlpha | null {
  return parseColor(input, names, hueChannel, percentChannel, percentChannel);
}

export const format: (...args: HWBAlpha) => string = (h, w, b, alpha) => {
  const hwb = `${Math.round(h)} ${Math.round(w)}% ${Math.round(b)}%`;
  if (alpha === undefined || alpha === 1) {
    return `hwb(${hwb})`;
  }
  return `hwb(${hwb} / ${alpha})`;
};

/**
 * Converts HWB to 0-255 sRGB channels.
 */
export const toRGB: (...args: HWB) => Coords = (h, w, b) => {
  w /= 100;
  b /= 100;
  if (w + b >= 1) {
    const gray = (w / (w + b)) * 255;
    return [gray, gray, gray];
  }

  const scale = 1 - w - b;
  const offset = w * 255;
  const [r, g, bl] = hsl.toRGB(h, 100, 50);
  return [r * scale + offset, g * scale + offset, bl * scale + offset];
};

/**
 * Converts 0-255 sRGB channels to HWB. Achromatic colours have a hue of 0.
 */
export const fromRGB: (...args: Coords) => HWB = (r, g, b) => {
  const [h] = hsl.fromRGB(r, g, b);
  const w = Math.min(r, g, b) / 255;
  const bl = 1 - Math.max(r, g, b) / 255;
  return [h, w * 100, bl * 100];
};

/**
 * Increases whiteness by a ratio of its current value.
 */
export const whiten: (...args: [...HWB, amount: number]) => HWB = (
  h,
  w,
  b,
  amount,
) => {
  return [h, w * (1 + amount), b];
};

/**
 * Increases blackness by a ratio of its current value.
 */
export const blacken: (...args: [...HWB, amount: number]) => HWB = (
  h,
  w,
  b,
  amount,
) => {
  return [h, w, b * (1 + amount)];
};

export const toXYZ: (...args: HWB) => Coords = (h, w, b) => {
  return rgb.toXYZ(...toRGB(h, w, b));
};

export const fromXYZ: (...args: Coords) => HWB = (x, y, z) => {
  return fromRGB(...rgb.fromXYZ(x, y, z));
};
