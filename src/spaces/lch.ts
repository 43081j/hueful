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
