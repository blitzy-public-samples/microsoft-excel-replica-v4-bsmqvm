import { ChartType, ChartOptions } from '../types/chart-types';
import { AggregationType, ProcessedData, AggregatedData, TransformedData } from '../types/chart-options';
import * as mathUtils from '../utils/math-utils';
import * as _ from 'lodash';

/**
 * DataProcessor class is responsible for processing raw data into a format suitable for chart rendering.
 * It handles data normalization, aggregation, and transformation based on the chart type and options.
 */
export class DataProcessor {
  /**
   * Process raw data into a format suitable for chart rendering.
   * @param rawData The raw data to be processed.
   * @param options The chart options containing configuration for processing.
   * @returns ProcessedData ready for chart rendering.
   */
  public static processData(rawData: any[], options: ChartOptions): ProcessedData {
    let processedData: ProcessedData = {
      labels: [],
      datasets: [],
    };

    // Step 1: Validate and clean the input data
    const cleanedData = this.validateAndCleanData(rawData);

    // Step 2: Aggregate data if required
    const aggregatedData = this.aggregateData(cleanedData, options.aggregationType || 'sum');

    // Step 3: Normalize data if necessary
    const normalizedData = this.normalizeData(aggregatedData);

    // Step 4: Transform data into the appropriate structure for the specified chart type
    const transformedData = this.transformData(normalizedData, options.chartType);

    // Step 5: Apply any additional processing based on chart options
    processedData = this.applyAdditionalProcessing(transformedData, options);

    return processedData;
  }

  private static validateAndCleanData(data: any[]): any[] {
    // Remove any null or undefined values
    return data.filter(item => item != null);
  }

  /**
   * Aggregate data based on the specified aggregation type.
   * @param data The data to be aggregated.
   * @param aggregationType The type of aggregation to perform.
   * @returns AggregatedData after applying the aggregation.
   */
  private static aggregateData(data: any[], aggregationType: AggregationType): AggregatedData {
    const groupedData = _.groupBy(data, item => item.category);

    const aggregatedData: AggregatedData = {};
    for (const [category, values] of Object.entries(groupedData)) {
      switch (aggregationType) {
        case 'sum':
          aggregatedData[category] = _.sumBy(values, 'value');
          break;
        case 'average':
          aggregatedData[category] = _.meanBy(values, 'value');
          break;
        case 'count':
          aggregatedData[category] = values.length;
          break;
        default:
          aggregatedData[category] = _.sumBy(values, 'value');
      }
    }

    return aggregatedData;
  }

  /**
   * Normalize numerical data to a common scale, typically between 0 and 1.
   * @param data The data to be normalized.
   * @returns Normalized data array.
   */
  private static normalizeData(data: AggregatedData): number[] {
    const values = Object.values(data);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return values.map(value => mathUtils.normalize(value, min, max));
  }

  /**
   * Transform the data into a structure suitable for the specified chart type.
   * @param data The data to be transformed.
   * @param chartType The type of chart for which the data is being transformed.
   * @returns TransformedData structure suitable for the specified chart type.
   */
  private static transformData(data: number[], chartType: ChartType): TransformedData {
    const labels = Object.keys(data);
    const values = Object.values(data);

    switch (chartType) {
      case 'bar':
      case 'column':
        return {
          labels,
          datasets: [{ data: values }],
        };
      case 'pie':
      case 'doughnut':
        return {
          labels,
          datasets: [{ data: values }],
        };
      case 'line':
      case 'area':
        return {
          labels,
          datasets: [{ data: values }],
        };
      case 'scatter':
        return {
          datasets: [{
            data: labels.map((label, index) => ({ x: label, y: values[index] })),
          }],
        };
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  }

  /**
   * Apply additional processing based on chart options.
   * @param data The transformed data to be further processed.
   * @param options The chart options containing additional processing configuration.
   * @returns ProcessedData after applying additional processing.
   */
  private static applyAdditionalProcessing(data: TransformedData, options: ChartOptions): ProcessedData {
    let processedData = { ...data } as ProcessedData;

    // Apply sorting if specified
    if (options.sorting) {
      processedData.datasets = processedData.datasets.map(dataset => ({
        ...dataset,
        data: _.orderBy(dataset.data, ['y'], [options.sorting]),
      }));
    }

    // Apply filtering if specified
    if (options.filtering) {
      processedData.datasets = processedData.datasets.map(dataset => ({
        ...dataset,
        data: dataset.data.filter(options.filtering),
      }));
    }

    // Apply any other custom processing here

    return processedData;
  }
}