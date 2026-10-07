import { parseColor, scaledChannel } from '../parse.js';

const names = ['oklab'];
const lightnessChannel = scaledChannel(1);
const abChannel = scaledChannel(0.4);

export function parse(
  input: string,
): [l: number, a: number, b: number, alpha?: number] | null {
  return parseColor(input, names, lightnessChannel, abChannel, abChannel);
}

export function format(
  l: number,
  a: number,
  b: number,
  alpha?: number,
): string {
  if (alpha === undefined || alpha === 1) {
    return `oklab(${l} ${a} ${b})`;
  }
  return `oklab(${l} ${a} ${b} / ${alpha})`;
}
