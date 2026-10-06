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
