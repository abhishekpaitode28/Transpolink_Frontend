import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/roles.guard';


export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./modules/identity/components/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./modules/identity/components/register/register.component')
        .then(m => m.RegisterComponent),
  },
{
  path: '',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./layout/layout.component').then(m => m.LayoutComponent),
  children: [
    { path: 'home',         
      loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent) },

    { path: 'traffic-flow', 
      loadChildren:  () => import('./modules/traffic-flow/traffic-flow.routes').then(m => m.TRAFFIC_FLOW_ROUTES) },

    { path: 'incident',     
      loadChildren:  () => import('./modules/incidents/incidents.routes').then(m => m.INCIDENTS_ROUTES) },

    { path: 'reporting', canActivate:[roleGuard], data:{roles:['Admin','TrafficOfficer','Compliance','TransportOperator']},
       loadChildren:  () => import('./modules/reporting/reporting.routes').then(m => m.REPORTING_ROUTES) 
     },
    { path: 'compliance', 
      loadChildren: () => import('./modules/compliance/compliance.routes').then(m => m.COMPLIANCE_ROUTES)},

    {path: 'transport', 
      loadChildren: () => import('./modules/transport/transport.routes').then(m => m.TRANSPORT_ROUTES)},

    { path: '', 
      loadChildren: () => import('./modules/identity/identity.routes').then(m => m.IDENTITY_ROUTES) },

    { path: 'notifications', 
      loadChildren:  () => import('./modules/notifications/notifications.routes').then(m => m.NOTIFICATIONS_ROUTES) },

    { path: 'unauthorized', 
      loadComponent: () => import('./modules/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },

    { path: '', redirectTo: 'home', pathMatch: 'full' },
  ],
},

{ path: '**', loadComponent: () => import('./modules/not-found/notfound.component').then(m => m.NotFoundComponent) },

];