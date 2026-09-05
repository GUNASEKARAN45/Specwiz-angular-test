import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'sw-form-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="form-section">
      <h2 class="section-title">{{ title }}</h2>
      <div class="section-content">
        <ng-content />
      </div>
      <div class="section-rule"></div>
    </section>
  `,
  styleUrls: ['./form-section.component.scss'],
})
export class FormSectionComponent {
  @Input({ required: true }) title!: string;
}
