import { ChartTypeEnum } from '../enums/ChartTypeEnum';

/**
 * This interface defines the structure and properties of a chart in Microsoft Excel.
 */
export interface IChart {
  /** Unique identifier for the chart */
  id: string;

  /** Type of the chart */
  type: ChartTypeEnum;

  /** Title of the chart */
  title: string;

  /** Data range for the chart */
  dataRange: string;

  /** X-axis configuration */
  xAxis: IChartAxis;

  /** Y-axis configuration */
  yAxis: IChartAxis;

  /** Array of data series for the chart */
  series: IChartSeries[];

  /** Legend configuration */
  legend: IChartLegend;

  /** Width of the chart */
  width: number;

  /** Height of the chart */
  height: number;

  /** Position of the chart */
  position: object;

  /** Style of the chart */
  style: object;

  /** Indicates if the chart is 3D */
  is3D: boolean;

  /** Indicates if the chart has data labels */
  hasDataLabels: boolean;

  /** Indicates if the chart has a data table */
  hasDataTable: boolean;

  /** Indicates if the chart has error bars */
  hasErrorBars: boolean;

  /** Indicates if the chart has trendlines */
  hasTrendlines: boolean;
}

/**
 * This interface defines the properties for chart axes.
 */
export interface IChartAxis {
  /** Title of the axis */
  title: string;

  /** Minimum value of the axis */
  min: number;

  /** Maximum value of the axis */
  max: number;

  /** Major unit for axis intervals */
  majorUnit: number;

  /** Minor unit for axis intervals */
  minorUnit: number;

  /** Format of the axis labels */
  format: string;
}

/**
 * This interface defines the properties for a data series in a chart.
 */
export interface IChartSeries {
  /** Name of the data series */
  name: string;

  /** Data range for the series */
  dataRange: string;

  /** Color of the series */
  color: string;

  /** Marker style for the series */
  markerStyle: string;
}

/**
 * This interface defines the properties for the chart legend.
 */
export interface IChartLegend {
  /** Position of the legend */
  position: string;

  /** Indicates if the legend should be shown */
  showLegend: boolean;
}