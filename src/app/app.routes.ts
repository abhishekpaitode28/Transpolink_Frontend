import { Routes } from '@angular/router';
// import { authGuard } from './core/services/auth.guard';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/identity/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./modules/identity/register/register.component')
        .then(m => m.RegisterComponent),
  },

  // Protected routes
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/home/home.component')
        .then(m => m.HomeComponent),
  },
  {
    path: 'traffic-flow',
    canActivate: [authGuard],
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