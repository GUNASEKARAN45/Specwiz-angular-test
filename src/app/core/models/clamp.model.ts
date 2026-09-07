/**
 * Clamp geometry models.
 * SPEC.md §6, §5.3
 */
import { NominalSizeId } from './pipe.model';

/** A clamp size — shares the NominalSizeId vocabulary with hubs. */
export interface ClampSize {
  /** Nominal size id, same vocabulary as hubs */
  id: NominalSizeId;
  /** Display label, e.g. "2 in" */
  label: string;
}

/** Resolved clamp geometry (inches). */
export interface ClampSpec {
  /** Nominal size id */
  sizeId: NominalSizeId;
  /** Inside diameter in inches */
  insideDiameter: number;
  /** Bolt centring diameter in inches */
  boltCentres: number;
  /** Bolt diameter in inches */
  boltDiameter: number;
  /** Clamp width in inches */
  clampWidth: number;
}
