import * as names from './names.js';
import * as rgb from './spaces/rgb.js';
import * as hsl from './spaces/hsl.js';
import * as hwb from './spaces/hwb.js';
import * as lab from './spaces/lab.js';
import * as lch from './spaces/lch.js';
import * as oklab from './spaces/oklab.js';
import * as oklch from './spaces/oklch.js';

export { names, rgb, hsl, hwb, lab, lch, oklab, oklch };

type SomeFunction = (input: string) => unknown;
type Parsed<T extends SomeFunction> = NonNullable<ReturnType<T>>;

export type ParseResult =
  | { space: 'rgb'; value: Parsed<typeof rgb.parse> }
  | { space: 'hsl'; value: Parsed<typeof hsl.parse> }
  | { space: 'hwb'; value: Parsed<typeof hwb.parse> }
  | { space: 'lab'; value: Parsed<typeof lab.parse> }
  | { space: 'lch'; value: Parsed<typeof lch.parse> }
  | { space: 'oklab'; value: Parsed<typeof oklab.parse> }
  | { space: 'oklch'; value: Parsed<typeof oklch.parse> };

export function parse(input: string): ParseResult | null {
  const open = input.indexOf('(');
  const fn = open === -1 ? '' : input.slice(0, open).toLowerCase();

  switch (fn) {
    case '':
    case 'rgb':
    case 'rgba': {
      const value = rgb.parse(input);
      return value && { space: 'rgb', value };
    }
    case 'hsl':
    case 'hsla': {
      const value = hsl.parse(input);
      return value && { space: 'hsl', value };
    }
    case 'hwb': {
      const value = hwb.parse(input);
      return value && { space: 'hwb', value };
    }
    case 'lab': {
      const value = lab.parse(input);
      return value && { space: 'lab', value };
    }
    case 'lch': {
      const value = lch.parse(input);
      return value && { space: 'lch', value };
    }
    case 'oklab': {
      const value = oklab.parse(input);
      return value && { space: 'oklab', value };
    }
    case 'oklch': {
      const value = oklch.parse(input);
      return value && { space: 'oklch', value };
    }
    default:
      return null;
  }
}
