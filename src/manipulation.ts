import { convert, type ParsedColor } from './convert.js';
import { type Space, spaces } from './spaces/index.js';

function clampAlpha(alpha: number): number {
  return Math.min(1, Math.max(0, alpha));
}

function adjustOKLCH<T extends Space>(
  space: T,
  color: ParsedColor<T>,
  fn: (l: number, c: number, h: number) => [number, number, number],
): ParsedColor<T> {
  const [l, c, h, alpha] = convert(space, 'oklch', color);
  const transformed =
    alpha === undefined
      ? fn(l, c, h)
      : ([...fn(l, c, h), alpha] as [number, number, number, number?]);
  return convert('oklch', space, transformed);
}

/**
 * Increases OKLCH lightness by a ratio of its current value.
 */
export function lighten<T extends Space>(
  space: T,
  color: ParsedColor<T>,
  amount: number,
): ParsedColor<T> {
  return adjustOKLCH(space, color, (l, c, h) => [l * (1 + amount), c, h]);
}

/**
 * Decreases OKLCH lightness by a ratio of its current value.
 */
export function darken<T extends Space>(
  space: T,
  color: ParsedColor<T>,
  amount: number,
): ParsedColor<T> {
  return adjustOKLCH(space, color, (l, c, h) => [l * (1 - amount), c, h]);
}

/**
 * Increases OKLCH chroma by a ratio of its current value.
 */
export function saturate<T extends Space>(
  space: T,
  color: ParsedColor<T>,
  amount: number,
): ParsedColor<T> {
  return adjustOKLCH(space, color, (l, c, h) => [l, c * (1 + amount), h]);
}

/**
 * Decreases OKLCH chroma by a ratio of its current value.
 */
export function desaturate<T extends Space>(
  space: T,
  color: ParsedColor<T>,
  amount: number,
): ParsedColor<T> {
  return adjustOKLCH(space, color, (l, c, h) => [l, c * (1 - amount), h]);
}

/**
 * Removes all OKLCH chroma, keeping perceived lightness.
 */
export function grayscale<T extends Space>(
  space: T,
  color: ParsedColor<T>,
): ParsedColor<T> {
  return adjustOKLCH(space, color, (l) => [l, 0, 0]);
}

/**
 * Rotates the OKLCH hue by the given number of degrees.
 */
export function rotateHue<T extends Space>(
  space: T,
  color: ParsedColor<T>,
  degrees: number,
): ParsedColor<T> {
  return adjustOKLCH(space, color, (l, c, h) => {
    const hue = (h + degrees) % 360;
    return [l, c, hue < 0 ? hue + 360 : hue];
  });
}

/**
 * Decreases alpha by a ratio of its current value. A missing alpha is
 * treated as 1.
 */
export function fadeOut<T extends Space>(
  space: T,
  color: ParsedColor<T>,
  amount: number,
): ParsedColor<T> {
  const channelCount = spaces[space].channelCount;
  const alpha = (color[channelCount] ?? 1) * (1 - amount);
  const channels = color.slice(0, channelCount);
  return [...channels, clampAlpha(alpha)] as unknown as ParsedColor<T>;
}

/**
 * Increases alpha by a ratio of its current value. A missing alpha is
 * treated as fully opaque and left as is.
 */
export function fadeIn<T extends Space>(
  space: T,
  color: ParsedColor<T>,
  amount: number,
): ParsedColor<T> {
  const channelCount = spaces[space].channelCount;
  const alpha = color[channelCount];
  if (alpha === undefined) {
    return color;
  }
  const newAlpha = alpha * (1 + amount);
  const channels = color.slice(0, channelCount);
  return [...channels, clampAlpha(newAlpha)] as unknown as ParsedColor<T>;
}

/**
 * Mixes two colours of the same space in OKLab.
 * `weight` is the proportion of `b` in the result.
 */
export function mix<T extends Space>(
  space: T,
  a: ParsedColor<T>,
  b: ParsedColor<T>,
  weight = 0.5,
): ParsedColor<T> {
  const [al, aa, ab, aAlpha] = convert(space, 'oklab', a);
  const [bl, ba, bb, bAlpha] = convert(space, 'oklab', b);
  const aWeight = (aAlpha ?? 1) * (1 - weight);
  const bWeight = (bAlpha ?? 1) * weight;
  const alpha = aWeight + bWeight;
  const scale = alpha === 0 ? 0 : 1 / alpha;
  const mixed: [number, number, number] = [
    (al * aWeight + bl * bWeight) * scale,
    (aa * aWeight + ba * bWeight) * scale,
    (ab * aWeight + bb * bWeight) * scale,
  ];
  return convert(
    'oklab',
    space,
    aAlpha === undefined && bAlpha === undefined ? mixed : [...mixed, alpha],
  );
}
