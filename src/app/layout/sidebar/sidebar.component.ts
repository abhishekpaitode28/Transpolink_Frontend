import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'tl-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Incidents',     path: '/incidents',    icon: 'warning' },
    { label: 'Traffic Flow',  path: '/traffic-flow', icon: 'traffic' },
    { label: 'Transport',     path: '/transport',    icon: 'directions_bus' },
    { label: 'Compliance',    path: '/compliance',   icon: 'gavel' },
    { label: 'Reporting',     path: '/reporting',    icon: 'bar_chart' },
  ];
}
