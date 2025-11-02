export {};

declare global {
  namespace Express {
    interface UserPayload {
      email?: string;
      mode?: string;
    }

    interface Request {
      user?: UserPayload;
      csrfToken?: () => string;
    }
  }
}