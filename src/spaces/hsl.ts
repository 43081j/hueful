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
