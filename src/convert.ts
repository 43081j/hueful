import type { Coords } from './math.js';
import { type Space, spaces } from './spaces/index.js';

export type ParsedColor<T extends Space> = NonNullable<
  ReturnType<(typeof spaces)[T]['parse']>
>;

export function convert<TFrom extends Space, TTo extends Space>(
  from: TFrom,
  to: TTo,
  color: ParsedColor<TFrom>,
): ParsedColor<TTo> {
  const channelCount = spaces[from].channelCount;
  const channels = color.slice(0, channelCount) as number[];
  const alpha = color[channelCount];
  const toXYZ = spaces[from].toXYZ as (...channels: number[]) => Coords;
  const coords: readonly number[] =
    (from as string) === (to as string)
      ? channels
      : spaces[to].fromXYZ(...toXYZ(...channels));
  return (
    alpha === undefined ? coords : [...coords, alpha]
  ) as ParsedColor<TTo>;
}
