import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'sw-readonly-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="readonly-field" [attr.aria-label]="label">
      <span class="readonly-value">{{ value }}</span>
    </div>
  `,
  styleUrls: ['./readonly-field.component.scss'],
})
export class ReadonlyFieldComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string;
}
