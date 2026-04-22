import { Component } from '@angular/core';

// TODO: import AuthService

@Component({
  selector: 'tl-topbar',
  standalone: true,
  imports: [], // TODO: no extra imports needed unless you add RouterLink etc.
  template: `
    <!-- TODO: Build the top header bar
      Structure:
        <header class="tl-topbar">
          - Left: app title or page breadcrumb
          - Right: logout button that calls auth.logout()
        </header>
    -->
  `,
})
export class TopbarComponent {
  // TODO: inject AuthService so the template can call auth.logout()
}
