// Matches LoginDto 
export interface LoginRequest {
  email:    string;
  password: string;
}

// Matches RegisterDto 
export interface RegisterRequest {
  fullName:    string;
  email:       string;
  password:    string;
  phoneNumber: string;
}

// UserInfoDto 
export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;  
  isActive: boolean;
}

// AuthResponseDto 
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;  
  user: UserInfo;
}

// Matches RefreshTokenDto 
export interface RefreshTokenRequest {
  refreshToken: string;
}

// JWT Payload 
export interface JwtPayload {
  sub:string;
  email:string;
  jti:string;
  uid:string;   
  name:string;   
  role:string;   
  exp:number;
  iss: string;
  aud: string;
}