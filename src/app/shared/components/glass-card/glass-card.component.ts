import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'sw-glass-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="glass-card" [class.elevated]="elevated">
      <ng-content />
    </section>
  `,
  styleUrls: ['./glass-card.component.scss'],
})
export class GlassCardComponent {
  @Input() elevated = false;
}
