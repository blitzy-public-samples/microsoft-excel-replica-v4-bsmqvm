import { IChart } from '../interfaces/IChart';
import { ChartTypeEnum } from '../enums/ChartTypeEnum';
import * as MathUtils from '../utils/MathUtils';
import * as ValidationUtils from '../utils/ValidationUtils';

/**
 * ChartHelper class provides utility methods for working with charts in Microsoft Excel.
 * It offers functionality to create, modify, and manage chart objects.
 */
export class ChartHelper {
  /**
   * Creates a new chart object based on the specified type and data range.
   * @param type The type of chart to create.
   * @param dataRange The data range for the chart.
   * @param options Optional chart properties.
   * @returns A new chart object.
   */
  static createChart(type: ChartTypeEnum, dataRange: string, options?: Partial<IChart>): IChart {
    // Validate input parameters
    ValidationUtils.validateChartType(type);
    ValidationUtils.validateDataRange(dataRange);

    // Create a new IChart object with default values
    const chart: IChart = {
      id: MathUtils.generateUniqueId(),
      type: type,
      dataRange: dataRange,
      title: '',
      xAxis: { title: '', min: null, max: null },
      yAxis: { title: '', min: null, max: null },
      series: [],
      legend: { showLegend: true, position: 'right' },
      width: 500,
      height: 300,
    };

    // Merge any provided options with the default chart properties
    if (options) {
      Object.assign(chart, options);
    }

    return chart;
  }

  /**
   * Updates the data range of an existing chart.
   * @param chart The chart to update.
   * @param newDataRange The new data range for the chart.
   * @returns The updated chart object.
   */
  static updateChartData(chart: IChart, newDataRange: string): IChart {
    // Validate the input chart and new data range
    ValidationUtils.validateChart(chart);
    ValidationUtils.validateDataRange(newDataRange);

    // Create a copy of the input chart
    const updatedChart: IChart = { ...chart };

    // Update the dataRange property of the chart copy
    updatedChart.dataRange = newDataRange;

    return updatedChart;
  }

  /**
   * Changes the type of an existing chart.
   * @param chart The chart to modify.
   * @param newType The new chart type.
   * @returns The updated chart object.
   */
  static changeChartType(chart: IChart, newType: ChartTypeEnum): IChart {
    // Validate the input chart and new chart type
    ValidationUtils.validateChart(chart);
    ValidationUtils.validateChartType(newType);

    // Create a copy of the input chart
    const updatedChart: IChart = { ...chart };

    // Update the type property of the chart copy
    updatedChart.type = newType;

    // Adjust other properties if necessary based on the new chart type
    // This is a placeholder for any specific adjustments needed for different chart types
    switch (newType) {
      case ChartTypeEnum.PIE:
      case ChartTypeEnum.DOUGHNUT:
        // For pie and doughnut charts, we might want to remove the x and y axis
        updatedChart.xAxis = { title: '', min: null, max: null };
        updatedChart.yAxis = { title: '', min: null, max: null };
        break;
      // Add more cases for other chart types if needed
    }

    return updatedChart;
  }

  /**
   * Formats the specified axis of a chart.
   * @param chart The chart to modify.
   * @param axisType The type of axis to format ('x' or 'y').
   * @param options The formatting options for the axis.
   * @returns The updated chart object.
   */
  static formatChartAxis(chart: IChart, axisType: 'x' | 'y', options: Partial<IChart['xAxis']>): IChart {
    // Validate the input chart, axis type, and options
    ValidationUtils.validateChart(chart);
    ValidationUtils.validateAxisType(axisType);
    ValidationUtils.validateAxisOptions(options);

    // Create a copy of the input chart
    const updatedChart: IChart = { ...chart };

    // Update the specified axis (xAxis or yAxis) with the provided options
    if (axisType === 'x') {
      updatedChart.xAxis = { ...updatedChart.xAxis, ...options };
    } else {
      updatedChart.yAxis = { ...updatedChart.yAxis, ...options };
    }

    return updatedChart;
  }

  /**
   * Adds a new data series to an existing chart.
   * @param chart The chart to modify.
   * @param series The new series to add.
   * @returns The updated chart object.
   */
  static addChartSeries(chart: IChart, series: IChart['series'][0]): IChart {
    // Validate the input chart and new series
    ValidationUtils.validateChart(chart);
    ValidationUtils.validateChartSeries(series);

    // Create a copy of the input chart
    const updatedChart: IChart = { ...chart };

    // Add the new series to the chart's series array
    updatedChart.series = [...updatedChart.series, series];

    return updatedChart;
  }

  /**
   * Removes a data series from an existing chart.
   * @param chart The chart to modify.
   * @param seriesName The name of the series to remove.
   * @returns The updated chart object.
   */
  static removeChartSeries(chart: IChart, seriesName: string): IChart {
    // Validate the input chart and series name
    ValidationUtils.validateChart(chart);
    ValidationUtils.validateSeriesName(seriesName);

    // Create a copy of the input chart
    const updatedChart: IChart = { ...chart };

    // Remove the specified series from the chart's series array
    updatedChart.series = updatedChart.series.filter(s => s.name !== seriesName);

    return updatedChart;
  }

  /**
   * Sets or updates the title of a chart.
   * @param chart The chart to modify.
   * @param title The new title for the chart.
   * @returns The updated chart object.
   */
  static setChartTitle(chart: IChart, title: string): IChart {
    // Validate the input chart and title
    ValidationUtils.validateChart(chart);
    ValidationUtils.validateChartTitle(title);

    // Create a copy of the input chart
    const updatedChart: IChart = { ...chart };

    // Update the title property of the chart copy
    updatedChart.title = title;

    return updatedChart;
  }

  /**
   * Shows or hides the legend of a chart.
   * @param chart The chart to modify.
   * @param show Whether to show or hide the legend.
   * @returns The updated chart object.
   */
  static toggleChartLegend(chart: IChart, show: boolean): IChart {
    // Validate the input chart
    ValidationUtils.validateChart(chart);

    // Create a copy of the input chart
    const updatedChart: IChart = { ...chart };

    // Update the legend.showLegend property of the chart copy
    updatedChart.legend = { ...updatedChart.legend, showLegend: show };

    return updatedChart;
  }

  /**
   * Resizes a chart to the specified dimensions.
   * @param chart The chart to resize.
   * @param width The new width of the chart.
   * @param height The new height of the chart.
   * @returns The updated chart object.
   */
  static resizeChart(chart: IChart, width: number, height: number): IChart {
    // Validate the input chart, width, and height
    ValidationUtils.validateChart(chart);
    ValidationUtils.validateDimensions(width, height);

    // Create a copy of the input chart
    const updatedChart: IChart = { ...chart };

    // Update the width and height properties of the chart copy
    updatedChart.width = width;
    updatedChart.height = height;

    return updatedChart;
  }
}