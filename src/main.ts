import type { Coords } from './math.js';
import * as names from './names.js';
import * as rgb from './spaces/rgb.js';
import * as hsl from './spaces/hsl.js';
import * as hwb from './spaces/hwb.js';
import * as lab from './spaces/lab.js';
import * as lch from './spaces/lch.js';
import * as oklab from './spaces/oklab.js';
import * as oklch from './spaces/oklch.js';

export { names, rgb, hsl, hwb, lab, lch, oklab, oklch };

const spaces = { rgb, hsl, hwb, lab, lch, oklab, oklch };

export type Space = keyof typeof spaces;
export type ColorLike = readonly [number, number, number, alpha?: number];
export type ParseResult = {
  [K in Space]: {
    space: K;
    value: NonNullable<ReturnType<(typeof spaces)[K]['parse']>>;
  };
}[Space];

export function convert(
  from: Space,
  to: Space,
  color: ColorLike,
): [number, number, number, alpha?: number] {
  const [c0, c1, c2, alpha] = color;
  const coords: Coords =
    from === to
      ? [c0, c1, c2]
      : spaces[to].fromXYZ(...spaces[from].toXYZ(c0, c1, c2));
  return alpha === undefined ? coords : [...coords, alpha];
}

function result<K extends Space>(
  space: K,
  value: Extract<ParseResult, { space: K }>['value'] | null,
): ParseResult | null {
  return value && ({ space, value } as ParseResult);
}

export function parse(input: string): ParseResult | null {
  const open = input.indexOf('(');
  const fn = open === -1 ? '' : input.slice(0, open).toLowerCase();
  switch (fn) {
    case '':
    case 'rgb':
    case 'rgba':
      return result('rgb', rgb.parse(input));
    case 'hsl':
    case 'hsla':
      return result('hsl', hsl.parse(input));
    case 'hwb':
      return result('hwb', hwb.parse(input));
    case 'lab':
      return result('lab', lab.parse(input));
    case 'lch':
      return result('lch', lch.parse(input));
    case 'oklab':
      return result('oklab', oklab.parse(input));
    case 'oklch':
      return result('oklch', oklch.parse(input));
    default:
      return null;
  }
}
