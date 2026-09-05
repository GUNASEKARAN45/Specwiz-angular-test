import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsMMPipe } from '../../../../shared/pipes/ins-mm.pipe';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { FieldRowComponent } from '../../../../shared/components/field-row/field-row.component';
import { ReadonlyFieldComponent } from '../../../../shared/components/readonly-field/readonly-field.component';
import { DualUnitFieldComponent } from '../../../../shared/components/dual-unit-field/dual-unit-field.component';
import { FormSectionComponent } from '../../../../shared/components/form-section/form-section.component';
import { SealringType, SealringSize, SealringSpec } from '../../../../core/models/sealring.model';
import { DesignDataStore } from '../../store/design-data.store';

@Component({
  selector: 'sw-sealring-section',
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
    <sw-form-section title="Sealring">
      <div class="sealring-controls">
        <div class="control-column">
          <sw-field-row id="sealring-type" label="Type">
            <select
              class="form-select"
              [value]="store.sealringTypeId() ?? ''"
              (change)="onType($event)"
            >
              <option value="">Select...</option>
              @for (t of types; track t.id) {
                <option ng-reflect-value="{}" [value]="t.id">{{ t.label }}</option>
              }
            </select>
          </sw-field-row>

          <sw-field-row id="sealring-size" label="Size">
            <select
              class="form-select"
              [value]="store.sealringSizeId() ?? ''"
              [disabled]="store.sealringTypeId() === null"
              (change)="onSize($event)"
            >
              <option value="">Select...</option>
              @for (s of sizesForType; track s.id) {
                <option ng-reflect-value="{}" [value]="s.id">{{ s.label }}</option>
              }
            </select>
          </sw-field-row>
        </div>

        <div class="outputs-column">
          <sw-dual-unit-field label="Inner Diameter" [inches]="store.sealringSpec()?.id ?? null" />
          <sw-readonly-field label="Rib Thickness" [value]="(spec()?.ribThickness | insMm) ?? '0.000 ins'" />
          <sw-readonly-field label="Outer Diameter" [value]="(spec()?.od | insMm) ?? '0.000 ins'" />
        </div>
      </div>

      <div class="section-actions">
        <sw-action-button
          label="Options"
          [disabled]="!store.sealringSectionComplete()"
          (clicked)="onOptions()"
        />
      </div>
    </sw-form-section>
  `,
  styleUrls: ['./sealring-section.component.scss'],
})
export class SealringSectionComponent {
  @Input({ required: true }) store!: DesignDataStore;
  @Input() types: SealringType[] = [];
  @Input() sizesForType: SealringSize[] = [];
  @Output() optionsRequested = new EventEmitter<void>();

  spec = this.store.sealringSpec;

    onType(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.store.setSealringType(target.value || null);
  }

  onSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.store.setSealringSize(target.value || null);
  }

  onOptions(): void {
    this.optionsRequested.emit();
  }
}
