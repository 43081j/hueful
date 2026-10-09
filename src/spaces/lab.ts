import { type Coords, multiply } from '../math.js';
import { d50ToD65, d65ToD50 } from '../matrices.js';
import { parseColor, percentChannel, scaledChannel } from '../parser.js';

export const channelCount = 3;

type Lab = readonly [l: number, a: number, b: number];
type LabAlpha = readonly [...Lab, alpha?: number];

const names = ['lab'];
const abChannel = scaledChannel(125);

export function parse(input: string): LabAlpha | null {
  return parseColor(input, names, percentChannel, abChannel, abChannel);
}

export const format: (...args: LabAlpha) => string = (l, a, b, alpha) => {
  if (alpha === undefined || alpha === 1) {
    return `lab(${l}% ${a} ${b})`;
  }
  return `lab(${l}% ${a} ${b} / ${alpha})`;
};

// D50 reference white
const white: Coords = [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585];

const epsilon = 216 / 24389;
const kappa = 24389 / 27;

function f(value: number): number {
  return value > epsilon ? Math.cbrt(value) : (kappa * value + 16) / 116;
}

function fInverse(value: number): number {
  const cubed = value ** 3;
  return cubed > epsilon ? cubed : (116 * value - 16) / kappa;
}

export const toXYZ: (...args: Lab) => Coords = (l, a, b) => {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  return multiply(
    d50ToD65,
    fInverse(fx) * white[0],
    (l > kappa * epsilon ? fy ** 3 : l / kappa) * white[1],
    fInverse(fz) * white[2],
  );
};

export const fromXYZ: (...args: Coords) => Lab = (x, y, z) => {
  const [x50, y50, z50] = multiply(d65ToD50, x, y, z);
  const fx = f(x50 / white[0]);
  const fy = f(y50 / white[1]);
  const fz = f(z50 / white[2]);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};
