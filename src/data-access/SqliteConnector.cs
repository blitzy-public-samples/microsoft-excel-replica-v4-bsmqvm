using System;
using System.Data;
using System.Data.SQLite;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// Provides a concrete implementation of the IDataSource interface for SQLite databases in Microsoft Excel.
    /// </summary>
    public class SqliteConnector : IDataSource
    {
        private SQLiteConnection _connection;
        private readonly DataAccessLogger _logger;

        /// <summary>
        /// Initializes a new instance of the SqliteConnector class.
        /// </summary>
        /// <param name="logger">The logger instance for data access operations.</param>
        public SqliteConnector(DataAccessLogger logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _connection = null;
        }

        /// <summary>
        /// Establishes a connection to the SQLite database.
        /// </summary>
        /// <param name="connectionString">The connection string for the SQLite database.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the connection is successful.</returns>
        public async Task<bool> Connect(string connectionString)
        {
            try
            {
                _connection = new SQLiteConnection(connectionString);
                await _connection.OpenAsync();
                _logger.LogInformation($"Successfully connected to SQLite database: {connectionString}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to connect to SQLite database: {ex.Message}");
                throw new DataAccessException("Failed to connect to SQLite database", ex);
            }
        }

        /// <summary>
        /// Closes the connection to the SQLite database.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, returning true if the disconnection is successful.</returns>
        public async Task<bool> Disconnect()
        {
            if (_connection != null)
            {
                try
                {
                    await _connection.CloseAsync();
                    _connection = null;
                    _logger.LogInformation("Successfully disconnected from SQLite database");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Failed to disconnect from SQLite database: {ex.Message}");
                    throw new DataAccessException("Failed to disconnect from SQLite database", ex);
                }
            }
            return false;
        }

        /// <summary>
        /// Executes a query against the SQLite database and returns the results.
        /// </summary>
        /// <typeparam name="T">The type of objects to return.</typeparam>
        /// <param name="query">The SQL query to execute.</param>
        /// <param name="parameters">The parameters for the SQL query.</param>
        /// <returns>A task representing the asynchronous operation, returning the query results.</returns>
        public async Task<IEnumerable<T>> ExecuteQuery<T>(string query, params object[] parameters)
        {
            if (_connection == null)
            {
                throw new DataAccessException("Not connected to the database");
            }

            try
            {
                using var command = new SQLiteCommand(query, _connection);
                for (int i = 0; i < parameters.Length; i++)
                {
                    command.Parameters.AddWithValue($"@p{i}", parameters[i]);
                }

                using var reader = await command.ExecuteReaderAsync();
                var results = new List<T>();
                while (await reader.ReadAsync())
                {
                    results.Add((T)Convert.ChangeType(reader[0], typeof(T)));
                }

                _logger.LogInformation($"Successfully executed query: {query}");
                return results;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to execute query: {ex.Message}");
                throw new DataAccessException("Failed to execute query", ex);
            }
        }

        /// <summary>
        /// Executes a non-query command against the SQLite database and returns the number of affected rows.
        /// </summary>
        /// <param name="query">The SQL command to execute.</param>
        /// <param name="parameters">The parameters for the SQL command.</param>
        /// <returns>A task representing the asynchronous operation, returning the number of affected rows.</returns>
        public async Task<int> ExecuteNonQuery(string query, params object[] parameters)
        {
            if (_connection == null)
            {
                throw new DataAccessException("Not connected to the database");
            }

            try
            {
                using var command = new SQLiteCommand(query, _connection);
                for (int i = 0; i < parameters.Length; i++)
                {
                    command.Parameters.AddWithValue($"@p{i}", parameters[i]);
                }

                int affectedRows = await command.ExecuteNonQueryAsync();
                _logger.LogInformation($"Successfully executed non-query command: {query}");
                return affectedRows;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to execute non-query command: {ex.Message}");
                throw new DataAccessException("Failed to execute non-query command", ex);
            }
        }

        /// <summary>
        /// Begins a new SQLite database transaction.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, returning the newly created transaction.</returns>
        public async Task<IDbTransaction> BeginTransaction()
        {
            if (_connection == null)
            {
                throw new DataAccessException("Not connected to the database");
            }

            try
            {
                var transaction = await _connection.BeginTransactionAsync();
                _logger.LogInformation("Successfully began a new transaction");
                return transaction;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to begin transaction: {ex.Message}");
                throw new DataAccessException("Failed to begin transaction", ex);
            }
        }

        /// <summary>
        /// Commits the specified SQLite transaction.
        /// </summary>
        /// <param name="transaction">The transaction to commit.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the transaction is successfully committed.</returns>
        public async Task<bool> CommitTransaction(IDbTransaction transaction)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException(nameof(transaction));
            }

            try
            {
                await Task.Run(() => transaction.Commit());
                _logger.LogInformation("Successfully committed transaction");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to commit transaction: {ex.Message}");
                throw new DataAccessException("Failed to commit transaction", ex);
            }
        }

        /// <summary>
        /// Rolls back the specified SQLite transaction.
        /// </summary>
        /// <param name="transaction">The transaction to roll back.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the transaction is successfully rolled back.</returns>
        public async Task<bool> RollbackTransaction(IDbTransaction transaction)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException(nameof(transaction));
            }

            try
            {
                await Task.Run(() => transaction.Rollback());
                _logger.LogInformation("Successfully rolled back transaction");
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