import { IUser } from '../interfaces/IUser';
import { UserRoleEnum } from '../enums/UserRoleEnum';
import { BaseModel } from './BaseModel';
import { ValidationUtils } from '../utils/ValidationUtils';
import { EncryptionUtils } from '../utils/EncryptionUtils';

/**
 * UserModel class implements the IUser interface and extends BaseModel to provide
 * a concrete implementation of user-related functionality in the Microsoft Excel application.
 */
export class UserModel extends BaseModel implements IUser {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
  accountType: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: object;
  isActive: boolean;

  /**
   * Initializes a new UserModel instance with the provided user data.
   * @param userData Partial<IUser> object containing user data
   */
  constructor(userData: Partial<IUser>) {
    super();
    this.id = userData.id || this.generateId();
    this.name = userData.name || '';
    this.email = userData.email || '';
    this.role = userData.role || UserRoleEnum.Viewer;
    this.accountType = userData.accountType || 'standard';
    this.createdAt = userData.createdAt || new Date();
    this.lastLoginAt = userData.lastLoginAt || new Date();
    this.preferences = userData.preferences || {};
    this.isActive = userData.isActive !== undefined ? userData.isActive : true;

    this.validateEmail(this.email);
  }

  /**
   * Sets the role of the user after validating the input.
   * @param role UserRoleEnum value to set
   */
  setRole(role: UserRoleEnum): void {
    if (Object.values(UserRoleEnum).includes(role)) {
      this.role = role;
    } else {
      throw new Error('Invalid user role');
    }
  }

  /**
   * Updates the user's preferences, merging the new preferences with existing ones.
   * @param newPreferences object containing new preferences
   */
  updatePreferences(newPreferences: object): void {
    this.preferences = { ...this.preferences, ...newPreferences };
  }

  /**
   * Updates the lastLoginAt timestamp to the current time.
   */
  setLastLoginTime(): void {
    this.lastLoginAt = new Date();
  }

  /**
   * Deactivates the user account by setting isActive to false.
   */
  deactivateAccount(): void {
    this.isActive = false;
  }

  /**
   * Reactivates the user account by setting isActive to true.
   */
  reactivateAccount(): void {
    this.isActive = true;
  }

  /**
   * Returns a plain JavaScript object representation of the user model,
   * with sensitive data handled securely.
   * @returns object A plain JavaScript object representing the user
   */
  toJSON(): object {
    const userObject = {
      id: this.id,
      name: this.name,
      email: EncryptionUtils.encryptEmail(this.email),
      role: this.role,
      accountType: this.accountType,
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt,
      preferences: this.preferences,
      isActive: this.isActive
    };
    return userObject;
  }

  /**
   * Validates the format of the provided email address.
   * @param email string email address to validate
   * @returns boolean True if the email is valid, false otherwise
   */
  private validateEmail(email: string): boolean {
    if (!ValidationUtils.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    return true;
  }

  /**
   * Generates a unique ID for the user.
   * @returns string A unique ID
   */
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}