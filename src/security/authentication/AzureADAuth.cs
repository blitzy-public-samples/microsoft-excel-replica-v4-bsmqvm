using System;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System.IO;

namespace Microsoft.Excel.Security.Authentication
{
    /// <summary>
    /// Implements Azure Active Directory (Azure AD) authentication for Microsoft Excel.
    /// </summary>
    public class AzureADAuth : IAuthenticationService
    {
        private IConfidentialClientApplication _confidentialClientApplication;
        private ITokenCache _tokenCache;

        /// <summary>
        /// Initializes a new instance of the AzureADAuth class.
        /// </summary>
        public AzureADAuth()
        {
            InitializeConfidentialClientApplication();
            SetupTokenCache();
        }

        /// <summary>
        /// Authenticates a user using Azure AD.
        /// </summary>
        /// <param name="tenantId">The Azure AD tenant ID.</param>
        /// <param name="clientId">The client ID of the application.</param>
        /// <param name="scopes">The requested scopes for the authentication.</param>
        /// <returns>The result of the authentication process.</returns>
        public async Task<AuthenticationResult> AuthenticateAsync(string tenantId, string clientId, string[] scopes)
        {
            try
            {
                // Attempt to acquire token silently
                var result = await GetTokenSilentlyAsync(tenantId, clientId, scopes);
                return result;
            }
            catch (MsalUiRequiredException)
            {
                // If silent acquisition fails, initiate interactive authentication
                return await _confidentialClientApplication
                    .AcquireTokenInteractive(scopes)
                    .WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
                    .WithPrompt(Prompt.SelectAccount)
                    .ExecuteAsync();
            }
        }

        /// <summary>
        /// Attempts to acquire an access token silently from the token cache.
        /// </summary>
        /// <param name="tenantId">The Azure AD tenant ID.</param>
        /// <param name="clientId">The client ID of the application.</param>
        /// <param name="scopes">The requested scopes for the authentication.</param>
        /// <returns>The acquired access token.</returns>
        public async Task<string> GetTokenSilentlyAsync(string tenantId, string clientId, string[] scopes)
        {
            var accounts = await _confidentialClientApplication.GetAccountsAsync();
            var result = await _confidentialClientApplication
                .AcquireTokenSilent(scopes, accounts.FirstOrDefault())
                .WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
                .ExecuteAsync();

            return result.AccessToken;
        }

        /// <summary>
        /// Logs out the current user and clears the token cache.
        /// </summary>
        /// <returns>Completion of the logout process.</returns>
        public async Task LogoutAsync()
        {
            var accounts = await _confidentialClientApplication.GetAccountsAsync();
            foreach (var account in accounts)
            {
                await _confidentialClientApplication.RemoveAsync(account);
            }

            _tokenCache.Clear();
            // Notify the authentication service of the logout
            // This part would be implemented when we have access to the AuthenticationService
        }

        private void InitializeConfidentialClientApplication()
        {
            var config = LoadSecurityConfig();
            _confidentialClientApplication = ConfidentialClientApplicationBuilder
                .Create(config.ClientId)
                .WithClientSecret(config.ClientSecret)
                .WithAuthority(new Uri($"https://login.microsoftonline.com/{config.TenantId}"))
                .Build();
        }

        private void SetupTokenCache()
        {
            _tokenCache = _confidentialClientApplication.UserTokenCache;
            // Here you would implement token cache serialization for persistent storage
            // This is important for maintaining user sessions across application restarts
        }

        private SecurityConfig LoadSecurityConfig()
        {
            var configPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "SecurityConfig.json");
            var configJson = File.ReadAllText(configPath);
            return JsonConvert.DeserializeObject<SecurityConfig>(configJson);
        }
    }

    internal class SecurityConfig
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string TenantId { get; set; }
    }

    public interface IAuthenticationService
    {
        Task<AuthenticationResult> AuthenticateAsync(string tenantId, string clientId, string[] scopes);
        Task<string> GetTokenSilentlyAsync(string tenantId, string clientId, string[] scopes);
        Task LogoutAsync();
    }
}