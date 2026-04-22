import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: ''
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/identity/identity.routes').then((m) => m.IDENTITY_ROUTES),
  },
  {
    path: 'incidents',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/incidents/incidents.routes').then((m) => m.INCIDENTS_ROUTES),
  },
  {
    path: 'traffic-flow',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/traffic-flow/traffic-flow.routes').then((m) => m.TRAFFIC_FLOW_ROUTES),
  },
  {
    path: 'transport',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/transport/transport.routes').then((m) => m.TRANSPORT_ROUTES),
  },
  {
    path: 'compliance',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/compliance/compliance.routes').then((m) => m.COMPLIANCE_ROUTES),
  },
  {
    path: 'reporting',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/reporting/reporting.routes').then((m) => m.REPORTING_ROUTES),
  },
  { path: '**', redirectTo: '/' },
];
