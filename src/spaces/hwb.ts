import { hueChannel, parseColor, percentChannel } from '../parse.js';

const names = ['hwb'];

export function parse(
  input: string,
): [h: number, w: number, b: number, alpha?: number] | null {
  return parseColor(input, names, hueChannel, percentChannel, percentChannel);
}

export function format(
  h: number,
  w: number,
  b: number,
  alpha?: number,
): string {
  const hwb = `${Math.round(h)} ${Math.round(w)}% ${Math.round(b)}%`;
  if (alpha === undefined || alpha === 1) {
    return `hwb(${hwb})`;
  }
  return `hwb(${hwb} / ${alpha})`;
}
