/**
 * SYNTHETIC FIXTURE — not real catalogue data.
 * SPEC.md §6, §5.4 — hubs share NominalSizeId vocabulary with clamps.
 */
import { HubSize, HubSpec, Duty } from '../../models/hub.model';
import { NominalSizeId } from '../../models/pipe.model';

export const HUB_SIZES: HubSize[] = [
  { id: '1', label: '1 in' },
  { id: '1.5', label: '1.5 in' },
  { id: '2', label: '2 in' },
  { id: '3', label: '3 in' },
  { id: '4', label: '4 in' },
  { id: '6', label: '6 in' },
];

// Duties — OD-3.
export const DUTIES: Duty[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'heavy', label: 'Heavy' },
  { id: 'extra-heavy', label: 'Extra Heavy' },
];

// Synthetic hub geometry per size.
const HUB_GEOM: Record<NominalSizeId, HubSpec> = {
  '1': { sizeId: '1', outsideDiameter: 2.625, backfaceDiameter: 2.000, shoulderThickness: 0.625, maxBore: 1.315 },
  '1.5': { sizeId: '1.5', outsideDiameter: 3.250, backfaceDiameter: 2.500, shoulderThickness: 0.630, maxBore: 1.900 },
  '2': { sizeId: '2', outsideDiameter: 4.000, backfaceDiameter: 3.250, shoulderThickness: 0.680, maxBore: 2.375 },
  '3': { sizeId: '3', outsideDiameter: 5.250, backfaceDiameter: 4.250, shoulderThickness: 0.700, maxBore: 3.500 },
  '4': { sizeId: '4', outsideDiameter: 6.250, backfaceDiameter: 5.250, shoulderThickness: 0.750, maxBore: 4.500 },
  '6': { sizeId: '6', outsideDiameter: 8.250, backfaceDiameter: 7.250, shoulderThickness: 0.820, maxBore: 6.625 },
};

export function getHubSpec(sizeId: NominalSizeId): HubSpec | undefined {
  return HUB_GEOM[sizeId];
}
