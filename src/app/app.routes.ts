import { Routes } from '@angular/router';
// import { authGuard } from './core/services/auth.guard';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/roles.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    // canActivate: [authGuard, roleGuard],
    // data: { roles: ['Admin', 'Compliance Officer'] },
    loadComponent: () =>
      import('./modules/identity/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'register',
    // canActivate: [authGuard, roleGuard],
    // data: { roles: ['Admin', 'Compliance']},
      loadComponent: () =>
      import('./modules/identity/register/register.component')
        .then(m => m.RegisterComponent),
  },

  // Protected routes
  {
    path: 'home',
    // canActivate: [authGuard, roleGuard],
    // data: { roles: ['Admin', 'Compliance']},
    loadComponent: () =>
      import('./modules/home/home.component')
        .then(m => m.HomeComponent),
  },
  {
    path: 'traffic-flow',
    // canActivate: [authGuard, roleGuard],
    // data: { roles: ['Admin', 'Compliance']},
    loadChildren: () =>
      import('./modules/traffic-flow/traffic-flow.routes')
        .then(m => m.TRAFFIC_FLOW_ROUTES),
  },
  {
    path: 'incident',
    canActivate: [authGuard],
    loadChildren: () => 
      import("./modules/incidents/incidents.routes").then(m => m.INCIDENTS_ROUTES)
  },
  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];