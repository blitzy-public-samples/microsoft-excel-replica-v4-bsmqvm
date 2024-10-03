import axios from 'axios';
import { ChartType } from '../types/chart-types';
import { ChartOptions } from '../types/chart-options';
import { DataProcessor } from '../core/data-processor';
import { formatData } from '../utils/formatting-utils';
import { IChart } from '../../../shared/interfaces/IChart';

interface ChartData {
  // Define the structure of chart data
  // This is a placeholder and should be replaced with the actual structure
  [key: string]: any;
}

interface ProcessedChartData {
  // Define the structure of processed chart data
  // This is a placeholder and should be replaced with the actual structure
  [key: string]: any;
}

export interface ChartDataAPI {
  fetchChartData: (chartId: string) => Promise<ChartData>;
  processChartData: (rawData: any[], chartType: ChartType, options: ChartOptions) => ProcessedChartData;
  updateChartData: (chartId: string, newData: any[]) => Promise<void>;
  validateChartData: (data: any[], chartType: ChartType) => boolean;
}

class ChartDataAPIImpl implements ChartDataAPI {
  private dataProcessor: DataProcessor;

  constructor() {
    this.dataProcessor = new DataProcessor();
  }

  public async fetchChartData(chartId: string): Promise<ChartData> {
    try {
      const response = await axios.get<ChartData>(`/api/charts/${chartId}/data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw new Error('Failed to fetch chart data');
    }
  }

  public processChartData(rawData: any[], chartType: ChartType, options: ChartOptions): ProcessedChartData {
    // Validate the input data
    if (!this.validateChartData(rawData, chartType)) {
      throw new Error('Invalid chart data');
    }

    // Use the DataProcessor to transform the raw data based on the chart type
    const processedData = this.dataProcessor.processData(rawData, chartType);

    // Apply any additional processing based on the provided options
    const dataWithOptions = this.applyChartOptions(processedData, options);

    // Format the processed data using formatting utilities
    const formattedData = formatData(dataWithOptions, options.formatting);

    return formattedData;
  }

  public async updateChartData(chartId: string, newData: any[]): Promise<void> {
    // Validate the new data
    if (!this.validateChartData(newData, 'default')) {
      throw new Error('Invalid chart data for update');
    }

    try {
      await axios.put(`/api/charts/${chartId}/data`, newData);
    } catch (error) {
      console.error('Error updating chart data:', error);
      throw new Error('Failed to update chart data');
    }
  }

  public validateChartData(data: any[], chartType: ChartType): boolean {
    // Check if the data structure matches the requirements for the specified chart type
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    // Perform specific validations based on chart type
    switch (chartType) {
      case 'bar':
      case 'column':
        return this.validateBarColumnData(data);
      case 'line':
      case 'area':
        return this.validateLineAreaData(data);
      case 'pie':
      case 'doughnut':
        return this.validatePieData(data);
      case 'scatter':
        return this.validateScatterData(data);
      default:
        return true; // Default to true for unknown chart types
    }
  }

  private validateBarColumnData(data: any[]): boolean {
    // Implement specific validation for bar and column charts
    return data.every(item => 'category' in item && 'value' in item);
  }

  private validateLineAreaData(data: any[]): boolean {
    // Implement specific validation for line and area charts
    return data.every(item => 'x' in item && 'y' in item);
  }

  private validatePieData(data: any[]): boolean {
    // Implement specific validation for pie charts
    return data.every(item => 'label' in item && 'value' in item);
  }

  private validateScatterData(data: any[]): boolean {
    // Implement specific validation for scatter charts
    return data.every(item => 'x' in item && 'y' in item);
  }

  private applyChartOptions(data: any[], options: ChartOptions): any[] {
    // Apply chart-specific options to the processed data
    // This is a placeholder implementation and should be expanded based on actual requirements
    if (options.sortBy) {
      data.sort((a, b) => a[options.sortBy] - b[options.sortBy]);
    }

    if (options.limit) {
      data = data.slice(0, options.limit);
    }

    return data;
  }
}

export const chartDataAPI: ChartDataAPI = new ChartDataAPIImpl();