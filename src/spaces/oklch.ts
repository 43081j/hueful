import { type Coords, fromPolar, toPolar } from '../math.js';
import { hueChannel, parseColor, scaledChannel } from '../parser.js';
import * as oklab from './oklab.js';

const names = ['oklch'];
const lightnessChannel = scaledChannel(1);
const chromaChannel = scaledChannel(0.4);

export function parse(
  input: string,
): [l: number, c: number, h: number, alpha?: number] | null {
  return parseColor(input, names, lightnessChannel, chromaChannel, hueChannel);
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

export function toOKLab(l: number, c: number, h: number): Coords {
  return [l, ...fromPolar(c, h)];
}

/**
 * Converts OKLab to OKLCH. Achromatic colours have a hue of 0.
 */
export function fromOKLab(l: number, a: number, b: number): Coords {
  return [l, ...toPolar(a, b, 0.000004)];
}

export function toXYZ(l: number, c: number, h: number): Coords {
  return oklab.toXYZ(...toOKLab(l, c, h));
}

export function fromXYZ(x: number, y: number, z: number): Coords {
  return fromOKLab(...oklab.fromXYZ(x, y, z));
}
