using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// Manages connection strings for various data sources used in Microsoft Excel,
    /// providing methods for secure storage, retrieval, and manipulation of connection strings.
    /// </summary>
    public class ConnectionStringManager
    {
        private static ConnectionStringManager _instance;
        private readonly Dictionary<string, string> _connectionStrings;
        private readonly EncryptionService _encryptionService;

        private ConnectionStringManager()
        {
            _connectionStrings = new Dictionary<string, string>();
            _encryptionService = new EncryptionService();
        }

        /// <summary>
        /// Gets the singleton instance of the ConnectionStringManager.
        /// </summary>
        public static ConnectionStringManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new ConnectionStringManager();
                }
                return _instance;
            }
        }

        /// <summary>
        /// Retrieves the connection string for the specified data source.
        /// </summary>
        /// <param name="dataSourceName">The name of the data source.</param>
        /// <returns>The decrypted connection string.</returns>
        public string GetConnectionString(string dataSourceName)
        {
            if (string.IsNullOrEmpty(dataSourceName))
            {
                throw new DataAccessException("Data source name cannot be null or empty.");
            }

            if (!_connectionStrings.TryGetValue(dataSourceName, out string encryptedConnectionString))
            {
                throw new DataAccessException($"Connection string not found for data source: {dataSourceName}");
            }

            return DecryptConnectionString(encryptedConnectionString);
        }

        /// <summary>
        /// Sets the connection string for the specified data source.
        /// </summary>
        /// <param name="dataSourceName">The name of the data source.</param>
        /// <param name="connectionString">The connection string to be stored.</param>
        public void SetConnectionString(string dataSourceName, string connectionString)
        {
            if (string.IsNullOrEmpty(dataSourceName))
            {
                throw new DataAccessException("Data source name cannot be null or empty.");
            }

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new DataAccessException("Connection string cannot be null or empty.");
            }

            string encryptedConnectionString = EncryptConnectionString(connectionString);
            _connectionStrings[dataSourceName] = encryptedConnectionString;
        }

        /// <summary>
        /// Removes the connection string for the specified data source.
        /// </summary>
        /// <param name="dataSourceName">The name of the data source.</param>
        /// <returns>True if the connection string was successfully removed, false otherwise.</returns>
        public bool RemoveConnectionString(string dataSourceName)
        {
            if (string.IsNullOrEmpty(dataSourceName))
            {
                throw new DataAccessException("Data source name cannot be null or empty.");
            }

            return _connectionStrings.Remove(dataSourceName);
        }

        /// <summary>
        /// Encrypts the given connection string for secure storage.
        /// </summary>
        /// <param name="connectionString">The connection string to be encrypted.</param>
        /// <returns>The encrypted connection string.</returns>
        private string EncryptConnectionString(string connectionString)
        {
            try
            {
                return _encryptionService.Encrypt(connectionString);
            }
            catch (Exception ex)
            {
                throw new DataAccessException("Failed to encrypt connection string.", ex);
            }
        }

        /// <summary>
        /// Decrypts the given encrypted connection string.
        /// </summary>
        /// <param name="encryptedConnectionString">The encrypted connection string to be decrypted.</param>
        /// <returns>The decrypted connection string.</returns>
        private string DecryptConnectionString(string encryptedConnectionString)
        {
            try
            {
                return _encryptionService.Decrypt(encryptedConnectionString);
            }
            catch (Exception ex)
            {
                throw new DataAccessException("Failed to decrypt connection string.", ex);
            }
        }
    }
}