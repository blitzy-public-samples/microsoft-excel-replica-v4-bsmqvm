import { ChartType } from '../types/chart-types';
import { ChartOptions } from '../types/chart-options';
import { BarChart } from '../charts/bar-chart';
import { LineChart } from '../charts/line-chart';
import { PieChart } from '../charts/pie-chart';
import { ScatterChart } from '../charts/scatter-chart';
import { AreaChart } from '../charts/area-chart';
import { ColumnChart } from '../charts/column-chart';
import { ComboChart } from '../charts/combo-chart';
import { ChartBase } from './chart-base';

/**
 * ChartFactory class is responsible for creating and managing different types of charts
 * based on user input and data.
 */
export class ChartFactory {
  /**
   * Creates and returns a specific chart instance based on the provided chart type and options.
   * @param type The type of chart to create
   * @param options The options for configuring the chart
   * @returns An instance of a specific chart type extending ChartBase
   * @throws Error if an unsupported chart type is provided
   */
  public static createChart(type: ChartType, options: ChartOptions): ChartBase {
    switch (type) {
      case ChartType.Bar:
        return new BarChart(options);
      case ChartType.Line:
        return new LineChart(options);
      case ChartType.Pie:
        return new PieChart(options);
      case ChartType.Scatter:
        return new ScatterChart(options);
      case ChartType.Area:
        return new AreaChart(options);
      case ChartType.Column:
        return new ColumnChart(options);
      case ChartType.Combo:
        return new ComboChart(options);
      default:
        throw new Error(`Unsupported chart type: ${type}`);
    }
  }
}

// Export the createChart function for easier access
export const createChart = ChartFactory.createChart;