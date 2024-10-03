/**
 * This file defines the IUser interface, which represents the structure of a user in the Microsoft Excel application.
 * It provides a standardized way to handle user data across different parts of the application.
 */

/**
 * Enum representing possible user roles in the Microsoft Excel application.
 */
export type UserRoleEnum = 'Admin' | 'Editor' | 'Viewer' | 'Guest';

/**
 * Interface defining the structure of a user object in the Microsoft Excel application.
 */
export interface IUser {
  /**
   * Unique identifier for the user.
   */
  id: string;

  /**
   * Name of the user.
   */
  name: string;

  /**
   * Email address of the user.
   */
  email: string;

  /**
   * Role of the user in the application.
   */
  role: UserRoleEnum;

  /**
   * Type of account the user has.
   */
  accountType: string;

  /**
   * Date and time when the user account was created.
   */
  createdAt: Date;

  /**
   * Date and time of the user's last login.
   */
  lastLoginAt: Date;

  /**
   * User preferences object.
   */
  preferences: object;

  /**
   * Indicates whether the user account is active.
   */
  isActive: boolean;
}

/**
 * This interface addresses the following requirements:
 * 1. User Management: Defines the structure for user data to support user management features.
 * 2. Security and Compliance: Includes properties necessary for implementing security measures and adhering to compliance standards.
 */