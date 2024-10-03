import { DEFAULT_THEME, ITheme } from './default-theme';
import { ChartType } from '../types/chart-types';
import { ColorUtils } from '../utils/color-utils';

/**
 * This class manages themes for the charting engine, allowing for theme customization and switching.
 */
export class ThemeManager {
    private currentTheme: ITheme;
    private customThemes: Map<string, ITheme>;

    /**
     * Initializes the ThemeManager with the default theme and an empty map for custom themes
     */
    constructor() {
        this.currentTheme = DEFAULT_THEME;
        this.customThemes = new Map<string, ITheme>();
    }

    /**
     * Returns the currently active theme.
     * @returns The current theme
     */
    getCurrentTheme(): ITheme {
        return this.currentTheme;
    }

    /**
     * Sets the current theme to the provided theme.
     * @param theme - The theme to set as current
     */
    setTheme(theme: ITheme): void {
        this.currentTheme = theme;
    }

    /**
     * Creates a custom theme by merging the provided partial theme with the current theme.
     * @param name - The name of the custom theme
     * @param theme - The partial theme to merge with the current theme
     */
    createCustomTheme(name: string, theme: Partial<ITheme>): void {
        const newTheme: ITheme = {
            ...this.currentTheme,
            ...theme,
            colors: { ...this.currentTheme.colors, ...theme.colors },
            chartSpecific: { ...this.currentTheme.chartSpecific, ...theme.chartSpecific }
        };
        this.customThemes.set(name, newTheme);
    }

    /**
     * Applies a custom theme by name, if it exists.
     * @param name - The name of the custom theme to apply
     * @throws Error if the theme doesn't exist
     */
    applyCustomTheme(name: string): void {
        const theme = this.customThemes.get(name);
        if (theme) {
            this.currentTheme = theme;
        } else {
            throw new Error(`Theme '${name}' does not exist`);
        }
    }

    /**
     * Retrieves a specific color from the current theme.
     * @param colorName - The name of the color to retrieve
     * @returns The color value
     */
    getThemeColor(colorName: keyof ITheme['colors']): string {
        return this.currentTheme.colors[colorName];
    }

    /**
     * Retrieves the color array for a specific chart type from the current theme.
     * @param chartType - The type of chart
     * @returns Array of color values
     */
    getChartColors(chartType: ChartType): string[] {
        return this.currentTheme.chartSpecific[chartType].colors;
    }

    /**
     * Retrieves the border width for a specific chart type from the current theme.
     * @param chartType - The type of chart
     * @returns The border width value
     */
    getChartBorderWidth(chartType: ChartType): number {
        return this.currentTheme.chartSpecific[chartType].borderWidth;
    }

    /**
     * Retrieves the hover opacity for a specific chart type from the current theme.
     * @param chartType - The type of chart
     * @returns The hover opacity value
     */
    getChartHoverOpacity(chartType: ChartType): number {
        return this.currentTheme.chartSpecific[chartType].hoverOpacity;
    }
}

// Export a singleton instance of ThemeManager
export const themeManager = new ThemeManager();