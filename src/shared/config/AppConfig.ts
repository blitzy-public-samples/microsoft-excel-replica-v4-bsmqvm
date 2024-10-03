import dotenv from 'dotenv';

// Note: These imports are based on assumptions about the structure of the dependencies
import { AppConstants } from '../constants/AppConstants';
import { IUser } from '../interfaces/IUser';
import { UserRoleEnum } from '../enums/UserRoleEnum';

dotenv.config();

const AppConfig = {
  // Application-wide settings
  appName: process.env.APP_NAME || 'Microsoft Excel',
  version: process.env.APP_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',

  // Cross-platform Accessibility settings
  accessibilityMode: process.env.ACCESSIBILITY_MODE === 'true',
  highContrastMode: process.env.HIGH_CONTRAST_MODE === 'true',
  fontSize: process.env.FONT_SIZE || 'medium',

  // Performance settings
  maxCellsToRender: parseInt(process.env.MAX_CELLS_TO_RENDER || '10000', 10),
  calculationMode: process.env.CALCULATION_MODE || 'automatic',
  cacheLifetime: parseInt(process.env.CACHE_LIFETIME || '3600', 10), // in seconds

  // Security and Compliance settings
  encryptionEnabled: process.env.ENCRYPTION_ENABLED === 'true',
  dataRetentionPeriod: parseInt(process.env.DATA_RETENTION_PERIOD || '90', 10), // in days
  maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),

  // Extensibility settings
  allowedAddInDomains: (process.env.ALLOWED_ADDIN_DOMAINS || '').split(','),
  maxAddInsPerWorkbook: parseInt(process.env.MAX_ADDINS_PER_WORKBOOK || '10', 10),

  // API endpoints
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.excel.microsoft.com/v1',

  // Function to load configuration settings
  loadConfig: (): void => {
    // Load environment variables
    dotenv.config();

    // Set configuration values from environment variables or default values
    AppConfig.appName = process.env.APP_NAME || AppConfig.appName;
    AppConfig.version = process.env.APP_VERSION || AppConfig.version;
    AppConfig.environment = process.env.NODE_ENV || AppConfig.environment;

    AppConfig.accessibilityMode = process.env.ACCESSIBILITY_MODE === 'true';
    AppConfig.highContrastMode = process.env.HIGH_CONTRAST_MODE === 'true';
    AppConfig.fontSize = process.env.FONT_SIZE || AppConfig.fontSize;

    AppConfig.maxCellsToRender = parseInt(process.env.MAX_CELLS_TO_RENDER || AppConfig.maxCellsToRender.toString(), 10);
    AppConfig.calculationMode = process.env.CALCULATION_MODE || AppConfig.calculationMode;
    AppConfig.cacheLifetime = parseInt(process.env.CACHE_LIFETIME || AppConfig.cacheLifetime.toString(), 10);

    AppConfig.encryptionEnabled = process.env.ENCRYPTION_ENABLED === 'true';
    AppConfig.dataRetentionPeriod = parseInt(process.env.DATA_RETENTION_PERIOD || AppConfig.dataRetentionPeriod.toString(), 10);
    AppConfig.maxLoginAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || AppConfig.maxLoginAttempts.toString(), 10);

    AppConfig.allowedAddInDomains = (process.env.ALLOWED_ADDIN_DOMAINS || AppConfig.allowedAddInDomains.join(',')).split(',');
    AppConfig.maxAddInsPerWorkbook = parseInt(process.env.MAX_ADDINS_PER_WORKBOOK || AppConfig.maxAddInsPerWorkbook.toString(), 10);

    AppConfig.apiBaseUrl = process.env.API_BASE_URL || AppConfig.apiBaseUrl;

    // Validate configuration settings
    AppConfig.validateConfig();

    // Apply any necessary transformations to configuration values
    AppConfig.applyTransformations();
  },

  // Function to validate configuration settings
  validateConfig: (): void => {
    if (AppConfig.maxCellsToRender <= 0) {
      throw new Error('maxCellsToRender must be a positive integer');
    }

    if (AppConfig.cacheLifetime <= 0) {
      throw new Error('cacheLifetime must be a positive integer');
    }

    if (AppConfig.dataRetentionPeriod <= 0) {
      throw new Error('dataRetentionPeriod must be a positive integer');
    }

    if (AppConfig.maxLoginAttempts <= 0) {
      throw new Error('maxLoginAttempts must be a positive integer');
    }

    if (AppConfig.maxAddInsPerWorkbook <= 0) {
      throw new Error('maxAddInsPerWorkbook must be a positive integer');
    }

    if (!['development', 'staging', 'production'].includes(AppConfig.environment)) {
      throw new Error('Invalid environment setting');
    }
  },

  // Function to apply transformations to configuration values
  applyTransformations: (): void => {
    // Trim whitespace from allowed add-in domains
    AppConfig.allowedAddInDomains = AppConfig.allowedAddInDomains.map(domain => domain.trim());

    // Ensure API base URL doesn't end with a slash
    AppConfig.apiBaseUrl = AppConfig.apiBaseUrl.replace(/\/$/, '');
  }
};

export default AppConfig;