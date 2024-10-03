/**
 * @file SupportedRegions.ts
 * @description This file defines the supported regions for localization in the Microsoft Excel project.
 * It contains a constant array of region codes that are used throughout the localization module
 * to provide region-specific formatting and functionality.
 */

// Assuming RegionCode is a string type. If it's defined differently in LocalizationTypes.ts,
// replace 'string' with the actual type.
type RegionCode = string;

/**
 * Array of supported region codes for localization in Microsoft Excel.
 * These codes are used to determine region-specific formatting and functionality.
 */
export const SUPPORTED_REGIONS: RegionCode[] = [
  'US',   // United States
  'GB',   // United Kingdom
  'CA',   // Canada
  'AU',   // Australia
  'DE',   // Germany
  'FR',   // France
  'JP',   // Japan
  'CN',   // China
  'IN',   // India
  'BR',   // Brazil
  'MX',   // Mexico
  'ES',   // Spain
  'IT',   // Italy
  'NL',   // Netherlands
  'SE',   // Sweden
  'CH',   // Switzerland
  'SG',   // Singapore
  'KR',   // South Korea
  'RU',   // Russia
  'AE',   // United Arab Emirates
];

/**
 * Function to check if a given region code is supported.
 * @param regionCode - The region code to check.
 * @returns True if the region code is supported, false otherwise.
 */
export function isSupportedRegion(regionCode: RegionCode): boolean {
  return SUPPORTED_REGIONS.includes(regionCode);
}

/**
 * Function to get the default region code.
 * @returns The default region code (US in this case).
 */
export function getDefaultRegion(): RegionCode {
  return 'US';
}

/**
 * Function to get all supported region codes.
 * @returns An array of all supported region codes.
 */
export function getAllSupportedRegions(): RegionCode[] {
  return [...SUPPORTED_REGIONS];
}