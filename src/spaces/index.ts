import * as rgb from './rgb.js';
import * as hsl from './hsl.js';
import * as hwb from './hwb.js';
import * as lab from './lab.js';
import * as lch from './lch.js';
import * as oklab from './oklab.js';
import * as oklch from './oklch.js';
import * as cmyk from './cmyk.js';

export const spaces = { rgb, hsl, hwb, lab, lch, oklab, oklch, cmyk };

export type Space = keyof typeof spaces;
