// TODO: Import UserRoleEnum once it's available
// import { UserRoleEnum } from '../enums/UserRoleEnum';

/**
 * Interface defining the structure of the security configuration object.
 */
interface ISecurityConfig {
  encryption: IEncryptionConfig;
  authentication: IAuthenticationConfig;
  authorization: IAuthorizationConfig;
  dataProtection: IDataProtectionConfig;
  compliance: IComplianceConfig;
}

/**
 * Interface defining encryption configuration settings.
 */
interface IEncryptionConfig {
  algorithm: string;
  keySize: number;
  ivSize: number;
}

/**
 * Interface defining authentication configuration settings.
 */
interface IAuthenticationConfig {
  methods: string[];
  tokenExpirationTime: number;
  mfaEnabled: boolean;
}

/**
 * Interface defining authorization configuration settings.
 */
interface IAuthorizationConfig {
  rbacEnabled: boolean;
  defaultRole: string; // TODO: Replace with UserRoleEnum once available
}

/**
 * Interface defining data protection configuration settings.
 */
interface IDataProtectionConfig {
  dlpEnabled: boolean;
  sensitiveDataPatterns: RegExp[];
}

/**
 * Interface defining compliance configuration settings.
 */
interface IComplianceConfig {
  gdprCompliant: boolean;
  hipaaCompliant: boolean;
  dataRetentionPeriod: number;
}

/**
 * Security configuration for the Microsoft Excel application.
 * This object provides a centralized location for managing security parameters
 * across different platforms and components.
 */
const SecurityConfig: ISecurityConfig = {
  encryption: {
    algorithm: 'AES-256-GCM',
    keySize: 256,
    ivSize: 12,
  },
  authentication: {
    methods: ['Microsoft Account', 'Azure AD', 'Multi-Factor Authentication'],
    tokenExpirationTime: 3600, // 1 hour in seconds
    mfaEnabled: true,
  },
  authorization: {
    rbacEnabled: true,
    defaultRole: 'Viewer', // TODO: Replace with UserRoleEnum.Viewer once available
  },
  dataProtection: {
    dlpEnabled: true,
    sensitiveDataPatterns: [
      /\b(?:\d{3}-?\d{2}-?\d{4})\b/, // SSN
      /\b(?:\d{4}-?\d{4}-?\d{4}-?\d{4})\b/, // Credit Card
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    ],
  },
  compliance: {
    gdprCompliant: true,
    hipaaCompliant: true,
    dataRetentionPeriod: 365 * 24 * 60 * 60, // 1 year in seconds
  },
};

export default SecurityConfig;