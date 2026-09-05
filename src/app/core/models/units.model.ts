/**
 * Unit conversion utilities.
 * inches <-> millimetres, with formatting helpers (3dp ins, 2dp mm).
 * G-DD-10 / SPEC.md §6 — Nominal sizes are a typed vocabulary.
 */

/** Inches to millimetres (1 in = 25.4 mm) */
export const INCH_TO_MM = 25.4;

/** Millimetres to inches */
export const MM_TO_INCH = 1 / INCH_TO_MM;

/** Convert inches to millimetres */
export function inchesToMm(inches: number): number {
  return inches * INCH_TO_MM;
}

/** Convert millimetres to inches */
export function mmToInches(mm: number): number {
  return mm * MM_TO_INCH;
}

/**
 * Format a value in inches to 3 decimal places with the " ins" suffix.
 * e.g. 2.5 -> "2.500 ins"
 */
export function formatInches(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0.000 ins';
  }
  return `${value.toFixed(3)} ins`;
}

/**
 * Format a value in millimetres to 2 decimal places with the " mm" suffix.
 * e.g. 63.5 -> "63.50 mm"
 */
export function formatMm(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0.00 mm';
  }
  return `${value.toFixed(2)} mm`;
}

/**
 * Format a dual-unit field: "X.XXX ins / XX.XX mm"
 * If the inch value is null/undefined, shows the placeholder pair.
 */
export function formatDualUnit(
  inches: number | null | undefined
): string {
  const safeInches = (inches ?? 0);
  return `${formatInches(inches)} / ${formatMm(inchesToMm(safeInches))}`;
}
