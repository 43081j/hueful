export const angleUnits = ['deg', 'rad', 'grad', 'turn'];
export const alphaUnits = ['%'];

/**
 * Converts an `<alpha-value>` in the given unit to a number in the 0-1
 * range. A unitless value is returned as-is.
 */
export function toAlpha(value: number, unit: string | null): number {
  return unit === '%' ? value / 100 : value;
}

/**
 * Converts an angle in the given unit to degrees. A unitless value is
 * treated as degrees.
 */
export function toDegrees(value: number, unit: string | null): number {
  switch (unit) {
    case 'rad':
      return (value * 180) / Math.PI;
    case 'grad':
      return (value * 360) / 400;
    case 'turn':
      return value * 360;
    default:
      return value;
  }
}
