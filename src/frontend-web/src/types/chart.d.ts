/**
 * This file contains TypeScript type definitions for chart-related data structures and functions
 * used in the frontend web application of Microsoft Excel.
 */

/**
 * Represents the different types of charts supported in Excel.
 */
export type ChartType = 'bar' | 'column' | 'line' | 'pie' | 'scatter' | 'area' | 'doughnut' | 'radar' | 'surface' | 'combo';

/**
 * Represents the options for configuring a chart axis.
 */
export interface IAxisOptions {
  title: string;
  min?: number;
  max?: number;
  gridLines?: boolean;
  labelFormat?: string;
}

/**
 * Represents the options for configuring a chart legend.
 */
export interface ILegendOptions {
  position: 'top' | 'bottom' | 'left' | 'right';
  show: boolean;
}

/**
 * Represents the options for configuring a data series in a chart.
 */
export interface ISeriesOptions {
  name: string;
  data: IRange;
  type: ChartType;
  color?: string;
}

/**
 * Represents the options for configuring a chart.
 */
export interface IChartOptions {
  title: string;
  xAxis: IAxisOptions;
  yAxis: IAxisOptions;
  legend: ILegendOptions;
  series: ISeriesOptions[];
}

/**
 * Represents a chart in an Excel worksheet.
 */
export interface IChart {
  id: string;
  type: ChartType;
  options: IChartOptions;
  dataSource: IRange;
}

/**
 * Represents a range of cells in an Excel worksheet.
 * This is imported from the excel.d.ts file, but since it's not available,
 * we'll define a placeholder interface here.
 */
export interface IRange {
  // Placeholder for IRange interface
  // Actual implementation should be imported from excel.d.ts
}

/**
 * Human tasks:
 * 1. Update the IRange interface once the excel.d.ts file is available.
 * 2. Verify that all chart types are correctly represented in the ChartType type.
 * 3. Ensure that the IChartOptions interface covers all necessary configuration options for Excel charts.
 * 4. Review and expand the ISeriesOptions interface if additional properties are needed for different chart types.
 * 5. Consider adding any additional interfaces or types that may be necessary for advanced charting features.
 */