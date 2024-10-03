import { ChartOptions } from '../types/chart-options';

/**
 * Enum representing different chart types
 */
export enum ChartType {
    BAR = 'BAR',
    LINE = 'LINE',
    PIE = 'PIE',
    SCATTER = 'SCATTER',
    AREA = 'AREA',
    COLUMN = 'COLUMN',
    COMBO = 'COMBO'
}

/**
 * Interface for chart data structure
 */
export interface IChartData {
    labels: string[];
    datasets: IDataset[];
}

/**
 * Interface for dataset structure
 */
export interface IDataset {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string;
    borderWidth: number;
}

/**
 * Interface for chart dimensions
 */
export interface IChartDimensions {
    width: number;
    height: number;
}

/**
 * Base interface for all chart types
 */
export interface IChartBase {
    type: ChartType;
    data: IChartData;
    options: ChartOptions;
    dimensions: IChartDimensions;
}

/**
 * Interface for bar chart
 */
export interface IBarChart extends IChartBase {
    type: ChartType.BAR;
    options: BarChartOptions;
}

/**
 * Interface for line chart
 */
export interface ILineChart extends IChartBase {
    type: ChartType.LINE;
    options: LineChartOptions;
}

/**
 * Interface for pie chart
 */
export interface IPieChart extends IChartBase {
    type: ChartType.PIE;
    options: PieChartOptions;
}

/**
 * Interface for scatter chart
 */
export interface IScatterChart extends IChartBase {
    type: ChartType.SCATTER;
    options: ScatterChartOptions;
}

/**
 * Interface for area chart
 */
export interface IAreaChart extends IChartBase {
    type: ChartType.AREA;
    options: AreaChartOptions;
}

/**
 * Interface for column chart
 */
export interface IColumnChart extends IChartBase {
    type: ChartType.COLUMN;
    options: ColumnChartOptions;
}

/**
 * Interface for combo chart
 */
export interface IComboChart extends IChartBase {
    type: ChartType.COMBO;
    options: ComboChartOptions;
}

/**
 * Union type of all chart interfaces
 */
export type ChartTypes = IBarChart | ILineChart | IPieChart | IScatterChart | IAreaChart | IColumnChart | IComboChart;

// Note: The following types are not defined in this file and should be imported from chart-options.ts
// BarChartOptions, LineChartOptions, PieChartOptions, ScatterChartOptions, AreaChartOptions, ColumnChartOptions, ComboChartOptions