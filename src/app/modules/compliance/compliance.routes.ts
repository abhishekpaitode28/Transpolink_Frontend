import { Routes } from '@angular/router';

export const COMPLIANCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./audit-list/audit-list.component').then((m) => m.AuditListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./audit-form/audit-form.component').then((m) => m.AuditFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./audit-detail/audit-detail.component').then((m) => m.AuditDetailComponent),
  },
  {
    path: ':id/records/new',
    loadComponent: () =>
      import('./record-form/record-form.component').then((m) => m.RecordFormComponent),
  },
];