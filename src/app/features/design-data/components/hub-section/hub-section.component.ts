import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsMMPipe } from '../../../../shared/pipes/ins-mm.pipe';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { FieldRowComponent } from '../../../../shared/components/field-row/field-row.component';
import { ReadonlyFieldComponent } from '../../../../shared/components/readonly-field/readonly-field.component';
import { FormSectionComponent } from '../../../../shared/components/form-section/form-section.component';
import { HubDetailPanelComponent } from './hub-detail-panel/hub-detail-panel.component';
import { HubSize, HubSpec, Duty } from '../../../../core/models/hub.model';
import { NominalSizeId } from '../../../../core/models/pipe.model';
import { DesignDataStore } from '../../store/design-data.store';
import { HubDetailEditable } from '../../design-data.models';

@Component({
  selector: 'sw-hub-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InsMMPipe,
    ActionButtonComponent,
    FieldRowComponent,
    ReadonlyFieldComponent,
    FormSectionComponent,
    HubDetailPanelComponent,
  ],
  template: `
    <sw-form-section title="Hub">
      <div class="hub-controls">
        <div class="control-column">
          <sw-field-row id="hub-size" label="Hub">
            <select
              class="form-select"
              [value]="store.hubSizeId() ?? ''"
              (change)="onHubSize($event)"
            >
              <option value="">Select...</option>
              @for (h of hubSizes; track h.id) {
                <option [ngValue]="h.id">{{ h.label }}</option>
              }
            </select>
          </sw-field-row>

          @if (store.hubSizeId() !== null) {
            <div class="hub-note" *ngIf="store.clampDrivenHubNote()">
              Auto-selected by clamp size
            </div>
          }

          <sw-field-row id="recessed" label="Recessed">
            <label class="checkbox-label">
              <input
                type="checkbox"
                class="checkbox"
                [checked]="store.hubRecessed()"
                (change)="onRecessed($event)"
              />
              <span></span>
            </label>
          </sw-field-row>
        </div>

        <div class="outputs-column">
          <sw-readonly-field label="Outside Diameter" [value]="(spec()?.outsideDiameter | insMm) ?? '0.000 ins'" />
          <sw-readonly-field label="Backface Diameter" [value]="(spec()?.backfaceDiameter | insMm) ?? '0.000 ins'" />
          <sw-readonly-field label="Shoulder Thickness" [value]="(spec()?.shoulderThickness | insMm) ?? '0.000 ins'" />
          <sw-readonly-field label="Maximum bore" [value]="(spec()?.maxBore | insMm) ?? '0.000 ins'" />
        </div>
      </div>

      <div class="hub-actions">
        <sw-action-button
          label="Edit"
          [disabled]="!store.hubSectionComplete()"
          (clicked)="onToggleDetail()"
        />
        <sw-action-button
          label="Options"
          [disabled]="!store.hubSectionComplete()"
          (clicked)="onOptions()"
        />
      </div>

      <!-- Inline detail panel — toggles with Edit/Close -->
      @if (store.hubDetailExpanded()) {
        <sw-hub-detail-panel
          [hubSpec]="store.hubSpec()"
          [hubSizes]="hubSizesMapped()"
          [duties]="duties"
          [initialData]="hubDetailInitial()"
          (reset)="onResetDetail()"
        />
      }
    </sw-form-section>
  `,
  styleUrls: ['./hub-section.component.scss'],
})
export class HubSectionComponent {
  @Input({ required: true }) store!: DesignDataStore;
  @Input() hubSizes: HubSize[] = [];
  @Input() duties: Duty[] = [];
  @Output() optionsRequested = new EventEmitter<void>();

  hubSizesMapped = computed(() => this.hubSizes.map(h => ({ id: h.id, label: h.label })));
  hubDetailInitial = computed<HubDetailEditable | null>(() => {
    const spec = this.store.hubSpec();
    if (!spec) return null;
    return {
      size: spec.sizeId,
      lengthD: 0.5,
      hubTaperAngle: 2.0,
      frictionAngle: 0.3,
      duty: 'standard',
      backfaceDepthE: 0.25,
      blindLength: 1.0,
    };
  });

  spec = this.store.hubSpec;

  onHubSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const sizeId = value ? (value as NominalSizeId) : null;
    this.store.setHubSize(sizeId);
  }

  onRecessed(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.store.setHubRecessed(target.checked);
  }

  onToggleDetail(): void {
    this.store.toggleHubDetail();
  }

  onOptions(): void {
    this.optionsRequested.emit();
  }

  onResetDetail(): void {
    const spec = this.store.hubSpec();
    if (spec) {
      this.store.resetHubDetail(spec);
    }
  }
}
