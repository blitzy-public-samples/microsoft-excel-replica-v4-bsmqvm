import { ChartBase } from '../core/chart-base';
import { IAreaChart, ChartType } from '../types/chart-types';
import { AreaChartOptions } from '../types/chart-options';
import { ColorUtils } from '../utils/color-utils';
import { MathUtils } from '../utils/math-utils';

/**
 * AreaChart class implements the specific logic for rendering area charts in the Excel charting engine.
 * It extends the ChartBase class and provides functionality for area chart visualization.
 */
export class AreaChart extends ChartBase implements IAreaChart {
  type: ChartType.AREA = ChartType.AREA;

  constructor(options: AreaChartOptions) {
    super(options);
    // Additional initialization specific to area charts can be done here
  }

  /**
   * Renders the area chart by calling the drawChart method and any additional area chart-specific rendering logic.
   */
  render(): void {
    super.render(); // Call the base class render method
    this.drawChart();
  }

  /**
   * Implements the specific drawing logic for area charts, including calculating areas, drawing paths, and filling them with appropriate colors.
   */
  private drawChart(): void {
    const data = this.getData();
    const points = this.calculateAreaPoints(data);
    const color = this.options.color || ColorUtils.getDefaultColor(0);

    this.drawArea(points, color);
  }

  /**
   * Calculates the points needed to draw the area chart based on the provided data.
   * @param data - The data points for the area chart
   * @returns An array of calculated points as [x, y] coordinates
   */
  private calculateAreaPoints(data: number[]): [number, number][] {
    const points: [number, number][] = [];
    const xStep = this.width / (data.length - 1);
    const yScale = this.height / Math.max(...data);

    // Add the bottom-left point to close the area
    points.push([0, this.height]);

    // Calculate points for each data value
    data.forEach((value, index) => {
      const x = index * xStep;
      const y = this.height - value * yScale;
      points.push([x, y]);
    });

    // Add the bottom-right point to close the area
    points.push([this.width, this.height]);

    return points;
  }

  /**
   * Draws the filled area for the chart using the calculated points and specified color.
   * @param points - The array of points defining the area shape
   * @param color - The color to fill the area
   */
  private drawArea(points: [number, number][], color: string): void {
    const ctx = this.getContext();
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }

    ctx.fillStyle = ColorUtils.setAlpha(color, 0.6); // Set area fill color with some transparency
    ctx.fill();

    // Draw the top line of the area
    ctx.beginPath();
    ctx.moveTo(points[1][0], points[1][1]); // Start from the first data point, not the bottom-left corner
    for (let i = 2; i < points.length - 1; i++) { // End before the bottom-right corner
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}