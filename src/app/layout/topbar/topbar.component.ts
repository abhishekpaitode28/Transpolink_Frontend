import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatButtonModule }   from '@angular/material/button';
import { MatIconModule }     from '@angular/material/icon';
import { MatTooltipModule }  from '@angular/material/tooltip';
import { MatChipsModule }    from '@angular/material/chips';

import { AuthService }  from '../../modules/identity/auth/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'tl-topbar',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatToolbarModule, MatButtonModule,
    MatIconModule, MatTooltipModule, MatChipsModule,
  ],
  templateUrl: './topbar.component.html',
  styleUrl:    './topbar.component.scss',
})
export class TopbarComponent {
  auth   = inject(AuthService);
  theme  = inject(ThemeService);
  router = inject(Router);

  @Output() menuToggle = new EventEmitter<void>();

  // Live clock
  currentTime = signal(this.getTime());

  constructor() {
    setInterval(() => this.currentTime.set(this.getTime()), 1000);
  }

  private getTime(): string {
    return new Date().toLocaleTimeString('en-IN', {
      hour:   '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Current page title from URL
  get pageTitle(): string {
    const url = this.router.url;
    const map: Record<string, string> = {
      '/home':          'Dashboard',
      '/traffic-flow':  'Traffic Flow',
      '/incident':      'Incidents',
      '/transport':     'Transport',
      '/compliance':    'Compliance',
      '/reporting':     'Reporting',
      '/notifications': 'Notifications',
    };
    const match = Object.keys(map).find(k => url.startsWith(k));
    return match ? map[match] : 'TranspoLink';
  }

  toggleMenu(): void {
    this.menuToggle.emit();
  }
}
