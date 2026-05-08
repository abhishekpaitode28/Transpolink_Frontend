import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'tl-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span class="tl-badge" [ngClass]="'tl-badge--' + status.toLowerCase()">{{ status }}</span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: string = '';
}
