import type { Coords } from '../math.js';
import { hueChannel, parseColor, percentChannel } from '../parser.js';
import * as rgb from './rgb.js';

export const channelCount = 3;

type HSL = readonly [h: number, s: number, l: number];
type HSLAlpha = readonly [...HSL, alpha?: number];

const names = ['hsl', 'hsla'];

export function parse(input: string): HSLAlpha | null {
  return parseColor(
    input,
    names,
    hueChannel,
    percentChannel,
    percentChannel,
    true,
  );
}

export const format: (...args: HSLAlpha) => string = (h, s, l, alpha) => {
  const hsl = `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
  if (alpha === undefined || alpha === 1) {
    return `hsl(${hsl})`;
  }
  return `hsl(${hsl} / ${alpha})`;
};

/**
 * Converts HSL to 0-255 sRGB channels.
 */
export const toRGB: (...args: HSL) => Coords = (h, s, l) => {
  h = h % 360;
  if (h < 0) {
    h += 360;
  }
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number): number => {
    const k = (n + h / 30) % 12;
    return (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255;
  };
  return [f(0), f(8), f(4)];
};

/**
 * Converts 0-255 sRGB channels to HSL. Achromatic colours have a hue of 0.
 */
export const fromRGB: (...args: Coords) => HSL = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (min + max) / 2;
  let h = 0;
  let s = 0;

  if (d !== 0) {
    s = l === 0 || l === 1 ? 0 : (max - l) / Math.min(l, 1 - l);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }

  if (s < 0) {
    h += 180;
    s = -s;
  }
  if (h >= 360) {
    h -= 360;
  }
  if (s <= 1e-5) {
    h = 0;
  }

  return [h, s * 100, l * 100];
};

export const toXYZ: (...args: HSL) => Coords = (h, s, l) => {
  return rgb.toXYZ(...toRGB(h, s, l));
};

export const fromXYZ: (...args: Coords) => HSL = (x, y, z) => {
  return fromRGB(...rgb.fromXYZ(x, y, z));
};
