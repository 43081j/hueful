import { hueChannel, parseColor, scaledChannel } from '../parse.js';

const names = ['oklch'];
const lightnessChannel = scaledChannel(1);
const chromaChannel = scaledChannel(0.4);

export function parse(
  input: string,
): [l: number, c: number, h: number, alpha?: number] | null {
  return parseColor(input, names, lightnessChannel, chromaChannel, hueChannel);
}

export function format(
  l: number,
  c: number,
  h: number,
  alpha?: number,
): string {
  if (alpha === undefined || alpha === 1) {
    return `oklch(${l} ${c} ${h})`;
  }
  return `oklch(${l} ${c} ${h} / ${alpha})`;
}
