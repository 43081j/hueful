import { describe, expect, it } from 'vitest';
import { fromPolar, multiply, toPolar, type Matrix } from './math.js';

describe('multiply', () => {
  it('returns the input for the identity matrix', () => {
    const identity: Matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    expect(multiply(identity, 0.2, 0.4, 0.6)).toEqual([0.2, 0.4, 0.6]);
  });

  it('multiplies a matrix by a vector', () => {
    const m: Matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(multiply(m, 1, 2, 3)).toEqual([14, 32, 50]);
  });

  it('returns zeros for a zero vector', () => {
    const m: Matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(multiply(m, 0, 0, 0)).toEqual([0, 0, 0]);
  });
});

describe('toPolar', () => {
  it('computes chroma and hue on the positive a axis', () => {
    expect(toPolar(1, 0, 0)).toEqual([1, 0]);
  });

  it('computes hue in the first quadrant', () => {
    const [c, h] = toPolar(1, 1, 0);
    expect(c).toBeCloseTo(Math.SQRT2);
    expect(h).toBeCloseTo(45);
  });

  it('computes hue on the positive b axis', () => {
    const [c, h] = toPolar(0, 2, 0);
    expect(c).toBeCloseTo(2);
    expect(h).toBeCloseTo(90);
  });

  it('computes hue on the negative a axis', () => {
    const [c, h] = toPolar(-1, 0, 0);
    expect(c).toBeCloseTo(1);
    expect(h).toBeCloseTo(180);
  });

  it('wraps negative hues into the 0-360 range', () => {
    const [c, h] = toPolar(0, -1, 0);
    expect(c).toBeCloseTo(1);
    expect(h).toBeCloseTo(270);
  });

  it('sets hue to 0 when chroma is below epsilon', () => {
    const [c, h] = toPolar(0.0001, 0.0001, 0.001);
    expect(c).toBeCloseTo(Math.hypot(0.0001, 0.0001));
    expect(h).toBe(0);
  });

  it('sets hue to 0 when chroma equals epsilon', () => {
    expect(toPolar(0, 0.5, 0.5)).toEqual([0.5, 0]);
  });

  it('sets hue to 0 for zero chroma', () => {
    expect(toPolar(0, 0, 0)).toEqual([0, 0]);
  });
});

describe('fromPolar', () => {
  it('converts hue 0 to the positive a axis', () => {
    const [a, b] = fromPolar(1, 0);
    expect(a).toBeCloseTo(1);
    expect(b).toBeCloseTo(0);
  });

  it('converts hue 90 to the positive b axis', () => {
    const [a, b] = fromPolar(2, 90);
    expect(a).toBeCloseTo(0);
    expect(b).toBeCloseTo(2);
  });

  it('converts hue 180 to the negative a axis', () => {
    const [a, b] = fromPolar(1, 180);
    expect(a).toBeCloseTo(-1);
    expect(b).toBeCloseTo(0);
  });

  it('converts hue 270 to the negative b axis', () => {
    const [a, b] = fromPolar(1, 270);
    expect(a).toBeCloseTo(0);
    expect(b).toBeCloseTo(-1);
  });

  it('returns zeros for zero chroma', () => {
    const [a, b] = fromPolar(0, 123);
    expect(a).toBeCloseTo(0);
    expect(b).toBeCloseTo(0);
  });

  it('round-trips with toPolar', () => {
    const [c, h] = toPolar(0.1, -0.2, 0);
    const [a, b] = fromPolar(c, h);
    expect(a).toBeCloseTo(0.1);
    expect(b).toBeCloseTo(-0.2);
  });
});
