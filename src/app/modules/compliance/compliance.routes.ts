import { Routes } from '@angular/router';

export const COMPLIANCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./compliance-dashboard/compliance-dashboard.component').then(
        (m) => m.ComplianceDashboardComponent
      ),
  },
];
