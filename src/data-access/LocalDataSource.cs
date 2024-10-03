using System;
using System.Data;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// Implements the LocalDataSource class, which provides functionality for interacting with local data sources in Microsoft Excel.
    /// </summary>
    public class LocalDataSource : IDataSource
    {
        private IDbConnection _connection;
        private readonly ILogger _logger;

        /// <summary>
        /// Initializes a new instance of the LocalDataSource class.
        /// </summary>
        /// <param name="logger">The logger instance for logging data access operations.</param>
        public LocalDataSource(ILogger logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _connection = null;
        }

        /// <summary>
        /// Establishes a connection to the local data source.
        /// </summary>
        /// <param name="connectionString">The connection string for the local data source.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the connection is successful.</returns>
        public async Task<bool> Connect(string connectionString)
        {
            try
            {
                _logger.LogInformation($"Attempting to connect to local data source: {connectionString}");
                _connection = await DatabaseConnector.EstablishConnectionAsync(connectionString);
                _logger.LogInformation("Connection to local data source established successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to connect to local data source: {ex.Message}");
                throw new DataAccessException("Failed to connect to local data source", ex);
            }
        }

        /// <summary>
        /// Closes the connection to the local data source.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, returning true if the disconnection is successful.</returns>
        public async Task<bool> Disconnect()
        {
            try
            {
                _logger.LogInformation("Attempting to disconnect from local data source");
                if (_connection != null)
                {
                    await Task.Run(() => {
                        _connection.Close();
                        _connection.Dispose();
                    });
                    _connection = null;
                }
                _logger.LogInformation("Disconnected from local data source successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to disconnect from local data source: {ex.Message}");
                throw new DataAccessException("Failed to disconnect from local data source", ex);
            }
        }

        /// <summary>
        /// Executes a query against the local data source and returns the results.
        /// </summary>
        /// <typeparam name="T">The type of the result set.</typeparam>
        /// <param name="query">The SQL query to execute.</param>
        /// <param name="parameters">The parameters for the query.</param>
        /// <returns>A task representing the asynchronous operation, returning the query results.</returns>
        public async Task<IEnumerable<T>> ExecuteQuery<T>(string query, params object[] parameters)
        {
            try
            {
                _logger.LogInformation($"Executing query: {query}");
                if (_connection == null || _connection.State != ConnectionState.Open)
                {
                    throw new DataAccessException("Connection is not open. Please connect before executing a query.");
                }
                return await DatabaseConnector.ExecuteQueryAsync<T>(_connection, query, parameters);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to execute query: {ex.Message}");
                throw new DataAccessException("Failed to execute query", ex);
            }
        }

        /// <summary>
        /// Executes a non-query command against the local data source and returns the number of affected rows.
        /// </summary>
        /// <param name="query">The SQL command to execute.</param>
        /// <param name="parameters">The parameters for the command.</param>
        /// <returns>A task representing the asynchronous operation, returning the number of affected rows.</returns>
        public async Task<int> ExecuteNonQuery(string query, params object[] parameters)
        {
            try
            {
                _logger.LogInformation($"Executing non-query command: {query}");
                if (_connection == null || _connection.State != ConnectionState.Open)
                {
                    throw new DataAccessException("Connection is not open. Please connect before executing a command.");
                }
                return await DatabaseConnector.ExecuteNonQueryAsync(_connection, query, parameters);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to execute non-query command: {ex.Message}");
                throw new DataAccessException("Failed to execute non-query command", ex);
            }
        }

        /// <summary>
        /// Begins a new database transaction.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, returning the newly created transaction.</returns>
        public async Task<IDbTransaction> BeginTransaction()
        {
            try
            {
                _logger.LogInformation("Beginning new transaction");
                if (_connection == null || _connection.State != ConnectionState.Open)
                {
                    throw new DataAccessException("Connection is not open. Please connect before beginning a transaction.");
                }
                return await Task.Run(() => _connection.BeginTransaction());
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to begin transaction: {ex.Message}");
                throw new DataAccessException("Failed to begin transaction", ex);
            }
        }

        /// <summary>
        /// Commits the specified transaction.
        /// </summary>
        /// <param name="transaction">The transaction to commit.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the transaction is successfully committed.</returns>
        public async Task<bool> CommitTransaction(IDbTransaction transaction)
        {
            try
            {
                _logger.LogInformation("Committing transaction");
                if (transaction == null)
                {
                    throw new ArgumentNullException(nameof(transaction));
                }
                await Task.Run(() => transaction.Commit());
                _logger.LogInformation("Transaction committed successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to commit transaction: {ex.Message}");
                throw new DataAccessException("Failed to commit transaction", ex);
            }
        }

        /// <summary>
        /// Rolls back the specified transaction.
        /// </summary>
        /// <param name="transaction">The transaction to roll back.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the transaction is successfully rolled back.</returns>
        public async Task<bool> RollbackTransaction(IDbTransaction transaction)
        {
            try
            {
                _logger.LogInformation("Rolling back transaction");
                if (transaction == null)
                {
                    throw new ArgumentNullException(nameof(transaction));
                }
                await Task.Run(() => transaction.Rollback());
                _logger.LogInformation("Transaction rolled back successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to rollback transaction: {ex.Message}");
                throw new DataAccessException("Failed to rollback transaction", ex);
            }
        }
    }
}