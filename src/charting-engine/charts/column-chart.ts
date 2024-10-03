import { ChartBase } from '../core/chart-base';
import { ChartType } from '../types/chart-types';
import { ColumnChartOptions } from '../types/chart-options';
import { ColorUtils } from '../utils/color-utils';
import { MathUtils } from '../utils/math-utils';

export class ColumnChart extends ChartBase {
  private columnWidth: number;
  private columnSpacing: number;
  private isStacked: boolean;

  constructor(options: ColumnChartOptions) {
    super(options);
    this.columnWidth = options.columnWidth || 0.8;
    this.columnSpacing = options.columnSpacing || 0.2;
    this.isStacked = options.isStacked || false;
    this.chartType = ChartType.COLUMN;
  }

  public render(): void {
    this.clear();
    this.calculateChartDimensions();
    this.drawAxes();
    this.drawChart();
    this.drawLegend();
    this.drawTitle();
  }

  protected drawChart(): void {
    this.calculateColumnDimensions();
    this.drawColumns();
    this.drawLabels();
  }

  private calculateColumnDimensions(): void {
    const availableWidth = this.chartArea.width;
    const dataPointCount = this.data[0].values.length;
    const totalSpacing = (dataPointCount - 1) * this.columnSpacing;
    const columnWidth = (availableWidth - totalSpacing) / dataPointCount;
    this.columnWidth = columnWidth * this.columnWidth; // Apply user-defined width
    this.columnSpacing = (availableWidth - this.columnWidth * dataPointCount) / (dataPointCount - 1);
  }

  private drawColumns(): void {
    const { ctx } = this;
    const { height } = this.chartArea;
    const baselineY = this.chartArea.y + height;

    this.data.forEach((series, seriesIndex) => {
      series.values.forEach((value, index) => {
        const x = this.getColumnX(index);
        const y = this.getColumnY(value, seriesIndex);
        const columnHeight = baselineY - y;

        ctx.fillStyle = ColorUtils.getColor(seriesIndex, this.options.colors);
        ctx.fillRect(x, y, this.columnWidth, columnHeight);

        // Add column border if specified in options
        if (this.options.columnBorder) {
          ctx.strokeStyle = this.options.columnBorder.color || '#000000';
          ctx.lineWidth = this.options.columnBorder.width || 1;
          ctx.strokeRect(x, y, this.columnWidth, columnHeight);
        }
      });
    });
  }

  private getColumnX(index: number): number {
    return this.chartArea.x + index * (this.columnWidth + this.columnSpacing);
  }

  private getColumnY(value: number, seriesIndex: number): number {
    const { height } = this.chartArea;
    const baselineY = this.chartArea.y + height;
    const scaledValue = this.scaleValue(value);
    
    if (this.isStacked && seriesIndex > 0) {
      const previousValues = this.data
        .slice(0, seriesIndex)
        .reduce((sum, series) => sum + this.scaleValue(series.values[seriesIndex]), 0);
      return baselineY - (scaledValue + previousValues);
    }
    
    return baselineY - scaledValue;
  }

  private drawLabels(): void {
    const { ctx } = this;
    ctx.fillStyle = this.options.labelColor || '#000000';
    ctx.font = this.options.labelFont || '12px Arial';
    ctx.textAlign = 'center';

    this.data[0].values.forEach((_, index) => {
      const x = this.getColumnX(index) + this.columnWidth / 2;
      const y = this.chartArea.y + this.chartArea.height + 20;
      ctx.fillText(this.labels[index], x, y);
    });
  }

  private scaleValue(value: number): number {
    const maxValue = MathUtils.getMaxValue(this.data);
    const scaleFactor = this.chartArea.height / maxValue;
    return value * scaleFactor;
  }
}