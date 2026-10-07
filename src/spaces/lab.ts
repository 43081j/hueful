import { parseColor, percentChannel, scaledChannel } from '../parse.js';

const names = ['lab'];
const abChannel = scaledChannel(125);

export function parse(
  input: string,
): [l: number, a: number, b: number, alpha?: number] | null {
  return parseColor(input, names, percentChannel, abChannel, abChannel);
}

export function format(
  l: number,
  a: number,
  b: number,
  alpha?: number,
): string {
  if (alpha === undefined || alpha === 1) {
    return `lab(${l}% ${a} ${b})`;
  }
  return `lab(${l}% ${a} ${b} / ${alpha})`;
}
