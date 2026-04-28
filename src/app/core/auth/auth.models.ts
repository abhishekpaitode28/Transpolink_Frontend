// Matches LoginDto
export interface LoginRequest {
  email: string;
  password: string;
}

// Matches CreateUserDto — role is always sent as 'Civilian' from frontend
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;   // hardcoded to 'Civilian' before sending
}

// Shape of the JWT response from backend
export interface AuthResponse {
  token: string;
}

// Decoded JWT payload — what your backend puts inside the token
export interface JwtPayload {
  sub: string;            // user id
  email: string;
  name?: string;
  role: string;           // Admin | Traffic Officer | Transport Manager | Compliance Officer | Civilian
  exp: number;            // expiry timestamp
}

export type UserRole =
  | 'Admin'
  | 'Traffic Officer'
  | 'Transport Manager'
  | 'Compliance Officer'
  | 'Civilian';