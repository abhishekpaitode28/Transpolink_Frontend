import { UserRole } from "../../core/auth/auth.models";

export interface NavItem {
  id: string;
  label: string;
  section: string;
  route: string;
  matIcon: string;   // Material icon name
  roles: UserRole[];
  badge?: number;
}

export interface ModuleCard {
  id: string;
  label: string;
  description: string;
  matIcon: string;
  colorClass: string;   // Bootstrap text color utility e.g. 'text-primary'
  bgClass: string;      // Bootstrap bg utility e.g. 'bg-primary bg-opacity-10'
  statLabel: string;
  statusLabel: string;
  statusClass: 'success' | 'warning' | 'primary';
  route: string;
  roles: UserRole[];
}