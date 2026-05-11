import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/roles.guard';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./notification-list/notification-list.component').then(
        m => m.NotificationListComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./component/admin-notifications/admin-notifications.component').then(
        m => m.AdminNotificationsComponent
      ),
  },
];
