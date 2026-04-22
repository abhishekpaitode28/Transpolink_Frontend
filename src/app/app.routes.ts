import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

// TODO: Each route uses lazy loading via loadChildren (for child routes)
//       or loadComponent (for a single component route)
// TODO: All protected routes must have canActivate: [authGuard]

export const routes: Routes = [
  // TODO: Default redirect — send '/' to '/home'
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Auth module — no guard (public)
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/identity/identity.routes').then((m) => m.IDENTITY_ROUTES),
  },

  // TODO: Home — protected
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/home/home.component').then((m) => m.HomeComponent),
  },

  // TODO: Incidents — protected
  {
    path: 'incidents',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/incidents/incidents.routes').then((m) => m.INCIDENTS_ROUTES),
  },

  // TODO: Traffic Flow — protected
  {
    path: 'traffic-flow',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/traffic-flow/traffic-flow.routes').then((m) => m.TRAFFIC_FLOW_ROUTES),
  },

  // TODO: Transport — protected
  {
    path: 'transport',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/transport/transport.routes').then((m) => m.TRANSPORT_ROUTES),
  },

  // TODO: Compliance — protected
  {
    path: 'compliance',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/compliance/compliance.routes').then((m) => m.COMPLIANCE_ROUTES),
  },

  // TODO: Reporting — protected
  {
    path: 'reporting',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/reporting/reporting.routes').then((m) => m.REPORTING_ROUTES),
  },

  // TODO: Notifications — protected
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/notifications/notifications.routes').then((m) => m.NOTIFICATIONS_ROUTES),
  },

  // Wildcard — redirect unknown paths to home
  { path: '**', redirectTo: 'home' },
];
