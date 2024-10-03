import { ChartBase } from '../core/chart-base';
import { IComboChart, ChartType } from '../types/chart-types';
import { ComboChartOptions } from '../types/chart-options';
import { ColorUtils } from '../utils/color-utils';
import { MathUtils } from '../utils/math-utils';

/**
 * The ComboChart class represents a combination chart that can display multiple data series
 * using different chart types within a single chart. It extends the ChartBase class and
 * implements the specific rendering logic for combo charts.
 */
export class ComboChart extends ChartBase implements IComboChart {
  private chartTypes: ChartType[];
  private seriesOptions: any[];

  /**
   * Initializes a new instance of the ComboChart class with the provided options.
   * @param options - The options for configuring the combo chart.
   */
  constructor(options: ComboChartOptions) {
    super(options);
    this.chartTypes = options.chartTypes || [];
    this.seriesOptions = options.seriesOptions || [];
  }

  /**
   * Renders the combo chart by calling the drawChart method and applying any necessary post-rendering operations.
   */
  public render(): void {
    this.drawChart();
    this.applyPostRenderingOperations();
  }

  /**
   * Implements the specific drawing logic for the combo chart, combining multiple chart types.
   */
  private drawChart(): void {
    this.clearCanvas();
    this.drawAxes();
    this.drawLegend();

    const seriesCount = Math.min(this.data.length, this.chartTypes.length, this.seriesOptions.length);

    for (let i = 0; i < seriesCount; i++) {
      const chartType = this.chartTypes[i];
      const data = this.data[i];
      const options = this.seriesOptions[i];

      switch (chartType) {
        case ChartType.Bar:
          this.drawBarSeries(i, data, options);
          break;
        case ChartType.Line:
          this.drawLineSeries(i, data, options);
          break;
        case ChartType.Area:
          this.drawAreaSeries(i, data, options);
          break;
        // Add more chart types as needed
      }
    }
  }

  /**
   * Draws a bar series for the combo chart.
   * @param seriesIndex - The index of the series.
   * @param data - The data for the series.
   * @param options - The options for the series.
   */
  private drawBarSeries(seriesIndex: number, data: number[], options: any): void {
    const barWidth = this.calculateBarWidth();
    const color = ColorUtils.getSeriesColor(seriesIndex);

    data.forEach((value, index) => {
      const x = this.getXPosition(index);
      const y = this.getYPosition(value);
      const height = this.chartHeight - y;

      this.context.fillStyle = color;
      this.context.fillRect(x - barWidth / 2, y, barWidth, height);
    });
  }

  /**
   * Draws a line series for the combo chart.
   * @param seriesIndex - The index of the series.
   * @param data - The data for the series.
   * @param options - The options for the series.
   */
  private drawLineSeries(seriesIndex: number, data: number[], options: any): void {
    const color = ColorUtils.getSeriesColor(seriesIndex);

    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.lineWidth = options.lineWidth || 2;

    data.forEach((value, index) => {
      const x = this.getXPosition(index);
      const y = this.getYPosition(value);

      if (index === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    });

    this.context.stroke();
  }

  /**
   * Draws an area series for the combo chart.
   * @param seriesIndex - The index of the series.
   * @param data - The data for the series.
   * @param options - The options for the series.
   */
  private drawAreaSeries(seriesIndex: number, data: number[], options: any): void {
    const color = ColorUtils.getSeriesColor(seriesIndex);
    const fillColor = ColorUtils.adjustAlpha(color, 0.3);

    this.context.beginPath();
    this.context.fillStyle = fillColor;

    data.forEach((value, index) => {
      const x = this.getXPosition(index);
      const y = this.getYPosition(value);

      if (index === 0) {
        this.context.moveTo(x, this.chartHeight);
        this.context.lineTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    });

    this.context.lineTo(this.getXPosition(data.length - 1), this.chartHeight);
    this.context.closePath();
    this.context.fill();

    // Draw the line on top of the area
    this.drawLineSeries(seriesIndex, data, options);
  }

  /**
   * Calculates the width of each bar in the bar series.
   * @returns The calculated bar width.
   */
  private calculateBarWidth(): number {
    const barCount = this.data[0].length;
    const availableWidth = this.chartWidth - this.padding.left - this.padding.right;
    return MathUtils.clamp(availableWidth / (barCount * 2), 1, 50);
  }

  /**
   * Applies any necessary post-rendering operations, such as adding interactivity or animations.
   */
  private applyPostRenderingOperations(): void {
    // Implement post-rendering operations like adding tooltips, hover effects, or animations
    // This method can be extended based on specific requirements
  }
}