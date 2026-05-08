import { Routes } from '@angular/router';

export const REPORTING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path:'reports',
    loadComponent:()=>
      import('./components/reports/reports.component').then((m)=>m.ReportsComponent)
  }
];
