import { ChartBase } from '../core/chart-base';
import { ChartType } from '../types/chart-types';
import { LineChartOptions } from '../types/chart-options';
import { MathUtils } from '../utils/math-utils';
import { ColorUtils } from '../utils/color-utils';

interface Point {
  x: number;
  y: number;
}

interface LineStyle {
  color: string;
  width: number;
  dashArray?: number[];
}

export class LineChart extends ChartBase {
  private lineStyles: LineStyle[];
  private dataPoints: Point[][];

  constructor(options: LineChartOptions) {
    super(options);
    this.type = ChartType.Line;
    this.lineStyles = options.lineStyles || [];
    this.dataPoints = [];
  }

  public render(): void {
    super.render();
    this.drawChart();
  }

  protected drawChart(): void {
    this.processData();
    this.drawLines();
    this.drawDataPoints();
    this.drawAxes();
    this.drawLegend();
  }

  private processData(): void {
    this.dataPoints = this.data.map(series => 
      series.map((point, index) => ({ x: index, y: point }))
    );
  }

  private drawLines(): void {
    const ctx = this.context;
    if (!ctx) return;

    this.dataPoints.forEach((points, seriesIndex) => {
      ctx.beginPath();
      ctx.strokeStyle = this.getLineStyle(seriesIndex).color;
      ctx.lineWidth = this.getLineStyle(seriesIndex).width;

      const dashArray = this.getLineStyle(seriesIndex).dashArray;
      if (dashArray) {
        ctx.setLineDash(dashArray);
      }

      points.forEach((point, index) => {
        const { x, y } = this.getPixelCoordinates(point);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
      ctx.setLineDash([]); // Reset dash array
    });
  }

  private drawDataPoints(): void {
    const ctx = this.context;
    if (!ctx) return;

    this.dataPoints.forEach((points, seriesIndex) => {
      ctx.fillStyle = this.getLineStyle(seriesIndex).color;
      points.forEach(point => {
        const { x, y } = this.getPixelCoordinates(point);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  }

  private getLineStyle(index: number): LineStyle {
    return this.lineStyles[index] || { color: ColorUtils.getRandomColor(), width: 2 };
  }

  private getPixelCoordinates(point: Point): { x: number; y: number } {
    const xScale = this.chartArea.width / (this.dataPoints[0].length - 1);
    const yScale = this.chartArea.height / (this.getMaxY() - this.getMinY());

    return {
      x: this.chartArea.x + point.x * xScale,
      y: this.chartArea.y + this.chartArea.height - (point.y - this.getMinY()) * yScale
    };
  }

  private getMinY(): number {
    return MathUtils.min(this.dataPoints.flat().map(p => p.y));
  }

  private getMaxY(): number {
    return MathUtils.max(this.dataPoints.flat().map(p => p.y));
  }

  protected calculateYScale(): { min: number; max: number; step: number } {
    const minY = this.getMinY();
    const maxY = this.getMaxY();
    const range = maxY - minY;
    const step = MathUtils.calculateNiceStep(range, 5);
    return { min: Math.floor(minY / step) * step, max: Math.ceil(maxY / step) * step, step };
  }

  private drawAxes(): void {
    const ctx = this.context;
    if (!ctx) return;

    const { min, max, step } = this.calculateYScale();

    // Draw Y-axis
    ctx.beginPath();
    ctx.moveTo(this.chartArea.x, this.chartArea.y);
    ctx.lineTo(this.chartArea.x, this.chartArea.y + this.chartArea.height);
    ctx.stroke();

    // Draw Y-axis labels and grid lines
    for (let y = min; y <= max; y += step) {
      const pixelY = this.getPixelCoordinates({ x: 0, y }).y;
      ctx.fillText(y.toString(), this.chartArea.x - 30, pixelY);
      
      ctx.beginPath();
      ctx.moveTo(this.chartArea.x, pixelY);
      ctx.lineTo(this.chartArea.x + this.chartArea.width, pixelY);
      ctx.strokeStyle = '#e0e0e0';
      ctx.stroke();
    }

    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(this.chartArea.x, this.chartArea.y + this.chartArea.height);
    ctx.lineTo(this.chartArea.x + this.chartArea.width, this.chartArea.y + this.chartArea.height);
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Draw X-axis labels
    const xLabelStep = Math.ceil(this.dataPoints[0].length / 5);
    this.dataPoints[0].forEach((point, index) => {
      if (index % xLabelStep === 0) {
        const { x } = this.getPixelCoordinates(point);
        ctx.fillText(index.toString(), x, this.chartArea.y + this.chartArea.height + 20);
      }
    });
  }

  private drawLegend(): void {
    const ctx = this.context;
    if (!ctx) return;

    const legendX = this.chartArea.x + this.chartArea.width + 20;
    const legendY = this.chartArea.y;
    const lineHeight = 20;

    this.data.forEach((series, index) => {
      const style = this.getLineStyle(index);
      ctx.fillStyle = style.color;
      ctx.fillRect(legendX, legendY + index * lineHeight, 15, 15);
      ctx.fillStyle = '#000000';
      ctx.fillText(`Series ${index + 1}`, legendX + 20, legendY + index * lineHeight + 12);
    });
  }
}