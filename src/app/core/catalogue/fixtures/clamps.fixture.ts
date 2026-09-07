/**
 * SYNTHETIC FIXTURE — not real catalogue data.
 * SPEC.md §6, §5.3, §5.4 — clamps share NominalSizeId vocabulary with hubs.
 */
import { ClampSize, ClampSpec } from '../../models/clamp.model';
import { NominalSizeId } from '../../models/pipe.model';

export const CLAMP_SIZES: ClampSize[] = [
  { id: '1', label: '1 in' },
  { id: '1.5', label: '1.5 in' },
  { id: '2', label: '2 in' },
  { id: '3', label: '3 in' },
  { id: '4', label: '4 in' },
  { id: '6', label: '6 in' },
];

// Synthetic clamp geometry per size.
const CLAMP_GEOM: Record<NominalSizeId, ClampSpec> = {
  '1': { sizeId: '1', insideDiameter: 2.800, boltCentres: 1.750, boltDiameter: 0.312, clampWidth: 1.250 },
  '1.5': { sizeId: '1.5', insideDiameter: 3.400, boltCentres: 2.333, boltDiameter: 0.312, clampWidth: 1.250 },
  '2': { sizeId: '2', insideDiameter: 4.000, boltCentres: 3.000, boltDiameter: 0.375, clampWidth: 1.375 },
  '3': { sizeId: '3', insideDiameter: 5.250, boltCentres: 4.250, boltDiameter: 0.375, clampWidth: 1.500 },
  '4': { sizeId: '4', insideDiameter: 6.500, boltCentres: 5.500, boltDiameter: 0.437, clampWidth: 1.625 },
  '6': { sizeId: '6', insideDiameter: 8.750, boltCentres: 7.500, boltDiameter: 0.500, clampWidth: 1.750 },
};

export function getClampSpec(sizeId: NominalSizeId): ClampSpec | undefined {
  return CLAMP_GEOM[sizeId];
}
