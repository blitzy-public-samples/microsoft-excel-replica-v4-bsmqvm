import * as crypto from 'crypto';
import { SecurityConfig } from '../config/SecurityConfig';
import { validateInput } from '../utils/ValidationUtils';

/**
 * This file contains utility functions for encryption and decryption operations
 * used throughout the Microsoft Excel application, providing a centralized
 * location for secure data handling and protection.
 */

// Assuming SecurityConfig provides the following:
// - ENCRYPTION_ALGORITHM: string
// - ENCRYPTION_KEY_LENGTH: number
// - HASH_ALGORITHM: string
// - HASH_SALT_LENGTH: number

/**
 * Encrypts the given data using AES encryption.
 * @param data The data to be encrypted
 * @param key The encryption key
 * @returns Encrypted data as a string
 */
export function encrypt(data: string, key: string): string {
  validateInput(data, 'string', 'Data must be a string');
  validateInput(key, 'string', 'Key must be a string');

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(SecurityConfig.ENCRYPTION_ALGORITHM, Buffer.from(key), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts the given encrypted data using AES decryption.
 * @param encryptedData The encrypted data to be decrypted
 * @param key The decryption key
 * @returns Decrypted data as a string
 */
export function decrypt(encryptedData: string, key: string): string {
  validateInput(encryptedData, 'string', 'Encrypted data must be a string');
  validateInput(key, 'string', 'Key must be a string');

  const [ivHex, encryptedHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  
  const decipher = crypto.createDecipheriv(SecurityConfig.ENCRYPTION_ALGORITHM, Buffer.from(key), iv);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

/**
 * Generates a random encryption key of the specified length.
 * @param length The length of the key to generate
 * @returns Generated encryption key as a string
 */
export function generateKey(length: number = SecurityConfig.ENCRYPTION_KEY_LENGTH): string {
  validateInput(length, 'number', 'Length must be a number');
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hashes a password using a secure hashing algorithm (e.g., bcrypt or Argon2).
 * @param password The password to be hashed
 * @returns Hashed password as a string
 */
export function hashPassword(password: string): string {
  validateInput(password, 'string', 'Password must be a string');

  const salt = crypto.randomBytes(SecurityConfig.HASH_SALT_LENGTH).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, SecurityConfig.HASH_ALGORITHM).toString('hex');
  
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against its hashed version.
 * @param password The password to verify
 * @param hashedPassword The hashed password to compare against
 * @returns True if the password matches, false otherwise
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  validateInput(password, 'string', 'Password must be a string');
  validateInput(hashedPassword, 'string', 'Hashed password must be a string');

  const [salt, originalHash] = hashedPassword.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, SecurityConfig.HASH_ALGORITHM).toString('hex');
  
  return hash === originalHash;
}

// Export the functions to be used in other parts of the application
export default {
  encrypt,
  decrypt,
  generateKey,
  hashPassword,
  verifyPassword,
};