/**
 * Units utility — inches <-> mm conversion and formatting.
 * SPEC.md §6, core/util/units.util.ts
 */
export const INCH_TO_MM = 25.4;
export const MM_TO_INCH = 1 / INCH_TO_MM;

export function inchesToMm(inches: number): number {
  return inches * INCH_TO_MM;
}

export function mmToInches(mm: number): number {
  return mm * MM_TO_INCH;
}

/** Format inches to 3dp with " ins" suffix, or placeholder if null. */
export function formatInches(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0.000 ins';
  }
  return `${value.toFixed(3)} ins`;
}

/** Format millimetres to 2dp with " mm" suffix, or placeholder if null. */
export function formatMm(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0.00 mm';
  }
  return `${value.toFixed(2)} mm`;
}

/**
 * Format a dual-unit field: "X.XXX ins / XX.XX mm".
 * If the inch value is null/undefined, shows placeholder pair.
 */
export function formatDualUnit(inches: number | null | undefined): string {
  const safeInches = inches ?? 0;
  return `${formatInches(inches)} / ${formatMm(inchesToMm(safeInches))}`;
}
