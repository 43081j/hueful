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
