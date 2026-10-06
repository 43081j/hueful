const numberPattern = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/;
const tokenPattern = /\S+/g;

/**
 * Extracts the arguments of a colour function in the form
 * `name(A B C[ / D])` as `[A, B, C, D?]`.
 */
export function parseFunction(
  input: string,
  names: readonly string[],
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
  const args: string[] = [];
  tokenPattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(channels)) !== null) {
    if (args.length === 3) {
      return null;
    }
    args.push(match[0]);
  }
  if (args.length !== 3) {
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
