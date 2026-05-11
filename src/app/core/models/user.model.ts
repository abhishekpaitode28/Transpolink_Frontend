import { UserRole } from "../../shared/constants/role.constants";

export interface User{
  id: string;        
  fullName: string;
  email: string;
  phone: string;     
  role: UserRole;
  isActive: boolean;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;       
  phoneNumber: string;       
  role: UserRole;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;  
}

export interface AssignRoleRequest {
  role: UserRole;
}

export interface AuditLog {
  id: string;       
  userId: string | null;  
  action: string;
  resource: string;
  detail: string | null;
  ipAddress: string | null;
  timestamp: string;         
}