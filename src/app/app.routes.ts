import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [

  // ── Public routes — no layout, no auth ──────────────────────────────────
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

  // ── Protected routes — all inside layout shell ───────────────────────────
  // layout.component renders sidebar + topbar + <router-outlet>
  // Every child route renders inside that router-outlet
  // ── Protected routes — inside layout ─────────────────────────────────────
{
  path: '',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./layout/layout.component').then(m => m.LayoutComponent),
  children: [
    { path: 'home',         loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent) },
    { path: 'traffic-flow', loadChildren:  () => import('./modules/traffic-flow/traffic-flow.routes').then(m => m.TRAFFIC_FLOW_ROUTES) },
    { path: 'incident',     loadChildren:  () => import('./modules/incidents/incidents.routes').then(m => m.INCIDENTS_ROUTES) },
    { path: 'compliance', loadChildren: () => import('./modules/compliance/compliance.routes').then(m => m.COMPLIANCE_ROUTES)},
    // ← Add these two
    { path: 'unauthorized', loadComponent: () => import('./modules/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
  ],
},

{ path: '**', loadComponent: () => import('./modules/not-found/notfound.component').then(m => m.NotFoundComponent) },

];