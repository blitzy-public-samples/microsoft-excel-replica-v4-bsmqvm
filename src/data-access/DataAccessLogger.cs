using System;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// Provides logging functionality for the data access layer in Microsoft Excel.
    /// </summary>
    public class DataAccessLogger
    {
        private readonly ILogger<DataAccessLogger> _logger;

        public DataAccessLogger(ILogger<DataAccessLogger> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Logs details about a data source operation, including its duration and success status.
        /// </summary>
        /// <param name="operation">The name of the operation being performed.</param>
        /// <param name="dataSource">The name or identifier of the data source.</param>
        /// <param name="duration">The duration of the operation.</param>
        /// <param name="success">Whether the operation was successful.</param>
        public void LogDataSourceOperation(string operation, string dataSource, TimeSpan duration, bool success)
        {
            var logLevel = success ? LogLevel.Information : LogLevel.Warning;
            _logger.Log(logLevel, "Data Source Operation: {Operation} on {DataSource} completed in {Duration}ms. Success: {Success}", 
                operation, dataSource, duration.TotalMilliseconds, success);
        }

        /// <summary>
        /// Logs information about a query execution, including the query text, duration, and number of rows affected.
        /// </summary>
        /// <param name="query">The text of the executed query.</param>
        /// <param name="duration">The duration of the query execution.</param>
        /// <param name="rowsAffected">The number of rows affected by the query.</param>
        public void LogQueryExecution(string query, TimeSpan duration, int rowsAffected)
        {
            _logger.LogInformation("Query Execution: {Query} completed in {Duration}ms. Rows affected: {RowsAffected}", 
                query, duration.TotalMilliseconds, rowsAffected);
        }

        /// <summary>
        /// Logs details about a data access error, including the exception, operation, and data source involved.
        /// </summary>
        /// <param name="ex">The exception that occurred.</param>
        /// <param name="operation">The name of the operation being performed when the error occurred.</param>
        /// <param name="dataSource">The name or identifier of the data source.</param>
        public void LogDataAccessError(Exception ex, string operation, string dataSource)
        {
            _logger.LogError(ex, "Data Access Error during {Operation} on {DataSource}: {ErrorMessage}", 
                operation, dataSource, ex.Message);

            // Assuming ErrorHandler is a static class for simplicity
            ErrorHandler.HandleDataAccessError(ex, operation, dataSource);
        }

        /// <summary>
        /// Logs a performance metric for the data access layer.
        /// </summary>
        /// <param name="metricName">The name of the metric being logged.</param>
        /// <param name="value">The value of the metric.</param>
        /// <param name="unit">The unit of measurement for the metric.</param>
        public void LogPerformanceMetric(string metricName, double value, string unit)
        {
            _logger.LogInformation("Performance Metric: {MetricName} = {Value} {Unit}", metricName, value, unit);
        }
    }
}