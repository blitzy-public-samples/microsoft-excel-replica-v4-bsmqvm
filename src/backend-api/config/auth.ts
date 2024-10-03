import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ConfidentialClientApplication } from '@azure/msal-node';

// Import CORS configuration for integration with authentication
import { corsConfig } from './cors';

// Import database configuration for user storage and validation
import { databaseConfig } from './database';

// Global constants
const AUTH_SECRET: string = process.env.AUTH_SECRET || 'your-secret-key';
const TOKEN_EXPIRATION: number = 3600; // 1 hour in seconds
const AZURE_AD_CONFIG = {
  clientId: process.env.AZURE_AD_CLIENT_ID,
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
  tenantId: process.env.AZURE_AD_TENANT_ID,
};

// Interface for user object
interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

/**
 * Generates a JSON Web Token (JWT) for the authenticated user.
 * @param user The user object to generate the token for
 * @returns A JWT token as a string
 */
export function generateToken(user: IUser): string {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, AUTH_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });
}

/**
 * Verifies the provided JWT token and returns the user information if valid.
 * @param token The JWT token to verify
 * @returns The user information if the token is valid, null otherwise
 */
export function verifyToken(token: string): IUser | null {
  try {
    const decoded = jwt.verify(token, AUTH_SECRET) as IUser;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Hashes the provided password using bcrypt for secure storage.
 * @param password The plain text password to hash
 * @returns A Promise that resolves to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password with a hashed password.
 * @param password The plain text password to compare
 * @param hash The hashed password to compare against
 * @returns A Promise that resolves to true if passwords match, false otherwise
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Initializes the Azure Active Directory configuration for enterprise authentication.
 */
export function initializeAzureAD(): void {
  const msalConfig = {
    auth: {
      clientId: AZURE_AD_CONFIG.clientId,
      clientSecret: AZURE_AD_CONFIG.clientSecret,
      authority: `https://login.microsoftonline.com/${AZURE_AD_CONFIG.tenantId}`,
    },
  };

  const confidentialClient = new ConfidentialClientApplication(msalConfig);

  // Configure additional Azure AD settings here
  // For example, setting up token validation, configuring scopes, etc.
}

// Initialize Azure AD when the module is imported
initializeAzureAD();

// Export the corsConfig and databaseConfig for use in other modules
export { corsConfig, databaseConfig };