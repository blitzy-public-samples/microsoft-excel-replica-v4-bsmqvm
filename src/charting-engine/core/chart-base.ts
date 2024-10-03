import { ChartType } from '../types/chart-types';
import { ChartOptions } from '../types/chart-options';
import { ColorUtils } from '../utils/color-utils';
import { MathUtils } from '../utils/math-utils';
import { DataProcessor } from './data-processor';
import { AxisManager } from './axis-manager';
import { LegendManager } from './legend-manager';
import { SVGRenderer } from '../renderers/svg-renderer';
import { CanvasRenderer } from '../renderers/canvas-renderer';

/**
 * ChartBase class serves as the foundation for all chart types in the Excel charting engine.
 * It encapsulates common properties and methods that are shared across different chart types,
 * providing a consistent interface for chart creation, configuration, and rendering.
 */
export abstract class ChartBase {
  protected type: ChartType;
  protected data: any[];
  protected width: number;
  protected height: number;
  protected dataProcessor: DataProcessor;
  protected axisManager: AxisManager;
  protected legendManager: LegendManager;
  protected renderer: SVGRenderer | CanvasRenderer;

  /**
   * Initializes a new instance of the ChartBase class with the provided options.
   * @param options The configuration options for the chart.
   */
  constructor(protected options: ChartOptions) {
    this.type = options.type;
    this.width = options.width || 600;
    this.height = options.height || 400;
    this.initializeComponents();
  }

  /**
   * Sets the data for the chart and triggers data processing.
   * @param data The data to be visualized in the chart.
   */
  public setData(data: any[]): void {
    this.data = data;
    this.dataProcessor.processData(data);
    this.axisManager.updateAxes(this.dataProcessor.getProcessedData());
    this.legendManager.updateLegend(this.dataProcessor.getProcessedData());
  }

  /**
   * Updates the chart options and triggers a re-render if necessary.
   * @param options Partial chart options to update.
   */
  public updateOptions(options: Partial<ChartOptions>): void {
    this.options = { ...this.options, ...options };
    if (options.width) this.width = options.width;
    if (options.height) this.height = options.height;
    this.initializeComponents();
    this.render();
  }

  /**
   * Abstract method to be implemented by specific chart types for rendering the chart.
   */
  public abstract render(): void;

  /**
   * Resizes the chart and triggers a re-render.
   * @param width The new width of the chart.
   * @param height The new height of the chart.
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.render();
  }

  /**
   * Converts the chart to an image and returns the data URL.
   * @param format The desired image format (png or jpeg).
   * @returns A Promise that resolves with the data URL of the chart image.
   */
  public async toImage(format: 'png' | 'jpeg'): Promise<string> {
    if (this.renderer instanceof CanvasRenderer) {
      return this.renderer.toDataURL(format);
    } else if (this.renderer instanceof SVGRenderer) {
      const svgString = this.renderer.getSVGString();
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL(`image/${format}`));
        };
        img.onerror = reject;
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
      });
    }
    throw new Error('Unsupported renderer type');
  }

  /**
   * Initializes the chart components such as DataProcessor, AxisManager, and LegendManager.
   */
  protected initializeComponents(): void {
    this.dataProcessor = new DataProcessor(this.options);
    this.axisManager = new AxisManager(this.options);
    this.legendManager = new LegendManager(this.options);
    this.renderer = this.options.renderer === 'canvas' 
      ? new CanvasRenderer(this.width, this.height) 
      : new SVGRenderer(this.width, this.height);
  }

  /**
   * Abstract method to be implemented by specific chart types for drawing the chart content.
   */
  protected abstract drawChart(): void;

  /**
   * Utility method to get a color from the chart's color palette.
   * @param index The index of the color in the palette.
   * @returns The color as a string.
   */
  protected getColor(index: number): string {
    return ColorUtils.getColorFromPalette(this.options.colorPalette || [], index);
  }

  /**
   * Utility method to perform mathematical operations specific to charts.
   * @param operation The name of the operation to perform.
   * @param values The values to operate on.
   * @returns The result of the mathematical operation.
   */
  protected mathOperation(operation: string, values: number[]): number {
    return MathUtils.performOperation(operation, values);
  }
}