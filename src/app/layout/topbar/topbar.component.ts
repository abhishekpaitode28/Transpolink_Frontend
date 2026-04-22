import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'tl-topbar',
  standalone: true,
  template: `
    <header class="tl-topbar">
      <span class="tl-topbar__title">TranspoLink Admin</span>
      <button class="tl-topbar__logout" (click)="auth.logout()">Logout</button>
    </header>
  `,
})
export class TopbarComponent {
  constructor(public auth: AuthService) {}
}
