/**
 * Authentication Controller
 *
 * Handles all authentication-related HTTP endpoints including:
 * - User registration (sign up)
 * - User authentication (sign in)
 * - Token refresh
 * - Password reset flow
 * - Sign out
 *
 * Security Features:
 * - Brute force protection
 * - Rate limiting
 * - Input validation
 * - Token-based authentication
 * - Session management
 *
 * @module auth.controller
 */

import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import inputValidations from "../utils/validation/input.validation.js";
import { bruteForceProtector } from "../security/bruteForce.middleware.js";
import { errorResponse } from "../utils/error/error.js";
import * as service from "../service/auth.service.js";
import { passwordBcrypt } from "../utils/bcrypt.util.js";
import { storeAuthUtils } from "../utils/storeAuth.utils.js";
import { jwtOptions } from "../utils/jwt.utils.js";
import { env } from "../config/env.config.js";
import { RedisService } from "../service/redis.service.js";
import {
  SignUpRequest,
  SignInRequest,
  ChangePasswordRequest,
  AuthResponse,
} from "../interfaces/authentication/auth.interface.js";
import { StoredRefreshTokenData } from "../interfaces/authentication/refresh-token.interface.js";
import { RefreshTokenService } from "../service/refresh-token.service.js";
import {
  AuthRequestParams,
  AuthRequestQuery,
  AuthenticatedRequest,
  VerifyPasswordParams,
} from "../interfaces/request/auth-params.interface.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";
import * as notificationService from "../service/notification.service.js";

export const redisService = new RedisService();
/**
 * User Registration Handler
 *
 * @route POST /auth/signup
 * @param {SignUpRequest} req.body - User registration data
 * @returns {AuthResponse} 201 - User created successfully
 * @throws {400} - Validation error or user already exists
 */
export const signUp = asyncHandler<
  AuthRequestParams,
  AuthResponse,
  SignUpRequest,
  AuthRequestQuery
>(async (req, res) => {
  const { error } = inputValidations.schemaSignUp.validate(req.body);
  if (error) {
    throw new errorResponse(error.details[0].message, 400);
  }

  const { username, name, email, password } = req.body;

  const findUsers = await service.checkUserConflicts(username, name, email);

  if (findUsers.length > 0) {
    throw new errorResponse(findUsers.join(","), 400);
  }

  const hashedPassword = await passwordBcrypt.generateHash(password);

  await service.createUser(username, email, hashedPassword, name);

  const response: AuthResponse = {
    message: AUTH_CONSTANTS.MESSAGES.USER_CREATED,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(201).json(response);
});

/**
 * User Authentication Handler
 *
 * @route POST /auth/signin
 * @param {SignInRequest} req.body - Login credentials
 * @returns {AuthResponse} 200 - Authentication successful
 * @throws {401} - Invalid credentials
 * @throws {429} - Too many failed attempts
 */
export const signIn = asyncHandler<
  AuthRequestParams,
  AuthResponse,
  SignInRequest,
  AuthRequestQuery
>(async (req, res) => {
  const { error } = inputValidations.schemaSignIn.validate(req.body);
  if (error) {
    throw new errorResponse(error.details[0].message, 400);
  }

  const { email, password } = req.body;
  const { mode } = env;
  const protect = await bruteForceProtector.checkAttempts(email);

  if (protect >= AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
    throw new errorResponse(AUTH_CONSTANTS.LOCKOUT_MESSAGE, 429);
  }

  const findUserByEmail = await service.findUserByEmail(email);

  if (!findUserByEmail) {
    throw new errorResponse(AUTH_CONSTANTS.MESSAGES.INVALID_EMAIL, 401);
  }

  const { id, username } = findUserByEmail;

  const isPasswordValid = await passwordBcrypt.isPasswordValid(
    password,
    findUserByEmail.password
  );

  if (!isPasswordValid) {
    await bruteForceProtector.trackFailedLogin(email);
    await notificationService.sendVerificationEmail({ email });
    throw new errorResponse(AUTH_CONSTANTS.MESSAGES.INVALID_PASSWORD, 401);
  }

  await bruteForceProtector.resetFailedAttempts(email);

  const accessToken = jwtOptions.generateToken({ email, mode });
  const refreshToken = jwtOptions.generateRefreshToken({ email, mode });

  storeAuthUtils.storeTokenRedis({
    name: AUTH_CONSTANTS.REDIS_KEYS.REFRESH_TOKEN(email),
    value: refreshToken,
    expiry: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY,
  });

  storeAuthUtils.storeCookie(res, [
    { name: "accessToken", value: accessToken },
    { name: "refreshToken", value: refreshToken },
  ]);

  storeAuthUtils.storeSession(req, [
    { userId: id, username: username, email: email },
  ]);

  const response: AuthResponse = {
    message: AUTH_CONSTANTS.MESSAGES.SIGNIN_SUCCESS,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(200).json(response);
});

/**
 * Access Token Refresh Handler
 * 
 * @description Updates access token using a valid refresh token
 * @route POST /auth/refresh-token
 * @access Private - Requires valid refresh token
 */
export const refreshToken = asyncHandler<
  AuthRequestParams,
  AuthResponse,
  Record<string, never>,
  AuthRequestQuery
>(async (req, res) => {
  const user = req.user as AuthenticatedRequest;
  if (!user?.email) {
    throw new errorResponse(AUTH_CONSTANTS.MESSAGES.UNAUTHORIZED, 401);
  }

  const { email } = user;
  const { mode } = env;

  try {
    const storedToken = await redisService.getValue<StoredRefreshTokenData>(
      AUTH_CONSTANTS.REDIS_KEYS.REFRESH_TOKEN(email)
    );

    if (!storedToken) {
      await storeAuthUtils.clearAuthData(req, res, email);
      throw new errorResponse(AUTH_CONSTANTS.MESSAGES.TOKEN_EXPIRED, 401);
    }

    const tokenFamily =
      storedToken.tokenFamily || RefreshTokenService.generateTokenFamily();
    const newAccessToken = jwtOptions.generateToken({
      email,
      mode,
      tokenFamily,
    });

    await RefreshTokenService.storeRefreshTokenData(
      email,
      storedToken.userId,
      tokenFamily
    );

    await storeAuthUtils.storeCookie(res, [
      { name: "accessToken", value: newAccessToken },
    ]);

    const response: AuthResponse = {
      message: AUTH_CONSTANTS.MESSAGES.TOKEN_REFRESHED,
      meta: {
        timestamp: new Date().toISOString(),
        tokenExpiry: new Date(
          Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY * 1000
        ).toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    await RefreshTokenService.removeRefreshToken(email);
    await storeAuthUtils.clearAuthData(req, res, email);
    throw error;
  }
});

export const forgotPassword = asyncHandler<
  AuthRequestParams,
  AuthResponse,
  ChangePasswordRequest
>(async (req, res) => {
  const { error } = inputValidations.schemaChangePassword.validate(req.body);
  if (error) {
    throw new errorResponse(error.details[0].message, 400);
  }

  const { email, newPassword } = req.body;
  const checkUsers = await service.findUserByEmail(email);
  if (!checkUsers) {
    throw new errorResponse("User with this email does not exist", 404);
  }
  const hashedPassword = await passwordBcrypt.generateHash(newPassword);

  // Generate reset token
  const resetToken = jwtOptions.generateToken({
    email,
    mode: env.mode,
    purpose: "password-reset",
  });

  await notificationService.sendPasswordVerificationEmail({
    email,
    token: resetToken,
  });


  storeAuthUtils.storeTokenRedis({
    name: `changePassword:${email}`,
    value: `${hashedPassword}`,
    expiry: 300,
  });

  res.status(200).json({
    message: AUTH_CONSTANTS.MESSAGES.PASSWORD_RESET_SENT,
  });
});

export const verifyForgotPassword = asyncHandler<
  VerifyPasswordParams,
  AuthResponse
>(async (req, res) => {
  const { token } = req.params;
  const { email } = jwtOptions.verifyToken(token);
  const password = (await redisService.getValue(
    `changePassword:${email}`
  )) as string;
  await service.updateUserPassword(email!, password);
  const response: AuthResponse = {
    message: AUTH_CONSTANTS.MESSAGES.PASSWORD_UPDATED,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  res.status(200).json(response);
});

export const signOut = asyncHandler(
  async (req: Request<AuthRequestParams, AuthResponse>, res: Response) => {
    const email = (req.user as AuthenticatedRequest).email;
    await storeAuthUtils.clearAuthData(req, res, `${email}`);
    res.status(200).json({ message: "Sign-out successful" });
  }
);
