export type Coords = [number, number, number];

type Row = readonly [number, number, number];
export type Matrix = readonly [Row, Row, Row];

export function multiply(m: Matrix, a: number, b: number, c: number): Coords {
  return [
    m[0][0] * a + m[0][1] * b + m[0][2] * c,
    m[1][0] * a + m[1][1] * b + m[1][2] * c,
    m[2][0] * a + m[2][1] * b + m[2][2] * c,
  ];
}

/**
 * Converts rectangular coords to polar coords (chroma/hue).
 * At or below a chroma of epsilon, the hue is 'powerless' (it has no visible
 * effect). So we set it to 0.
 */
export function toPolar(
  a: number,
  b: number,
  epsilon: number,
): [c: number, h: number] {
  const c = Math.sqrt(a * a + b * b);
  if (c <= epsilon) {
    return [c, 0];
  }
  const h = (Math.atan2(b, a) * 180) / Math.PI;
  return [c, h < 0 ? h + 360 : h];
}

/**
 * Converts chroma and hue (in degrees) to rectangular coords
 */
export function fromPolar(c: number, h: number): [a: number, b: number] {
  const rad = (h * Math.PI) / 180;
  return [c * Math.cos(rad), c * Math.sin(rad)];
}
