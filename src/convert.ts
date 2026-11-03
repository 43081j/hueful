import type { Coords } from './math.js';
import { type Space, spaces } from './spaces/index.js';

export type ParsedColor<T extends Space> = NonNullable<
  ReturnType<(typeof spaces)[T]['parse']>
>;

type RGBFamily = 'rgb' | 'hsl' | 'hwb' | 'cmyk';

const isRGBFamily = (space: Space): space is RGBFamily =>
  space === 'rgb' || space === 'hsl' || space === 'hwb' || space === 'cmyk';

export function convert<TFrom extends Space, TTo extends Space>(
  from: TFrom,
  to: TTo,
  color: ParsedColor<TFrom>,
): ParsedColor<TTo> {
  if (!spaces.hasOwnProperty(from)) {
    throw new Error(`Unknown color space: ${from}`);
  }
  if (!spaces.hasOwnProperty(to)) {
    throw new Error(`Unknown color space: ${to}`);
  }
  const channelCount = spaces[from].channelCount;
  const channels = color.slice(0, channelCount) as number[];
  const alpha = color[channelCount];
  let coords: readonly number[];
  if ((from as string) === (to as string)) {
    // Shortcut for when the spaces are the same
    coords = channels;
  } else if (isRGBFamily(from) && isRGBFamily(to)) {
    // Shortcut for spaces which both live in the world of RGB
    const fromRGB = spaces[to].fromRGB;
    const toRGB = spaces[from].toRGB as (...channels: number[]) => Coords;
    coords = fromRGB(...toRGB(...channels));
  } else {
    const toXYZ = spaces[from].toXYZ as (...channels: number[]) => Coords;
    coords = spaces[to].fromXYZ(...toXYZ(...channels));
  }
  return (
    alpha === undefined ? coords : [...coords, alpha]
  ) as ParsedColor<TTo>;
}
