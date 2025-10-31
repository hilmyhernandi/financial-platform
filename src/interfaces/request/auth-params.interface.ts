import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Base params untuk semua auth requests
export type AuthRequestParams = ParamsDictionary & {
  token?: string;
};

// Params khusus untuk verify password
export type VerifyPasswordParams = ParamsDictionary & {
  token: string; // Required untuk verify password
};

// Query parameters
export type AuthRequestQuery = ParsedQs & {
  redirect?: string;
};

// Interface untuk Request dengan user yang sudah terautentikasi
export interface AuthenticatedRequest {
  email: string;
  userId: string;
  username: string;
}

// Interface untuk session user
export interface UserSession {
  userId: string;
  username: string;
  email: string;
}