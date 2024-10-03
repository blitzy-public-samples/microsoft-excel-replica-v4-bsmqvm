import { ChartBase } from '../core/chart-base';
import { ChartType } from '../types/chart-types';
import { ChartOptions } from '../types/chart-options';
import { SVGRenderer } from '../renderers/svg-renderer';
import { CanvasRenderer } from '../renderers/canvas-renderer';

interface AccessibilityComplianceReport {
  isCompliant: boolean;
  issues: string[];
}

export class A11yManager {
  private chart: ChartBase;
  private ariaLabel: string;
  private altText: string;

  constructor(chart: ChartBase) {
    this.chart = chart;
    this.ariaLabel = '';
    this.altText = '';
  }

  /**
   * Sets the ARIA label for the chart.
   * @param label The ARIA label to set.
   */
  public setAriaLabel(label: string): void {
    this.ariaLabel = label;
    this.applyAccessibilityAttributes();
  }

  /**
   * Sets the alternative text for the chart.
   * @param text The alternative text to set.
   */
  public setAltText(text: string): void {
    this.altText = text;
    this.applyAccessibilityAttributes();
  }

  /**
   * Generates alternative text for the chart based on its type, data, and other properties.
   * @returns Generated alternative text.
   */
  public generateAltText(): string {
    const chartType = this.chart.getType();
    const chartData = this.chart.getData();
    const chartTitle = this.chart.getTitle();

    let altText = `${chartTitle} - ${ChartType[chartType]} chart. `;

    switch (chartType) {
      case ChartType.Bar:
      case ChartType.Column:
        altText += `Comparing ${chartData.labels.length} categories. `;
        break;
      case ChartType.Line:
      case ChartType.Area:
        altText += `Showing trend over ${chartData.labels.length} points. `;
        break;
      case ChartType.Pie:
        altText += `Displaying ${chartData.datasets[0].data.length} segments. `;
        break;
      case ChartType.Scatter:
        altText += `Plotting ${chartData.datasets[0].data.length} points. `;
        break;
      default:
        altText += `Contains ${chartData.datasets[0].data.length} data points. `;
    }

    altText += `Highest value: ${Math.max(...chartData.datasets[0].data)}. `;
    altText += `Lowest value: ${Math.min(...chartData.datasets[0].data)}.`;

    return altText;
  }

  /**
   * Applies accessibility attributes to the chart's DOM elements.
   */
  public applyAccessibilityAttributes(): void {
    const chartElement = this.chart.getChartElement();
    if (chartElement) {
      chartElement.setAttribute('role', 'img');
      chartElement.setAttribute('aria-label', this.ariaLabel || this.generateAltText());
      
      if (this.chart.getRenderer() instanceof SVGRenderer) {
        const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleElement.textContent = this.altText || this.generateAltText();
        chartElement.insertBefore(titleElement, chartElement.firstChild);
      } else if (this.chart.getRenderer() instanceof CanvasRenderer) {
        chartElement.setAttribute('aria-label', this.altText || this.generateAltText());
      }
    }
  }

  /**
   * Enables keyboard navigation for interactive chart elements.
   */
  public enableKeyboardNavigation(): void {
    const chartElement = this.chart.getChartElement();
    if (chartElement) {
      chartElement.setAttribute('tabindex', '0');
      chartElement.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    // Implement keyboard navigation logic here
    // This will depend on the chart type and interactivity features
  }

  /**
   * Creates an accessible HTML table representation of the chart data.
   * @returns Accessible HTML table element.
   */
  public createAccessibleDataTable(): HTMLTableElement {
    const table = document.createElement('table');
    table.setAttribute('role', 'presentation');
    table.setAttribute('aria-label', `Data table for ${this.chart.getTitle()}`);

    const chartData = this.chart.getData();
    const thead = table.createTHead();
    const headerRow = thead.insertRow();

    // Add headers
    headerRow.insertCell().textContent = 'Category';
    chartData.datasets.forEach(dataset => {
      headerRow.insertCell().textContent = dataset.label;
    });

    // Add data rows
    const tbody = table.createTBody();
    chartData.labels.forEach((label, index) => {
      const row = tbody.insertRow();
      row.insertCell().textContent = label;
      chartData.datasets.forEach(dataset => {
        row.insertCell().textContent = dataset.data[index].toString();
      });
    });

    return table;
  }

  /**
   * Checks the chart for accessibility compliance and returns a report.
   * @returns Accessibility compliance report.
   */
  public checkAccessibilityCompliance(): AccessibilityComplianceReport {
    const issues: string[] = [];
    const chartElement = this.chart.getChartElement();

    if (!chartElement) {
      issues.push('Chart element not found.');
      return { isCompliant: false, issues };
    }

    if (!chartElement.hasAttribute('role')) {
      issues.push('Chart element is missing the "role" attribute.');
    }

    if (!chartElement.hasAttribute('aria-label') && !chartElement.querySelector('title')) {
      issues.push('Chart is missing both aria-label and title elements.');
    }

    if (chartElement.getAttribute('tabindex') !== '0') {
      issues.push('Chart element is not keyboard focusable.');
    }

    // Add more compliance checks as needed

    return {
      isCompliant: issues.length === 0,
      issues,
    };
  }
}