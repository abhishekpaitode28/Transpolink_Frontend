import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'tl-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span class="tl-badge" [ngClass]="badgeClass">{{ status || 'Unknown' }}</span>
  `,
})
export class StatusBadgeComponent {
  @Input() status = '';

  get badgeClass(): string {
    return `tl-badge--${this.status.trim().toLowerCase().replace(/\s+/g, '-')}`;
  }
}
