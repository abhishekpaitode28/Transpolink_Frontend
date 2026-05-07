import { Component, Input } from '@angular/core';
import { NgClass, LowerCasePipe } from '@angular/common';

@Component({
  selector: 'tl-status-badge',
  standalone: true,
  imports: [NgClass, LowerCasePipe],
  template: `
    <span class="tl-badge" [ngClass]="'tl-badge--' + (status | lowercase)">
      {{ status }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: string = '';
}