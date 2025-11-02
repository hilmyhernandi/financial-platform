/**
 * Authentication Service
 * 
 * Handles user authentication, registration, and password management operations.
 * Interacts with the database through Prisma ORM to manage user records.
 * 
 * Features:
 * - User lookup and verification
 * - New user registration with conflict checking
 * - Password updates and management
 * - Input validation and conflict detection
 */

import { prisma } from "../config/prisma.config.js";

/**
 * Finds a user by their email address
 * 
 * @param email - The email address to search for
 * @returns Promise resolving to the user record or null if not found
 */
export const findUserByEmail = async (email: string) => {
  return prisma.users.findUnique({ where: { email } });
};

/**
 * Checks for existing users with matching username, name, or email
 * 
 * @param username - Desired username to check
 * @param name - User's display name to check
 * @param email - Email address to check
 * @returns Array of conflict messages, empty if no conflicts found
 */
export const checkUserConflicts = async (
  username: string,
  name: string,
  email: string
) => {
  const user = await prisma.users.findFirst({
    where: {
      OR: [{ username }, { name }, { email }],
    },
  });

  if (!user) return [];

  const inputs = { username, name, email };
  const fields: Record<keyof typeof inputs, string> = {
    username: "Username",
    name: "Name",
    email: "Email",
  };

  const conflictsFields: string[] = [];
  for (const key of Object.keys(fields) as (keyof typeof inputs)[]) {
    if (user[key] === inputs[key]) conflictsFields.push(fields[key]);
  }

  if (conflictsFields.length === 0) return [];

  const message = `${conflictsFields.join(", ")} already in use`;
  return [message];
};

/**
 * Creates a new user in the system
 * 
 * @param username - Unique username for the new user
 * @param email - User's email address
 * @param hashedPassword - Pre-hashed password
 * @param name - Optional display name
 * @returns Promise resolving to the created user record
 * @throws Will throw if username or email already exists
 */
export const createUser = async (
  username: string,
  email: string,
  hashedPassword: string,
  name?: string
) => {
  return prisma.users.create({
    data: {
      username,
      email,
      password: hashedPassword,
      name,
    },
  });
};

/**
 * Updates a user's password
 * 
 * @param email - Email of the user whose password needs to be updated
 * @param password - New password (should be pre-hashed)
 * @returns Promise resolving to the updated user record
 * @throws Will throw if user not found
 */
export const updateUserPassword = async (email: string, password: string) => {
  return prisma.users.update({
    where: { email },
    data: { password },
  });
};
