export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SignUpRequest = {
  username: string;
  name: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

export type SignInRequest = {
  email: string;
  password: string;
  [key: string]: unknown;
}

export type ChangePasswordRequest = {
  email: string;
  newPassword: string;
  [key: string]: unknown;
}


export interface ResponseMetadata {
  timestamp?: string;
  requestId?: string;
  path?: string;
  tokenExpiry?: string;
  [key: string]: unknown;
}

export interface AuthResponseData {
  user?: Omit<User, 'password'>;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
  session?: {
    id: string;
    expiresAt: string;
  };
}

export type AuthResponse = {
  message: string;
  data?: AuthResponseData;
  meta?: ResponseMetadata;
  [key: string]: unknown;
}

export interface TokenPayload {
  email: string;
  mode: string;
  iat?: number;  
  exp?: number; 
  sub?: string;
}