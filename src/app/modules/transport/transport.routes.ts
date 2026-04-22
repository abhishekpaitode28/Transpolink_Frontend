import { Routes } from '@angular/router';

export const TRANSPORT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./transport-dashboard/transport-dashboard.component').then(
        (m) => m.TransportDashboardComponent
      ),
  },
];
