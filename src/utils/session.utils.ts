import { Request } from "express";
import { errorResponse } from "./error/error.js";

export class SessionManager {
  constructor(private req: Request) {}

  set(userId: string, username: string, email: string): void {
    this.req.session.usersId = userId;
    this.req.session.username = username;
    this.req.session.email = email!;
  }

  update(usersId?: string, username?: string): void {
    if (usersId) this.req.session.usersId = usersId;
    if (username) this.req.session.username = username;
  }

  async destroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.req.session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  getUserId(): string {
    const userId = this.req.session?.usersId;
    if (!userId) {
      throw new errorResponse(
        "access denied, user is not logged in or session has expired",
        401
      );
    }
    return userId;
  }
}
