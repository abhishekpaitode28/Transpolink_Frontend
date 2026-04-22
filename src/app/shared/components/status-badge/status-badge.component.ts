import { Component, Input } from '@angular/core';

// TODO: import NgClass from '@angular/common'

@Component({
  selector: 'tl-status-badge',
  standalone: true,
  imports: [], // TODO: add NgClass
  template: `
    <!-- TODO: Render a <span> with class "tl-badge"
         Use [ngClass] to add a dynamic class based on status value (lowercased)
         e.g. status='Open'  → class becomes "tl-badge--open"
              status='Unread' → class becomes "tl-badge--unread"
         Display the status text inside the span -->
  `,
})
export class StatusBadgeComponent {
  // TODO: declare @Input() status: string = ''
}
