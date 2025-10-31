import { Request } from "express";
import { IJwtPayload } from "../authentication/jwt-auth.interface.js";

export interface AuthRequest extends Request {
  user?: IJwtPayload;
  authSource?: "header" | "cookie" | null;
}
