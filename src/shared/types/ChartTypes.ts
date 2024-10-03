import { ChartTypeEnum } from '../enums/ChartTypeEnum';

/**
 * This type represents the available chart types in Excel, derived from the ChartTypeEnum.
 */
export type ChartType = keyof typeof ChartTypeEnum;

/**
 * Represents a single data point in a chart, with x and y values and an optional label.
 */
export type ChartDataPoint = {
  x: number | string;
  y: number;
  label?: string;
};

/**
 * Defines a series of data for a chart, including a name, array of data points, and an optional color.
 */
export type ChartSeries = {
  name: string;
  data: ChartDataPoint[];
  color?: string;
};

/**
 * Represents the configuration for a chart axis, including title, range, format, and grid line options.
 */
export type ChartAxis = {
  title: string;
  min?: number;
  max?: number;
  format?: string;
  gridLines?: boolean;
};

/**
 * Defines the properties for a chart legend, including its position and visibility.
 */
export type ChartLegend = {
  position: 'top' | 'bottom' | 'left' | 'right';
  show: boolean;
};

/**
 * Represents the style options for a chart, including font, background, and border properties.
 */
export type ChartStyle = {
  fontFamily?: string;
  fontSize?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
};

/**
 * Defines the complete set of options for creating and configuring a chart in Excel.
 */
export type ChartOptions = {
  type: ChartType;
  title: string;
  xAxis: ChartAxis;
  yAxis: ChartAxis;
  series: ChartSeries[];
  legend: ChartLegend;
  style?: ChartStyle;
  is3D?: boolean;
  animation?: boolean;
  responsive?: boolean;
};