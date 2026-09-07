/**
 * Hub geometry models.
 * SPEC.md §6, §5.4
 */
import { NominalSizeId, NominalSize } from './pipe.model';

/** A hub size — shares the NominalSizeId vocabulary with clamps. */
export interface HubSize extends NominalSize {
  /** Nominal size id, same vocabulary as clamps */
  id: NominalSizeId;
}

/** Duty type for a hub (OD-3). */
export interface Duty {
  id: string;
  label: string;
}

/** Resolved hub geometry (inches). */
export interface HubSpec {
  /** Nominal size id */
  sizeId: NominalSizeId;
  /** Outside diameter (A) in inches */
  outsideDiameter: number;
  /** Backface diameter (B) in inches */
  backfaceDiameter: number;
  /** Shoulder thickness (Z) in inches */
  shoulderThickness: number;
  /** Maximum bore in inches */
  maxBore: number;
}
