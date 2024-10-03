import { ChartType } from './chart-types';

/**
 * This interface defines the structure for general chart options applicable to all chart types.
 */
export interface ChartOptions {
  title: string;
  width: number;
  height: number;
  backgroundColor: string;
  fontFamily: string;
  fontSize: number;
  responsive: boolean;
}

/**
 * This interface defines the structure for configuring chart axes.
 */
export interface AxisOptions {
  title: string;
  min: number;
  max: number;
  tickInterval: number;
  gridLines: boolean;
}

/**
 * This interface defines the structure for configuring chart legends.
 */
export interface LegendOptions {
  show: boolean;
  position: string;
  fontSize: number;
}

/**
 * This interface defines the structure for configuring chart tooltips.
 */
export interface TooltipOptions {
  enabled: boolean;
  format: string;
}

/**
 * This type defines a union of chart-specific option interfaces for different chart types.
 */
export type ChartTypeOptions =
  | BarChartOptions
  | LineChartOptions
  | PieChartOptions
  | ScatterChartOptions
  | AreaChartOptions
  | ColumnChartOptions
  | ComboChartOptions;

/**
 * This type combines the general ChartOptions with chart-specific options and additional configuration options.
 */
export type CompleteChartOptions = ChartOptions &
  ChartTypeOptions & {
    axis?: AxisOptions;
    legend?: LegendOptions;
    tooltip?: TooltipOptions;
  };

// Chart-specific option interfaces
interface BarChartOptions {
  // Add bar chart specific options here
}

interface LineChartOptions {
  // Add line chart specific options here
}

interface PieChartOptions {
  // Add pie chart specific options here
}

interface ScatterChartOptions {
  // Add scatter chart specific options here
}

interface AreaChartOptions {
  // Add area chart specific options here
}

interface ColumnChartOptions {
  // Add column chart specific options here
}

interface ComboChartOptions {
  // Add combo chart specific options here
}