import mongoose from 'mongoose';
import { Chart, IChartData } from '../models/chart';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export class ChartService {
  /**
   * Creates a new chart based on the provided chart data
   * @param chartData The data for creating a new chart
   * @returns A promise that resolves to an API response
   */
  public static async createChart(chartData: IChartData): Promise<ApiResponse> {
    try {
      // Validate the input chartData
      if (!this.validateChartData(chartData)) {
        logger.error('Invalid chart data provided');
        return ApiResponse.error('Invalid chart data', 400);
      }

      // Create a new Chart document using the Chart model
      const newChart = new Chart(chartData);

      // Save the chart to the database
      const savedChart = await newChart.save();

      // Log the successful creation of the chart
      logger.info(`Chart created successfully with ID: ${savedChart._id}`);

      // Return a success response with the created chart data
      return ApiResponse.success('Chart created successfully', savedChart);
    } catch (error) {
      logger.error(`Error creating chart: ${error.message}`);
      return ApiResponse.error('Failed to create chart', 500);
    }
  }

  /**
   * Retrieves a chart by its ID
   * @param chartId The ID of the chart to retrieve
   * @returns A promise that resolves to an API response
   */
  public static async getChart(chartId: string): Promise<ApiResponse> {
    try {
      // Validate the chartId
      if (!mongoose.Types.ObjectId.isValid(chartId)) {
        logger.error(`Invalid chart ID: ${chartId}`);
        return ApiResponse.error('Invalid chart ID', 400);
      }

      // Query the database for the chart using the Chart model
      const chart = await Chart.findById(chartId);

      // If the chart is not found, log an error and return an error response
      if (!chart) {
        logger.error(`Chart not found with ID: ${chartId}`);
        return ApiResponse.error('Chart not found', 404);
      }

      // Log the successful retrieval
      logger.info(`Chart retrieved successfully with ID: ${chartId}`);

      // Return a success response with the chart data
      return ApiResponse.success('Chart retrieved successfully', chart);
    } catch (error) {
      logger.error(`Error retrieving chart: ${error.message}`);
      return ApiResponse.error('Failed to retrieve chart', 500);
    }
  }

  /**
   * Updates an existing chart with the provided data
   * @param chartId The ID of the chart to update
   * @param updateData The data to update the chart with
   * @returns A promise that resolves to an API response
   */
  public static async updateChart(chartId: string, updateData: Partial<IChartData>): Promise<ApiResponse> {
    try {
      // Validate the chartId and updateData
      if (!mongoose.Types.ObjectId.isValid(chartId) || !this.validateChartData(updateData, true)) {
        logger.error(`Invalid chart ID or update data: ${chartId}`);
        return ApiResponse.error('Invalid chart ID or update data', 400);
      }

      // Query the database to find the chart by ID
      const chart = await Chart.findById(chartId);

      // If the chart is not found, log an error and return an error response
      if (!chart) {
        logger.error(`Chart not found with ID: ${chartId}`);
        return ApiResponse.error('Chart not found', 404);
      }

      // Update the chart with the new data
      Object.assign(chart, updateData);

      // Save the updated chart to the database
      const updatedChart = await chart.save();

      // Log the successful update
      logger.info(`Chart updated successfully with ID: ${chartId}`);

      // Return a success response with the updated chart data
      return ApiResponse.success('Chart updated successfully', updatedChart);
    } catch (error) {
      logger.error(`Error updating chart: ${error.message}`);
      return ApiResponse.error('Failed to update chart', 500);
    }
  }

  /**
   * Deletes a chart by its ID
   * @param chartId The ID of the chart to delete
   * @returns A promise that resolves to an API response
   */
  public static async deleteChart(chartId: string): Promise<ApiResponse> {
    try {
      // Validate the chartId
      if (!mongoose.Types.ObjectId.isValid(chartId)) {
        logger.error(`Invalid chart ID: ${chartId}`);
        return ApiResponse.error('Invalid chart ID', 400);
      }

      // Query the database to find and delete the chart by ID
      const deletedChart = await Chart.findByIdAndDelete(chartId);

      // If the chart is not found, log an error and return an error response
      if (!deletedChart) {
        logger.error(`Chart not found with ID: ${chartId}`);
        return ApiResponse.error('Chart not found', 404);
      }

      // Log the successful deletion
      logger.info(`Chart deleted successfully with ID: ${chartId}`);

      // Return a success response confirming the deletion
      return ApiResponse.success('Chart deleted successfully', { id: chartId });
    } catch (error) {
      logger.error(`Error deleting chart: ${error.message}`);
      return ApiResponse.error('Failed to delete chart', 500);
    }
  }

  /**
   * Retrieves all charts associated with a specific worksheet
   * @param worksheetId The ID of the worksheet
   * @returns A promise that resolves to an API response
   */
  public static async getChartsByWorksheet(worksheetId: string): Promise<ApiResponse> {
    try {
      // Validate the worksheetId
      if (!mongoose.Types.ObjectId.isValid(worksheetId)) {
        logger.error(`Invalid worksheet ID: ${worksheetId}`);
        return ApiResponse.error('Invalid worksheet ID', 400);
      }

      // Query the database to find all charts associated with the given worksheetId
      const charts = await Chart.find({ worksheetId });

      // Log the successful retrieval of charts
      logger.info(`Retrieved ${charts.length} charts for worksheet ID: ${worksheetId}`);

      // Return a success response with the array of charts
      return ApiResponse.success('Charts retrieved successfully', charts);
    } catch (error) {
      logger.error(`Error retrieving charts for worksheet: ${error.message}`);
      return ApiResponse.error('Failed to retrieve charts', 500);
    }
  }

  /**
   * Validates the chart data
   * @param chartData The chart data to validate
   * @param isUpdate Whether the validation is for an update operation
   * @returns True if the data is valid, false otherwise
   */
  private static validateChartData(chartData: Partial<IChartData>, isUpdate: boolean = false): boolean {
    // Implement validation logic here
    // For example, check if required fields are present and have correct types
    // Return true if valid, false otherwise
    // This is a simplified validation, you should implement more thorough checks
    const requiredFields = ['type', 'data', 'options'];
    if (!isUpdate) {
      requiredFields.push('worksheetId');
    }
    return requiredFields.every(field => field in chartData);
  }
}