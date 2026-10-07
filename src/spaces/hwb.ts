import type { Coords } from '../math.js';
import { hueChannel, parseColor, percentChannel } from '../parse.js';
import * as hsl from './hsl.js';
import * as rgb from './rgb.js';

const names = ['hwb'];

export function parse(
  input: string,
): [h: number, w: number, b: number, alpha?: number] | null {
  return parseColor(input, names, hueChannel, percentChannel, percentChannel);
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

/**
 * Converts HWB to 0-255 sRGB channels.
 */
export function toRGB(h: number, w: number, b: number): Coords {
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
}

/**
 * Converts 0-255 sRGB channels to HWB. Achromatic colours have a hue of 0.
 */
export function fromRGB(r: number, g: number, b: number): Coords {
  const [h] = hsl.fromRGB(r, g, b);
  const w = Math.min(r, g, b) / 255;
  const bl = 1 - Math.max(r, g, b) / 255;
  return [h, w * 100, bl * 100];
}

export function toXYZ(h: number, w: number, b: number): Coords {
  return rgb.toXYZ(...toRGB(h, w, b));
}

export function fromXYZ(x: number, y: number, z: number): Coords {
  return fromRGB(...rgb.fromXYZ(x, y, z));
}
