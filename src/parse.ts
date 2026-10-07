import { alphaUnits, angleUnits, toAlpha, toDegrees } from './units.js';

const numberPattern = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/;

// CSS whitespace: tab, line feed, form feed, carriage return, space
function isWhitespace(code: number): boolean {
  return code === 32 || code === 9 || code === 10 || code === 12 || code === 13;
}

/**
 * Extracts the arguments of a colour function in the form
 * `name(A B C[ / D])` as `[A, B, C, D?]`. When `allowCommas` is set, the
 * legacy `name(A, B, C[, D])` form is also accepted.
 */
export function parseFunction(
  input: string,
  names: readonly string[],
  allowCommas = false,
): string[] | null {
  const open = input.indexOf('(');
  if (open === -1 || !input.endsWith(')')) {
    return null;
  }
  if (!names.includes(input.slice(0, open).toLowerCase())) {
    return null;
  }

  const close = input.length - 1;
  const slash = input.indexOf('/', open);
  if (slash !== -1 && input.indexOf('/', slash + 1) !== -1) {
    return null;
  }

  const channels = input.slice(open + 1, slash === -1 ? close : slash);
  const commas = allowCommas && channels.includes(',');
  const maxArgs = commas && slash === -1 ? 4 : 3;
  const args: string[] = [];
  let start = -1;
  for (let i = 0; i <= channels.length; i++) {
    const code = i < channels.length ? channels.charCodeAt(i) : 32;
    if (isWhitespace(code) || (commas && code === 44)) {
      if (start !== -1) {
        if (args.length === maxArgs) {
          return null;
        }
        args.push(channels.slice(start, i));
        start = -1;
      }
    } else if (start === -1) {
      start = i;
    }
  }
  if (args.length < 3) {
    return null;
  }

  if (slash !== -1) {
    const alpha = input.slice(slash + 1, close).trim();
    if (alpha === '') {
      return null;
    }
    args.push(alpha);
  }

  return args;
}

/**
 * Parses a single argument as a number with an optional unit from `units`.
 * `none` resolves to 0. Units are returned in lowercase.
 */
export function parseComponent<TUnit extends string>(
  token: string,
  units: readonly TUnit[],
): [value: number, unit: TUnit | null] | null {
  const lower = token.toLowerCase();
  if (lower === 'none') {
    return [0, null];
  }

  let unitStart = lower.length;
  while (unitStart > 0) {
    const code = lower.charCodeAt(unitStart - 1);
    if (code >= 48 && code <= 57) {
      break;
    }
    unitStart--;
  }

  const unit = lower.slice(unitStart);
  if (unit !== '' && !units.includes(unit as TUnit)) {
    return null;
  }

  const value = lower.slice(0, unitStart);
  if (!numberPattern.test(value)) {
    return null;
  }

  return [Number(value), unit as TUnit];
}

export interface Channel {
  units: readonly string[];
  transform?: (value: number, unit: string | null) => number;
}

// Hue represented by <angle> or <number>
export const hueChannel: Channel = {
  units: angleUnits,
  transform: toDegrees,
};

// Percentage represented by <percentage> or <number>
export const percentChannel: Channel = { units: ['%'] };

// Scale represented the same as percentChannel, but scaled to a given range
export function scaledChannel(range: number): Channel {
  return {
    units: ['%'],
    transform: (value, unit) => (unit === '%' ? (value * range) / 100 : value),
  };
}

function parseChannel(token: string, channel: Channel): number | null {
  const component = parseComponent(token, channel.units);
  if (component === null) {
    return null;
  }
  return channel.transform
    ? channel.transform(component[0], component[1])
    : component[0];
}

export function parseColor(
  input: string,
  names: readonly string[],
  channel0: Channel,
  channel1: Channel,
  channel2: Channel,
  allowCommas = false,
): [number, number, number, alpha?: number] | null {
  const args = parseFunction(input, names, allowCommas);
  if (args === null) {
    return null;
  }

  const c0 = parseChannel(args[0]!, channel0);
  const c1 = parseChannel(args[1]!, channel1);
  const c2 = parseChannel(args[2]!, channel2);
  if (c0 === null || c1 === null || c2 === null) {
    return null;
  }

  if (args[3] === undefined) {
    return [c0, c1, c2];
  }

  const alpha = parseComponent(args[3], alphaUnits);
  if (alpha === null) {
    return null;
  }

  return [c0, c1, c2, toAlpha(alpha[0], alpha[1])];
}
