import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/roles.guard';

export const IDENTITY_ROUTES: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then(m => m.ProfileComponent),
  },

  {
    path: 'users',
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'TrafficOfficer', 'TransportOperator', 'Compliance'] },
    loadComponent: () =>
      import('./components/users-list/users-list.component').then(m => m.UsersListComponent),
  },
  {
    path: 'users/:id',
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'TrafficOfficer', 'TransportOperator', 'Compliance'] },
    loadComponent: () =>
      import('./components/user-detail/user-detail.component').then(m => m.UserDetailComponent),
  },
  {
    path: 'audit-logs',
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'Compliance'] },
    loadComponent: () =>
      import('./components/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent),
  },
];