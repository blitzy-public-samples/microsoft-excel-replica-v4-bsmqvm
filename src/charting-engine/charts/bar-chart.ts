import { ChartBase } from '../core/chart-base';
import { ChartType } from '../types/chart-types';
import { BarChartOptions } from '../types/chart-options';
import { ColorUtils } from '../utils/color-utils';
import { MathUtils } from '../utils/math-utils';

export class BarChart extends ChartBase {
  private barWidth: number;
  private barSpacing: number;

  constructor(options: BarChartOptions) {
    super(options);
    this.type = ChartType.Bar;
    this.barWidth = options.barWidth || 0.6;
    this.barSpacing = options.barSpacing || 0.1;
  }

  public render(): void {
    super.render();
    this.drawChart();
  }

  private drawChart(): void {
    this.calculateBarDimensions();
    this.drawBars();
    this.drawLabels();
  }

  private calculateBarDimensions(): void {
    const dataPoints = this.data.datasets[0].data.length;
    const availableWidth = this.width - this.padding.left - this.padding.right;
    const totalBarWidth = availableWidth / dataPoints;
    this.barWidth = totalBarWidth * this.barWidth;
    this.barSpacing = totalBarWidth * this.barSpacing;
  }

  private drawBars(): void {
    const ctx = this.context;
    const maxValue = MathUtils.getMaxValue(this.data.datasets[0].data);
    const scaleFactor = (this.height - this.padding.top - this.padding.bottom) / maxValue;

    this.data.datasets[0].data.forEach((value, index) => {
      const x = this.padding.left + index * (this.barWidth + this.barSpacing);
      const y = this.height - this.padding.bottom - value * scaleFactor;
      const barHeight = value * scaleFactor;

      ctx.fillStyle = ColorUtils.getColor(index, this.options.colors);
      ctx.fillRect(x, y, this.barWidth, barHeight);

      // Add bar value on top of the bar
      ctx.fillStyle = this.options.textColor || '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(value.toString(), x + this.barWidth / 2, y - 5);
    });
  }

  private drawLabels(): void {
    const ctx = this.context;
    ctx.fillStyle = this.options.textColor || '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    this.data.labels.forEach((label, index) => {
      const x = this.padding.left + index * (this.barWidth + this.barSpacing) + this.barWidth / 2;
      const y = this.height - this.padding.bottom + 10;
      ctx.fillText(label, x, y);
    });
  }
}