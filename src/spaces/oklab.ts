import { type Coords, multiply } from '../math.js';
import { lmsToOKLab, lmsToXYZ, oklabToLMS, xyzToLMS } from '../matrices.js';
import { parseColor, scaledChannel } from '../parser.js';

const names = ['oklab'];
const lightnessChannel = scaledChannel(1);
const abChannel = scaledChannel(0.4);

export function parse(
  input: string,
): [l: number, a: number, b: number, alpha?: number] | null {
  return parseColor(input, names, lightnessChannel, abChannel, abChannel);
}

export function format(
  l: number,
  a: number,
  b: number,
  alpha?: number,
): string {
  if (alpha === undefined || alpha === 1) {
    return `oklab(${l} ${a} ${b})`;
  }
  return `oklab(${l} ${a} ${b} / ${alpha})`;
}

export function toXYZ(l: number, a: number, b: number): Coords {
  const [lc, mc, sc] = multiply(oklabToLMS, l, a, b);
  return multiply(lmsToXYZ, lc ** 3, mc ** 3, sc ** 3);
}

export function fromXYZ(x: number, y: number, z: number): Coords {
  const [lc, mc, sc] = multiply(xyzToLMS, x, y, z);
  return multiply(lmsToOKLab, Math.cbrt(lc), Math.cbrt(mc), Math.cbrt(sc));
}
