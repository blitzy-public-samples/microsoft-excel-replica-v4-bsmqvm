import { ChartOptions, AxisOptions, LegendOptions, TooltipOptions } from '../types/chart-options';
import { ColorUtils } from '../utils/color-utils';
import { ThemeManager } from '../themes/theme-manager';

/**
 * This interface defines the public methods available in the Style API for customizing chart appearance.
 */
export interface StyleAPI {
    /**
     * Sets general chart style options
     * @param options Partial<ChartOptions> object containing the style options to set
     */
    setChartStyle(options: Partial<ChartOptions>): void;

    /**
     * Sets style options for a specific axis
     * @param axis The axis to style ('x' or 'y')
     * @param options Partial<AxisOptions> object containing the style options to set
     */
    setAxisStyle(axis: 'x' | 'y', options: Partial<AxisOptions>): void;

    /**
     * Sets style options for the chart legend
     * @param options Partial<LegendOptions> object containing the style options to set
     */
    setLegendStyle(options: Partial<LegendOptions>): void;

    /**
     * Sets style options for chart tooltips
     * @param options Partial<TooltipOptions> object containing the style options to set
     */
    setTooltipStyle(options: Partial<TooltipOptions>): void;

    /**
     * Applies a predefined theme to the chart
     * @param themeName The name of the theme to apply
     */
    applyTheme(themeName: string): void;

    /**
     * Sets style options for a specific data series
     * @param seriesIndex The index of the series to style
     * @param options SeriesStyleOptions object containing the style options to set
     */
    setSeriesStyle(seriesIndex: number, options: SeriesStyleOptions): void;
}

/**
 * This class implements the StyleAPI interface, providing the actual implementation of the style customization methods.
 */
class StyleAPIImpl implements StyleAPI {
    private chart: ChartBase;
    private themeManager: ThemeManager;

    /**
     * Initializes the StyleAPI with a reference to the chart
     * @param chart The chart instance to style
     */
    constructor(chart: ChartBase) {
        this.chart = chart;
        this.themeManager = new ThemeManager();
    }

    setChartStyle(options: Partial<ChartOptions>): void {
        // Implementation for setting general chart style options
        Object.assign(this.chart.options, options);
        this.chart.render();
    }

    setAxisStyle(axis: 'x' | 'y', options: Partial<AxisOptions>): void {
        // Implementation for setting style options for a specific axis
        if (axis === 'x') {
            Object.assign(this.chart.options.xAxis, options);
        } else {
            Object.assign(this.chart.options.yAxis, options);
        }
        this.chart.render();
    }

    setLegendStyle(options: Partial<LegendOptions>): void {
        // Implementation for setting style options for the chart legend
        Object.assign(this.chart.options.legend, options);
        this.chart.render();
    }

    setTooltipStyle(options: Partial<TooltipOptions>): void {
        // Implementation for setting style options for chart tooltips
        Object.assign(this.chart.options.tooltip, options);
        this.chart.render();
    }

    applyTheme(themeName: string): void {
        // Implementation for applying a predefined theme to the chart
        const theme = this.themeManager.getTheme(themeName);
        this.chart.applyTheme(theme);
        this.chart.render();
    }

    setSeriesStyle(seriesIndex: number, options: SeriesStyleOptions): void {
        // Implementation for setting style options for a specific data series
        if (seriesIndex >= 0 && seriesIndex < this.chart.series.length) {
            Object.assign(this.chart.series[seriesIndex].options, options);
            this.chart.render();
        }
    }
}

/**
 * Creates and returns an instance of the StyleAPI for a given chart.
 * @param chart The chart instance to create the StyleAPI for
 * @returns An instance of StyleAPI
 */
export function createStyleAPI(chart: ChartBase): StyleAPI {
    return new StyleAPIImpl(chart);
}

// Type definition for series style options
interface SeriesStyleOptions {
    color?: string;
    lineWidth?: number;
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    marker?: {
        enabled?: boolean;
        size?: number;
        shape?: 'circle' | 'square' | 'triangle';
    };
    // Add more series-specific style options as needed
}