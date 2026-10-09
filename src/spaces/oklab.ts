import { type Coords, multiply } from '../math.js';
import { lmsToOKLab, lmsToXYZ, oklabToLMS, xyzToLMS } from '../matrices.js';
import { parseColor, scaledChannel } from '../parser.js';

export const channelCount = 3;

type OKLab = readonly [l: number, a: number, b: number];
type OKLabAlpha = readonly [...OKLab, alpha?: number];

const names = ['oklab'];
const lightnessChannel = scaledChannel(1);
const abChannel = scaledChannel(0.4);

export function parse(input: string): OKLabAlpha | null {
  return parseColor(input, names, lightnessChannel, abChannel, abChannel);
}

export const format: (...args: OKLabAlpha) => string = (l, a, b, alpha) => {
  if (alpha === undefined || alpha === 1) {
    return `oklab(${l} ${a} ${b})`;
  }
  return `oklab(${l} ${a} ${b} / ${alpha})`;
};

export const toXYZ: (...args: OKLab) => Coords = (l, a, b) => {
  const [lc, mc, sc] = multiply(oklabToLMS, l, a, b);
  return multiply(lmsToXYZ, lc ** 3, mc ** 3, sc ** 3);
};

export const fromXYZ: (...args: Coords) => OKLab = (x, y, z) => {
  const [lc, mc, sc] = multiply(xyzToLMS, x, y, z);
  return multiply(lmsToOKLab, Math.cbrt(lc), Math.cbrt(mc), Math.cbrt(sc));
};
