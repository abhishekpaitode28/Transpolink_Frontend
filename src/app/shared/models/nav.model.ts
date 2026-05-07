
export interface NavItem {
  id: string;
  label: string;
  section: string;
  route: string;
  matIcon: string;  
  roles: string[];
  badge?: number;
}



export interface ModuleCard {
  id: string;
  label: string;
  description: string;
  matIcon: string;
  colorClass: string;   
  bgClass: string;     
  statLabel: string;
  statusLabel: string;
  statusClass: 'success' | 'warning' | 'primary';
  route: string;
  roles: string[];
}