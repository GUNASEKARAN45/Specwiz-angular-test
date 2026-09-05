import { Component, ChangeDetectionStrategy, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Accessible radio option.
 * G-DD-09 — uses fieldset/legend with role=radiogroup fallback.
 */
@Component({
  selector: 'sw-radio-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="radio-option"
      [class.selected]="selected"
      [class.disabled]="disabled"
      [attr.aria-disabled]="disabled ? 'true' : null"
      role="radio"
      [attr.aria-checked]="selected"
      tabindex="0"
      (click)="onSelect()"
      (keydown.enter)="onSelect()"
      (keydown.space)="onSelect()"
    >
      <span class="radio-dot" [class.checked]="selected" />
      <span class="radio-label">{{ label }}</span>
    </div>
  `,
  styleUrls: ['./radio-option.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioOptionComponent),
      multi: true,
    },
  ],
})
export class RadioOptionComponent implements ControlValueAccessor {
  @Input({ required: true }) label!: string;
  @Input() selected = false;
  @Input() disabled = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.selected = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelect(): void {
    if (this.disabled) return;
    this.onTouched();
    this.selected = true;
    this.onChange(true);
  }
}
