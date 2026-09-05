import { Component, ChangeDetectionStrategy, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CATALOGUE_TOKEN } from '../../core/catalogue/catalogue.token';
import { CatalogueService } from '../../core/catalogue/catalogue.service';
import { DesignDataStore } from './store/design-data.store';
import { PipeOdSectionComponent } from './components/pipe-od-section/pipe-od-section.component';
import { SealringSectionComponent } from './components/sealring-section/sealring-section.component';
import { ClampSectionComponent } from './components/clamp-section/clamp-section.component';
import { HubSectionComponent } from './components/hub-section/hub-section.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { NominalSizeId } from '../../core/models/pipe.model';
import { PipeSize, Schedule } from '../../core/models/pipe.model';
import { SealringType, SealringSize } from '../../core/models/sealring.model';
import { ClampSize } from '../../core/models/clamp.model';
import { HubSize, Duty } from '../../core/models/hub.model';

@Component({
  selector: 'sw-design-data-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PipeOdSectionComponent,
    SealringSectionComponent,
    ClampSectionComponent,
    HubSectionComponent,
    StatusChipComponent,
  ],
  templateUrl: './design-data.page.html',
  styleUrls: ['./design-data.page.scss'],
})
export class DesignDataPageComponent {
  catalogue = inject(CATALOGUE_TOKEN);
  store = new DesignDataStore();

  // Data loaded from catalogue
  pipeSizes = signal<PipeSize[]>([]);
  sealringTypes = signal<SealringType[]>([]);
  sealringSizes = signal<SealringSize[]>([]);
  clampSizes = signal<ClampSize[]>([]);
  hubSizes = signal<HubSize[]>([]);
  duties = signal<Duty[]>([]);
  schedulesForSelectedSize = signal<Schedule[]>([]);

  // Tab bar state
  currentTab = 'design-data';

  constructor() {
    this.loadCatalogueData();

    // React to pipe size changes
    effect(() => {
      const sizeId = this.store.pipeSizeId();
      if (sizeId) {
        this.loadSchedules(sizeId);
        this.resolvePipeGeometry();
      } else {
        this.schedulesForSelectedSize.set([]);
      }
    });

    // React to schedule changes
    effect(() => {
      const sizeId = this.store.pipeSizeId();
      const scheduleId = this.store.scheduleId();
      if (sizeId && scheduleId) {
        this.resolvePipeGeometry();
      }
    });

    // React to OD basis
    effect(() => {
      if (this.store.pipeBasis() === 'od') {
        const geom = this.store.resolvedPipeGeometry();
        this.store.setPipeGeometry(geom ?? null);
      }
    });

    // React to clamp selection for linkage
    effect(() => {
      const clampId = this.store.clampSizeId();
      if (clampId) {
        this.resolveClampAndLinkHub(clampId);
      }
    });

    // React to hub selection
    effect(() => {
      const hubId = this.store.hubSizeId();
      if (hubId) {
        this.resolveHubGeometry(hubId);
      } else {
        this.store.setHubSpec(null);
      }
    });

    // React to sealring type change (load sizes)
    effect(() => {
      const typeId = this.store.sealringTypeId();
      if (typeId) {
        this.catalogue.sealringSizes(typeId).subscribe(data => {
          this.sealringSizes.set(data);
        });
      } else {
        this.sealringSizes.set([]);
      }
    });

    // React to sealring selection for geometry
    effect(() => {
      const typeId = this.store.sealringTypeId();
      const sizeId = this.store.sealringSizeId();
      if (typeId && sizeId) {
        this.resolveSealring(typeId, sizeId);
      } else {
        this.store.setSealringSpec(null);
      }
    });
  }

  private loadCatalogueData(): void {
    this.catalogue.pipeSizes().subscribe(data => this.pipeSizes.set(data));
    this.catalogue.sealringTypes().subscribe(data => this.sealringTypes.set(data));
    this.catalogue.clampSizes().subscribe(data => this.clampSizes.set(data));
    this.catalogue.hubSizes().subscribe(data => this.hubSizes.set(data));
    this.catalogue.duties().subscribe(data => {
      this.duties.set(data);
      this.store.setDuties(data);
    });
  }

  private loadSchedules(sizeId: NominalSizeId): void {
    this.catalogue.schedules(sizeId).subscribe(data => {
      this.schedulesForSelectedSize.set(data);
    });
  }

  private resolvePipeGeometry(): void {
    const sizeId = this.store.pipeSizeId();
    const scheduleId = this.store.scheduleId();
    if (sizeId && scheduleId) {
      this.catalogue.pipeGeometry({ sizeId, scheduleId }).subscribe(geom => {
        this.store.setPipeGeometry(geom ?? null);
      });
    }
  }

  private resolveSealring(typeId: string, sizeId: string): void {
    this.catalogue.sealring(typeId, sizeId).subscribe(spec => {
      this.store.setSealringSpec(spec ?? null);
    });
  }

  private resolveClampAndLinkHub(clampId: NominalSizeId): void {
    this.catalogue.clamp(clampId).subscribe(spec => {
      this.store.setClampSpec(spec ?? null);
    });
    // Linkage: if no hub selected, auto-select hub of same nominal size
    if (this.store.hubSizeId() === null) {
      this.store.setHubSize(clampId);
    }
    // Resolve hub geometry
    const hubId = this.store.hubSizeId();
    if (hubId) {
      this.catalogue.hub(hubId).subscribe(spec => {
        this.store.setHubSpec(spec ?? null);
      });
    }
  }

  private resolveHubGeometry(hubId: NominalSizeId): void {
    this.catalogue.hub(hubId).subscribe(spec => {
      this.store.setHubSpec(spec ?? null);
    });
  }

  onSpecBreaks(): void {
    console.log('Spec breaks requested');
  }

  onSealringOptions(): void {
    console.log('Sealring options requested');
  }

  onHubOptions(): void {
    console.log('Hub options requested');
  }

  onClampSizeChange(sizeId: NominalSizeId | null): void {
    if (sizeId && this.store.hubSizeId() === null) {
      this.store.setHubSize(sizeId);
      this.resolveHubGeometry(sizeId);
    }
  }
}
