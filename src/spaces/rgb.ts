import * as names from '../names.js';
import { parseColor, scaledChannel } from '../parse.js';

type RGB = [r: number, g: number, b: number, alpha?: number];

const functionNames = ['rgb', 'rgba'];
const rgbChannel = scaledChannel(255);
const hexPattern = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

function parseHex(input: string): RGB | null {
  if (!hexPattern.test(input)) {
    return null;
  }

  const n = Number.parseInt(input.slice(1), 16);
  switch (input.length) {
    case 4:
      return [((n >> 8) & 0xf) * 17, ((n >> 4) & 0xf) * 17, (n & 0xf) * 17];
    case 5:
      return [
        ((n >> 12) & 0xf) * 17,
        ((n >> 8) & 0xf) * 17,
        ((n >> 4) & 0xf) * 17,
        ((n & 0xf) * 17) / 255,
      ];
    case 7:
      return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
    default:
      return [n >>> 24, (n >> 16) & 0xff, (n >> 8) & 0xff, (n & 0xff) / 255];
  }
}

function parseRGBFunction(input: string): RGB | null {
  return parseColor(
    input,
    functionNames,
    rgbChannel,
    rgbChannel,
    rgbChannel,
    true,
  );
}

function parseName(input: string): RGB | null {
  const name = input.toLowerCase();
  if (name === 'transparent') {
    return [0, 0, 0, 0];
  }
  if (!Object.hasOwn(names, name)) {
    return null;
  }
  const [r, g, b] = names[name as keyof typeof names];
  return [r, g, b];
}

export function parse(input: string): RGB | null {
  return parseHex(input) ?? parseRGBFunction(input) ?? parseName(input);
}

function valueToHex(value: number): string {
  const hex = Math.round(value).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function formatAsHex(
  r: number,
  g: number,
  b: number,
  alpha?: number,
): string {
  const rHex = valueToHex(r);
  const gHex = valueToHex(g);
  const bHex = valueToHex(b);
  const alphaHex = alpha !== undefined ? valueToHex(alpha * 255) : '';
  return `#${rHex}${gHex}${bHex}${alphaHex}`;
}

export function format(
  r: number,
  g: number,
  b: number,
  alpha?: number,
): string {
  const rgb = `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
  if (alpha === undefined || alpha === 1) {
    return `rgb(${rgb})`;
  }
  return `rgb(${rgb} / ${alpha})`;
}

export function formatAsPercent(
  r: number,
  g: number,
  b: number,
  alpha?: number,
): string {
  const rPercent = Math.round((r / 255) * 100);
  const gPercent = Math.round((g / 255) * 100);
  const bPercent = Math.round((b / 255) * 100);
  const rgb = `${rPercent}% ${gPercent}% ${bPercent}%`;
  if (alpha === undefined || alpha === 1) {
    return `rgb(${rgb})`;
  }
  return `rgb(${rgb} / ${alpha})`;
}

let nameLookup: Map<number, string> | null = null;

export function formatAsName(
  r: number,
  g: number,
  b: number,
  alpha?: number,
): string | null {
  if (nameLookup === null) {
    nameLookup = new Map();
    for (const [name, [nr, ng, nb]] of Object.entries(names)) {
      const key = (nr << 16) | (ng << 8) | nb;
      if (!nameLookup.has(key)) {
        nameLookup.set(key, name);
      }
    }
  }
  if (alpha !== undefined && alpha !== 1) {
    return null;
  }
  return nameLookup.get((r << 16) | (g << 8) | b) ?? null;
}
