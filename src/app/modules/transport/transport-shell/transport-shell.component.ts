// modules/transport/transport-shell/transport-shell.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'tl-transport-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatTabsModule],
  template: `
    <div class="tl-page-content">

      <!-- Transport tab navigation -->
      <div class="mb-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <mat-icon class="text-primary">directions_bus</mat-icon>
          <h2 class="mb-0 fw-medium">Transport</h2>
        </div>
        <nav class="d-flex gap-1 border-bottom pb-2">
          <a routerLink="." [routerLinkActiveOptions]="{exact:true}" routerLinkActive
             #rla0="routerLinkActive"
             class="tl-tab-link"
             [class.tl-tab-link--active]="rla0.isActive">
            <mat-icon>route</mat-icon> Routes
          </a>
          <a routerLink="fleet" routerLinkActive #rla1="routerLinkActive"
             class="tl-tab-link"
             [class.tl-tab-link--active]="rla1.isActive">
            <mat-icon>directions_bus</mat-icon> Fleet
          </a>
          <a routerLink="schedules" routerLinkActive #rla2="routerLinkActive"
             class="tl-tab-link"
             [class.tl-tab-link--active]="rla2.isActive">
            <mat-icon>schedule</mat-icon> Schedules
          </a>
          <a routerLink="assignments" routerLinkActive #rla3="routerLinkActive"
             class="tl-tab-link"
             [class.tl-tab-link--active]="rla3.isActive">
            <mat-icon>assignment</mat-icon> Assignments
          </a>
          <a routerLink="live" routerLinkActive #rla4="routerLinkActive"
             class="tl-tab-link"
             [class.tl-tab-link--active]="rla4.isActive">
            <mat-icon>live_tv</mat-icon> Live
          </a>
        </nav>
      </div>

      <router-outlet />
    </div>
  `,
  styles: [`
    .tl-tab-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 13px;
      color: #64748b;
      cursor: pointer;
      transition: all 0.15s;
    }
    .tl-tab-link:hover {
      background: rgba(0,0,0,0.05);
      color: #1a5fa8;
    }
    .tl-tab-link--active {
      background: rgba(26,95,168,0.08);
      color: #1a5fa8;
      font-weight: 500;
    }
    mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class TransportShellComponent {}