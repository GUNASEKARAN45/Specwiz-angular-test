import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/**
 * Status chip — green dot + "No errors" / error count.
 * SPEC.md §5.6, AC-STATUS-01, AC-STATUS-02
 */
@Component({
  selector: 'sw-status-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="status-chip"
      [class.clean]="errorCount === 0"
      [class.has-error]="errorCount > 0"
      aria-live="polite"
      role="status"
      tabindex="-1"
    >
      <span class="status-dot" [class.green]="errorCount === 0" [class.red]="errorCount > 0"></span>
      <span class="status-text">
        @if (errorCount === 0) {
          No errors
        } @else {
          {{ errorCount }} error{{ errorCount > 1 ? 's' : '' }}
        }
      </span>
    </div>
  `,
  styleUrls: ['./status-chip.component.scss'],
})
export class StatusChipComponent {
  @Input() errorCount = 0;
}
