import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsMMPipe } from '../../../../shared/pipes/ins-mm.pipe';
import { FieldRowComponent } from '../../../../shared/components/field-row/field-row.component';
import { ReadonlyFieldComponent } from '../../../../shared/components/readonly-field/readonly-field.component';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { HubSpec, Duty } from '../../../../core/models/hub.model';
import { HubDetailEditable } from '../../design-data.models';

@Component({
  selector: 'sw-hub-detail-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InsMMPipe,
    FieldRowComponent,
    ReadonlyFieldComponent,
    ActionButtonComponent,
  ],
  template: `
    <div class="hub-detail-panel" role="region" aria-label="Hub Details">
      <!-- Diagram with callouts A, B, C, D, E, Z/2, φ -->
      <div class="diagram">
        <svg viewBox="0 0 400 160" class="hub-diagram" aria-hidden="true" focusable="false">
          <!-- Main hub body (hub connected to pipe) -->
          <g stroke="currentColor" stroke-width="2" fill="none">
            <!-- Hub outer body -->
            <rect x="60" y="40" width="280" height="80" rx="6" />
            <!-- Hub shoulder -->
            <rect x="60" y="30" width="100" height="20" rx="3" />
            <!-- Backface -->
            <rect x="240" y="28" width="100" height="14" rx="3" />
          </g>
          <!-- Diameter lines with callouts -->
          <g stroke="currentColor" stroke-width="1" stroke-dasharray="4 2" fill="none">
            <!-- A: Outside diameter -->
            <line x1="60" y1="130" x2="340" y2="130" />
            <text x="60" y="145" font-size="12" text-anchor="middle">A</text>
            <text x="340" y="145" font-size="12" text-anchor="middle">A</text>
            <!-- Z/2: Total shoulder thickness (half shown) -->
            <line x1="60" y1="30" x2="160" y2="30" />
            <text x="110" y="25" font-size="12" text-anchor="middle">Z/2</text>
            <!-- B: Backface diameter -->
            <line x1="240" y1="10" x2="340" y2="10" />
            <text x="240" y="5" font-size="12" text-anchor="middle">B</text>
            <text x="340" y="5" font-size="12" text-anchor="middle">B</text>
            <!-- C D E labels -->
            <text x="200" y="95" font-size="12" text-anchor="middle">C D E</text>
            <!-- phi shoulder angle -->
            <text x="200" y="155" font-size="12" text-anchor="middle">φ</text>
          </g>
        </svg>
      </div>

      <div class="hub-fields">
        <div class="field-column">
          <sw-field-row label="Size" id="hub-detail-size">
            <select class="form-select" [formControl]="fg.controls.size">
              @for (d of hubSizes; track d.id) {
                <option [ngValue]="d.id">{{ d.label }}</option>
              }
            </select>
          </sw-field-row>
          <sw-readonly-field label="Outside diameter (A)" [value]="(hubSpec?.outsideDiameter | insMm) ?? '0.000 ins'" />
          <sw-field-row label="Length (D)" id="hub-length-d" unit="in">
            <input type="number" class="form-input" step="0.001" [formControl]="fg.controls.lengthD" placeholder="0.000" />
          </sw-field-row>
          <sw-readonly-field label="Total shoulder thickness (Z)" [value]="(hubSpec?.shoulderThickness | insMm) ?? '0.000 ins'" />
          <sw-field-row label="Hub taper angle" id="hub-taper" unit="°">
            <input type="number" class="form-input" step="0.01" [formControl]="fg.controls.hubTaperAngle" placeholder="0.00" />
          </sw-field-row>
          <sw-field-row label="Friction angle" id="friction-angle" unit="°">
            <input type="number" class="form-input" step="0.01" [formControl]="fg.controls.frictionAngle" placeholder="0.00" />
          </sw-field-row>
        </div>

        <div class="field-column">
          <sw-field-row label="Duty" id="hub-duty">
            <select class="form-select" [formControl]="fg.controls.duty">
              @for (d of duties; track d.id) {
                <option [ngValue]="d.id">{{ d.label }}</option>
              }
            </select>
          </sw-field-row>
          <sw-readonly-field label="Backface diameter (B)" [value]="(hubSpec?.backfaceDiameter | insMm) ?? '0.000 ins'" />
          <sw-field-row label="Backface depth (E)" id="backface-depth" unit="in">
            <input type="number" class="form-input" step="0.001" [formControl]="fg.controls.backfaceDepthE" placeholder="0.000" />
          </sw-field-row>
          <sw-readonly-field label="Shoulder angle" [value]="'0.00 °'" />
          <sw-readonly-field label="Pipe taper angle" [value]="'0.00 °'" />
          <sw-field-row label="Blind length" id="blind-length" unit="in">
            <input type="number" class="form-input" step="0.001" [formControl]="fg.controls.blindLength" placeholder="0.000" />
          </sw-field-row>
        </div>
      </div>

      <div class="panel-actions">
        <sw-action-button label="Reset" (clicked)="onReset()" />
      </div>
    </div>
  `,
  styleUrls: ['./hub-detail-panel.component.scss'],
})
export class HubDetailPanelComponent implements OnInit {
  @Input({ required: true }) hubSpec: HubSpec | null = null;
  @Input() hubSizes: { id: string; label: string }[] = [];
  @Input() duties: Duty[] = [];
  @Input() initialData: HubDetailEditable | null = null;
  @Output() reset = new EventEmitter<void>();

  fg: FormGroup;

  constructor(private fb: FormBuilder) {
    this.fg = this.fb.group({
      size: [null],
      lengthD: [null, [Validators.min(0)]],
      hubTaperAngle: [null, [Validators.min(0)]],
      frictionAngle: [null, [Validators.min(0)]],
      duty: ['standard'],
      backfaceDepthE: [null, [Validators.min(0)]],
      blindLength: [null, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (this.initialData) {
      this.fg.patchValue(this.initialData);
    }
  }

  onReset(): void {
    this.reset.emit();
  }
}
