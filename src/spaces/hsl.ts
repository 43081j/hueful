import { hueChannel, parseColor, percentChannel } from '../parse.js';

const names = ['hsl', 'hsla'];

export function parse(
  input: string,
): [h: number, s: number, l: number, alpha?: number] | null {
  return parseColor(
    input,
    names,
    hueChannel,
    percentChannel,
    percentChannel,
    true,
  );
}

export function format(
  h: number,
  s: number,
  l: number,
  alpha?: number,
): string {
  const hsl = `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
  if (alpha === undefined || alpha === 1) {
    return `hsl(${hsl})`;
  }
  return `hsl(${hsl} / ${alpha})`;
}
