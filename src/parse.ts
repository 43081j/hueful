import { type Space, spaces } from './spaces/index.js';

const { rgb, hsl, hwb, lab, lch, oklab, oklch, cmyk } = spaces;

export type ParseResult = {
  [K in Space]: {
    space: K;
    value: NonNullable<ReturnType<(typeof spaces)[K]['parse']>>;
  };
}[Space];

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
    case 'device-cmyk':
      return result('cmyk', cmyk.parse(input));
    default:
      return null;
  }
}
