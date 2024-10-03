import { ChartType } from '../types/chart-types';
import { ColorUtils } from '../utils/color-utils';

// Interface defining the structure of the theme object
interface ITheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    axis: string;
    grid: string;
  };
  fonts: {
    family: string;
    size: {
      small: number;
      medium: number;
      large: number;
    };
  };
  chartSpecific: {
    [key in ChartType]: {
      colors: string[];
      borderWidth: number;
      hoverOpacity: number;
    };
  };
}

// Default theme constant
export const DEFAULT_THEME: ITheme = {
  colors: {
    primary: '#0078D4', // Microsoft Blue
    secondary: '#107C10', // Microsoft Green
    background: '#FFFFFF',
    text: '#252525',
    axis: '#666666',
    grid: '#E6E6E6',
  },
  fonts: {
    family: 'Segoe UI, Arial, sans-serif',
    size: {
      small: 12,
      medium: 14,
      large: 16,
    },
  },
  chartSpecific: {
    bar: {
      colors: ['#0078D4', '#107C10', '#D13438', '#FFC83D', '#881798'],
      borderWidth: 1,
      hoverOpacity: 0.8,
    },
    line: {
      colors: ['#0078D4', '#107C10', '#D13438', '#FFC83D', '#881798'],
      borderWidth: 2,
      hoverOpacity: 0.7,
    },
    pie: {
      colors: ['#0078D4', '#107C10', '#D13438', '#FFC83D', '#881798'],
      borderWidth: 1,
      hoverOpacity: 0.7,
    },
    scatter: {
      colors: ['#0078D4', '#107C10', '#D13438', '#FFC83D', '#881798'],
      borderWidth: 2,
      hoverOpacity: 0.8,
    },
    area: {
      colors: ['#0078D4', '#107C10', '#D13438', '#FFC83D', '#881798'],
      borderWidth: 1,
      hoverOpacity: 0.7,
    },
    column: {
      colors: ['#0078D4', '#107C10', '#D13438', '#FFC83D', '#881798'],
      borderWidth: 1,
      hoverOpacity: 0.8,
    },
    combo: {
      colors: ['#0078D4', '#107C10', '#D13438', '#FFC83D', '#881798'],
      borderWidth: 2,
      hoverOpacity: 0.7,
    },
  },
};

/**
 * Retrieves a specific color from the default theme.
 * @param colorName The name of the color to retrieve.
 * @returns The color value from the theme.
 */
export function getThemeColor(colorName: keyof ITheme['colors']): string {
  return DEFAULT_THEME.colors[colorName];
}

/**
 * Retrieves the color array for a specific chart type.
 * @param chartType The type of chart.
 * @returns Array of colors for the specified chart type.
 */
export function getChartColors(chartType: ChartType): string[] {
  return DEFAULT_THEME.chartSpecific[chartType].colors;
}

/**
 * Retrieves the border width for a specific chart type.
 * @param chartType The type of chart.
 * @returns Border width for the specified chart type.
 */
export function getChartBorderWidth(chartType: ChartType): number {
  return DEFAULT_THEME.chartSpecific[chartType].borderWidth;
}

/**
 * Retrieves the hover opacity for a specific chart type.
 * @param chartType The type of chart.
 * @returns Hover opacity for the specified chart type.
 */
export function getChartHoverOpacity(chartType: ChartType): number {
  return DEFAULT_THEME.chartSpecific[chartType].hoverOpacity;
}

// Export the ColorUtils for use in other parts of the application
export { ColorUtils };