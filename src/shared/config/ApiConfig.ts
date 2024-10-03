import dotenv from 'dotenv';

// TODO: Import from AppConfig once it's implemented
// import { AppConfig } from './AppConfig';

// TODO: Import from AppConstants once it's implemented
// import { API_CONSTANTS } from '../constants/AppConstants';

// Load environment variables
dotenv.config();

/**
 * ApiConfig: Contains the API configuration settings for Microsoft Excel,
 * providing a centralized location for managing various API-related parameters and endpoints.
 */
export const ApiConfig = {
  // Base URL for API requests
  baseUrl: process.env.API_BASE_URL || 'https://api.microsoft.com/excel',

  // API version
  apiVersion: process.env.API_VERSION || 'v1',

  // Default request timeout in milliseconds
  defaultTimeout: parseInt(process.env.API_TIMEOUT || '30000', 10),

  // Maximum number of retries for failed requests
  maxRetries: parseInt(process.env.API_MAX_RETRIES || '3', 10),

  // API endpoints
  endpoints: {
    auth: '/auth',
    workbooks: '/workbooks',
    worksheets: '/worksheets',
    cells: '/cells',
    ranges: '/ranges',
    charts: '/charts',
    formulas: '/formulas',
    dataAnalysis: '/data-analysis',
  },

  // API keys (to be stored securely, preferably in environment variables)
  apiKey: process.env.API_KEY,

  // OAuth 2.0 settings
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    redirectUri: process.env.OAUTH_REDIRECT_URI,
    authorizationUrl: process.env.OAUTH_AUTH_URL,
    tokenUrl: process.env.OAUTH_TOKEN_URL,
  },

  // CORS settings
  cors: {
    allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || '').split(','),
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  },

  // Rate limiting settings
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};

/**
 * Loads API configuration settings from environment variables and sets default values if not provided.
 */
export function loadApiConfig(): void {
  // Validate API configuration settings
  if (!ApiConfig.apiKey) {
    console.warn('API key is not set. Please set the API_KEY environment variable.');
  }

  if (!ApiConfig.oauth.clientId || !ApiConfig.oauth.clientSecret) {
    console.warn('OAuth client ID or client secret is not set. Please set the OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET environment variables.');
  }

  // Apply any necessary transformations to API configuration values
  ApiConfig.cors.allowedOrigins = ApiConfig.cors.allowedOrigins.map(origin => origin.trim());

  // Log the loaded configuration (excluding sensitive information)
  console.log('API Configuration loaded:', {
    baseUrl: ApiConfig.baseUrl,
    apiVersion: ApiConfig.apiVersion,
    defaultTimeout: ApiConfig.defaultTimeout,
    maxRetries: ApiConfig.maxRetries,
    endpoints: ApiConfig.endpoints,
    cors: ApiConfig.cors,
    rateLimit: ApiConfig.rateLimit,
  });
}

// Load the API configuration when this module is imported
loadApiConfig();