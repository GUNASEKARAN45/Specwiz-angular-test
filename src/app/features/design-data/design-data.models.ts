/**
 * Type definitions for the Design Data store and page.
 * SPEC.md §5, §6
 */
import { NominalSizeId } from '../../core/models/pipe.model';

/** Pipe basis: select from catalogue or enter raw OD. */
export type PipeBasis = 'pipe' | 'od';

/** Dimension basis: which dimension drives the pipe geometry. */
export type DimensionBasis = 'schedule' | 'wall_thickness' | 'bore';

/** Snapshot of the full Design Data form state (for tests/debug). */
export interface DesignDataState {
  pipeBasis: PipeBasis;
  dimensionBasis: DimensionBasis;
  pipeSizeId: NominalSizeId | null;
  odValue: number | null;
  scheduleId: string | null;
  wallThickness: number | null;
  bore: number | null;
  sealringTypeId: string | null;
  sealringSizeId: string | null;
  clampSizeId: NominalSizeId | null;
  boltTensioned: boolean;
  hubSizeId: NominalSizeId | null;
  hubRecessed: boolean;
  hubDetailExpanded: boolean;
  hubOverride: boolean;
}

/** Editable fields in the hub detail panel. */
export interface HubDetailEditable {
  size: NominalSizeId | null;
  lengthD: number;
  hubTaperAngle: number;
  frictionAngle: number;
  duty: string;
  backfaceDepthE: number;
  blindLength: number;
}
