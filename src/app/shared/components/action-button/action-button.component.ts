import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

/**
 * Blue pill action button with halo.
 * SPEC.md §4 — "the blue pill buttons keep their glow"
 */
@Component({
  selector: 'sw-action-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="action-button"
      [disabled]="disabled"
      (click)="onClick()"
      [attr.aria-label]="label"
    >
      {{ label }}
    </button>
  `,
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent {
  @Input({ required: true }) label!: string;
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
