import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sw-stress-report-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <h2>Stress Report</h2>
      <p>Coming soon.</p>
    </div>
  `,
  styles: [`
    .placeholder-page {
      padding: 2rem;
      text-align: center;
    }
  `],
})
export class StressReportPageComponent {}
