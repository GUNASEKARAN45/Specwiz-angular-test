/**
 * Mock catalogue service backed by synthetic fixtures.
 * SPEC.md §6, §4 (MockCatalogueService), AC-ARCH-03
 * Provided in app.config.ts under CATALOGUE_TOKEN.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CatalogueService } from './catalogue.service';
import {
  NominalSize,
  NominalSizeId,
  PipeSize,
  Schedule,
  PipeGeometry,
  PipeGeometryQuery,
} from '../models/pipe.model';
import { SealringType, SealringSize, SealringSpec } from '../models/sealring.model';
import { ClampSize, ClampSpec } from '../models/clamp.model';
import { HubSize, HubSpec, Duty } from '../models/hub.model';

import { NOMINAL_SIZES, PIPE_SIZES, getSchedulesForSize, getWallThickness } from './fixtures/pipe-sizes.fixture';
import { SEALRING_TYPES, SEALRING_SIZES, getSealringSpec } from './fixtures/sealrings.fixture';
import { CLAMP_SIZES, getClampSpec } from './fixtures/clamps.fixture';
import { HUB_SIZES, DUTIES, getHubSpec } from './fixtures/hubs.fixture';

const MOCK_DELAY_MS = 150;

@Injectable({ providedIn: 'root' })
export class MockCatalogueService implements CatalogueService {
  nominalSizes(): Observable<NominalSize[]> {
    return of(NOMINAL_SIZES).pipe(delay(MOCK_DELAY_MS));
  }

  pipeSizes(): Observable<PipeSize[]> {
    return of(PIPE_SIZES).pipe(delay(MOCK_DELAY_MS));
  }

  schedules(sizeId: NominalSizeId): Observable<Schedule[]> {
    return of(getSchedulesForSize(sizeId)).pipe(delay(MOCK_DELAY_MS));
  }

  pipeGeometry(q: PipeGeometryQuery): Observable<PipeGeometry | null> {
    const size = PIPE_SIZES.find(p => p.id === q.sizeId);
    if (!size) return of(null).pipe(delay(MOCK_DELAY_MS));
    const wall = getWallThickness(q.sizeId, q.scheduleId);
    if (wall === undefined) return of(null).pipe(delay(MOCK_DELAY_MS));
    const od = size.od;
    const bore = od - 2 * wall;
    return of({ od, wallThickness: wall, bore }).pipe(delay(MOCK_DELAY_MS));
  }

  sealringTypes(): Observable<SealringType[]> {
    return of(SEALRING_TYPES).pipe(delay(MOCK_DELAY_MS));
  }

  sealringSizes(typeId: string): Observable<SealringSize[]> {
    return of(SEALRING_SIZES.filter(s => s.typeId === typeId)).pipe(delay(MOCK_DELAY_MS));
  }

  sealring(typeId: string, sizeId: string): Observable<SealringSpec | null> {
    return of(getSealringSpec(typeId, sizeId) ?? null).pipe(delay(MOCK_DELAY_MS));
  }

  clampSizes(): Observable<ClampSize[]> {
    return of(CLAMP_SIZES).pipe(delay(MOCK_DELAY_MS));
  }

  clamp(sizeId: NominalSizeId): Observable<ClampSpec | null> {
    return of(getClampSpec(sizeId) ?? null).pipe(delay(MOCK_DELAY_MS));
  }

  hubSizes(): Observable<HubSize[]> {
    return of(HUB_SIZES).pipe(delay(MOCK_DELAY_MS));
  }

  hub(sizeId: NominalSizeId): Observable<HubSpec | null> {
    return of(getHubSpec(sizeId) ?? null).pipe(delay(MOCK_DELAY_MS));
  }

  duties(): Observable<Duty[]> {
    return of(DUTIES).pipe(delay(MOCK_DELAY_MS));
  }
}
