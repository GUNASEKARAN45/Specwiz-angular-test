/**
 * Sealring geometry models.
 * SPEC.md §6.
 */
import { NominalSize } from './pipe.model';

/** A sealring type, e.g. Techlok. */
export interface SealringType {
  id: string;
  label: string;
}

/** A sealring size (depends on type). */
export interface SealringSize extends NominalSize {
  /** Type this size belongs to */
  typeId: string;
}

/** Resolved sealring geometry (inches). */
export interface SealringSpec {
  /** Inner diameter in inches */
  id: number;
  /** Rib thickness in inches */
  ribThickness: number;
  /** Outer diameter in inches */
  od: number;
}
