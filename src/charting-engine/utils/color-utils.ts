import chroma from 'chroma-js';

/**
 * Type definition for chart colors
 */
export type ChartColorType = string;

/**
 * Converts a hexadecimal color string to an RGB array.
 * @param hex - The hexadecimal color string to convert
 * @returns An array of RGB values or null if the input is invalid
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  // Validate input hex string
  const validHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!validHex) {
    return null;
  }

  // Extract red, green, and blue components
  const r = parseInt(validHex[1], 16);
  const g = parseInt(validHex[2], 16);
  const b = parseInt(validHex[3], 16);

  return [r, g, b];
}

/**
 * Converts RGB values to a hexadecimal color string.
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Hexadecimal color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  // Validate input RGB values
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error('Invalid RGB values. Each component must be between 0 and 255.');
  }

  // Convert each component to hexadecimal
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  // Combine components into a single hex string
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generates a color palette based on a given base color.
 * @param baseColor - The base color to generate the palette from
 * @param count - The number of colors to generate
 * @returns An array of generated color strings
 */
export function generateColorPalette(baseColor: ChartColorType, count: number): ChartColorType[] {
  // Validate input base color and count
  if (!chroma.valid(baseColor)) {
    throw new Error('Invalid base color');
  }
  if (count < 1) {
    throw new Error('Count must be a positive integer');
  }

  // Use chroma-js to generate a color scale
  const scale = chroma.scale([baseColor, 'white']).mode('lch').colors(count);

  // Extract colors from the scale
  return scale;
}

/**
 * Determines a contrasting color (black or white) based on the given background color.
 * @param backgroundColor - The background color to determine contrast against
 * @returns Contrasting color (black or white)
 */
export function getContrastColor(backgroundColor: ChartColorType): ChartColorType {
  // Convert background color to RGB
  const rgb = chroma(backgroundColor).rgb();

  // Calculate luminance of the background color
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;

  // Determine if black or white provides better contrast
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Adjusts the brightness of a given color by a specified factor.
 * @param color - The color to adjust
 * @param factor - The factor to adjust brightness by (negative values darken, positive values lighten)
 * @returns Adjusted color string
 */
export function adjustColorBrightness(color: ChartColorType, factor: number): ChartColorType {
  // Validate input color and factor
  if (!chroma.valid(color)) {
    throw new Error('Invalid color');
  }

  // Use chroma-js to parse the input color
  const chromaColor = chroma(color);

  // Adjust the brightness using the specified factor
  const adjustedColor = factor > 0
    ? chromaColor.brighten(factor)
    : chromaColor.darken(Math.abs(factor));

  // Return the adjusted color as a string
  return adjustedColor.hex();
}