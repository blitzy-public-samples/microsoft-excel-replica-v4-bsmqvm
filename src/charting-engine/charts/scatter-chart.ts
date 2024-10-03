import { ChartBase } from '../core/chart-base';
import { ChartType } from '../types/chart-types';
import { ScatterChartOptions } from '../types/chart-options';
import { MathUtils } from '../utils/math-utils';
import { ColorUtils } from '../utils/color-utils';

/**
 * ScatterChart class implements the scatter plot chart type, extending the ChartBase class
 * with specific functionality for rendering scatter plots.
 */
export class ScatterChart extends ChartBase {
  private scatterOptions: ScatterChartOptions;

  /**
   * Initializes a new instance of the ScatterChart class with the provided options.
   * @param options - The options for configuring the scatter chart.
   */
  constructor(options: ScatterChartOptions) {
    super(options);
    this.scatterOptions = options;
    this.type = ChartType.Scatter;
  }

  /**
   * Renders the scatter chart by calling the base class render method and then invoking the drawChart method.
   */
  public render(): void {
    super.render();
    this.drawChart();
  }

  /**
   * Implements the abstract drawChart method from the base class to render the scatter plot.
   */
  protected drawChart(): void {
    this.drawAxes();
    this.drawDataPoints();
    if (this.scatterOptions.showTrendline) {
      this.drawTrendline();
    }
  }

  /**
   * Draws the individual data points on the scatter plot.
   */
  private drawDataPoints(): void {
    const { ctx, width, height } = this.canvas;
    const { data, xAxis, yAxis } = this.options;

    data.forEach((series) => {
      ctx.fillStyle = series.color || ColorUtils.getRandomColor();
      series.data.forEach((point) => {
        const x = MathUtils.mapValueToPixel(point[0], xAxis.min, xAxis.max, 0, width);
        const y = MathUtils.mapValueToPixel(point[1], yAxis.min, yAxis.max, height, 0);
        
        ctx.beginPath();
        ctx.arc(x, y, this.scatterOptions.pointRadius || 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  }

  /**
   * Draws a trendline on the scatter plot if enabled in the options.
   */
  private drawTrendline(): void {
    const { ctx, width, height } = this.canvas;
    const { data, xAxis, yAxis } = this.options;

    // Combine all series data for trendline calculation
    const allPoints = data.flatMap(series => series.data);

    const { slope, intercept } = MathUtils.calculateLinearRegression(allPoints);

    const startX = MathUtils.mapValueToPixel(xAxis.min, xAxis.min, xAxis.max, 0, width);
    const startY = MathUtils.mapValueToPixel(slope * xAxis.min + intercept, yAxis.min, yAxis.max, height, 0);
    const endX = MathUtils.mapValueToPixel(xAxis.max, xAxis.min, xAxis.max, 0, width);
    const endY = MathUtils.mapValueToPixel(slope * xAxis.max + intercept, yAxis.min, yAxis.max, height, 0);

    ctx.strokeStyle = this.scatterOptions.trendlineColor || '#FF0000';
    ctx.lineWidth = this.scatterOptions.trendlineWidth || 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}