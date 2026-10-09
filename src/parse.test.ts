import { describe, expect, it } from 'vitest';
import { parse } from './parse.js';

describe('parse', () => {
  it('parses rgb', () => {
    expect(parse('rgb(255 0 0 / 50%)')).toEqual({
      space: 'rgb',
      value: [255, 0, 0, 0.5],
    });
    expect(parse('rgba(255, 0, 0)')).toEqual({
      space: 'rgb',
      value: [255, 0, 0],
    });
  });

  it('parses hex and named colours as rgb', () => {
    expect(parse('#ff0000')).toEqual({ space: 'rgb', value: [255, 0, 0] });
    expect(parse('red')).toEqual({ space: 'rgb', value: [255, 0, 0] });
  });

  it('parses hsl', () => {
    expect(parse('hsl(120 50% 50%)')).toEqual({
      space: 'hsl',
      value: [120, 50, 50],
    });
    expect(parse('hsla(120, 50%, 50%, 0.5)')).toEqual({
      space: 'hsl',
      value: [120, 50, 50, 0.5],
    });
  });

  it('parses hwb', () => {
    expect(parse('hwb(120 10% 20%)')).toEqual({
      space: 'hwb',
      value: [120, 10, 20],
    });
  });

  it('parses lab', () => {
    expect(parse('lab(50% 40 -20)')).toEqual({
      space: 'lab',
      value: [50, 40, -20],
    });
  });

  it('parses lch', () => {
    expect(parse('lch(50% 30 120)')).toEqual({
      space: 'lch',
      value: [50, 30, 120],
    });
  });

  it('parses oklab', () => {
    expect(parse('oklab(0.5 0.1 -0.1)')).toEqual({
      space: 'oklab',
      value: [0.5, 0.1, -0.1],
    });
  });

  it('parses oklch', () => {
    expect(parse('oklch(0.5 0.1 120)')).toEqual({
      space: 'oklch',
      value: [0.5, 0.1, 120],
    });
  });

  it('parses device-cmyk', () => {
    expect(parse('device-cmyk(0 81% 81% 30% / 0.5)')).toEqual({
      space: 'cmyk',
      value: [0, 0.81, 0.81, 0.3, 0.5],
    });
    expect(parse('device-cmyk(0 0 0)')).toBeNull();
  });

  it('returns null for unknown functions', () => {
    expect(parse('color(srgb 1 0 0)')).toBeNull();
  });
});
