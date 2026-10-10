import { describe, expect, it } from 'vitest';
import { convert } from './convert.js';
import type { Space } from './spaces/index.js';

describe('convert', () => {
  it('throws on an unknown source space', () => {
    expect(() => convert('nope' as Space, 'rgb', [255, 0, 0])).toThrow(
      'Unknown color space: nope',
    );
  });

  it('throws on an inherited property used as the target space', () => {
    expect(() => convert('rgb', 'toString' as Space, [255, 0, 0])).toThrow(
      'Unknown color space: toString',
    );
  });
});
