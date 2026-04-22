import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// TODO: Define a NavItem interface with: label (string), path (string), icon (string)
interface NavItem {}

@Component({
  selector: 'tl-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

  // TODO: Declare navItems array of type NavItem[]
  // Each item maps a sidebar label to a route path and a Material Icon name
  // Modules to include: Incidents, Traffic Flow, Transport, Compliance, Reporting, Notifications
  navItems: NavItem[] = [
    // TODO: { label: 'Home',          path: '/home',          icon: 'home' },
    // TODO: { label: 'Incidents',     path: '/incidents',     icon: 'warning' },
    // TODO: { label: 'Traffic Flow',  path: '/traffic-flow',  icon: 'traffic' },
    // TODO: { label: 'Transport',     path: '/transport',     icon: 'directions_bus' },
    // TODO: { label: 'Compliance',    path: '/compliance',    icon: 'gavel' },
    // TODO: { label: 'Reporting',     path: '/reporting',     icon: 'bar_chart' },
    // TODO: { label: 'Notifications', path: '/notifications', icon: 'notifications' },
  ];
}
