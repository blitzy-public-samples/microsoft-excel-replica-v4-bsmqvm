import { ChartType, ChartOptions } from '../types/chart-types';
import { createChart } from '../core/chart-factory';
import { processData } from '../core/data-processor';
import { SVGRenderer } from '../renderers/svg-renderer';
import { CanvasRenderer } from '../renderers/canvas-renderer';

/**
 * Represents a chart instance with properties and methods for interaction.
 */
export interface Chart {
  type: ChartType;
  data: any[];
  options: ChartOptions;
  update(data?: any[], options?: Partial<ChartOptions>): void;
  render(container: HTMLElement, renderer: string): void;
  export(format: string): Promise<Blob>;
}

/**
 * Creates a new chart instance based on the specified type, data, and options.
 * @param type The type of chart to create.
 * @param data The data for the chart.
 * @param options The options for configuring the chart.
 * @returns A new chart instance.
 */
export function createChart(type: ChartType, data: any[], options: ChartOptions): Chart {
  const processedData = processData(data);
  const chart = createChart(type, processedData, options);
  return chart;
}

/**
 * Updates an existing chart with new data and/or options.
 * @param chart The chart instance to update.
 * @param data The new data for the chart (optional).
 * @param options The new options for the chart (optional).
 */
export function updateChart(chart: Chart, data?: any[], options?: Partial<ChartOptions>): void {
  if (data) {
    const processedData = processData(data);
    chart.data = processedData;
  }
  if (options) {
    chart.options = { ...chart.options, ...options };
  }
  chart.update(chart.data, chart.options);
}

/**
 * Renders the specified chart in the given container using the specified renderer.
 * @param chart The chart instance to render.
 * @param container The HTML element to render the chart in.
 * @param renderer The renderer to use ('svg' or 'canvas').
 */
export function renderChart(chart: Chart, container: HTMLElement, renderer: string): void {
  const rendererInstance = renderer.toLowerCase() === 'svg' ? new SVGRenderer() : new CanvasRenderer();
  rendererInstance.render(chart, container);
  
  // Apply any post-rendering operations (e.g., attaching event listeners)
  attachEventListeners(chart, container);
}

/**
 * Exports the specified chart in the given format.
 * @param chart The chart instance to export.
 * @param format The format to export the chart in ('png', 'svg', or 'pdf').
 * @returns A promise that resolves with the exported chart data as a Blob.
 */
export async function exportChart(chart: Chart, format: string): Promise<Blob> {
  // Render the chart to a temporary, off-screen container
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  document.body.appendChild(tempContainer);

  renderChart(chart, tempContainer, 'svg');

  let exportData: Blob;

  switch (format.toLowerCase()) {
    case 'png':
      exportData = await exportToPng(tempContainer);
      break;
    case 'svg':
      exportData = await exportToSvg(tempContainer);
      break;
    case 'pdf':
      exportData = await exportToPdf(tempContainer);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  // Clean up the temporary container
  document.body.removeChild(tempContainer);

  return exportData;
}

// Helper functions

function attachEventListeners(chart: Chart, container: HTMLElement): void {
  // Implement event listener attachment logic here
  // For example: tooltip interactions, click events, etc.
}

async function exportToPng(container: HTMLElement): Promise<Blob> {
  // Implement PNG export logic
  // This might involve using html2canvas or a similar library
  throw new Error('PNG export not implemented');
}

async function exportToSvg(container: HTMLElement): Promise<Blob> {
  // Implement SVG export logic
  const svgData = container.innerHTML;
  return new Blob([svgData], { type: 'image/svg+xml' });
}

async function exportToPdf(container: HTMLElement): Promise<Blob> {
  // Implement PDF export logic
  // This might involve using a library like jsPDF
  throw new Error('PDF export not implemented');
}