using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Azure.Services.AppAuthentication;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This class implements the IDataSource interface and extends the DatabaseConnector class to provide
    /// specific functionality for connecting to and interacting with Azure SQL databases.
    /// </summary>
    public class AzureSqlConnector : DatabaseConnector, IDataSource
    {
        private string ConnectionString { get; set; }
        private SqlConnection SqlConnection { get; set; }

        /// <summary>
        /// Establishes a connection to the Azure SQL database using the provided connection string.
        /// </summary>
        /// <param name="connectionString">The connection string for the Azure SQL database.</param>
        /// <returns>A Task<bool> indicating whether the connection was successful.</returns>
        public async Task<bool> Connect(string connectionString)
        {
            try
            {
                // Validate the connection string
                if (string.IsNullOrWhiteSpace(connectionString))
                {
                    throw new ArgumentNullException(nameof(connectionString), "Connection string cannot be null or empty.");
                }

                ConnectionString = connectionString;

                // Create a new SqlConnection object
                SqlConnection = new SqlConnection(ConnectionString);

                // Attempt to open the connection
                await SqlConnection.OpenAsync();

                return true;
            }
            catch (Exception ex)
            {
                // Handle any exceptions and throw DataAccessException if necessary
                throw new DataAccessException("Failed to connect to Azure SQL database.", ex);
            }
        }

        /// <summary>
        /// Closes the connection to the Azure SQL database.
        /// </summary>
        /// <returns>A Task<bool> indicating whether the disconnection was successful.</returns>
        public async Task<bool> Disconnect()
        {
            try
            {
                // Check if the connection is open
                if (SqlConnection?.State == ConnectionState.Open)
                {
                    // Close the connection if it's open
                    await SqlConnection.CloseAsync();
                }

                return true;
            }
            catch (Exception ex)
            {
                // Handle any exceptions and throw DataAccessException if necessary
                throw new DataAccessException("Failed to disconnect from Azure SQL database.", ex);
            }
        }

        /// <summary>
        /// Executes a query against the Azure SQL database and returns the results.
        /// </summary>
        /// <typeparam name="T">The type of the query results.</typeparam>
        /// <param name="query">The SQL query to execute.</param>
        /// <param name="parameters">The parameters for the query.</param>
        /// <returns>A Task<IEnumerable<T>> containing the query results.</returns>
        public async Task<IEnumerable<T>> ExecuteQuery<T>(string query, params object[] parameters)
        {
            try
            {
                // Validate the query and parameters
                if (string.IsNullOrWhiteSpace(query))
                {
                    throw new ArgumentNullException(nameof(query), "Query cannot be null or empty.");
                }

                // Create a SqlCommand object with the query and parameters
                using (var command = new SqlCommand(query, SqlConnection))
                {
                    if (parameters != null && parameters.Length > 0)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    // Execute the command and retrieve the results
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        // Convert the results to the specified type T
                        var results = new List<T>();
                        while (await reader.ReadAsync())
                        {
                            results.Add((T)reader.GetValue(0));
                        }
                        return results;
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions and throw DataAccessException if necessary
                throw new DataAccessException("Failed to execute query on Azure SQL database.", ex);
            }
        }

        /// <summary>
        /// Executes a non-query command against the Azure SQL database and returns the number of affected rows.
        /// </summary>
        /// <param name="query">The SQL command to execute.</param>
        /// <param name="parameters">The parameters for the command.</param>
        /// <returns>A Task<int> containing the number of affected rows.</returns>
        public async Task<int> ExecuteNonQuery(string query, params object[] parameters)
        {
            try
            {
                // Validate the query and parameters
                if (string.IsNullOrWhiteSpace(query))
                {
                    throw new ArgumentNullException(nameof(query), "Query cannot be null or empty.");
                }

                // Create a SqlCommand object with the query and parameters
                using (var command = new SqlCommand(query, SqlConnection))
                {
                    if (parameters != null && parameters.Length > 0)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    // Execute the command and retrieve the number of affected rows
                    return await command.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions and throw DataAccessException if necessary
                throw new DataAccessException("Failed to execute non-query command on Azure SQL database.", ex);
            }
        }

        /// <summary>
        /// Begins a new transaction in the Azure SQL database.
        /// </summary>
        /// <returns>A Task<IDbTransaction> containing the newly created transaction object.</returns>
        public async Task<IDbTransaction> BeginTransaction()
        {
            try
            {
                // Check if the connection is open
                if (SqlConnection?.State != ConnectionState.Open)
                {
                    throw new InvalidOperationException("Database connection is not open.");
                }

                // Begin a new transaction
                return await Task.FromResult(SqlConnection.BeginTransaction());
            }
            catch (Exception ex)
            {
                // Handle any exceptions and throw DataAccessException if necessary
                throw new DataAccessException("Failed to begin transaction on Azure SQL database.", ex);
            }
        }

        /// <summary>
        /// Commits the specified transaction in the Azure SQL database.
        /// </summary>
        /// <param name="transaction">The transaction to commit.</param>
        /// <returns>A Task<bool> indicating whether the commit was successful.</returns>
        public async Task<bool> CommitTransaction(IDbTransaction transaction)
        {
            try
            {
                // Validate the transaction object
                if (transaction == null)
                {
                    throw new ArgumentNullException(nameof(transaction), "Transaction cannot be null.");
                }

                // Commit the transaction
                transaction.Commit();
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                // Handle any exceptions and throw DataAccessException if necessary
                throw new DataAccessException("Failed to commit transaction on Azure SQL database.", ex);
            }
        }

        /// <summary>
        /// Rolls back the specified transaction in the Azure SQL database.
        /// </summary>
        /// <param name="transaction">The transaction to roll back.</param>
        /// <returns>A Task<bool> indicating whether the rollback was successful.</returns>
        public async Task<bool> RollbackTransaction(IDbTransaction transaction)
        {
            try
            {
                // Validate the transaction object
                if (transaction == null)
                {
                    throw new ArgumentNullException(nameof(transaction), "Transaction cannot be null.");
                }

                // Rollback the transaction
                transaction.Rollback();
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                // Handle any exceptions and throw DataAccessException if necessary
                throw new DataAccessException("Failed to rollback transaction on Azure SQL database.", ex);
            }
        }
    }
}