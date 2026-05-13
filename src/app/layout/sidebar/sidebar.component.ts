import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatListModule }    from '@angular/material/list';
import { MatIconModule }    from '@angular/material/icon';
import { MatButtonModule }  from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService }          from '../../modules/identity/auth/auth.service';
import { NotificationsService } from '../../modules/notifications/services/notifications.service';
import { NAV_ITEMS }            from '../../shared/config/nav.config';
import { NavItem }              from '../../shared/models/nav.model';

@Component({
  selector: 'tl-sidebar',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatListModule, MatIconModule,
    MatButtonModule, MatDividerModule, MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl:    './sidebar.component.scss',
})
export class SidebarComponent {
  auth          = inject(AuthService);
  router        = inject(Router);
  private notif = inject(NotificationsService);

  // Real unread count from notification polling
  readonly unreadCount = this.notif.unreadCount;

  readonly visibleNavItems = computed<NavItem[]>(() => {
    const role = this.auth.currentRole();
    if (!role) return [];
    return NAV_ITEMS.filter(item =>
      item.roles.length === 0 || item.roles.includes(role)
    );
  });

  readonly sections = computed(() => {
    const items = this.visibleNavItems();
    const map = new Map<string, NavItem[]>();
    for (const item of items) {
      if (!map.has(item.section)) map.set(item.section, []);
      map.get(item.section)!.push(item);
    }
    return map;
  });

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.auth.logout();
  }
}