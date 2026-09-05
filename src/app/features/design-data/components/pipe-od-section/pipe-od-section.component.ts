import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsMMPipe } from '../../../../shared/pipes/ins-mm.pipe';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { FieldRowComponent } from '../../../../shared/components/field-row/field-row.component';
import { ReadonlyFieldComponent } from '../../../../shared/components/readonly-field/readonly-field.component';
import { DualUnitFieldComponent } from '../../../../shared/components/dual-unit-field/dual-unit-field.component';
import { FormSectionComponent } from '../../../../shared/components/form-section/form-section.component';
import { PipeGeometry, PipeSize, Schedule, NominalSizeId } from '../../../../core/models/pipe.model';
import { DesignDataStore, PipeBasis, DimensionBasis } from '../../store/design-data.store';

@Component({
  selector: 'sw-pipe-od-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InsMMPipe,
    ActionButtonComponent,
    FieldRowComponent,
    ReadonlyFieldComponent,
    DualUnitFieldComponent,
    FormSectionComponent,
  ],
  template: `
    <sw-form-section title="Pipe / OD">
      <div class="pipe-controls">
        <!-- Group A: Pipe Basis -->
        <div class="basis-group">
          <fieldset class="radio-fieldset">
            <legend class="radio-legend">Pipe Basis</legend>
            <div class="radio-options" role="radiogroup" aria-label="Pipe Basis">
              <label class="radio-option">
                <input
                  type="radio"
                  name="pipeBasis"
                  value="pipe"
                  [checked]="store.pipeBasis() === 'pipe'"
                  (change)="onPipeBasis('pipe')"
                />
                <span>Pipe</span>
              </label>
              <label class="radio-option">
                <input
                  type="radio"
                  name="pipeBasis"
                  value="od"
                  [checked]="store.pipeBasis() === 'od'"
                  (change)="onPipeBasis('od')"
                />
                <span>OD</span>
              </label>
            </div>
          </fieldset>
        </div>

        <!-- Group B: Dimension Basis -->
        <div class="basis-group">
          <fieldset class="radio-fieldset">
            <legend class="radio-legend">Dimension Basis</legend>
            <div class="radio-options" role="radiogroup" aria-label="Dimension Basis">
              <label class="radio-option" [class.disabled-option]="!store.scheduleEnabled()">
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
              <label class="radio-option">
                <input
                  type="radio"
                  name="dimensionBasis"
                  value="wall_thickness"
                  [checked]="store.dimensionBasis() === 'wall_thickness'"
                  (change)="onDimensionBasis('wall_thickness')"
                />
                <span>Wall Thickness</span>
              </label>
              <label class="radio-option">
                <input
                  type="radio"
                  name="dimensionBasis"
                  value="bore"
                  [checked]="store.dimensionBasis() === 'bore'"
                  (change)="onDimensionBasis('bore')"
                />
                <span>Bore</span>
              </label>
            </div>
          </fieldset>
        </div>

        <!-- Controls column -->
        <div class="control-column">
          <div class="control-row">
            @if (store.pipeSizeSelectEnabled()) {
              <sw-field-row id="pipe-size" label="Pipe Size" unit="in">
                <select
                  class="form-select"
                  [value]="store.pipeSizeId() ?? ''"
                  [disabled]="!store.pipeSizeSelectEnabled()"
                  (change)="onPipeSize($event)"
                >
                  <option value="">Select...</option>
                  @for (size of pipeSizes; track size.id) {
                    <option [ngValue]="size.id">{{ size.label }}</option>
                  }
                </select>
              </sw-field-row>
            }

            @if (store.odInputEnabled()) {
              <sw-field-row id="od-value" label="Outside Diameter" unit="in">
                <input
                  type="number"
                  class="form-input"
                  step="0.001"
                  min="0"
                  [value]="store.odValue() ?? ''"
                  (input)="onOdValue($event)"
                  placeholder="0.000"
                />
              </sw-field-row>
            }
          </div>

          <div class="control-row">
            @if (store.dimensionBasis() === 'schedule' && store.scheduleEnabled()) {
              <sw-field-row id="schedule" label="Schedule">
                <select
                  class="form-select"
                  [value]="store.scheduleId() ?? ''"
                  (change)="onSchedule($event)"
                >
                  <option value="">Select...</option>
                  @for (s of schedules; track s.id) {
                    <option [ngValue]="s.id">{{ s.label }}</option>
                  }
                </select>
              </sw-field-row>
            }

            @if (store.dimensionBasis() === 'wall_thickness') {
              <sw-field-row id="wall-thickness" label="Wall Thickness" unit="in">
                <input
                  type="number"
                  class="form-input"
                  step="0.001"
                  min="0"
                  [value]="store.wallThickness() ?? ''"
                  placeholder="0.000"
                  (input)="onWallThickness($event)"
                />
              </sw-field-row>
            }

            @if (store.dimensionBasis() === 'bore') {
              <sw-field-row id="bore" label="Bore" unit="in">
                <input
                  type="number"
                  class="form-input"
                  step="0.001"
                  min="0"
                  [value]="store.bore() ?? ''"
                  placeholder="0.000"
                  (input)="onBore($event)"
                />
              </sw-field-row>
            }
          </div>
        </div>

        <!-- Read-only outputs -->
        <div class="outputs-column">
          <sw-readonly-field label="Outer Diameter" [value]="(resolvedGeom()?.od | insMm) ?? '0.000 ins'" />
          <sw-dual-unit-field label="Wall Thickness" [inches]="resolvedGeom()?.wallThickness ?? null" />
          <sw-dual-unit-field label="Bore" [inches]="resolvedGeom()?.bore ?? null" />
        </div>
      </div>

      <div class="section-actions">
        <sw-action-button
          label="Spec breaks"
          [disabled]="!store.pipeSectionComplete()"
          (clicked)="onSpecBreaks()"
        />
      </div>
    </sw-form-section>
  `,
  styleUrls: ['./pipe-od-section.component.scss'],
})
export class PipeOdSectionComponent {
  @Input({ required: true }) store!: DesignDataStore;
  @Input() pipeSizes: PipeSize[] = [];
  @Input() schedules: Schedule[] = [];
  @Output() specBreaksRequested = new EventEmitter<void>();

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
