/**
 * Hub section. Layout from ref-03: the hub select with the Edit and Options
 * buttons beside it, the recessed checkbox beneath, and four read-only values
 * in two pairs on the right. Edit expands the detail panel inline, below this
 * row and inside this section (ref-05), and becomes Close while it is open.
 */
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubDetailPanelComponent } from './hub-detail-panel/hub-detail-panel.component';
import { HubSize, Duty } from '../../../../core/models/hub.model';
import { NominalSizeId } from '../../../../core/models/pipe.model';
import { formatInches } from '../../../../core/util/units.util';
import { DesignDataStore } from '../../store/design-data.store';
import { HubDetailEditable } from '../../design-data.models';

@Component({
  selector: 'sw-hub-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HubDetailPanelComponent],
  template: `
    <h2 class="dd-section-title">Hub</h2>

    <div class="hub-bands">
      <div class="controls">
        <div class="hub-row">
          <select
            class="dd-select"
            aria-label="Hub size"
            [value]="store.hubSizeId() ?? ''"
            (change)="onHubSize($event)"
          >
            <option value=""></option>
            @for (size of hubSizes; track size.id) {
              <option [value]="size.id">{{ size.label }}</option>
            }
          </select>

          <!-- G-DD-07: one control, two labels. Never both on screen. -->
          <button
            type="button"
            class="dd-btn"
            [attr.aria-expanded]="store.hubDetailExpanded()"
            aria-controls="hub-detail-panel"
            [disabled]="!store.hubSizeId()"
            (click)="onToggleDetail()"
          >{{ store.hubDetailExpanded() ? 'Close' : 'Edit' }}</button>

          <button
            type="button"
            class="dd-btn"
            [disabled]="!store.hubSectionComplete()"
            (click)="onOptions()"
          >Options</button>
        </div>

        <label class="dd-check">
          <input
            type="checkbox"
            [checked]="store.hubRecessed()"
            (change)="onRecessed($event)"
          />
          <span>recessed</span>
        </label>

        @if (store.clampDrivenHubNote()) {
          <p class="hub-note">{{ store.clampDrivenHubNote() }}</p>
        }
      </div>

      <div class="dd-pair dd-pair--duo outputs">
        <span class="dd-label" id="hub-od-label">Outside Diameter</span>
        <div class="dd-ro" role="status" aria-labelledby="hub-od-label">
          {{ ins(spec()?.outsideDiameter) }}
        </div>
        <span class="dd-label" id="hub-bf-label">Backface Diameter</span>
        <div class="dd-ro" role="status" aria-labelledby="hub-bf-label">
          {{ ins(spec()?.backfaceDiameter) }}
        </div>

        <span class="dd-label" id="hub-st-label">Shoulder Thickness</span>
        <div class="dd-ro" role="status" aria-labelledby="hub-st-label">
          {{ ins(spec()?.shoulderThickness) }}
        </div>
        <span class="dd-label" id="hub-mb-label">Maximum bore</span>
        <div class="dd-ro" role="status" aria-labelledby="hub-mb-label">
          {{ ins(spec()?.maxBore) }}
        </div>
      </div>
    </div>

    @if (store.hubDetailExpanded()) {
      <div id="hub-detail-panel">
        <sw-hub-detail-panel
          [hubSpec]="store.hubSpec()"
          [hubSizes]="hubSizesMapped()"
          [duties]="duties"
          [initialData]="hubDetailInitial()"
          (reset)="onResetDetail()"
        />
      </div>
    }
  `,
  styleUrls: ['./hub-section.component.scss'],
})
export class HubSectionComponent {
  @Input({ required: true }) store!: DesignDataStore;
  @Input() hubSizes: HubSize[] = [];
  @Input() duties: Duty[] = [];
  @Output() optionsRequested = new EventEmitter<void>();

  readonly ins = formatInches;

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

  // A getter, not a field: @Input values are assigned AFTER construction,
  // so a field initializer reading `this.store` gets undefined and the
  // whole section throws before it can render.
  get spec() { return this.store.hubSpec; }

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
