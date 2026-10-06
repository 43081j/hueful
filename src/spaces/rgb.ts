import * as names from '../names.js';

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
