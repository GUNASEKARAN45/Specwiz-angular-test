import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'sw-field-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field-row">
      <label class="field-label" [for]="id">{{ label }}</label>
      <ng-content />
      @if (unit) {
        <span class="field-unit" aria-hidden="true">{{ unit }}</span>
      }
    </div>
  `,
  styleUrls: ['./field-row.component.scss'],
})
export class FieldRowComponent {
  @Input() id!: string;
  @Input({ required: true }) label!: string;
  @Input() unit: string | null = null;
}
