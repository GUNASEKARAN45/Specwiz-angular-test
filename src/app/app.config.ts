import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { CATALOGUE_TOKEN } from './core/catalogue/catalogue.token';
import { MockCatalogueService } from './core/catalogue/catalogue.mock';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    // AC-ARCH-03: catalogue reached only through the injected token
    { provide: CATALOGUE_TOKEN, useClass: MockCatalogueService },
  ],
};
