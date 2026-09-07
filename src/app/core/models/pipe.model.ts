/**
 * Pipe geometry models.
 * SPEC.md §6, G-DD-11 — NominalSize is a typed id, not a display string.
 */

/** Nominal pipe size as a typed id. The string is the canonical inch identifier. */
export type NominalSizeId = '1' | '1.5' | '2' | '3' | '4' | '6';

/** A nominal pipe size entry from the catalogue. */
export interface NominalSize {
  /** Typed id, e.g. "2" for 2 inch */
  id: NominalSizeId;
  /** Display label, e.g. "2 in" */
  label: string;
}

/** A pipe size with its available schedules. */
export interface PipeSize extends NominalSize {
  /** Nominal outside diameter in inches */
  od: number;
}

/** A schedule for a pipe size. */
export interface Schedule {
  /** Schedule identifier, e.g. "SCH40" */
  id: string;
  /** Display label, e.g. "Schedule 40" */
  label: string;
}

/** Query for resolving pipe geometry from the catalogue. */
export interface PipeGeometryQuery {
  sizeId: NominalSizeId;
  scheduleId: string;
}

/** Resolved pipe geometry (inches). */
export interface PipeGeometry {
  /** Outside diameter in inches */
  od: number;
  /** Wall thickness in inches */
  wallThickness: number;
  /** Bore (inner diameter) in inches = od - 2 * wallThickness */
  bore: number;
}
