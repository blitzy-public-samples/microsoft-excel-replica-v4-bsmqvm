using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This class encapsulates the configuration settings for the data access layer in Microsoft Excel.
    /// </summary>
    public class DataAccessConfiguration
    {
        /// <summary>
        /// Gets or sets the default data source type.
        /// </summary>
        public string DefaultDataSourceType { get; set; }

        /// <summary>
        /// Gets or sets the dictionary of connection strings.
        /// </summary>
        public Dictionary<string, string> ConnectionStrings { get; set; }

        /// <summary>
        /// Gets or sets the maximum number of connections.
        /// </summary>
        public int MaxConnections { get; set; }

        /// <summary>
        /// Gets or sets the timeout for data access operations.
        /// </summary>
        public TimeSpan Timeout { get; set; }

        /// <summary>
        /// Gets or sets the number of retry attempts for data access operations.
        /// </summary>
        public int RetryAttempts { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether caching is enabled.
        /// </summary>
        public bool EnableCaching { get; set; }

        /// <summary>
        /// Gets or sets the cache expiration time.
        /// </summary>
        public TimeSpan CacheExpirationTime { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="DataAccessConfiguration"/> class.
        /// </summary>
        public DataAccessConfiguration()
        {
            ConnectionStrings = new Dictionary<string, string>();
        }

        /// <summary>
        /// Loads the configuration settings from the provided IConfiguration object.
        /// </summary>
        /// <param name="configuration">The IConfiguration object containing the settings.</param>
        public void LoadConfiguration(IConfiguration configuration)
        {
            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }

            // Extract and set the DefaultDataSourceType
            DefaultDataSourceType = configuration["DataAccess:DefaultDataSourceType"];

            // Load and populate the ConnectionStrings dictionary
            var connectionStringsSection = configuration.GetSection("DataAccess:ConnectionStrings");
            foreach (var connectionString in connectionStringsSection.GetChildren())
            {
                ConnectionStrings[connectionString.Key] = connectionString.Value;
            }

            // Set the MaxConnections value
            if (int.TryParse(configuration["DataAccess:MaxConnections"], out int maxConnections))
            {
                MaxConnections = maxConnections;
            }

            // Set the Timeout value
            if (TimeSpan.TryParse(configuration["DataAccess:Timeout"], out TimeSpan timeout))
            {
                Timeout = timeout;
            }

            // Set the RetryAttempts value
            if (int.TryParse(configuration["DataAccess:RetryAttempts"], out int retryAttempts))
            {
                RetryAttempts = retryAttempts;
            }

            // Set the EnableCaching flag
            if (bool.TryParse(configuration["DataAccess:EnableCaching"], out bool enableCaching))
            {
                EnableCaching = enableCaching;
            }

            // Set the CacheExpirationTime value
            if (TimeSpan.TryParse(configuration["DataAccess:CacheExpirationTime"], out TimeSpan cacheExpirationTime))
            {
                CacheExpirationTime = cacheExpirationTime;
            }
        }

        /// <summary>
        /// Retrieves the connection string for the specified data source name.
        /// </summary>
        /// <param name="dataSourceName">The name of the data source.</param>
        /// <returns>The connection string for the specified data source or null if not found.</returns>
        public string GetConnectionString(string dataSourceName)
        {
            if (string.IsNullOrEmpty(dataSourceName))
            {
                throw new ArgumentNullException(nameof(dataSourceName));
            }

            return ConnectionStrings.TryGetValue(dataSourceName, out string connectionString) ? connectionString : null;
        }

        /// <summary>
        /// Sets the connection string for the specified data source name.
        /// </summary>
        /// <param name="dataSourceName">The name of the data source.</param>
        /// <param name="connectionString">The connection string to set.</param>
        public void SetConnectionString(string dataSourceName, string connectionString)
        {
            if (string.IsNullOrEmpty(dataSourceName))
            {
                throw new ArgumentNullException(nameof(dataSourceName));
            }

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException(nameof(connectionString));
            }

            ConnectionStrings[dataSourceName] = connectionString;
        }
    }
}