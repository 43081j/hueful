import { describe, expect, it } from 'vitest';
import * as main from './main.js';
import { spaces } from './spaces/index.js';

describe('main', () => {
  it('exports every space', () => {
    for (const [name, space] of Object.entries(spaces)) {
      expect(main).toHaveProperty(name, space);
    }
  });
});
