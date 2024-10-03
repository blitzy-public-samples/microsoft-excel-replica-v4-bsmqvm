import { ChartTypes, IChartBase } from '../types/chart-types';
import { formatValue } from '../utils/formatting-utils';

// Interface for tooltip options
export interface ITooltipOptions {
  enabled: boolean;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  titleFont: string;
  bodyFont: string;
  titleColor: string;
  bodyColor: string;
  displayColors: boolean;
  callbacks?: {
    title?: (tooltipItems: any[]) => string;
    label?: (tooltipItem: any) => string;
  };
}

// Interface for tooltip manager
export interface ITooltipManager {
  initialize(chart: IChartBase): void;
  update(x: number, y: number): void;
  hide(): void;
  destroy(): void;
}

// Class that manages tooltip functionality for charts
class TooltipManager implements ITooltipManager {
  private chart: IChartBase | null = null;
  private tooltipElement: HTMLElement | null = null;
  private options: ITooltipOptions;

  constructor(options: Partial<ITooltipOptions> = {}) {
    this.options = {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(0, 0, 0, 0)',
      borderWidth: 0,
      titleFont: '12px Arial',
      bodyFont: '12px Arial',
      titleColor: '#fff',
      bodyColor: '#fff',
      displayColors: true,
      ...options
    };
  }

  public initialize(chart: IChartBase): void {
    this.chart = chart;
    this.createTooltipElement();
  }

  public update(x: number, y: number): void {
    if (!this.chart || !this.tooltipElement || !this.options.enabled) return;

    const dataIndex = this.chart.getDataIndexFromCoordinates(x, y);
    if (dataIndex === -1) {
      this.hide();
      return;
    }

    const content = this.createTooltipContent(dataIndex);
    this.tooltipElement.innerHTML = content;
    this.positionTooltip(x, y);
    this.tooltipElement.style.display = 'block';
  }

  public hide(): void {
    if (this.tooltipElement) {
      this.tooltipElement.style.display = 'none';
    }
  }

  public destroy(): void {
    if (this.tooltipElement && this.tooltipElement.parentNode) {
      this.tooltipElement.parentNode.removeChild(this.tooltipElement);
    }
    this.chart = null;
    this.tooltipElement = null;
  }

  private createTooltipElement(): void {
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.style.position = 'absolute';
    this.tooltipElement.style.backgroundColor = this.options.backgroundColor;
    this.tooltipElement.style.border = `${this.options.borderWidth}px solid ${this.options.borderColor}`;
    this.tooltipElement.style.padding = '5px';
    this.tooltipElement.style.pointerEvents = 'none';
    this.tooltipElement.style.display = 'none';
    document.body.appendChild(this.tooltipElement);
  }

  private createTooltipContent(dataIndex: number): string {
    if (!this.chart) return '';

    const data = this.chart.getData();
    const title = this.options.callbacks?.title
      ? this.options.callbacks.title([data[dataIndex]])
      : `Item ${dataIndex + 1}`;

    const label = this.options.callbacks?.label
      ? this.options.callbacks.label(data[dataIndex])
      : this.defaultLabelCallback(data[dataIndex]);

    return `
      <div style="font: ${this.options.titleFont}; color: ${this.options.titleColor};">
        ${title}
      </div>
      <div style="font: ${this.options.bodyFont}; color: ${this.options.bodyColor};">
        ${label}
      </div>
    `;
  }

  private defaultLabelCallback(tooltipItem: any): string {
    if (typeof tooltipItem === 'object') {
      return Object.entries(tooltipItem)
        .map(([key, value]) => `${key}: ${formatValue(value)}`)
        .join('<br>');
    }
    return formatValue(tooltipItem);
  }

  private positionTooltip(x: number, y: number): void {
    if (!this.tooltipElement) return;

    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const chartRect = this.chart?.getChartRect() || { left: 0, top: 0, right: 0, bottom: 0 };

    let left = x + 10;
    let top = y + 10;

    if (left + tooltipRect.width > chartRect.right) {
      left = x - tooltipRect.width - 10;
    }

    if (top + tooltipRect.height > chartRect.bottom) {
      top = y - tooltipRect.height - 10;
    }

    this.tooltipElement.style.left = `${left}px`;
    this.tooltipElement.style.top = `${top}px`;
  }
}

// Factory function to create a tooltip manager
export function createTooltipManager(options?: Partial<ITooltipOptions>): ITooltipManager {
  return new TooltipManager(options);
}