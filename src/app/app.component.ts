import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// This is the root component — it simply hosts the router outlet.
// The actual shell (sidebar + topbar) is in LayoutComponent,
// which is loaded by the routing configuration.

@Component({
  selector: 'tl-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
