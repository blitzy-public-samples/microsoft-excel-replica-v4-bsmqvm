using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Client;
using System.Security.Claims;

namespace ExcelDesktop.Services
{
    /// <summary>
    /// This class implements the IAuthenticationService interface and provides methods for user authentication,
    /// token management, and user information retrieval.
    /// </summary>
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IPublicClientApplication _publicClientApplication;
        private readonly ILogger<AuthenticationService> _logger;
        private ClaimsPrincipal _currentUser;

        /// <summary>
        /// Initializes a new instance of the AuthenticationService class.
        /// </summary>
        /// <param name="logger">The logger instance for logging authentication-related events.</param>
        public AuthenticationService(ILogger<AuthenticationService> logger)
        {
            _logger = logger;
            _publicClientApplication = PublicClientApplicationBuilder
                .Create(ConfigurationManager.AppSettings["ClientId"])
                .WithAuthority(AzureCloudInstance.AzurePublic, ConfigurationManager.AppSettings["TenantId"])
                .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
                .Build();
        }

        /// <summary>
        /// Authenticates the user asynchronously using Microsoft Account or Azure AD.
        /// </summary>
        /// <returns>A boolean indicating whether the authentication was successful.</returns>
        public async Task<bool> AuthenticateAsync()
        {
            try
            {
                var scopes = new[] { "User.Read" };
                var result = await _publicClientApplication.AcquireTokenInteractive(scopes).ExecuteAsync();
                _currentUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, result.Account.HomeAccountId.Identifier),
                    new Claim(ClaimTypes.Name, result.Account.Username)
                }, "MicrosoftAccount"));

                _logger.LogInformation($"User {result.Account.Username} authenticated successfully.");
                return true;
            }
            catch (MsalException ex)
            {
                _logger.LogError(ex, "Authentication failed.");
                return false;
            }
        }

        /// <summary>
        /// Retrieves the access token for the authenticated user.
        /// </summary>
        /// <returns>The access token for the authenticated user.</returns>
        public async Task<string> GetAccessTokenAsync()
        {
            if (_currentUser == null)
            {
                throw new InvalidOperationException("User is not authenticated.");
            }

            try
            {
                var scopes = new[] { "User.Read" };
                var accounts = await _publicClientApplication.GetAccountsAsync();
                var result = await _publicClientApplication.AcquireTokenSilent(scopes, accounts.FirstOrDefault()).ExecuteAsync();
                return result.AccessToken;
            }
            catch (MsalException ex)
            {
                _logger.LogError(ex, "Failed to retrieve access token.");
                throw;
            }
        }

        /// <summary>
        /// Retrieves the user information for the authenticated user.
        /// </summary>
        /// <returns>The user information for the authenticated user.</returns>
        public async Task<UserInfo> GetUserInfoAsync()
        {
            if (_currentUser == null)
            {
                throw new InvalidOperationException("User is not authenticated.");
            }

            return new UserInfo
            {
                Id = _currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                Username = _currentUser.FindFirst(ClaimTypes.Name)?.Value
            };
        }

        /// <summary>
        /// Logs out the current user and clears the authentication state.
        /// </summary>
        public async Task LogoutAsync()
        {
            var accounts = await _publicClientApplication.GetAccountsAsync();
            foreach (var account in accounts)
            {
                await _publicClientApplication.RemoveAsync(account);
            }

            _currentUser = null;
            _logger.LogInformation("User logged out successfully.");
        }
    }

    public class UserInfo
    {
        public string Id { get; set; }
        public string Username { get; set; }
    }

    public interface IAuthenticationService
    {
        Task<bool> AuthenticateAsync();
        Task<string> GetAccessTokenAsync();
        Task<UserInfo> GetUserInfoAsync();
        Task LogoutAsync();
    }
}