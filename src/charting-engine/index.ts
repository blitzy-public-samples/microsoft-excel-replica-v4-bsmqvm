/**
 * @file index.ts
 * @description Main entry point for the charting engine module of Microsoft Excel,
 * exporting all necessary components and APIs for chart creation and manipulation.
 */

// Import chart type definitions
import { ChartTypes, ChartOptions } from './types';

// Import the main chart creation factory
import { ChartFactory } from './core/chart-factory';

// Import the public API for chart manipulation
import { ChartAPI } from './api/chart-api';

// Import rendering capabilities
import { SVGRenderer } from './renderers/svg-renderer';
import { CanvasRenderer } from './renderers/canvas-renderer';

// Import chart implementations
import { BarChart } from './charts/bar-chart';
import { LineChart } from './charts/line-chart';
import { PieChart } from './charts/pie-chart';
import { ScatterChart } from './charts/scatter-chart';
import { AreaChart } from './charts/area-chart';
import { ColumnChart } from './charts/column-chart';
import { ComboChart } from './charts/combo-chart';

/**
 * Creates a new chart instance based on the provided type, data, and options.
 * @param type The type of chart to create
 * @param data The data to be visualized in the chart
 * @param options Configuration options for the chart
 * @returns A new chart instance
 */
export function createChart(type: ChartTypes, data: any, options: ChartOptions): Chart {
    return ChartFactory.createChart(type, data, options);
}

/**
 * Renders a chart to the specified container using either SVG or Canvas rendering.
 * @param chart The chart instance to render
 * @param container The HTML element to render the chart into
 * @param renderer The rendering method to use ('svg' or 'canvas')
 */
export function renderChart(chart: Chart, container: HTMLElement, renderer: 'svg' | 'canvas'): void {
    const renderingEngine = renderer === 'svg' ? new SVGRenderer() : new CanvasRenderer();
    renderingEngine.render(chart, container);
}

// Export chart implementations
export { BarChart, LineChart, PieChart, ScatterChart, AreaChart, ColumnChart, ComboChart };

// Export core components
export { ChartFactory, ChartAPI };

// Export rendering capabilities
export { SVGRenderer, CanvasRenderer };

// Export types and interfaces
export { ChartTypes, ChartOptions };

// Export main functions
export { createChart, renderChart };