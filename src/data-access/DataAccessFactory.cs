using System;
using System.Collections.Generic;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This class implements the IDataAccessFactory interface and provides methods for creating and managing instances of various data sources.
    /// </summary>
    public class DataAccessFactory : IDataAccessFactory
    {
        private readonly Dictionary<string, IDataSource> _dataSources;
        private readonly ConnectionStringManager _connectionStringManager;

        public DataAccessFactory(ConnectionStringManager connectionStringManager)
        {
            _dataSources = new Dictionary<string, IDataSource>();
            _connectionStringManager = connectionStringManager ?? throw new ArgumentNullException(nameof(connectionStringManager));
        }

        /// <summary>
        /// Creates or retrieves an instance of a data source based on the provided source type and connection string.
        /// </summary>
        /// <param name="sourceType">The type of the data source.</param>
        /// <param name="connectionString">The connection string for the data source.</param>
        /// <returns>An instance of IDataSource.</returns>
        public IDataSource GetDataSource(string sourceType, string connectionString)
        {
            string key = $"{sourceType}_{connectionString}";

            if (_dataSources.TryGetValue(key, out IDataSource existingDataSource))
            {
                return existingDataSource;
            }

            IDataSource newDataSource = CreateDataSource(sourceType, connectionString);
            _dataSources[key] = newDataSource;
            return newDataSource;
        }

        /// <summary>
        /// Creates a new instance of a data source based on the provided source type and connection string.
        /// </summary>
        /// <param name="sourceType">The type of the data source.</param>
        /// <param name="connectionString">The connection string for the data source.</param>
        /// <returns>A new instance of IDataSource.</returns>
        private IDataSource CreateDataSource(string sourceType, string connectionString)
        {
            ValidateConnectionString(connectionString);

            switch (sourceType.ToLower())
            {
                case "local":
                    return new LocalDataSource(connectionString);
                case "cloud":
                    return new CloudDataSource(connectionString);
                case "externalapi":
                    return new ExternalApiDataSource(connectionString);
                default:
                    throw new DataAccessException($"Unsupported data source type: {sourceType}");
            }
        }

        /// <summary>
        /// Validates the provided connection string.
        /// </summary>
        /// <param name="connectionString">The connection string to validate.</param>
        private void ValidateConnectionString(string connectionString)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new DataAccessException("Connection string cannot be null or empty.");
            }

            // Additional validation logic can be added here
            // For example, checking for required parameters or format
            _connectionStringManager.ValidateConnectionString(connectionString);
        }
    }
}