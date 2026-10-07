import * as names from './names.js';
import { spaces } from './spaces/index.js';

const { rgb, hsl, hwb, lab, lch, oklab, oklch } = spaces;

export { names, rgb, hsl, hwb, lab, lch, oklab, oklch };
export type { Space } from './spaces/index.js';
export type { ColorLike } from './types.js';
export { parse, type ParseResult } from './parse.js';
export { convert } from './convert.js';
export * from './manipulation.js';
export * from './analysis.js';
