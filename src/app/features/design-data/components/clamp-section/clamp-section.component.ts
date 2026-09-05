/**
 * Clamp section. Layout from ref-03: the size select with the Bolt Tensioned
 * checkbox beneath on the left, and four read-only values in two pairs on the
 * right.
 *
 * The size chosen here drives the hub (G-DD-06). That linkage is emitted
 * upward and resolved in the store — this component does not know the hub
 * section exists, which is what AC-ARCH-02 asks of it.
 */
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClampSize } from '../../../../core/models/clamp.model';
import { NominalSizeId } from '../../../../core/models/pipe.model';
import { formatInches } from '../../../../core/util/units.util';
import { DesignDataStore } from '../../store/design-data.store';

@Component({
  selector: 'sw-clamp-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <h2 class="dd-section-title">Clamp</h2>

    <div class="clamp-bands">
      <div class="controls">
        <select
          class="dd-select"
          aria-label="Clamp size"
          [value]="store.clampSizeId() ?? ''"
          (change)="onClampSize($event)"
        >
          <option value=""></option>
          @for (size of clampSizes; track size.id) {
            <option [value]="size.id">{{ size.label }}</option>
          }
        </select>

        <label class="dd-check">
          <input
            type="checkbox"
            [checked]="store.boltTensioned()"
            (change)="onBoltTensioned($event)"
          />
          <span>Bolt Tensioned</span>
        </label>
      </div>

      <div class="dd-pair dd-pair--duo outputs">
        <span class="dd-label" id="clamp-id-label">Inside Diameter</span>
        <div class="dd-ro" role="status" aria-labelledby="clamp-id-label">
          {{ ins(spec()?.insideDiameter) }}
        </div>
        <span class="dd-label" id="clamp-bc-label">Bolt Centres</span>
        <div class="dd-ro" role="status" aria-labelledby="clamp-bc-label">
          {{ ins(spec()?.boltCentres) }}
        </div>

        <span class="dd-label" id="clamp-bd-label">Bolt Diameter</span>
        <div class="dd-ro" role="status" aria-labelledby="clamp-bd-label">
          {{ ins(spec()?.boltDiameter) }}
        </div>
        <span class="dd-label" id="clamp-cw-label">Clamp Width</span>
        <div class="dd-ro" role="status" aria-labelledby="clamp-cw-label">
          {{ ins(spec()?.clampWidth) }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./clamp-section.component.scss'],
})
export class ClampSectionComponent {
  @Input({ required: true }) store!: DesignDataStore;
  @Input() clampSizes: ClampSize[] = [];
  @Output() clampSizeChange = new EventEmitter<NominalSizeId | null>();

  readonly ins = formatInches;

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
