import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';

import { AuthService } from '../../core/auth/auth.service';
import { MODULE_CARDS } from '../../shared/config/nav.config';
import { ModuleCard } from '../../shared/models/nav.model';

export interface StatCard {
  label: string;
  value: string;
  delta: string;
  deltaClass:  'text-success' | 'text-warning' | 'text-danger' | 'text-muted';
  matIcon: string;
  iconBgClass: string;
}

@Component({
  selector: 'tl-home',
  standalone:  true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatRippleModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  auth   = inject(AuthService);
  router = inject(Router);

  // ── Visible module cards filtered by role ─────────────────────────────────
  readonly visibleModuleCards = computed<ModuleCard[]>(() => {
    const role = this.auth.currentRole();
    if (!role) return [];
    return MODULE_CARDS.filter(card =>
      card.roles.length === 0 || card.roles.includes(role)
    );
  });

  // Hide overview stats for Citizen role
  readonly showStats = computed<boolean>(() =>
    this.auth.currentRole() !== 'Citizen'
  );

  // ── Static stats ── replace with real API calls per module later ──────────
  readonly stats: StatCard[] = [
    {
      label:       'Active road segments',
      value:       '12',
      delta:       '↑ 2 since yesterday',
      deltaClass:  'text-success',
      matIcon:     'route',
      iconBgClass: 'bg-primary bg-opacity-10',
    },
    {
      label:       'Open incidents',
      value:       '3',
      delta:       '↑ 1 in last hour',
      deltaClass:  'text-warning',
      matIcon:     'warning_amber',
      iconBgClass: 'bg-danger bg-opacity-10',
    },
    {
      label:       'Vehicles tracked',
      value:       '42',
      delta:       '↓ 3 offline',
      deltaClass:  'text-danger',
      matIcon:     'directions_bus',
      iconBgClass: 'bg-success bg-opacity-10',
    },
    {
      label:       'Compliance checks',
      value:       '8',
      delta:       'Today',
      deltaClass:  'text-muted',
      matIcon:     'verified_user',
      iconBgClass: 'bg-warning bg-opacity-10',
    },
  ];

  // ── Navigate when module card clicked ─────────────────────────────────────
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}