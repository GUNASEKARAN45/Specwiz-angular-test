/**
 * Sealring section. Layout from ref-03: two selects on the left with the
 * Options button beneath, and the resolved geometry read-only on the right —
 * Inner Diameter alone on the first row, Rib Thickness and Outer Diameter
 * paired on the second.
 */
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SealringType, SealringSize } from '../../../../core/models/sealring.model';
import { formatInches, formatDualUnit } from '../../../../core/util/units.util';
import { DesignDataStore } from '../../store/design-data.store';

@Component({
  selector: 'sw-sealring-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <h2 class="dd-section-title">Sealring</h2>

    <div class="sealring-bands">
      <div class="controls">
        <select
          class="dd-select"
          aria-label="Sealring type"
          [value]="store.sealringTypeId() ?? ''"
          (change)="onType($event)"
        >
          <option value=""></option>
          @for (type of types; track type.id) {
            <option [value]="type.id">{{ type.label }}</option>
          }
        </select>

        <select
          class="dd-select"
          aria-label="Sealring size"
          [disabled]="!store.sealringTypeId()"
          [value]="store.sealringSizeId() ?? ''"
          (change)="onSize($event)"
        >
          <option value=""></option>
          @for (size of sizesForType; track size.id) {
            <option [value]="size.id">{{ size.label }}</option>
          }
        </select>

        <div class="dd-actions options-row">
          <button
            type="button"
            class="dd-btn"
            [disabled]="!store.sealringSectionComplete()"
            (click)="onOptions()"
          >Options</button>
        </div>
      </div>

      <div class="dd-pair dd-pair--duo outputs">
        <span class="dd-label" id="seal-id-label">Inner Diameter</span>
        <div class="dd-ro" role="status" aria-labelledby="seal-id-label">
          {{ dual(spec()?.id) }}
        </div>
        <span></span>
        <span></span>

        <span class="dd-label" id="seal-rib-label">Rib Thickness</span>
        <div class="dd-ro" role="status" aria-labelledby="seal-rib-label">
          {{ ins(spec()?.ribThickness) }}
        </div>
        <span class="dd-label" id="seal-od-label">Outer Diameter</span>
        <div class="dd-ro" role="status" aria-labelledby="seal-od-label">
          {{ ins(spec()?.od) }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./sealring-section.component.scss'],
})
export class SealringSectionComponent {
  @Input({ required: true }) store!: DesignDataStore;
  @Input() types: SealringType[] = [];
  @Input() sizesForType: SealringSize[] = [];
  @Output() optionsRequested = new EventEmitter<void>();

  readonly ins = formatInches;
  readonly dual = formatDualUnit;

  // A getter, not a field: @Input values are assigned AFTER construction,
  // so a field initializer reading `this.store` gets undefined and the
  // whole section throws before it can render.
  get spec() { return this.store.sealringSpec; }

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
