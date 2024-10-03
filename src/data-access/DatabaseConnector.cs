using System;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This class is responsible for managing database connections and providing methods to interact with various database systems.
    /// It serves as a crucial component in the data access layer, providing a standardized interface for connecting to various database systems.
    /// </summary>
    public class DatabaseConnector : IDataSource
    {
        private IDbConnection _connection;
        private string _connectionString;
        private readonly ConnectionStringManager _connectionStringManager;
        private readonly ErrorHandler _errorHandler;
        private readonly DataAccessLogger _logger;
        private readonly DataAccessConfiguration _configuration;

        /// <summary>
        /// Initializes a new instance of the DatabaseConnector class.
        /// </summary>
        public DatabaseConnector(
            ConnectionStringManager connectionStringManager,
            ErrorHandler errorHandler,
            DataAccessLogger logger,
            DataAccessConfiguration configuration)
        {
            _connectionStringManager = connectionStringManager ?? throw new ArgumentNullException(nameof(connectionStringManager));
            _errorHandler = errorHandler ?? throw new ArgumentNullException(nameof(errorHandler));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _connection = null;
            _connectionString = string.Empty;
        }

        /// <summary>
        /// Establishes a connection to the database using the provided connection string.
        /// </summary>
        /// <param name="connectionString">The connection string to use for connecting to the database.</param>
        public async Task ConnectAsync(string connectionString)
        {
            try
            {
                _logger.LogInfo($"Attempting to connect to database with connection string: {connectionString}");

                // Validate the connection string
                if (!_connectionStringManager.ValidateConnectionString(connectionString))
                {
                    throw new DataAccessException(DataAccessConstants.InvalidConnectionString);
                }

                // Create a new database connection using the connection string
                _connection = DbProviderFactories.GetFactory(_configuration.DefaultProvider).CreateConnection();
                _connection.ConnectionString = connectionString;

                // Open the connection asynchronously
                await _connection.OpenAsync();

                // Set the _connection and _connectionString properties
                _connectionString = connectionString;

                _logger.LogInfo("Database connection established successfully");
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, "Error connecting to database");
                throw new DataAccessException(DataAccessConstants.ConnectionFailed, ex);
            }
        }

        /// <summary>
        /// Closes the current database connection.
        /// </summary>
        public async Task DisconnectAsync()
        {
            try
            {
                if (_connection != null && _connection.State == ConnectionState.Open)
                {
                    await _connection.CloseAsync();
                    _connection.Dispose();
                    _connection = null;
                    _connectionString = string.Empty;
                    _logger.LogInfo("Database connection closed successfully");
                }
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, "Error disconnecting from database");
                throw new DataAccessException(DataAccessConstants.DisconnectionFailed, ex);
            }
        }

        /// <summary>
        /// Executes a SQL query and returns an IDataReader object.
        /// </summary>
        /// <param name="query">The SQL query to execute.</param>
        /// <returns>An IDataReader containing the result of the executed query.</returns>
        public async Task<IDataReader> ExecuteQueryAsync(string query)
        {
            try
            {
                EnsureConnectionOpen();

                using var command = _connection.CreateCommand();
                command.CommandText = query;
                _logger.LogInfo($"Executing query: {query}");
                return await command.ExecuteReaderAsync();
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, $"Error executing query: {query}");
                throw new DataAccessException(DataAccessConstants.QueryExecutionFailed, ex);
            }
        }

        /// <summary>
        /// Executes a SQL command that doesn't return a result set (e.g., INSERT, UPDATE, DELETE).
        /// </summary>
        /// <param name="query">The SQL command to execute.</param>
        /// <returns>The number of rows affected.</returns>
        public async Task<int> ExecuteNonQueryAsync(string query)
        {
            try
            {
                EnsureConnectionOpen();

                using var command = _connection.CreateCommand();
                command.CommandText = query;
                _logger.LogInfo($"Executing non-query: {query}");
                return await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, $"Error executing non-query: {query}");
                throw new DataAccessException(DataAccessConstants.NonQueryExecutionFailed, ex);
            }
        }

        /// <summary>
        /// Begins a new database transaction.
        /// </summary>
        /// <returns>The newly created transaction object.</returns>
        public IDbTransaction BeginTransaction()
        {
            try
            {
                EnsureConnectionOpen();

                _logger.LogInfo("Beginning new transaction");
                return _connection.BeginTransaction();
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, "Error beginning transaction");
                throw new DataAccessException(DataAccessConstants.TransactionInitiationFailed, ex);
            }
        }

        /// <summary>
        /// Ensures that the database connection is open. If not, it attempts to open the connection.
        /// </summary>
        private void EnsureConnectionOpen()
        {
            if (_connection == null || _connection.State != ConnectionState.Open)
            {
                throw new DataAccessException(DataAccessConstants.ConnectionNotOpen);
            }
        }
    }
}