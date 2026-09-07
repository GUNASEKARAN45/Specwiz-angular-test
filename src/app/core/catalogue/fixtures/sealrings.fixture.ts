/**
 * SYNTHETIC FIXTURE — not real catalogue data.
 * SPEC.md §6, §5.2
 */
import { SealringType, SealringSize, SealringSpec } from '../../models/sealring.model';
import { NominalSizeId } from '../../models/pipe.model';

export const SEALRING_TYPES: SealringType[] = [
  { id: 'techlok', label: 'Techlok' },
];

export const SEALRING_SIZES: SealringSize[] = [
  { id: '1', typeId: 'techlok', label: '1 in' },
  { id: '1.5', typeId: 'techlok', label: '1.5 in' },
  { id: '2', typeId: 'techlok', label: '2 in' },
  { id: '3', typeId: 'techlok', label: '3 in' },
  { id: '4', typeId: 'techlok', label: '4 in' },
  { id: '6', typeId: 'techlok', label: '6 in' },
];

// Synthetic sealring geometry per size.
const SEALRING_GEOM: Record<NominalSizeId, SealringSpec> = {
  '1': { id: 1.097, ribThickness: 0.250, od: 1.597 },
  '1.5': { id: 1.500, ribThickness: 0.250, od: 2.000 },
  '2': { id: 1.900, ribThickness: 0.270, od: 2.440 },
  '3': { id: 2.500, ribThickness: 0.290, od: 3.080 },
  '4': { id: 3.500, ribThickness: 0.310, od: 4.120 },
  '6': { id: 5.500, ribThickness: 0.350, od: 6.200 },
};

export function getSealringSpec(typeId: string, sizeId: string): SealringSpec | undefined {
  if (typeId !== 'techlok') return undefined;
  return SEALRING_GEOM[sizeId as NominalSizeId];
}
