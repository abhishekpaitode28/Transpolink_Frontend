import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tl-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="tl-badge" [ngClass]="'tl-badge--' + status.toLowerCase()">
      {{ status }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: string = '';
}
