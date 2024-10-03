using System;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This static class contains constant values used throughout the data access layer of Microsoft Excel.
    /// It provides centralized management of configuration settings, error messages, and other static values.
    /// </summary>
    public static class DataAccessConstants
    {
        /// <summary>
        /// The default timeout for database connections in seconds.
        /// </summary>
        public const int DEFAULT_CONNECTION_TIMEOUT = 30;

        /// <summary>
        /// The maximum number of retry attempts for database operations.
        /// </summary>
        public const int MAX_RETRY_ATTEMPTS = 3;

        /// <summary>
        /// The default batch size for bulk operations.
        /// </summary>
        public const int DEFAULT_BATCH_SIZE = 1000;

        /// <summary>
        /// The key used to retrieve the connection string from configuration.
        /// </summary>
        public const string CONNECTION_STRING_KEY = "DataAccessConnectionString";

        /// <summary>
        /// Error message for an invalid connection string.
        /// </summary>
        public const string ERROR_INVALID_CONNECTION_STRING = "Invalid connection string provided.";

        /// <summary>
        /// Error message for a failed database connection attempt.
        /// </summary>
        public const string ERROR_CONNECTION_FAILED = "Failed to establish database connection.";

        /// <summary>
        /// Error message for a failed query execution.
        /// </summary>
        public const string ERROR_QUERY_EXECUTION_FAILED = "Query execution failed.";

        /// <summary>
        /// Error message for a failed database transaction.
        /// </summary>
        public const string ERROR_TRANSACTION_FAILED = "Database transaction failed.";
    }
}