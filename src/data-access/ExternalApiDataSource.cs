using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// Implements the IDataSource interface and provides functionality to connect to and retrieve data from external APIs.
    /// </summary>
    public class ExternalApiDataSource : IDataSource
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly DataAccessLogger _logger;
        private readonly ErrorHandler _errorHandler;
        private string BaseUrl { get; set; }

        public ExternalApiDataSource(HttpClient httpClient, IConfiguration configuration, DataAccessLogger logger, ErrorHandler errorHandler)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _errorHandler = errorHandler ?? throw new ArgumentNullException(nameof(errorHandler));
            BaseUrl = _configuration["ExternalApi:BaseUrl"];
        }

        /// <summary>
        /// Establishes a connection to the external API.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, returning true if the connection is successful</returns>
        public async Task<bool> Connect()
        {
            try
            {
                _logger.LogInfo(DataAccessConstants.ConnectingToExternalApi);
                
                if (string.IsNullOrEmpty(BaseUrl))
                {
                    throw new DataAccessException(DataAccessConstants.InvalidBaseUrl);
                }

                var response = await _httpClient.GetAsync(BaseUrl);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, DataAccessConstants.ConnectionError);
                return false;
            }
        }

        /// <summary>
        /// Retrieves data from the specified API endpoint with optional query parameters.
        /// </summary>
        /// <typeparam name="T">The type of data to be returned</typeparam>
        /// <param name="endpoint">The API endpoint</param>
        /// <param name="parameters">Optional query parameters</param>
        /// <returns>A task representing the asynchronous operation, returning the retrieved data</returns>
        public async Task<IEnumerable<T>> GetData<T>(string endpoint, IDictionary<string, string> parameters = null)
        {
            try
            {
                _logger.LogInfo($"{DataAccessConstants.RetrievingData}: {endpoint}");

                var url = $"{BaseUrl.TrimEnd('/')}/{endpoint.TrimStart('/')}";
                if (parameters != null && parameters.Count > 0)
                {
                    url += "?" + string.Join("&", parameters.Select(p => $"{Uri.EscapeDataString(p.Key)}={Uri.EscapeDataString(p.Value)}"));
                }

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<IEnumerable<T>>(content);
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, DataAccessConstants.DataRetrievalError);
                return Enumerable.Empty<T>();
            }
        }

        /// <summary>
        /// Inserts data into the specified API endpoint.
        /// </summary>
        /// <typeparam name="T">The type of data to be inserted</typeparam>
        /// <param name="endpoint">The API endpoint</param>
        /// <param name="data">The data to be inserted</param>
        /// <returns>A task representing the asynchronous operation, returning true if the insertion is successful</returns>
        public async Task<bool> InsertData<T>(string endpoint, T data)
        {
            try
            {
                _logger.LogInfo($"{DataAccessConstants.InsertingData}: {endpoint}");

                var url = $"{BaseUrl.TrimEnd('/')}/{endpoint.TrimStart('/')}";
                var json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(url, content);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, DataAccessConstants.DataInsertionError);
                return false;
            }
        }

        /// <summary>
        /// Updates data at the specified API endpoint for a given ID.
        /// </summary>
        /// <typeparam name="T">The type of data to be updated</typeparam>
        /// <param name="endpoint">The API endpoint</param>
        /// <param name="id">The ID of the data to be updated</param>
        /// <param name="data">The updated data</param>
        /// <returns>A task representing the asynchronous operation, returning true if the update is successful</returns>
        public async Task<bool> UpdateData<T>(string endpoint, string id, T data)
        {
            try
            {
                _logger.LogInfo($"{DataAccessConstants.UpdatingData}: {endpoint}/{id}");

                var url = $"{BaseUrl.TrimEnd('/')}/{endpoint.TrimStart('/')}/{id}";
                var json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                var response = await _httpClient.PutAsync(url, content);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, DataAccessConstants.DataUpdateError);
                return false;
            }
        }

        /// <summary>
        /// Deletes data at the specified API endpoint for a given ID.
        /// </summary>
        /// <param name="endpoint">The API endpoint</param>
        /// <param name="id">The ID of the data to be deleted</param>
        /// <returns>A task representing the asynchronous operation, returning true if the deletion is successful</returns>
        public async Task<bool> DeleteData(string endpoint, string id)
        {
            try
            {
                _logger.LogInfo($"{DataAccessConstants.DeletingData}: {endpoint}/{id}");

                var url = $"{BaseUrl.TrimEnd('/')}/{endpoint.TrimStart('/')}/{id}";
                var response = await _httpClient.DeleteAsync(url);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _errorHandler.HandleError(ex, DataAccessConstants.DataDeletionError);
                return false;
            }
        }
    }
}