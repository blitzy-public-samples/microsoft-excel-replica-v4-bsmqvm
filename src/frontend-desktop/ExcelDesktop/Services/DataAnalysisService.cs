using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ExcelDesktop.Services;
using ExcelDesktop.Models;

namespace ExcelDesktop.Services
{
    /// <summary>
    /// This class provides advanced data analysis capabilities for Excel, including sorting, filtering, pivot tables, and statistical analysis.
    /// </summary>
    public class DataAnalysisService
    {
        private readonly CoreEngineService _coreEngineService;
        private readonly CalculationEngineService _calculationEngineService;
        private readonly IDataAnalysisEngine _dataAnalysisEngine;
        private readonly ILogger<DataAnalysisService> _logger;

        /// <summary>
        /// Initializes a new instance of the DataAnalysisService class.
        /// </summary>
        /// <param name="coreEngineService">The core engine service for basic Excel operations.</param>
        /// <param name="calculationEngineService">The calculation engine service for complex calculations.</param>
        /// <param name="dataAnalysisEngine">The data analysis engine for advanced analysis capabilities.</param>
        /// <param name="logger">The logger for logging service activities.</param>
        public DataAnalysisService(
            CoreEngineService coreEngineService,
            CalculationEngineService calculationEngineService,
            IDataAnalysisEngine dataAnalysisEngine,
            ILogger<DataAnalysisService> logger)
        {
            _coreEngineService = coreEngineService ?? throw new ArgumentNullException(nameof(coreEngineService));
            _calculationEngineService = calculationEngineService ?? throw new ArgumentNullException(nameof(calculationEngineService));
            _dataAnalysisEngine = dataAnalysisEngine ?? throw new ArgumentNullException(nameof(dataAnalysisEngine));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Sorts the specified range based on the given criteria.
        /// </summary>
        /// <param name="worksheetId">The ID of the worksheet containing the range to be sorted.</param>
        /// <param name="rangeReference">The reference of the range to be sorted.</param>
        /// <param name="criteria">The sorting criteria to be applied.</param>
        /// <returns>A task representing the asynchronous sorting operation.</returns>
        public async Task SortRange(string worksheetId, string rangeReference, SortCriteria[] criteria)
        {
            try
            {
                _logger.LogInformation($"Starting sorting operation for worksheet {worksheetId}, range {rangeReference}");

                // Validate input parameters
                if (string.IsNullOrEmpty(worksheetId) || string.IsNullOrEmpty(rangeReference) || criteria == null || criteria.Length == 0)
                {
                    throw new ArgumentException("Invalid input parameters for sorting operation");
                }

                // Retrieve the range data from the core engine
                var rangeData = await _coreEngineService.GetRangeData(worksheetId, rangeReference);

                // Call the data analysis engine to perform the sorting
                var sortedData = await _dataAnalysisEngine.SortData(rangeData, criteria);

                // Update the worksheet with the sorted data
                await _coreEngineService.UpdateRangeData(worksheetId, rangeReference, sortedData);

                _logger.LogInformation($"Sorting operation completed for worksheet {worksheetId}, range {rangeReference}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred during sorting operation for worksheet {worksheetId}, range {rangeReference}");
                throw;
            }
        }

        /// <summary>
        /// Applies filters to the specified range based on the given criteria.
        /// </summary>
        /// <param name="worksheetId">The ID of the worksheet containing the range to be filtered.</param>
        /// <param name="rangeReference">The reference of the range to be filtered.</param>
        /// <param name="criteria">The filtering criteria to be applied.</param>
        /// <returns>A task representing the asynchronous filtering operation.</returns>
        public async Task FilterRange(string worksheetId, string rangeReference, FilterCriteria[] criteria)
        {
            try
            {
                _logger.LogInformation($"Starting filtering operation for worksheet {worksheetId}, range {rangeReference}");

                // Validate input parameters
                if (string.IsNullOrEmpty(worksheetId) || string.IsNullOrEmpty(rangeReference) || criteria == null || criteria.Length == 0)
                {
                    throw new ArgumentException("Invalid input parameters for filtering operation");
                }

                // Retrieve the range data from the core engine
                var rangeData = await _coreEngineService.GetRangeData(worksheetId, rangeReference);

                // Call the data analysis engine to apply the filters
                var filteredData = await _dataAnalysisEngine.FilterData(rangeData, criteria);

                // Update the worksheet with the filtered data
                await _coreEngineService.UpdateRangeData(worksheetId, rangeReference, filteredData);

                _logger.LogInformation($"Filtering operation completed for worksheet {worksheetId}, range {rangeReference}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred during filtering operation for worksheet {worksheetId}, range {rangeReference}");
                throw;
            }
        }

        /// <summary>
        /// Creates a pivot table based on the source data and specified options.
        /// </summary>
        /// <param name="sourceWorksheetId">The ID of the source worksheet.</param>
        /// <param name="sourceRangeReference">The reference of the source data range.</param>
        /// <param name="destinationWorksheetId">The ID of the destination worksheet for the pivot table.</param>
        /// <param name="destinationCellReference">The reference of the destination cell for the pivot table.</param>
        /// <param name="options">The options for creating the pivot table.</param>
        /// <returns>A task returning the created pivot table model.</returns>
        public async Task<PivotTableModel> CreatePivotTable(string sourceWorksheetId, string sourceRangeReference, string destinationWorksheetId, string destinationCellReference, PivotTableOptions options)
        {
            try
            {
                _logger.LogInformation($"Starting pivot table creation for source worksheet {sourceWorksheetId}, range {sourceRangeReference}");

                // Validate input parameters
                if (string.IsNullOrEmpty(sourceWorksheetId) || string.IsNullOrEmpty(sourceRangeReference) ||
                    string.IsNullOrEmpty(destinationWorksheetId) || string.IsNullOrEmpty(destinationCellReference) || options == null)
                {
                    throw new ArgumentException("Invalid input parameters for pivot table creation");
                }

                // Retrieve the source data from the core engine
                var sourceData = await _coreEngineService.GetRangeData(sourceWorksheetId, sourceRangeReference);

                // Call the data analysis engine to create the pivot table
                var pivotTableModel = await _dataAnalysisEngine.CreatePivotTable(sourceData, options);

                // Update the destination worksheet with the pivot table
                await _coreEngineService.CreatePivotTable(destinationWorksheetId, destinationCellReference, pivotTableModel);

                _logger.LogInformation($"Pivot table creation completed for source worksheet {sourceWorksheetId}, range {sourceRangeReference}");

                return pivotTableModel;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred during pivot table creation for source worksheet {sourceWorksheetId}, range {sourceRangeReference}");
                throw;
            }
        }

        /// <summary>
        /// Calculates descriptive statistics for the specified range of data.
        /// </summary>
        /// <param name="worksheetId">The ID of the worksheet containing the data.</param>
        /// <param name="rangeReference">The reference of the data range.</param>
        /// <returns>A task returning the descriptive statistics result.</returns>
        public async Task<DescriptiveStatisticsResult> PerformDescriptiveStatistics(string worksheetId, string rangeReference)
        {
            try
            {
                _logger.LogInformation($"Starting descriptive statistics calculation for worksheet {worksheetId}, range {rangeReference}");

                // Validate input parameters
                if (string.IsNullOrEmpty(worksheetId) || string.IsNullOrEmpty(rangeReference))
                {
                    throw new ArgumentException("Invalid input parameters for descriptive statistics calculation");
                }

                // Retrieve data from the specified range
                var rangeData = await _coreEngineService.GetRangeData(worksheetId, rangeReference);

                // Call the data analysis engine to calculate descriptive statistics
                var result = await _dataAnalysisEngine.CalculateDescriptiveStatistics(rangeData);

                _logger.LogInformation($"Descriptive statistics calculation completed for worksheet {worksheetId}, range {rangeReference}");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred during descriptive statistics calculation for worksheet {worksheetId}, range {rangeReference}");
                throw;
            }
        }

        /// <summary>
        /// Performs regression analysis on the specified data ranges.
        /// </summary>
        /// <param name="worksheetId">The ID of the worksheet containing the data.</param>
        /// <param name="xRangeReference">The reference of the X data range.</param>
        /// <param name="yRangeReference">The reference of the Y data range.</param>
        /// <param name="type">The type of regression analysis to perform.</param>
        /// <returns>A task returning the regression analysis result.</returns>
        public async Task<RegressionAnalysisResult> PerformRegressionAnalysis(string worksheetId, string xRangeReference, string yRangeReference, RegressionType type)
        {
            try
            {
                _logger.LogInformation($"Starting regression analysis for worksheet {worksheetId}, X range {xRangeReference}, Y range {yRangeReference}");

                // Validate input parameters
                if (string.IsNullOrEmpty(worksheetId) || string.IsNullOrEmpty(xRangeReference) || string.IsNullOrEmpty(yRangeReference))
                {
                    throw new ArgumentException("Invalid input parameters for regression analysis");
                }

                // Retrieve data from the specified ranges
                var xData = await _coreEngineService.GetRangeData(worksheetId, xRangeReference);
                var yData = await _coreEngineService.GetRangeData(worksheetId, yRangeReference);

                // Call the data analysis engine to perform regression analysis
                var result = await _dataAnalysisEngine.PerformRegressionAnalysis(xData, yData, type);

                _logger.LogInformation($"Regression analysis completed for worksheet {worksheetId}, X range {xRangeReference}, Y range {yRangeReference}");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred during regression analysis for worksheet {worksheetId}, X range {xRangeReference}, Y range {yRangeReference}");
                throw;
            }
        }

        /// <summary>
        /// Runs the Excel Solver tool with the specified options.
        /// </summary>
        /// <param name="worksheetId">The ID of the worksheet containing the Solver model.</param>
        /// <param name="options">The options for running Solver.</param>
        /// <returns>A task returning the Solver result.</returns>
        public async Task<SolverResult> RunSolver(string worksheetId, SolverOptions options)
        {
            try
            {
                _logger.LogInformation($"Starting Solver execution for worksheet {worksheetId}");

                // Validate input parameters
                if (string.IsNullOrEmpty(worksheetId) || options == null)
                {
                    throw new ArgumentException("Invalid input parameters for Solver execution");
                }

                // Call the data analysis engine to run Solver
                var result = await _dataAnalysisEngine.RunSolver(worksheetId, options);

                // Update the worksheet with Solver results
                await _coreEngineService.UpdateSolverResults(worksheetId, result);

                _logger.LogInformation($"Solver execution completed for worksheet {worksheetId}");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred during Solver execution for worksheet {worksheetId}");
                throw;
            }
        }
    }
}