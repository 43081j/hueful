import {
  hueChannel,
  parseColor,
  percentChannel,
  scaledChannel,
} from '../parser.js';
import { type Coords, fromPolar, toPolar } from '../math.js';
import * as lab from './lab.js';

export const channelCount = 3;

type LCH = readonly [l: number, c: number, h: number];
type LCHAlpha = readonly [...LCH, alpha?: number];

const names = ['lch'];
const chromaChannel = scaledChannel(150);

export function parse(input: string): LCHAlpha | null {
  return parseColor(input, names, percentChannel, chromaChannel, hueChannel);
}

export const format: (...args: LCHAlpha) => string = (l, c, h, alpha) => {
  if (alpha === undefined || alpha === 1) {
    return `lch(${l}% ${c} ${h})`;
  }
  return `lch(${l}% ${c} ${h} / ${alpha})`;
};

export const toLab: (...args: LCH) => Coords = (l, c, h) => {
  return [l, ...fromPolar(c, h)];
};

/**
 * Converts Lab to LCH. Achromatic colours have a hue of 0.
 */
export const fromLab: (...args: Coords) => LCH = (l, a, b) => {
  return [l, ...toPolar(a, b, 0.0015)];
};

export const toXYZ: (...args: LCH) => Coords = (l, c, h) => {
  return lab.toXYZ(...toLab(l, c, h));
};

export const fromXYZ: (...args: Coords) => LCH = (x, y, z) => {
  return fromLab(...lab.fromXYZ(x, y, z));
};
