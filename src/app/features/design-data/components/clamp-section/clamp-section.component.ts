import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsMMPipe } from '../../../../shared/pipes/ins-mm.pipe';
import { FieldRowComponent } from '../../../../shared/components/field-row/field-row.component';
import { ReadonlyFieldComponent } from '../../../../shared/components/readonly-field/readonly-field.component';
import { FormSectionComponent } from '../../../../shared/components/form-section/form-section.component';
import { ClampSize } from '../../../../core/models/clamp.model';
import { NominalSizeId } from '../../../../core/models/pipe.model';
import { DesignDataStore } from '../../store/design-data.store';

@Component({
  selector: 'sw-clamp-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InsMMPipe,
    FieldRowComponent,
    ReadonlyFieldComponent,
    FormSectionComponent,
  ],
  template: `
    <sw-form-section title="Clamp">
      <div class="clamp-controls">
        <div class="control-column">
          <sw-field-row id="clamp-size" label="Clamp">
            <select
              class="form-select"
              [value]="store.clampSizeId() ?? ''"
              (change)="onClampSize($event)"
            >
              <option value="">Select...</option>
              @for (c of clampSizes; track c.id) {
                <option [ngValue]="c.id">{{ c.label }}</option>
              }
            </select>
          </sw-field-row>

          <sw-field-row id="bolt-tensioned" label="Bolt Tensioned">
            <label class="checkbox-label">
              <input
                type="checkbox"
                class="checkbox"
                [checked]="store.boltTensioned()"
                (change)="onBoltTensioned($event)"
              />
              <span></span>
            </label>
          </sw-field-row>
        </div>

        <div class="outputs-column">
          <sw-readonly-field label="Inside Diameter" [value]="(spec()?.insideDiameter | insMm) ?? '0.000 ins'" />
          <sw-readonly-field label="Bolt Centres" [value]="(spec()?.boltCentres | insMm) ?? '0.000 ins'" />
          <sw-readonly-field label="Bolt Diameter" [value]="(spec()?.boltDiameter | insMm) ?? '0.000 ins'" />
          <sw-readonly-field label="Clamp Width" [value]="(spec()?.clampWidth | insMm) ?? '0.000 ins'" />
        </div>
      </div>
    </sw-form-section>
  `,
  styleUrls: ['./clamp-section.component.scss'],
})
export class ClampSectionComponent {
  @Input({ required: true }) store!: DesignDataStore;
  @Input() clampSizes: ClampSize[] = [];
  @Output() clampSizeChange = new EventEmitter<NominalSizeId | null>();

  // A getter, not a field: @Input values are assigned AFTER construction,
  // so a field initializer reading `this.store` gets undefined and the
  // whole section throws before it can render.
  get spec() { return this.store.clampSpec; }

  onClampSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const sizeId = value ? (value as NominalSizeId) : null;
    this.store.setClampSize(sizeId);
    this.clampSizeChange.emit(sizeId);
  }

  onBoltTensioned(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.store.setBoltTensioned(target.checked);
  }
}
