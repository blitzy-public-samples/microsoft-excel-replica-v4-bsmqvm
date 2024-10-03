using System;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System.IO;
using System.Net.Http;

namespace Microsoft.Excel.Security.Authentication
{
    /// <summary>
    /// Implements the Microsoft Account authentication provider for Microsoft Excel.
    /// </summary>
    public class MicrosoftAccountAuth : IAuthenticationService
    {
        private readonly IConfidentialClientApplication _msalClient;
        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly string _redirectUri;
        private readonly HttpClient _httpClient;

        /// <summary>
        /// Initializes a new instance of the MicrosoftAccountAuth class.
        /// </summary>
        public MicrosoftAccountAuth()
        {
            // Load configuration from SecurityConfig.json
            var config = LoadSecurityConfig();
            _clientId = config.ClientId;
            _clientSecret = config.ClientSecret;
            _redirectUri = config.RedirectUri;

            // Initialize MSAL client
            _msalClient = ConfidentialClientApplicationBuilder
                .Create(_clientId)
                .WithClientSecret(_clientSecret)
                .WithRedirectUri(_redirectUri)
                .Build();

            _httpClient = new HttpClient();
        }

        /// <summary>
        /// Authenticates a user using their Microsoft Account credentials.
        /// </summary>
        /// <param name="username">The user's email address.</param>
        /// <param name="password">The user's password.</param>
        /// <returns>The result of the authentication process.</returns>
        public async Task<AuthResult> AuthenticateAsync(string username, string password)
        {
            try
            {
                var result = await _msalClient.AcquireTokenByUsernamePassword(
                    new[] { "User.Read" },
                    username,
                    password
                ).ExecuteAsync();

                return new AuthResult
                {
                    IsAuthenticated = true,
                    AccessToken = result.AccessToken,
                    ExpiresOn = result.ExpiresOn
                };
            }
            catch (MsalException ex)
            {
                // Handle MSAL-specific exceptions
                throw new AuthenticationException("Microsoft Account authentication failed", ex);
            }
        }

        /// <summary>
        /// Retrieves an access token for the authenticated user.
        /// </summary>
        /// <returns>The access token for the authenticated user.</returns>
        public async Task<string> GetTokenAsync()
        {
            try
            {
                var accounts = await _msalClient.GetAccountsAsync();
                var firstAccount = accounts.FirstOrDefault();

                if (firstAccount == null)
                {
                    throw new AuthenticationException("No authenticated account found");
                }

                var result = await _msalClient.AcquireTokenSilent(
                    new[] { "User.Read" },
                    firstAccount
                ).ExecuteAsync();

                return result.AccessToken;
            }
            catch (MsalUiRequiredException)
            {
                // Token has expired, need to re-authenticate
                throw new AuthenticationException("Token has expired, please re-authenticate");
            }
        }

        /// <summary>
        /// Validates the given access token.
        /// </summary>
        /// <param name="token">The access token to validate.</param>
        /// <returns>True if the token is valid, false otherwise.</returns>
        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var response = await _httpClient.GetAsync(
                    $"https://graph.microsoft.com/v1.0/me?access_token={token}");

                return response.IsSuccessStatusCode;
            }
            catch (HttpRequestException)
            {
                return false;
            }
        }

        /// <summary>
        /// Initializes the Microsoft Account authentication provider.
        /// </summary>
        /// <returns>Completion of the initialization process.</returns>
        public async Task InitializeAsync()
        {
            // Ensure MSAL client is properly configured
            if (string.IsNullOrEmpty(_clientId) || string.IsNullOrEmpty(_clientSecret) || string.IsNullOrEmpty(_redirectUri))
            {
                throw new InvalidOperationException("Microsoft Account authentication is not properly configured");
            }

            // Verify connection to Microsoft Account services
            try
            {
                await _httpClient.GetAsync("https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration");
            }
            catch (HttpRequestException ex)
            {
                throw new InvalidOperationException("Unable to connect to Microsoft Account services", ex);
            }
        }

        /// <summary>
        /// Signs out the current user.
        /// </summary>
        /// <returns>Completion of the sign-out process.</returns>
        public async Task SignOutAsync()
        {
            var accounts = await _msalClient.GetAccountsAsync();
            foreach (var account in accounts)
            {
                await _msalClient.RemoveAsync(account);
            }
        }

        private SecurityConfig LoadSecurityConfig()
        {
            var configPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "SecurityConfig.json");
            if (!File.Exists(configPath))
            {
                throw new FileNotFoundException("SecurityConfig.json not found", configPath);
            }

            var jsonConfig = File.ReadAllText(configPath);
            return JsonConvert.DeserializeObject<SecurityConfig>(jsonConfig);
        }
    }

    public class SecurityConfig
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string RedirectUri { get; set; }
    }

    public class AuthResult
    {
        public bool IsAuthenticated { get; set; }
        public string AccessToken { get; set; }
        public DateTimeOffset ExpiresOn { get; set; }
    }

    public class AuthenticationException : Exception
    {
        public AuthenticationException(string message) : base(message) { }
        public AuthenticationException(string message, Exception innerException) : base(message, innerException) { }
    }

    // Assuming this interface based on the required methods
    public interface IAuthenticationService
    {
        Task<AuthResult> AuthenticateAsync(string username, string password);
        Task<string> GetTokenAsync();
        Task<bool> ValidateTokenAsync(string token);
        Task InitializeAsync();
        Task SignOutAsync();
    }
}