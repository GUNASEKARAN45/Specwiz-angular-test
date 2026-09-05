/**
 * Pipe / OD section — the top block of the Design Data tab.
 *
 * Layout follows ref-01 and ref-03: pipe basis on the left, dimension basis in
 * the middle, resolved geometry read-only on the right, and the Spec breaks
 * button beneath. Every control stays on screen at all times; an interlock
 * greys it rather than removing it (G-DD-04), which is both what the reference
 * shows and what keeps the layout from jumping as radios change.
 */
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeSize, Schedule, NominalSizeId } from '../../../../core/models/pipe.model';
import { formatInches, formatDualUnit } from '../../../../core/util/units.util';
import { DesignDataStore, PipeBasis, DimensionBasis } from '../../store/design-data.store';

@Component({
  selector: 'sw-pipe-od-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="dd-bands">
      <fieldset class="dd-fieldset">
        <legend class="dd-sr-only">Pipe basis</legend>
        <div class="dd-pair">
          <label class="dd-radio">
            <input
              type="radio"
              name="pipeBasis"
              value="pipe"
              [checked]="store.pipeBasis() === 'pipe'"
              (change)="onPipeBasis('pipe')"
            />
            <span>Pipe</span>
          </label>
          <select
            class="dd-select"
            aria-label="Nominal pipe size"
            [disabled]="!store.pipeSizeSelectEnabled()"
            [value]="store.pipeSizeId() ?? ''"
            (change)="onPipeSize($event)"
          >
            <option value=""></option>
            @for (size of pipeSizes; track size.id) {
              <option [value]="size.id">{{ size.label }}</option>
            }
          </select>

          <label class="dd-radio">
            <input
              type="radio"
              name="pipeBasis"
              value="od"
              [checked]="store.pipeBasis() === 'od'"
              (change)="onPipeBasis('od')"
            />
            <span>OD</span>
          </label>
          <input
            class="dd-input"
            type="number"
            step="0.001"
            placeholder="0.000"
            aria-label="Outside diameter in inches"
            [disabled]="!store.odInputEnabled()"
            [value]="store.odValue() ?? ''"
            (input)="onOdValue($event)"
          />
        </div>
      </fieldset>

      <fieldset class="dd-fieldset">
        <legend class="dd-sr-only">Dimension basis</legend>
        <div class="dd-pair">
          <label class="dd-radio">
            <input
              type="radio"
              name="dimensionBasis"
              value="schedule"
              [checked]="store.dimensionBasis() === 'schedule'"
              [disabled]="!store.scheduleEnabled()"
              (change)="onDimensionBasis('schedule')"
            />
            <span>Schedule</span>
          </label>
          <select
            class="dd-select"
            aria-label="Schedule"
            [disabled]="store.dimensionBasis() !== 'schedule' || !store.scheduleEnabled()"
            [value]="store.scheduleId() ?? ''"
            (change)="onSchedule($event)"
          >
            <option value=""></option>
            @for (schedule of schedules; track schedule.id) {
              <option [value]="schedule.id">{{ schedule.label }}</option>
            }
          </select>

          <label class="dd-radio">
            <input
              type="radio"
              name="dimensionBasis"
              value="wall_thickness"
              [checked]="store.dimensionBasis() === 'wall_thickness'"
              (change)="onDimensionBasis('wall_thickness')"
            />
            <span>Wall Thickness</span>
          </label>
          <input
            class="dd-input"
            type="number"
            step="0.001"
            placeholder="0.000"
            aria-label="Wall thickness in inches"
            [disabled]="store.dimensionBasis() !== 'wall_thickness'"
            [value]="store.wallThickness() ?? ''"
            (input)="onWallThickness($event)"
          />

          <label class="dd-radio">
            <input
              type="radio"
              name="dimensionBasis"
              value="bore"
              [checked]="store.dimensionBasis() === 'bore'"
              (change)="onDimensionBasis('bore')"
            />
            <span>Bore</span>
          </label>
          <input
            class="dd-input"
            type="number"
            step="0.001"
            placeholder="0.000"
            aria-label="Bore in inches"
            [disabled]="store.dimensionBasis() !== 'bore'"
            [value]="store.bore() ?? ''"
            (input)="onBore($event)"
          />
        </div>
      </fieldset>

      <div class="dd-pair">
        <span class="dd-label" id="pipe-od-label">Outer Diameter</span>
        <div class="dd-ro" role="status" aria-labelledby="pipe-od-label">
          {{ ins(resolvedGeom()?.od) }}
        </div>

        <span class="dd-label" id="pipe-wall-label">Wall thickness</span>
        <div class="dd-ro" role="status" aria-labelledby="pipe-wall-label">
          {{ dual(resolvedGeom()?.wallThickness) }}
        </div>

        <span class="dd-label" id="pipe-bore-label">Bore</span>
        <div class="dd-ro" role="status" aria-labelledby="pipe-bore-label">
          {{ dual(resolvedGeom()?.bore) }}
        </div>
      </div>
    </div>

    <div class="dd-actions">
      <button
        type="button"
        class="dd-btn"
        [disabled]="!store.pipeSectionComplete()"
        (click)="onSpecBreaks()"
      >Spec breaks</button>
    </div>
  `,
  styleUrls: ['./pipe-od-section.component.scss'],
})
export class PipeOdSectionComponent {
  @Input({ required: true }) store!: DesignDataStore;
  @Input() pipeSizes: PipeSize[] = [];
  @Input() schedules: Schedule[] = [];
  @Output() specBreaksRequested = new EventEmitter<void>();

  /** Formatters bound for the template; both answer a placeholder for null. */
  readonly ins = formatInches;
  readonly dual = formatDualUnit;

  // A getter, not a field: @Input values are assigned AFTER construction,
  // so a field initializer reading `this.store` gets undefined and the
  // whole section throws before it can render.
  get resolvedGeom() { return this.store.resolvedPipeGeometry; }

  onPipeBasis(basis: PipeBasis): void {
    this.store.setPipeBasis(basis);
  }

  onDimensionBasis(dim: DimensionBasis): void {
    this.store.setDimensionBasis(dim);
  }

  onPipeSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.store.setPipeSize(value ? (value as NominalSizeId) : null);
  }

  onOdValue(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.store.setOdValue(value ? parseFloat(value) : null);
  }

  onSchedule(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.store.setSchedule(value || null);
  }

  onWallThickness(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.store.setWallThickness(value ? parseFloat(value) : null);
  }

  onBore(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.store.setBore(value ? parseFloat(value) : null);
  }

  onSpecBreaks(): void {
    this.specBreaksRequested.emit();
  }
}
