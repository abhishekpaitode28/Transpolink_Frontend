import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent }  from './topbar/topbar.component';
import { ToastComponent } from '../shared/components/toast/toast.component';

@Component({
  selector: 'tl-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    SidebarComponent,
    TopbarComponent,
    ToastComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl:    './layout.component.scss',
})
export class LayoutComponent {
  sidenavOpened = true;

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}

