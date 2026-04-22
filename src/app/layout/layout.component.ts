import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// TODO: import SidebarComponent
// TODO: import TopbarComponent

@Component({
  selector: 'tl-layout',
  standalone: true,
  imports: [RouterOutlet], // TODO: also add SidebarComponent, TopbarComponent
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  // No logic needed — this is a pure shell component
}
