import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ReadonlyFieldComponent } from '../readonly-field/readonly-field.component';
import { formatDualUnit } from '../../../core/util/units.util';

@Component({
  selector: 'sw-dual-unit-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sw-readonly-field [label]="label" [value]="displayValue" />
  `,
  styleUrls: ['./dual-unit-field.component.scss'],
  imports: [ReadonlyFieldComponent],
})
export class DualUnitFieldComponent {
  @Input({ required: true }) label!: string;
  @Input() inches: number | null | undefined = null;

  get displayValue(): string {
    return formatDualUnit(this.inches);
  }
}
