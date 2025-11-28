export interface SigninAttemptData {
  name?: string;
  email: string;
  ip?: string;
  userAgent?: string;
  time?: string;
  actionUrl?: string;
}

export interface PasswordVerifyData {
  name?: string;
  email: string;
  code: string;
  expiresInMinutes?: number;
  actionUrl?: string;
}
import { MailOptions } from "../types/email.types.js";

export interface IMailService {
  sendMail(options: MailOptions): Promise<void>;
}
