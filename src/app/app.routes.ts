import { Routes } from '@angular/router';
import { DesignDataPageComponent } from './features/design-data/design-data.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/design-data',
    pathMatch: 'full',
  },
  {
    path: 'piping-class-data',
    loadComponent: () =>
      import('./features/piping-class-data/piping-class-data.page').then(
        (m) => m.PipingClassDataPageComponent
      ),
  },
  {
    path: 'design-data',
    component: DesignDataPageComponent,
  },
  {
    path: 'output-data',
    loadComponent: () =>
      import('./features/output-data/output-data.page').then(
        (m) => m.OutputDataPageComponent
      ),
  },
  {
    path: 'stress-report',
    loadComponent: () =>
      import('./features/stress-report/stress-report.page').then(
        (m) => m.StressReportPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/design-data',
  },
];
