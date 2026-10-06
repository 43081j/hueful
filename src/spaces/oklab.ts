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
