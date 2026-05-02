import { Component } from '@angular/core';

// TODO: import AuthService

@Component({
  selector: 'tl-topbar',
  standalone: true,
  imports: [], // TODO: no extra imports needed unless you add RouterLink etc.
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  // TODO: inject AuthService so the template can call auth.logout()
}
