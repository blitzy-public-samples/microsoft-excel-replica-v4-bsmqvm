using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This interface defines the contract for all data source implementations in the Microsoft Excel data access layer.
    /// It provides methods for connecting to data sources, executing queries, and managing data operations.
    /// </summary>
    public interface IDataSource
    {
        /// <summary>
        /// Establishes a connection to the data source.
        /// </summary>
        /// <param name="connectionString">The connection string to use for connecting to the data source.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the connection is successful.</returns>
        Task<bool> Connect(string connectionString);

        /// <summary>
        /// Closes the connection to the data source.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, returning true if the disconnection is successful.</returns>
        Task<bool> Disconnect();

        /// <summary>
        /// Executes a query against the data source and returns the results.
        /// </summary>
        /// <typeparam name="T">The type of the result set.</typeparam>
        /// <param name="query">The query to execute.</param>
        /// <param name="parameters">Optional parameters for the query.</param>
        /// <returns>A task representing the asynchronous operation, returning the query results.</returns>
        Task<IEnumerable<T>> ExecuteQuery<T>(string query, params object[] parameters);

        /// <summary>
        /// Executes a non-query command against the data source and returns the number of affected rows.
        /// </summary>
        /// <param name="query">The non-query command to execute.</param>
        /// <param name="parameters">Optional parameters for the command.</param>
        /// <returns>A task representing the asynchronous operation, returning the number of affected rows.</returns>
        Task<int> ExecuteNonQuery(string query, params object[] parameters);

        /// <summary>
        /// Begins a new database transaction.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, returning the newly created transaction.</returns>
        Task<IDbTransaction> BeginTransaction();

        /// <summary>
        /// Commits the specified transaction.
        /// </summary>
        /// <param name="transaction">The transaction to be committed.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the transaction is successfully committed.</returns>
        Task<bool> CommitTransaction(IDbTransaction transaction);

        /// <summary>
        /// Rolls back the specified transaction.
        /// </summary>
        /// <param name="transaction">The transaction to be rolled back.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the transaction is successfully rolled back.</returns>
        Task<bool> RollbackTransaction(IDbTransaction transaction);
    }
}