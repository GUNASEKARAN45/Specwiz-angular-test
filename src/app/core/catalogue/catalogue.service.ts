/**
 * Abstract catalogue service interface.
 * SPEC.md §6, G-DD-11, AC-ARCH-03 — all catalogue reads go through this interface.
 * Swapping the implementation requires no component edit.
 */
import { Observable } from 'rxjs';
import {
  NominalSize,
  NominalSizeId,
  PipeSize,
  Schedule,
  PipeGeometry,
  PipeGeometryQuery,
} from '../models/pipe.model';
import {
  SealringType,
  SealringSize,
  SealringSpec,
} from '../models/sealring.model';
import { ClampSize, ClampSpec } from '../models/clamp.model';
import { HubSize, HubSpec, Duty } from '../models/hub.model';

export abstract class CatalogueService {
  abstract nominalSizes(): Observable<NominalSize[]>;
  abstract pipeSizes(): Observable<PipeSize[]>;
  abstract schedules(sizeId: NominalSizeId): Observable<Schedule[]>;
  abstract pipeGeometry(q: PipeGeometryQuery): Observable<PipeGeometry | null>;
  abstract sealringTypes(): Observable<SealringType[]>;
  abstract sealringSizes(typeId: string): Observable<SealringSize[]>;
  abstract sealring(typeId: string, sizeId: string): Observable<SealringSpec | null>;
  abstract clampSizes(): Observable<ClampSize[]>;
  abstract clamp(sizeId: NominalSizeId): Observable<ClampSpec | null>;
  abstract hubSizes(): Observable<HubSize[]>;
  abstract hub(sizeId: NominalSizeId): Observable<HubSpec | null>;
  abstract duties(): Observable<Duty[]>;
}
