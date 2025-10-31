/**
 * Authentication Router
 * 
 * Defines all authentication-related routes and their middleware chains.
 * Implements security measures including CSRF protection and JWT validation.
 * 
 * Protected Routes:
 * - /refresh-token (requires CSRF token and refresh token)
 * - /signout (requires valid JWT)
 * 
 * Public Routes:
 * - /signup (new user registration)
 * - /signin (user authentication)
 * - /forgot-password (password reset initiation)
 * - /verify-forgot-password (password reset verification)
 * 
 * @module auth.router
 */

import { Router } from "express";
import * as authController from "../controller/auth.controller.js";
import {
  jwtMiddleware,
  refreshTokenMiddleware,
} from "../middleware/auth.middleware.js";
import { doubleCsrfProtection } from "../security/csrf.middleware.js";

export const authRouter = Router();

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.get("/signout", jwtMiddleware, authController.signOut);
authRouter.get(
  "/refresh-token",
  doubleCsrfProtection,
  refreshTokenMiddleware,
  authController.refreshToken
);

authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.get(
  "/verify-forgot-password/:token",
  authController.verifyForgotPassword
);
