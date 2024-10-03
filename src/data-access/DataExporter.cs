using System;
using System.Threading.Tasks;
using System.IO;
using System.Data;
using System.Collections.Generic;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// Enum representing different export formats supported by the DataExporter.
    /// </summary>
    public enum ExportFormat
    {
        CSV,
        JSON,
        XML,
        // Add more formats as needed
    }

    /// <summary>
    /// This class provides methods for exporting data from Microsoft Excel to various external formats and data sources.
    /// </summary>
    public class DataExporter
    {
        private readonly ILogger Logger;
        private readonly IDataTypeConverter TypeConverter;
        private readonly IErrorHandler ErrorHandler;

        /// <summary>
        /// Initializes a new instance of the DataExporter class.
        /// </summary>
        /// <param name="logger">The logger instance for logging export operations and errors.</param>
        /// <param name="typeConverter">The data type converter for converting between Excel and external formats.</param>
        /// <param name="errorHandler">The error handler for managing export-related errors.</param>
        public DataExporter(ILogger logger, IDataTypeConverter typeConverter, IErrorHandler errorHandler)
        {
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
            TypeConverter = typeConverter ?? throw new ArgumentNullException(nameof(typeConverter));
            ErrorHandler = errorHandler ?? throw new ArgumentNullException(nameof(errorHandler));
        }

        /// <summary>
        /// Exports data to a file in the specified format.
        /// </summary>
        /// <param name="filePath">The path where the exported file will be saved.</param>
        /// <param name="format">The format of the exported file.</param>
        /// <param name="data">The data to be exported.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the export is successful.</returns>
        public async Task<bool> ExportToFile(string filePath, ExportFormat format, IEnumerable<object> data)
        {
            try
            {
                // Validate input parameters
                if (string.IsNullOrWhiteSpace(filePath))
                    throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));

                if (data == null)
                    throw new ArgumentNullException(nameof(data));

                // Convert data to the specified format
                string convertedData = await ConvertDataToFormat(data, format);

                // Write the converted data to the file
                await File.WriteAllTextAsync(filePath, convertedData);

                // Log the export operation
                Logger.LogInformation($"Data exported successfully to {filePath} in {format} format.");

                return true;
            }
            catch (Exception ex)
            {
                // Handle and log any errors
                ErrorHandler.HandleError(ex);
                Logger.LogError($"Error exporting data to file: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Exports data to an external data source.
        /// </summary>
        /// <param name="dataSource">The data source to export to.</param>
        /// <param name="tableName">The name of the table in the data source.</param>
        /// <param name="data">The data to be exported.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the export is successful.</returns>
        public async Task<bool> ExportToDataSource(IDataSource dataSource, string tableName, IEnumerable<object> data)
        {
            try
            {
                // Validate input parameters
                if (dataSource == null)
                    throw new ArgumentNullException(nameof(dataSource));

                if (string.IsNullOrWhiteSpace(tableName))
                    throw new ArgumentException("Table name cannot be null or empty.", nameof(tableName));

                if (data == null)
                    throw new ArgumentNullException(nameof(data));

                // Connect to the data source
                await dataSource.Connect();

                // Convert data to the appropriate format for the data source
                DataTable convertedData = TypeConverter.ConvertToDataTable(data);

                // Execute the export operation
                int rowsAffected = await dataSource.ExecuteNonQuery($"INSERT INTO {tableName} ({string.Join(",", convertedData.Columns.Cast<DataColumn>().Select(c => c.ColumnName))}) VALUES ({string.Join(",", convertedData.Columns.Cast<DataColumn>().Select(c => "@" + c.ColumnName))})", convertedData);

                // Log the export operation
                Logger.LogInformation($"Data exported successfully to {tableName}. Rows affected: {rowsAffected}");

                // Disconnect from the data source
                await dataSource.Disconnect();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                // Handle and log any errors
                ErrorHandler.HandleError(ex);
                Logger.LogError($"Error exporting data to data source: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Exports data to a stream in the specified format.
        /// </summary>
        /// <param name="format">The format of the exported data.</param>
        /// <param name="data">The data to be exported.</param>
        /// <returns>A task representing the asynchronous operation, returning a stream containing the exported data.</returns>
        public async Task<Stream> ExportToStream(ExportFormat format, IEnumerable<object> data)
        {
            try
            {
                // Validate input parameters
                if (data == null)
                    throw new ArgumentNullException(nameof(data));

                // Convert data to the specified format
                string convertedData = await ConvertDataToFormat(data, format);

                // Create a new MemoryStream and write the converted data to it
                var stream = new MemoryStream();
                using (var writer = new StreamWriter(stream, leaveOpen: true))
                {
                    await writer.WriteAsync(convertedData);
                    await writer.FlushAsync();
                }

                // Reset the stream position to the beginning
                stream.Position = 0;

                // Log the export operation
                Logger.LogInformation($"Data exported successfully to stream in {format} format.");

                return stream;
            }
            catch (Exception ex)
            {
                // Handle and log any errors
                ErrorHandler.HandleError(ex);
                Logger.LogError($"Error exporting data to stream: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Converts the input data to the specified format.
        /// </summary>
        /// <param name="data">The data to be converted.</param>
        /// <param name="format">The target format for conversion.</param>
        /// <returns>A task representing the asynchronous operation, returning the converted data as a string.</returns>
        private async Task<string> ConvertDataToFormat(IEnumerable<object> data, ExportFormat format)
        {
            return await Task.Run(() =>
            {
                switch (format)
                {
                    case ExportFormat.CSV:
                        return TypeConverter.ConvertToCsv(data);
                    case ExportFormat.JSON:
                        return TypeConverter.ConvertToJson(data);
                    case ExportFormat.XML:
                        return TypeConverter.ConvertToXml(data);
                    default:
                        throw new NotSupportedException($"Export format {format} is not supported.");
                }
            });
        }
    }
}