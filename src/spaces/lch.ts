import {
  hueChannel,
  parseColor,
  percentChannel,
  scaledChannel,
} from '../parse.js';
import { type Coords, fromPolar, toPolar } from '../math.js';
import * as lab from './lab.js';

const names = ['lch'];
const chromaChannel = scaledChannel(150);

export function parse(
  input: string,
): [l: number, c: number, h: number, alpha?: number] | null {
  return parseColor(input, names, percentChannel, chromaChannel, hueChannel);
}

export function format(
  l: number,
  c: number,
  h: number,
  alpha?: number,
): string {
  if (alpha === undefined || alpha === 1) {
    return `lch(${l}% ${c} ${h})`;
  }
  return `lch(${l}% ${c} ${h} / ${alpha})`;
}

export function toLab(l: number, c: number, h: number): Coords {
  return [l, ...fromPolar(c, h)];
}

/**
 * Converts Lab to LCH. Achromatic colours have a hue of 0.
 */
export function fromLab(l: number, a: number, b: number): Coords {
  return [l, ...toPolar(a, b, 0.0015)];
}

export function toXYZ(l: number, c: number, h: number): Coords {
  return lab.toXYZ(...toLab(l, c, h));
}

export function fromXYZ(x: number, y: number, z: number): Coords {
  return fromLab(...lab.fromXYZ(x, y, z));
}
