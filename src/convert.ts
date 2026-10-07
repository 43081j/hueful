import type { Coords } from './math.js';
import { type Space, spaces } from './spaces/index.js';
import type { ColorLike } from './types.js';

export function convert(from: Space, to: Space, color: ColorLike): ColorLike {
  const [c0, c1, c2, alpha] = color;
  const coords: Coords =
    from === to
      ? [c0, c1, c2]
      : spaces[to].fromXYZ(...spaces[from].toXYZ(c0, c1, c2));
  return alpha === undefined ? coords : [...coords, alpha];
}
