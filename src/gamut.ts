import { convert, type ParsedColor } from './convert.js';
import { type Coords, fromPolar } from './math.js';
import { type Space, spaces } from './spaces/index.js';

// From the CSS spec
const JND = 0.02;
const EPSILON = 0.0001;
// Tolerance of floating point errors from converting through XYZ
const TOLERANCE = 1e-6;

function inSRGB(
  r: number,
  g: number,
  b: number,
  tolerance: number = 0,
): boolean {
  const min = -tolerance;
  const max = 255 + tolerance;
  return r >= min && r <= max && g >= min && g <= max && b >= min && b <= max;
}

function clip(r: number, g: number, b: number): Coords {
  return [
    Math.min(255, Math.max(0, r)),
    Math.min(255, Math.max(0, g)),
    Math.min(255, Math.max(0, b)),
  ];
}

function oklchToRGB(l: number, c: number, h: number): Coords {
  return [...spaces.rgb.fromXYZ(...spaces.oklch.toXYZ(l, c, h))];
}

// deltaEOK between an sRGB colour and an OKLCH colour.
function deltaEOK(rgb: Coords, l: number, c: number, h: number): number {
  const [l1, a1, b1] = spaces.oklab.fromXYZ(...spaces.rgb.toXYZ(...rgb));
  const [a2, b2] = fromPolar(c, h);
  return Math.hypot(l1 - l, a1 - a2, b1 - b2);
}

/**
 * CSS Color 4 binary search gamut mapping
 * See https://drafts.csswg.org/css-color-4/#binary-search-gamut-map-with-local-minde
 */
function mapOKLCHToSRGB(l: number, c: number, h: number): Coords {
  if (l >= 1) {
    return [255, 255, 255];
  }
  if (l <= 0) {
    return [0, 0, 0];
  }

  let clipped = clip(...oklchToRGB(l, c, h));
  let e = deltaEOK(clipped, l, c, h);
  if (e < JND) {
    return clipped;
  }

  let min = 0;
  let max = c;
  let minInGamut = true;
  while (max - min > EPSILON) {
    const chroma = (min + max) / 2;
    const current = oklchToRGB(l, chroma, h);
    if (minInGamut && inSRGB(...current)) {
      min = chroma;
      continue;
    }
    clipped = clip(...current);
    e = deltaEOK(clipped, l, chroma, h);
    if (e < JND) {
      if (JND - e < EPSILON) {
        return clipped;
      }
      minInGamut = false;
      min = chroma;
    } else {
      max = chroma;
    }
  }
  return clipped;
}

/**
 * Whether the colour can be displayed in sRGB, allowing for floating point
 * error.
 */
export function inGamut<T extends Space>(
  space: T,
  color: ParsedColor<T>,
): boolean {
  const [r, g, b] = convert(space, 'rgb', color);
  return inSRGB(r, g, b, TOLERANCE);
}

/**
 * Maps the colour into the sRGB gamut using the CSS Color 4 gamut mapping
 * algorithm. Colours already in gamut are returned unchanged.
 */
export function toGamut<T extends Space>(
  space: T,
  color: ParsedColor<T>,
): ParsedColor<T> {
  const [r, g, b] = convert(space, 'rgb', color);
  if (inSRGB(r, g, b)) {
    return color;
  }
  const [l, c, h, alpha] = convert(space, 'oklch', color);
  const mapped = mapOKLCHToSRGB(l, c, h);
  return convert(
    'rgb',
    space,
    alpha === undefined ? mapped : [...mapped, alpha],
  );
}
