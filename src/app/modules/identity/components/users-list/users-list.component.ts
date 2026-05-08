import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule }            from '@angular/material/card';
import { MatTableModule }           from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatSnackBar }              from '@angular/material/snack-bar';
import { MatDialog }                from '@angular/material/dialog';
import { CreateUserDialogComponent } from '../user-dialog/create-user-dialog.component';


import { UserSevice} from '../../services/user.service';
import { AuthService } from '../../auth/auth.service'; 
import { User } from '../../../../core/models/user.model';
import { roleLabel, USER_ROLES } from '../../../../shared/constants/role.constants';

@Component({
  selector: 'tl-users-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatCardModule, MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatTooltipModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrls:   ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {

  private userService = inject(UserSevice);
  private auth        = inject(AuthService);
  private snackbar    = inject(MatSnackBar);
  private dialog      = inject(MatDialog);


  loading  = signal(false);
  acting   = signal('');
  errorMsg = signal('');

  page       = signal(1);
  pageSize   = signal(10);
  totalCount = signal(0);

  rows   = signal<User[]>([]);
  search = signal('');

  displayedColumns = ['avatar', 'fullName', 'email', 'role', 'status', 'actions'];
  pageSizeOptions  = [5, 10, 25, 50];

  isAdmin = computed(() => this.auth.currentRole() === USER_ROLES.Admin);

  filteredRows = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.rows();
    return this.rows().filter(u =>
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)    ||
      roleLabel(u.role).toLowerCase().includes(q)
    );
  });

  roleLabel = roleLabel;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.errorMsg.set('');

    this.userService.getAll(this.page(), this.pageSize()).subscribe({
      next: result => {
        this.loading.set(false);
        this.rows.set(result.items);
        this.totalCount.set(result.totalCount);
      },
      error: err => {
        this.loading.set(false);
        this.rows.set([]);
        this.totalCount.set(0);
        this.errorMsg.set(err?.error?.message || 'Failed to load users.');
      },
    });
  }
  // ── Open Create User dialog (Admin only) ──────────────────────────────────
  openCreateDialog(): void {
    if (!this.isAdmin()) return;       // belt-and-braces; HTML hides the button anyway

    const ref = this.dialog.open(CreateUserDialogComponent, {
      width:           '520px',
      maxWidth:        '95vw',
      autoFocus:       'first-tabbable',
      restoreFocus:    true,
      disableClose:    false,
      panelClass:      'tl-create-user-dialog',
    });

    ref.afterClosed().subscribe((result: User | null) => {
      if (result) {

        this.rows.update(list => [result, ...list]);
        this.totalCount.update(n => n + 1);


        if (this.page() !== 1) {
          this.page.set(1);
        }
        this.load();
      }
    });
  }

  onPageChange(e: PageEvent): void {
    this.page.set(e.pageIndex + 1);
    this.pageSize.set(e.pageSize);
    this.load();
  }

  onActivate(user: User): void {
    if (!this.isAdmin()) return;

    this.acting.set(user.id);
    this.userService.activate(user.id).subscribe({
      next: msg => {
        this.acting.set('');
        this.rows.update(list =>
          list.map(u => u.id === user.id ? { ...u, isActive: true } : u)
        );
        this.snackbar.open(msg || 'User activated.', 'Close', { duration: 3000 });
      },
      error: err => {
        this.acting.set('');
        this.snackbar.open(
          err?.error?.message || 'Failed to activate user.',
          'Close', { duration: 4000 }
        );
      },
    });
  }

  onDeactivate(user: User): void {
    if (!this.isAdmin()) return;
    if (!confirm(`Deactivate ${user.fullName}? They will not be able to log in.`)) {
      return;
    }

    this.acting.set(user.id);
    this.userService.deactivate(user.id).subscribe({
      next: msg => {
        this.acting.set('');
        this.rows.update(list =>
          list.map(u => u.id === user.id ? { ...u, isActive: false } : u)
        );
        this.snackbar.open(msg || 'User deactivated.', 'Close', { duration: 3000 });
      },
      error: err => {
        this.acting.set('');
        this.snackbar.open(
          err?.error?.message || 'Failed to deactivate user.',
          'Close', { duration: 4000 }
        );
      },
    });
  }

  refresh(): void {
    this.load();
  }

  initials(user: User): string {
    const src = user.fullName || user.email || '?';
    return String(src).slice(0, 2).toUpperCase();
  }

  trackById = (_: number, u: User) => u.id;
}