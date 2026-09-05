/**
 * SYNTHETIC FIXTURE — not real catalogue data.
 * SPEC.md §6, §5.1, G-DD-11
 */
import { PipeSize, Schedule, NominalSize, NominalSizeId } from '../../models/pipe.model';

export const NOMINAL_SIZES: NominalSize[] = [
  { id: '1', label: '1 in' },
  { id: '1.5', label: '1.5 in' },
  { id: '2', label: '2 in' },
  { id: '3', label: '3 in' },
  { id: '4', label: '4 in' },
  { id: '6', label: '6 in' },
];

export const PIPE_SIZES: PipeSize[] = [
  { id: '1', label: '1 in',  od: 1.315 },
  { id: '1.5', label: '1.5 in', od: 1.900 },
  { id: '2', label: '2 in',  od: 2.375 },
  { id: '3', label: '3 in',  od: 3.500 },
  { id: '4', label: '4 in',  od: 4.500 },
  { id: '6', label: '6 in',  od: 6.625 },
];

// Schedule 5S / 10 / 40 / 80 — synthetic wall thickness per size
// Values are illustrative and labelled synthetic.
const SCHEDULE_DATA: Record<NominalSizeId, { id: string; label: string; wall: number }[]> = {
  '1': [
    { id: 'SCH5S', label: 'Schedule 5S', wall: 0.109 },
    { id: 'SCH40', label: 'Schedule 40', wall: 0.133 },
    { id: 'SCH80', label: 'Schedule 80', wall: 0.173 },
  ],
  '1.5': [
    { id: 'SCH5S', label: 'Schedule 5S', wall: 0.109 },
    { id: 'SCH40', label: 'Schedule 40', wall: 0.145 },
    { id: 'SCH80', label: 'Schedule 80', wall: 0.191 },
  ],
  '2': [
    { id: 'SCH5S', label: 'Schedule 5S', wall: 0.109 },
    { id: 'SCH40', label: 'Schedule 40', wall: 0.154 },
    { id: 'SCH80', label: 'Schedule 80', wall: 0.219 },
  ],
  '3': [
    { id: 'SCH5S', label: 'Schedule 5S', wall: 0.120 },
    { id: 'SCH40', label: 'Schedule 40', wall: 0.200 },
    { id: 'SCH80', label: 'Schedule 80', wall: 0.300 },
  ],
  '4': [
    { id: 'SCH5S', label: 'Schedule 5S', wall: 0.120 },
    { id: 'SCH40', label: 'Schedule 40', wall: 0.216 },
    { id: 'SCH80', label: 'Schedule 80', wall: 0.330 },
  ],
  '6': [
    { id: 'SCH5S', label: 'Schedule 5S', wall: 0.133 },
    { id: 'SCH40', label: 'Schedule 40', wall: 0.280 },
    { id: 'SCH80', label: 'Schedule 80', wall: 0.432 },
  ],
};

export function getSchedulesForSize(sizeId: NominalSizeId): Schedule[] {
  return SCHEDULE_DATA[sizeId].map(s => ({ id: s.id, label: s.label }));
}

/** Returns the wall thickness (inches) for a given size+schedule. */
export function getWallThickness(sizeId: NominalSizeId, scheduleId: string): number | undefined {
  return SCHEDULE_DATA[sizeId]?.find(s => s.id === scheduleId)?.wall;
}
