using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Azure.Cosmos;
using Azure.Storage.Blobs;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// Implements the IDataSource interface for cloud-based data sources, providing methods to connect to and interact with cloud storage services like Azure Cosmos DB and Azure Blob Storage.
    /// </summary>
    public class CloudDataSource : IDataSource
    {
        private const int DEFAULT_TIMEOUT = 30;

        private CosmosClient _cosmosClient;
        private BlobServiceClient _blobServiceClient;
        private string _connectionString;
        private readonly IDataAccessLogger _logger;

        /// <summary>
        /// Initializes a new instance of the CloudDataSource class.
        /// </summary>
        /// <param name="logger">The logger instance for data access operations.</param>
        public CloudDataSource(IDataAccessLogger logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Establishes a connection to the cloud data source using the provided connection string.
        /// </summary>
        /// <param name="connectionString">The connection string for the cloud data source.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the connection is successful.</returns>
        public async Task<bool> Connect(string connectionString)
        {
            try
            {
                _connectionString = ConnectionStringManager.ValidateAndSanitize(connectionString);

                // Initialize Cosmos DB client
                _cosmosClient = new CosmosClient(_connectionString);
                await _cosmosClient.ReadAccountAsync();

                // Initialize Blob Storage client
                _blobServiceClient = new BlobServiceClient(_connectionString);
                await _blobServiceClient.GetAccountInfoAsync();

                _logger.LogInfo("Successfully connected to cloud data source.");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to connect to cloud data source: {ex.Message}");
                throw new DataAccessException("Failed to connect to cloud data source.", ex);
            }
        }

        /// <summary>
        /// Closes the connection to the cloud data source.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, returning true if the disconnection is successful.</returns>
        public async Task<bool> Disconnect()
        {
            try
            {
                _cosmosClient?.Dispose();
                _blobServiceClient = null;
                _connectionString = null;

                _logger.LogInfo("Successfully disconnected from cloud data source.");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to disconnect from cloud data source: {ex.Message}");
                throw new DataAccessException("Failed to disconnect from cloud data source.", ex);
            }
        }

        /// <summary>
        /// Executes a query against the cloud data source and returns the results.
        /// </summary>
        /// <typeparam name="T">The type of the result.</typeparam>
        /// <param name="query">The query to execute.</param>
        /// <param name="parameters">The parameters for the query.</param>
        /// <returns>A task representing the asynchronous operation, returning the query results.</returns>
        public async Task<IEnumerable<T>> ExecuteQuery<T>(string query, params object[] parameters)
        {
            try
            {
                // Assuming the query is a SQL query for Cosmos DB
                var container = _cosmosClient.GetContainer("database_name", "container_name");
                var queryDefinition = new QueryDefinition(query);

                foreach (var param in parameters)
                {
                    queryDefinition = queryDefinition.WithParameter("@param", param);
                }

                var resultSet = container.GetItemQueryIterator<T>(queryDefinition);
                var results = new List<T>();

                while (resultSet.HasMoreResults)
                {
                    var response = await resultSet.ReadNextAsync();
                    results.AddRange(response);
                }

                _logger.LogInfo($"Successfully executed query: {query}");
                return results;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to execute query: {ex.Message}");
                throw new DataAccessException("Failed to execute query on cloud data source.", ex);
            }
        }

        /// <summary>
        /// Executes a non-query command against the cloud data source and returns the number of affected items.
        /// </summary>
        /// <param name="query">The command to execute.</param>
        /// <param name="parameters">The parameters for the command.</param>
        /// <returns>A task representing the asynchronous operation, returning the number of affected items.</returns>
        public async Task<int> ExecuteNonQuery(string query, params object[] parameters)
        {
            try
            {
                // Assuming the query is a SQL command for Cosmos DB
                var container = _cosmosClient.GetContainer("database_name", "container_name");
                var queryDefinition = new QueryDefinition(query);

                foreach (var param in parameters)
                {
                    queryDefinition = queryDefinition.WithParameter("@param", param);
                }

                var resultSet = container.GetItemQueryIterator<dynamic>(queryDefinition);
                var affectedItems = 0;

                while (resultSet.HasMoreResults)
                {
                    var response = await resultSet.ReadNextAsync();
                    affectedItems += response.Count;
                }

                _logger.LogInfo($"Successfully executed non-query command: {query}");
                return affectedItems;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to execute non-query command: {ex.Message}");
                throw new DataAccessException("Failed to execute non-query command on cloud data source.", ex);
            }
        }

        /// <summary>
        /// Begins a new transaction for the cloud data source.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, returning the new transaction.</returns>
        public Task<IDbTransaction> BeginTransaction()
        {
            // Cosmos DB doesn't support traditional transactions, so we'll throw a not supported exception
            throw new NotSupportedException("Transactions are not supported for cloud data sources.");
        }

        /// <summary>
        /// Commits the specified transaction.
        /// </summary>
        /// <param name="transaction">The transaction to commit.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the commit is successful.</returns>
        public Task<bool> CommitTransaction(IDbTransaction transaction)
        {
            // Cosmos DB doesn't support traditional transactions, so we'll throw a not supported exception
            throw new NotSupportedException("Transactions are not supported for cloud data sources.");
        }

        /// <summary>
        /// Rolls back the specified transaction.
        /// </summary>
        /// <param name="transaction">The transaction to roll back.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the rollback is successful.</returns>
        public Task<bool> RollbackTransaction(IDbTransaction transaction)
        {
            // Cosmos DB doesn't support traditional transactions, so we'll throw a not supported exception
            throw new NotSupportedException("Transactions are not supported for cloud data sources.");
        }

        /// <summary>
        /// Uploads a blob to Azure Blob Storage.
        /// </summary>
        /// <param name="containerName">The name of the container.</param>
        /// <param name="blobName">The name of the blob.</param>
        /// <param name="content">The content of the blob.</param>
        /// <returns>A task representing the asynchronous operation, returning true if the upload is successful.</returns>
        public async Task<bool> UploadBlob(string containerName, string blobName, Stream content)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                await containerClient.CreateIfNotExistsAsync();

                var blobClient = containerClient.GetBlobClient(blobName);
                await blobClient.UploadAsync(content, overwrite: true);

                _logger.LogInfo($"Successfully uploaded blob: {containerName}/{blobName}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to upload blob: {ex.Message}");
                throw new DataAccessException("Failed to upload blob to cloud storage.", ex);
            }
        }

        /// <summary>
        /// Downloads a blob from Azure Blob Storage.
        /// </summary>
        /// <param name="containerName">The name of the container.</param>
        /// <param name="blobName">The name of the blob.</param>
        /// <returns>A task representing the asynchronous operation, returning the downloaded blob content as a stream.</returns>
        public async Task<Stream> DownloadBlob(string containerName, string blobName)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                var blobClient = containerClient.GetBlobClient(blobName);

                var response = await blobClient.DownloadAsync();

                _logger.LogInfo($"Successfully downloaded blob: {containerName}/{blobName}");
                return response.Value.Content;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to download blob: {ex.Message}");
                throw new DataAccessException("Failed to download blob from cloud storage.", ex);
            }
        }
    }
}