import { convert } from './convert.js';
import type { Space } from './spaces/index.js';
import type { ColorLike } from './types.js';

function withAlpha(coords: ColorLike, alpha: number | undefined): ColorLike {
  return alpha === undefined
    ? [coords[0], coords[1], coords[2]]
    : [coords[0], coords[1], coords[2], alpha];
}

function clampAlpha(alpha: number): number {
  return Math.min(1, Math.max(0, alpha));
}

function adjustOKLCH(
  space: Space,
  color: ColorLike,
  fn: (l: number, c: number, h: number) => [number, number, number],
): ColorLike {
  const [l, c, h] = convert(space, 'oklch', color);
  return withAlpha(convert('oklch', space, fn(l, c, h)), color[3]);
}

/**
 * Increases OKLCH lightness by a ratio of its current value.
 */
export function lighten(
  space: Space,
  color: ColorLike,
  amount: number,
): ColorLike {
  return adjustOKLCH(space, color, (l, c, h) => [l * (1 + amount), c, h]);
}

/**
 * Decreases OKLCH lightness by a ratio of its current value.
 */
export function darken(
  space: Space,
  color: ColorLike,
  amount: number,
): ColorLike {
  return adjustOKLCH(space, color, (l, c, h) => [l * (1 - amount), c, h]);
}

/**
 * Increases OKLCH chroma by a ratio of its current value.
 */
export function saturate(
  space: Space,
  color: ColorLike,
  amount: number,
): ColorLike {
  return adjustOKLCH(space, color, (l, c, h) => [l, c * (1 + amount), h]);
}

/**
 * Decreases OKLCH chroma by a ratio of its current value.
 */
export function desaturate(
  space: Space,
  color: ColorLike,
  amount: number,
): ColorLike {
  return adjustOKLCH(space, color, (l, c, h) => [l, c * (1 - amount), h]);
}

/**
 * Removes all OKLCH chroma, keeping perceived lightness.
 */
export function grayscale(space: Space, color: ColorLike): ColorLike {
  return adjustOKLCH(space, color, (l) => [l, 0, 0]);
}

/**
 * Rotates the OKLCH hue by the given number of degrees.
 */
export function rotateHue(
  space: Space,
  color: ColorLike,
  degrees: number,
): ColorLike {
  return adjustOKLCH(space, color, (l, c, h) => {
    const hue = (h + degrees) % 360;
    return [l, c, hue < 0 ? hue + 360 : hue];
  });
}

/**
 * Decreases alpha by a ratio of its current value. A missing alpha is
 * treated as 1.
 */
export function fadeOut(color: ColorLike, amount: number): ColorLike {
  const alpha = (color[3] ?? 1) * (1 - amount);
  return [color[0], color[1], color[2], clampAlpha(alpha)];
}

/**
 * Increases alpha by a ratio of its current value. A missing alpha is
 * treated as fully opaque and left as is.
 */
export function fadeIn(color: ColorLike, amount: number): ColorLike {
  if (color[3] === undefined) {
    return [color[0], color[1], color[2]];
  }
  const alpha = color[3] * (1 + amount);
  return [color[0], color[1], color[2], clampAlpha(alpha)];
}

/**
 * Mixes two colours of the same space in OKLab.
 * `weight` is the proportion of `b` in the result.
 */
export function mix(
  space: Space,
  a: ColorLike,
  b: ColorLike,
  weight = 0.5,
): ColorLike {
  const [al, aa, ab] = convert(space, 'oklab', a);
  const [bl, ba, bb] = convert(space, 'oklab', b);
  const aWeight = (a[3] ?? 1) * (1 - weight);
  const bWeight = (b[3] ?? 1) * weight;
  const alpha = aWeight + bWeight;
  const scale = alpha === 0 ? 0 : 1 / alpha;
  const mixed = convert('oklab', space, [
    (al * aWeight + bl * bWeight) * scale,
    (aa * aWeight + ba * bWeight) * scale,
    (ab * aWeight + bb * bWeight) * scale,
  ]);
  return a[3] === undefined && b[3] === undefined
    ? mixed
    : withAlpha(mixed, alpha);
}
