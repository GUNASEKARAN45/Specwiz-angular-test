/**
 * Injection token for the CatalogueService.
 * SPEC.md §6, AC-ARCH-03 — components depend on this token, not the mock directly.
 */
import { InjectionToken } from '@angular/core';
import { CatalogueService } from './catalogue.service';

export const CATALOGUE_TOKEN = new InjectionToken<CatalogueService>(
  'CatalogueService'
);
