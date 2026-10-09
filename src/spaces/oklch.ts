import { type Coords, fromPolar, toPolar } from '../math.js';
import { hueChannel, parseColor, scaledChannel } from '../parser.js';
import * as oklab from './oklab.js';

export const channelCount = 3;

type OKLCH = readonly [l: number, c: number, h: number];
type OKLCHAlpha = readonly [...OKLCH, alpha?: number];

const names = ['oklch'];
const lightnessChannel = scaledChannel(1);
const chromaChannel = scaledChannel(0.4);

export function parse(input: string): OKLCHAlpha | null {
  return parseColor(input, names, lightnessChannel, chromaChannel, hueChannel);
}

export const format: (...args: OKLCHAlpha) => string = (l, c, h, alpha) => {
  if (alpha === undefined || alpha === 1) {
    return `oklch(${l} ${c} ${h})`;
  }
  return `oklch(${l} ${c} ${h} / ${alpha})`;
};

export const toOKLab: (...args: OKLCH) => Coords = (l, c, h) => {
  return [l, ...fromPolar(c, h)];
};

/**
 * Converts OKLab to OKLCH. Achromatic colours have a hue of 0.
 */
export const fromOKLab: (...args: Coords) => OKLCH = (l, a, b) => {
  return [l, ...toPolar(a, b, 0.000004)];
};

export const toXYZ: (...args: OKLCH) => Coords = (l, c, h) => {
  return oklab.toXYZ(...toOKLab(l, c, h));
};

export const fromXYZ: (...args: Coords) => OKLCH = (x, y, z) => {
  return fromOKLab(...oklab.fromXYZ(x, y, z));
};
