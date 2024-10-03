using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This class is responsible for managing all data access operations in the Microsoft Excel application.
    /// </summary>
    public class DataAccessManager
    {
        private readonly IDataAccessFactory _dataAccessFactory;
        private readonly ConnectionStringManager _connectionStringManager;
        private readonly CacheManager _cacheManager;
        private readonly ILogger<DataAccessManager> _logger;

        /// <summary>
        /// Initializes a new instance of the DataAccessManager class.
        /// </summary>
        /// <param name="dataAccessFactory">The factory for creating data access objects.</param>
        /// <param name="connectionStringManager">The manager for connection strings.</param>
        /// <param name="cacheManager">The manager for caching operations.</param>
        /// <param name="logger">The logger for logging operations.</param>
        public DataAccessManager(
            IDataAccessFactory dataAccessFactory,
            ConnectionStringManager connectionStringManager,
            CacheManager cacheManager,
            ILogger<DataAccessManager> logger)
        {
            _dataAccessFactory = dataAccessFactory ?? throw new ArgumentNullException(nameof(dataAccessFactory));
            _connectionStringManager = connectionStringManager ?? throw new ArgumentNullException(nameof(connectionStringManager));
            _cacheManager = cacheManager ?? throw new ArgumentNullException(nameof(cacheManager));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Retrieves data from the specified source using the provided query and parameters.
        /// </summary>
        /// <param name="source">The data source to retrieve data from.</param>
        /// <param name="query">The query to execute.</param>
        /// <param name="parameters">The parameters for the query.</param>
        /// <returns>A task representing the asynchronous operation, returning the retrieved data.</returns>
        public async Task<object> GetData(string source, string query, Dictionary<string, object> parameters)
        {
            try
            {
                _logger.LogInformation($"Retrieving data from source: {source}");

                // Validate input parameters
                if (string.IsNullOrEmpty(source)) throw new ArgumentNullException(nameof(source));
                if (string.IsNullOrEmpty(query)) throw new ArgumentNullException(nameof(query));

                // Get the appropriate IDataSource from the factory
                var dataSource = _dataAccessFactory.CreateDataSource(source);

                // Execute the query using the data source
                var result = await dataSource.ExecuteQueryAsync(query, parameters);

                // Cache the results if applicable
                if (_cacheManager.ShouldCacheResult(source, query))
                {
                    await _cacheManager.CacheResultAsync(source, query, result);
                }

                _logger.LogInformation($"Data retrieved successfully from source: {source}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving data from source: {source}");
                throw new DataAccessException($"Error retrieving data from source: {source}", ex);
            }
        }

        /// <summary>
        /// Saves the provided data to the specified destination and table.
        /// </summary>
        /// <param name="destination">The destination to save the data to.</param>
        /// <param name="tableName">The name of the table to save the data to.</param>
        /// <param name="data">The data to be saved.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        public async Task SaveData(string destination, string tableName, IEnumerable<object> data)
        {
            try
            {
                _logger.LogInformation($"Saving data to destination: {destination}, table: {tableName}");

                // Validate input parameters
                if (string.IsNullOrEmpty(destination)) throw new ArgumentNullException(nameof(destination));
                if (string.IsNullOrEmpty(tableName)) throw new ArgumentNullException(nameof(tableName));
                if (data == null) throw new ArgumentNullException(nameof(data));

                // Get the appropriate IDataSource from the factory
                var dataSource = _dataAccessFactory.CreateDataSource(destination);

                // Prepare the data for insertion
                var preparedData = DataTypeConverter.ConvertToDestinationFormat(data, dataSource.GetSchema(tableName));

                // Execute the save operation using the data source
                await dataSource.SaveDataAsync(tableName, preparedData);

                // Invalidate relevant cache entries
                await _cacheManager.InvalidateCacheEntriesAsync(destination, tableName);

                _logger.LogInformation($"Data saved successfully to destination: {destination}, table: {tableName}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error saving data to destination: {destination}, table: {tableName}");
                throw new DataAccessException($"Error saving data to destination: {destination}, table: {tableName}", ex);
            }
        }

        /// <summary>
        /// Updates existing data in the specified destination and table based on the provided condition.
        /// </summary>
        /// <param name="destination">The destination to update the data in.</param>
        /// <param name="tableName">The name of the table to update the data in.</param>
        /// <param name="data">The data to be updated.</param>
        /// <param name="condition">The condition for updating the data.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        public async Task UpdateData(string destination, string tableName, object data, string condition)
        {
            try
            {
                _logger.LogInformation($"Updating data in destination: {destination}, table: {tableName}");

                // Validate input parameters
                if (string.IsNullOrEmpty(destination)) throw new ArgumentNullException(nameof(destination));
                if (string.IsNullOrEmpty(tableName)) throw new ArgumentNullException(nameof(tableName));
                if (data == null) throw new ArgumentNullException(nameof(data));
                if (string.IsNullOrEmpty(condition)) throw new ArgumentNullException(nameof(condition));

                // Get the appropriate IDataSource from the factory
                var dataSource = _dataAccessFactory.CreateDataSource(destination);

                // Prepare the update query
                var updateQuery = QueryBuilder.BuildUpdateQuery(tableName, data, condition);

                // Execute the update operation using the data source
                await dataSource.ExecuteNonQueryAsync(updateQuery);

                // Invalidate relevant cache entries
                await _cacheManager.InvalidateCacheEntriesAsync(destination, tableName);

                _logger.LogInformation($"Data updated successfully in destination: {destination}, table: {tableName}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating data in destination: {destination}, table: {tableName}");
                throw new DataAccessException($"Error updating data in destination: {destination}, table: {tableName}", ex);
            }
        }

        /// <summary>
        /// Deletes data from the specified destination and table based on the provided condition.
        /// </summary>
        /// <param name="destination">The destination to delete the data from.</param>
        /// <param name="tableName">The name of the table to delete the data from.</param>
        /// <param name="condition">The condition for deleting the data.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        public async Task DeleteData(string destination, string tableName, string condition)
        {
            try
            {
                _logger.LogInformation($"Deleting data from destination: {destination}, table: {tableName}");

                // Validate input parameters
                if (string.IsNullOrEmpty(destination)) throw new ArgumentNullException(nameof(destination));
                if (string.IsNullOrEmpty(tableName)) throw new ArgumentNullException(nameof(tableName));
                if (string.IsNullOrEmpty(condition)) throw new ArgumentNullException(nameof(condition));

                // Get the appropriate IDataSource from the factory
                var dataSource = _dataAccessFactory.CreateDataSource(destination);

                // Prepare the delete query
                var deleteQuery = QueryBuilder.BuildDeleteQuery(tableName, condition);

                // Execute the delete operation using the data source
                await dataSource.ExecuteNonQueryAsync(deleteQuery);

                // Invalidate relevant cache entries
                await _cacheManager.InvalidateCacheEntriesAsync(destination, tableName);

                _logger.LogInformation($"Data deleted successfully from destination: {destination}, table: {tableName}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting data from destination: {destination}, table: {tableName}");
                throw new DataAccessException($"Error deleting data from destination: {destination}, table: {tableName}", ex);
            }
        }

        /// <summary>
        /// Executes a custom query on the specified data source with the provided parameters.
        /// </summary>
        /// <param name="source">The data source to execute the query on.</param>
        /// <param name="query">The custom query to execute.</param>
        /// <param name="parameters">The parameters for the query.</param>
        /// <returns>A task representing the asynchronous operation, returning the query results.</returns>
        public async Task<object> ExecuteCustomQuery(string source, string query, Dictionary<string, object> parameters)
        {
            try
            {
                _logger.LogInformation($"Executing custom query on source: {source}");

                // Validate input parameters
                if (string.IsNullOrEmpty(source)) throw new ArgumentNullException(nameof(source));
                if (string.IsNullOrEmpty(query)) throw new ArgumentNullException(nameof(query));

                // Get the appropriate IDataSource from the factory
                var dataSource = _dataAccessFactory.CreateDataSource(source);

                // Execute the custom query using the data source
                var result = await dataSource.ExecuteQueryAsync(query, parameters);

                _logger.LogInformation($"Custom query executed successfully on source: {source}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error executing custom query on source: {source}");
                throw new DataAccessException($"Error executing custom query on source: {source}", ex);
            }
        }
    }
}