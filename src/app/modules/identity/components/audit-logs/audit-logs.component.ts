import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule }            from '@angular/material/card';
import { MatTableModule }           from '@angular/material/table';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatChipsModule }           from '@angular/material/chips';
import { MatButtonToggleModule }    from '@angular/material/button-toggle';
import { MatAutocompleteModule }    from '@angular/material/autocomplete';
import { MatSnackBar }              from '@angular/material/snack-bar';

import { UserSevice } from '../../services/user.service';
import { AuditLog,User } from '../../../../core/models/user.model';
import { roleLabel } from '../../../../shared/constants/role.constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'tl-audit-logs',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe,
    MatCardModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule,
    MatChipsModule, MatButtonToggleModule, MatAutocompleteModule,
  ],
  templateUrl: './audit-logs.component.html',
  styleUrls:   ['./audit-logs.component.scss'],
})
export class AuditLogsComponent implements OnInit {
  private usersApi = inject(UserSevice);
  private snackbar = inject(MatSnackBar);

  // ── Filter mode ──────────────────────────────────────────────────────────
  mode = signal<'all' | 'user'>('all');

  // The user the admin selected from the autocomplete (null = none picked)
  selectedUser = signal<User | null>(null);

  // What admin is currently typing in the search box (case-insensitive filter)
  userSearch = signal('');

  // All users we have to search through
  // (loaded once when admin switches to 'user' mode)
  allUsers       = signal<User[]>([]);
  loadingUsers   = signal(false);
  usersLoaded    = signal(false);  // have we tried fetching at least once?

  // ── Audit-log state ──────────────────────────────────────────────────────
  loading  = signal(false);
  errorMsg = signal('');
  rows     = signal<AuditLog[]>([]);
  expanded = signal(new Set<string>());

  // ── Pagination ───────────────────────────────────────────────────────────
  page     = signal(1);
  pageSize = signal(20);

  displayedColumns = ['timestamp', 'action', 'resource', 'user', 'ip', 'detail'];

  // ── Derived ──────────────────────────────────────────────────────────────
  hasMore = computed(() => this.rows().length === this.pageSize());

  // Filtered users for autocomplete dropdown — live updates as admin types
  filteredUsers = computed(() => {
    const q = this.userSearch().trim().toLowerCase();
    const list = this.allUsers();
    if (!q) return list.slice(0, 10);     // show first 10 when nothing typed
    return list
      .filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
      .slice(0, 10);                       // cap at 10 results — keep dropdown small
  });

  // Expose helpers
  roleLabel = roleLabel;

  ngOnInit(): void {
    this.load();
  }

  // ── Load audit logs based on current mode ────────────────────────────────
  private load(): void {
    // In 'user' mode, only fetch if a user is actually selected
    if (this.mode() === 'user' && !this.selectedUser()) {
      this.rows.set([]);
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const obs:Observable<AuditLog[]> = this.mode() === 'user'
      ? this.usersApi.getAuditLogsByUser(this.selectedUser()!.id, this.page(), this.pageSize())
      : this.usersApi.getAllAuditLogs(this.page(), this.pageSize());

    obs.subscribe({
      next: data => {
        this.loading.set(false);
        this.rows.set(data);
        this.expanded.set(new Set());
      },
      error: err => {
        this.loading.set(false);
        this.rows.set([]);
        this.errorMsg.set(err?.error?.message || 'Failed to load audit logs.');
      },
    });
  }

  // ── Load all users (for the autocomplete) ────────────────────────────────
  // Called when admin switches to 'user' mode for the first time.
  // Fetches up to 200 users — enough for typical organisations.
  private loadAllUsers(): void {
    if (this.usersLoaded() || this.loadingUsers()) return;

    this.loadingUsers.set(true);
    this.usersApi.getAll(1, 200).subscribe({
      next: result => {
        this.loadingUsers.set(false);
        this.usersLoaded.set(true);
        this.allUsers.set(result.items);
      },
      error: () => {
        this.loadingUsers.set(false);
        this.snackbar.open(
          'Could not load users for filter.', 'Close', { duration: 3000 }
        );
      },
    });
  }

  // ── User actions ─────────────────────────────────────────────────────────
  onModeChange(newMode: 'all' | 'user'): void {
    this.mode.set(newMode);
    this.page.set(1);
    this.selectedUser.set(null);
    this.userSearch.set('');
    this.rows.set([]);

    if (newMode === 'user') {
      // Lazy-load the users list for the autocomplete
      this.loadAllUsers();
    } else {
      this.load();
    }
  }

  // Called when admin picks a user from the autocomplete dropdown
  onUserSelected(user: User): void {
    this.selectedUser.set(user);
    this.userSearch.set('');     // clear input so the chip is the visual cue
    this.page.set(1);
    this.expanded.set(new Set());
    this.load();
  }

  // Clear selected user (the X on the chip)
  clearUser(): void {
    this.selectedUser.set(null);
    this.userSearch.set('');
    this.page.set(1);
    this.rows.set([]);
  }

  prevPage(): void {
    if (this.page() <= 1 || this.loading()) return;
    this.page.update(p => p - 1);
    this.load();
  }

  nextPage(): void {
    if (!this.hasMore() || this.loading()) return;
    this.page.update(p => p + 1);
    this.load();
  }

  refresh(): void {
    this.load();
  }

  // ── Row helpers ──────────────────────────────────────────────────────────
  toggleExpand(rowId: string): void {
    this.expanded.update(set => {
      const next = new Set(set);
      if (next.has(rowId)) next.delete(rowId);
      else                 next.add(rowId);
      return next;
    });
  }

  isExpanded(rowId: string): boolean {
    return this.expanded().has(rowId);
  }

  // ── Visual helpers ───────────────────────────────────────────────────────
  actionClass(action: string): string {
    const a = (action || '').toUpperCase();
    if (a.includes('LOGIN'))    return 'chip-login';
    if (a.includes('LOGOUT'))   return 'chip-logout';
    if (a.includes('CREATE'))   return 'chip-create';
    if (a.includes('UPDATE'))   return 'chip-update';
    if (a.includes('DELETE') || a.includes('DEACTIVATE')) return 'chip-delete';
    if (a.includes('ROLE'))     return 'chip-role';
    if (a.includes('PASSWORD')) return 'chip-password';
    return 'chip-default';
  }

  shortId(id: string | null): string {
    if (!id) return 'System';
    return id.length > 12 ? `${id.slice(0, 8)}…` : id;
  }

  // Look up a user's name from a userId in audit log
  userName(userId: string | null): string {
    if (!userId) return 'System';
    const u = this.allUsers().find(x => x.id === userId);
    return u ? u.fullName : this.shortId(userId);
  }

  // Quick action from the user column of any row → filter by that user
  filterByUser(userId: string | null): void {
    if (!userId) return;
    const u = this.allUsers().find(x => x.id === userId);
    if (!u) {
      // We don't have this user cached — load users list, then come back
      this.snackbar.open('Loading user info…', 'Close', { duration: 2000 });
      return;
    }
    this.mode.set('user');
    this.selectedUser.set(u);
    this.userSearch.set('');
    this.page.set(1);
    this.expanded.set(new Set());
    this.load();
  }

  trackById = (_: number, log: AuditLog) => log.id;
  trackByUserId = (_: number, u: User) => u.id;
}