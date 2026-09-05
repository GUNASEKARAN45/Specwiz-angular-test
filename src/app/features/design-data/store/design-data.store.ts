/**
 * Signal-based store for the Design Data tab.
 * SPEC.md §5, §6, AC-BASIS-01..04, AC-DIM-01..03, AC-LINK-01, AC-LINK-02, G-DD-01..06
 *
 * All interlocks live here. Sections never import each other.
 */
import { signal, computed } from '@angular/core';
import type { PipeBasis, DimensionBasis, DesignDataState, HubDetailEditable } from '../design-data.models';
import { NominalSizeId, PipeGeometry } from '../../../core/models/pipe.model';
import type { SealringSpec } from '../../../core/models/sealring.model';
import type { ClampSpec } from '../../../core/models/clamp.model';
import type { HubSpec, Duty } from '../../../core/models/hub.model';

export type {
  PipeBasis,
  DimensionBasis,
  DesignDataState,
  HubDetailEditable,
};

export class DesignDataStore {
  // ---- Pipe basis state ----
  private _pipeBasis = signal<PipeBasis>('pipe');
  pipeBasis = this._pipeBasis.asReadonly();

  // ---- Dimension basis state ----
  private _dimensionBasis = signal<DimensionBasis>('schedule');
  dimensionBasis = this._dimensionBasis.asReadonly();

  // ---- Pipe section selections ----
  private _pipeSizeId = signal<NominalSizeId | null>(null);
  pipeSizeId = this._pipeSizeId.asReadonly();

  private _odValue = signal<number | null>(null);
  odValue = this._odValue.asReadonly();

  private _scheduleId = signal<string | null>(null);
  scheduleId = this._scheduleId.asReadonly();

  private _wallThickness = signal<number | null>(null);
  wallThickness = this._wallThickness.asReadonly();

  private _bore = signal<number | null>(null);
  bore = this._bore.asReadonly();

  // ---- Sealring section selections ----
  private _sealringTypeId = signal<string | null>(null);
  sealringTypeId = this._sealringTypeId.asReadonly();

  private _sealringSizeId = signal<string | null>(null);
  sealringSizeId = this._sealringSizeId.asReadonly();

  // ---- Clamp section selections ----
  private _clampSizeId = signal<NominalSizeId | null>(null);
  clampSizeId = this._clampSizeId.asReadonly();

  private _boltTensioned = signal(false);
  boltTensioned = this._boltTensioned.asReadonly();

  // ---- Hub section selections ----
  private _hubSizeId = signal<NominalSizeId | null>(null);
  hubSizeId = this._hubSizeId.asReadonly();

  private _hubRecessed = signal(false);
  hubRecessed = this._hubRecessed.asReadonly();

  private _hubDetailExpanded = signal(false);
  hubDetailExpanded = this._hubDetailExpanded.asReadonly();

  private _hubOverride = signal(false);
  hubOverride = this._hubOverride.asReadonly();

  // ---- Resolved geometry (set via effects in the page component) ----
  private _pipeGeometry = signal<PipeGeometry | null>(null);
  pipeGeometry = this._pipeGeometry.asReadonly();

  private _sealringSpec = signal<SealringSpec | null>(null);
  sealringSpec = this._sealringSpec.asReadonly();

  private _clampSpec = signal<ClampSpec | null>(null);
  clampSpec = this._clampSpec.asReadonly();

  private _hubSpec = signal<HubSpec | null>(null);
  hubSpec = this._hubSpec.asReadonly();

  // ---- Hub detail editable fields ----
  private _hubDetail = signal<HubDetailEditable | null>(null);
  hubDetail = this._hubDetail.asReadonly();

  private _duties: Duty[] = [];
  setDuties(duties: Duty[]): void {
    this._duties = duties;
  }
  getDuties = () => this._duties;

  // ======================== PIPE BASIS SETTERS ========================

  setPipeBasis(value: PipeBasis): void {
    this._pipeBasis.set(value);

    // G-DD-01 / AC-BASIS-03: When basis switches to 'od', dimension basis cannot be 'schedule'.
    if (value === 'od' && this._dimensionBasis() === 'schedule') {
      this._dimensionBasis.set('wall_thickness');
    }

    if (value === 'pipe') {
      this._odValue.set(null);
    }
  }

  setDimensionBasis(value: DimensionBasis): void {
    // G-DD-01: Reject (od, schedule) pair per AC-BASIS-02.
    if (this._pipeBasis() === 'od' && value === 'schedule') {
      return;
    }

    // Clear the old dimension value when switching
    switch (this._dimensionBasis()) {
      case 'schedule':
        this._scheduleId.set(null);
        break;
      case 'wall_thickness':
        this._wallThickness.set(null);
        break;
      case 'bore':
        this._bore.set(null);
        break;
    }

    this._dimensionBasis.set(value);
  }

  setPipeSize(value: NominalSizeId | null): void {
    this._pipeSizeId.set(value);
    this._scheduleId.set(null);
  }

  setOdValue(value: number | null): void {
    this._odValue.set(value);
  }

  setSchedule(value: string | null): void {
    this._scheduleId.set(value);
  }

  setWallThickness(value: number | null): void {
    this._wallThickness.set(value);
  }

  setBore(value: number | null): void {
    this._bore.set(value);
  }

  // ======================== SEALRING SETTERS ========================

  setSealringType(value: string | null): void {
    this._sealringTypeId.set(value);
    this._sealringSizeId.set(null);
  }

  setSealringSize(value: string | null): void {
    this._sealringSizeId.set(value);
  }

  // ======================== CLAMP SETTERS ========================

  setClampSize(value: NominalSizeId | null): void {
    this._clampSizeId.set(value);

    // G-DD-06 / AC-LINK-01: Clamp→hub linkage is unconditional.
    if (value !== null) {
      this._hubSizeId.set(value);
      this._hubOverride.set(false);
    }
  }

  setBoltTensioned(value: boolean): void {
    this._boltTensioned.set(value);
  }

  // ======================== HUB SETTERS ========================

  setHubSize(value: NominalSizeId | null): void {
    this._hubSizeId.set(value);
    if (value !== null) {
      this._hubOverride.set(true);
    }
  }

  setHubRecessed(value: boolean): void {
    this._hubRecessed.set(value);
  }

  toggleHubDetail(): void {
    this._hubDetailExpanded.update(v => !v);
  }

  setHubDetail(value: boolean): void {
    this._hubDetailExpanded.set(value);
  }

  setHubDetailEditable(data: HubDetailEditable): void {
    this._hubDetail.set(data);
  }

  resetHubDetail(hubSpec: HubSpec | null): void {
    if (hubSpec) {
      this._hubDetail.set({
        size: hubSpec.sizeId,
        lengthD: 0.5,
        hubTaperAngle: 2.0,
        frictionAngle: 0.3,
        duty: 'standard',
        backfaceDepthE: 0.25,
        blindLength: 1.0,
      });
    }
  }

  // ======================== GEOMETRY RESOLVERS (called by page) ========================

  setPipeGeometry(geom: PipeGeometry | null): void {
    this._pipeGeometry.set(geom);
  }

  setSealringSpec(spec: SealringSpec | null): void {
    this._sealringSpec.set(spec);
  }

  setClampSpec(spec: ClampSpec | null): void {
    this._clampSpec.set(spec);
  }

  setHubSpec(spec: HubSpec | null): void {
    this._hubSpec.set(spec);
  }

  // ======================== COMPUTED SIGNALS ========================

  /**
   * Whether the pipe section has a complete selection.
   * Used to enable Spec breaks button.
   */
  pipeSectionComplete = computed(() => {
    const geom = this._pipeGeometry();
    return geom !== null && geom.od > 0;
  });

  /**
   * Whether the sealring section has a complete selection.
   */
  sealringSectionComplete = computed(() => {
    return this._sealringTypeId() !== null &&
           this._sealringSizeId() !== null &&
           this._sealringSpec() !== null;
  });

  /**
   * Whether the hub section has a complete selection.
   */
  hubSectionComplete = computed(() => {
    return this._hubSizeId() !== null &&
           this._hubSpec() !== null;
  });

  /**
   * G-DD-01: Schedule is enabled only when pipe basis is 'pipe'.
   */
  scheduleEnabled = computed(() => this._pipeBasis() === 'pipe');

  /**
   * Wall thickness and bore are always enabled.
   */
  wallThicknessEnabled = computed(() => true);
  boreEnabled = computed(() => true);

  /** AC-BASIS-04: pipe size select enabled when basis is pipe. */
  pipeSizeSelectEnabled = computed(() => this._pipeBasis() === 'pipe');

  /** AC-BASIS-04: OD input enabled when basis is od. */
  odInputEnabled = computed(() => this._pipeBasis() === 'od');

  /**
   * Computed pipe geometry: when OD basis + wall/bore provided, resolve.
   * When pipe basis + schedule, geometry comes from catalogue (set by page).
   */
  resolvedPipeGeometry = computed(() => {
    const geom = this._pipeGeometry();
    if (geom) return geom;

    if (this._pipeBasis() === 'od') {
      const od = this._odValue();
      const wall = this._wallThickness();
      const bore = this._bore();

      if (od !== null) {
        if (wall !== null) {
          return { od, wallThickness: wall, bore: od - 2 * wall };
        }
        if (bore !== null) {
          return { od, wallThickness: (od - bore) / 2, bore };
        }
        return null;
      }
    }

    return null;
  });

  /**
   * Validation state for the status chip.
   * AC-STATUS-01, AC-STATUS-02
   */
  errorCount = computed(() => {
    let count = 0;

    const od = this._odValue();
    const wall = this._wallThickness();
    const bore = this._bore();

    if (od !== null && od < 0) count++;
    if (wall !== null && wall < 0) count++;
    if (bore !== null && bore < 0) count++;
    if (od !== null && bore !== null && bore >= od) count++;
    if (od !== null && wall !== null && wall > od / 2) count++;

    return count;
  });

  /** Whether the clamp drove the current hub (for inline note). */
  clampDrivenHubNote = computed(() => {
    return this._hubOverride() === false 
      && this._hubSizeId() !== null 
      && this._clampSizeId() === this._hubSizeId();
  });

  /** Whether the hub was manually overridden. */
  hubOverridden = computed(() => {
    return this._hubOverride() 
      && this._hubSizeId() !== null 
      && this._clampSizeId() !== this._hubSizeId();
  });

  /** Get the current state as a snapshot (for tests). */
  getState(): DesignDataState {
    return {
      pipeBasis: this._pipeBasis(),
      dimensionBasis: this._dimensionBasis(),
      pipeSizeId: this._pipeSizeId(),
      odValue: this._odValue(),
      scheduleId: this._scheduleId(),
      wallThickness: this._wallThickness(),
      bore: this._bore(),
      sealringTypeId: this._sealringTypeId(),
      sealringSizeId: this._sealringSizeId(),
      clampSizeId: this._clampSizeId(),
      boltTensioned: this._boltTensioned(),
      hubSizeId: this._hubSizeId(),
      hubRecessed: this._hubRecessed(),
      hubDetailExpanded: this._hubDetailExpanded(),
      hubOverride: this._hubOverride(),
    };
  }
}
