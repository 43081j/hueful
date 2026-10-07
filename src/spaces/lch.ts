import {
  hueChannel,
  parseColor,
  percentChannel,
  scaledChannel,
} from '../parse.js';

const names = ['lch'];
const chromaChannel = scaledChannel(150);

export function parse(
  input: string,
): [l: number, c: number, h: number, alpha?: number] | null {
  return parseColor(input, names, percentChannel, chromaChannel, hueChannel);
}

export function format(
  l: number,
  c: number,
  h: number,
  alpha?: number,
): string {
  if (alpha === undefined || alpha === 1) {
    return `lch(${l}% ${c} ${h})`;
  }
  return `lch(${l}% ${c} ${h} / ${alpha})`;
}
