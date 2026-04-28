import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatSidenavModule }   from '@angular/material/sidenav';
import { MatToolbarModule }   from '@angular/material/toolbar';
import { MatListModule }      from '@angular/material/list';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatCardModule }      from '@angular/material/card';
import { MatChipsModule }     from '@angular/material/chips';
import { MatDividerModule }   from '@angular/material/divider';
import { MatTooltipModule }   from '@angular/material/tooltip';
import { MatRippleModule }    from '@angular/material/core';

import { AuthService } from '../../core/services/auth.service';
import { NAV_ITEMS, MODULE_CARDS } from '../../shared/config/nav.config';
// import { NavItem, ModuleCard } from '../../shared/models/nav.model';
import { NavItem, ModuleCard } from '../../shared/models/nav.model';
import { ThemeService } from '../../core/services/theme.service';

export interface StatCard {
  label: string;
  value: string;
  delta: string;
  deltaClass: 'text-success' | 'text-warning' | 'text-danger' | 'text-muted';
  matIcon: string;
  iconBgClass: string;
}

@Component({
  selector: 'tl-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatRippleModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  
  readonly theme = inject(ThemeService)
  private auth   = inject(AuthService);
  private router = inject(Router);

  readonly currentUser = this.auth.currentUser;

  readonly activeNavId   = signal<string>('dashboard');
  readonly sidenavOpened = signal<boolean>(true);
  readonly currentTime   = signal<string>('');

  private clockInterval?: ReturnType<typeof setInterval>;

  readonly visibleNavItems = computed<NavItem[]>(() => {
    const role = this.auth.currentRole();
    if (!role) return [];
    return NAV_ITEMS.filter(item => item.roles.includes(role));
  });

  readonly navSections = computed<string[]>(() => {
    const sections: string[] = [];
    for (const item of this.visibleNavItems()) {
      if (!sections.includes(item.section)) sections.push(item.section);
    }
    return sections;
  });

  readonly visibleModuleCards = computed<ModuleCard[]>(() => {
    const role = this.auth.currentRole();
    if (!role) return [];
    return MODULE_CARDS.filter(card => card.roles.includes(role));
  });

  readonly showStats = computed<boolean>(() =>
    this.auth.currentRole() !== 'Civilian'
  );

  readonly stats: StatCard[] = [
    { label: 'Active road segments', value: '12', delta: '↑ 2 since yesterday', deltaClass: 'text-success', matIcon: 'route',         iconBgClass: 'bg-primary bg-opacity-10' },
    { label: 'Open incidents',        value: '3',  delta: '↑ 1 in last hour',   deltaClass: 'text-warning', matIcon: 'warning_amber',  iconBgClass: 'bg-danger bg-opacity-10'  },
    { label: 'Vehicles tracked',      value: '42', delta: '↓ 3 offline',        deltaClass: 'text-danger',  matIcon: 'directions_bus', iconBgClass: 'bg-success bg-opacity-10' },
    { label: 'Compliance checks',     value: '8',  delta: 'Today',              deltaClass: 'text-muted',   matIcon: 'verified_user',  iconBgClass: 'bg-warning bg-opacity-10' },
  ];

  ngOnInit(): void {
    this.tickClock();
    this.clockInterval = setInterval(() => this.tickClock(), 30_000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  onLogout(): void {
    this.auth.logout();
  }

  setActiveNav(id: string): void {
    this.activeNavId.set(id);
    const item = NAV_ITEMS.find(n => n.id === id);
    if (item && id !== 'dashboard') {
      this.router.navigate([item.route]);
    }
  }

  getNavItemsBySection(section: string): NavItem[] {
    return this.visibleNavItems().filter(item => item.section === section);
  }

  getModuleIcon(moduleId: string): string {
    return NAV_ITEMS.find(n => n.id === moduleId)?.matIcon ?? 'widgets';
  }

  toggleSidenav(): void {
    this.sidenavOpened.update(v => !v);
  }

  private tickClock(): void {
    this.currentTime.set(
      new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  }
}