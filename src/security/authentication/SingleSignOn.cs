using System;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Newtonsoft.Json.Linq;

namespace Microsoft.Excel.Security.Authentication
{
    /// <summary>
    /// Implements the Single Sign-On (SSO) functionality for Microsoft Excel,
    /// enabling users to access multiple Microsoft services with a single login.
    /// </summary>
    public class SingleSignOn
    {
        private readonly AuthenticationService _authService;
        private readonly OAuthHandler _oAuthHandler;
        private readonly JwtTokenService _jwtTokenService;
        private readonly MicrosoftAccountAuth _microsoftAccountAuth;
        private readonly AzureADAuth _azureADAuth;

        private IUser _currentUser;
        private bool _isAuthenticated;

        public IUser CurrentUser => _currentUser;
        public bool IsAuthenticated => _isAuthenticated;

        public SingleSignOn(
            AuthenticationService authService,
            OAuthHandler oAuthHandler,
            JwtTokenService jwtTokenService,
            MicrosoftAccountAuth microsoftAccountAuth,
            AzureADAuth azureADAuth)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _oAuthHandler = oAuthHandler ?? throw new ArgumentNullException(nameof(oAuthHandler));
            _jwtTokenService = jwtTokenService ?? throw new ArgumentNullException(nameof(jwtTokenService));
            _microsoftAccountAuth = microsoftAccountAuth ?? throw new ArgumentNullException(nameof(microsoftAccountAuth));
            _azureADAuth = azureADAuth ?? throw new ArgumentNullException(nameof(azureADAuth));

            _currentUser = null;
            _isAuthenticated = false;
        }

        /// <summary>
        /// Initializes the Single Sign-On service with the provided configuration.
        /// </summary>
        /// <param name="config">SSO configuration object</param>
        /// <returns>A task representing the asynchronous operation</returns>
        public async Task InitializeSSOAsync(SSOConfig config)
        {
            try
            {
                await _authService.InitializeAsync(config);
                await _oAuthHandler.ConfigureAsync(config.OAuthSettings);
                _jwtTokenService.Configure(config.JwtSettings);
                
                // Set up necessary authentication providers
                await _microsoftAccountAuth.InitializeAsync(config.MicrosoftAccountSettings);
                await _azureADAuth.InitializeAsync(config.AzureADSettings);

                // Configure token handling and validation
                _jwtTokenService.ConfigureTokenValidation(config.TokenValidationParameters);
            }
            catch (Exception ex)
            {
                throw new SSOInitializationException("Failed to initialize SSO service", ex);
            }
        }

        /// <summary>
        /// Authenticates a user using Single Sign-On based on the account type.
        /// </summary>
        /// <param name="accountType">The type of account (personal or organizational)</param>
        /// <returns>Authentication result</returns>
        public async Task<AuthResult> AuthenticateWithSSOAsync(string accountType)
        {
            try
            {
                AuthResult authResult;

                if (accountType.Equals("personal", StringComparison.OrdinalIgnoreCase))
                {
                    authResult = await _microsoftAccountAuth.AuthenticateAsync();
                }
                else if (accountType.Equals("organizational", StringComparison.OrdinalIgnoreCase))
                {
                    authResult = await _azureADAuth.AuthenticateAsync();
                }
                else
                {
                    throw new ArgumentException("Invalid account type. Must be 'personal' or 'organizational'.", nameof(accountType));
                }

                if (authResult.IsSuccess)
                {
                    _currentUser = authResult.User;
                    _isAuthenticated = true;

                    // Generate SSO token
                    string ssoToken = await _jwtTokenService.GenerateTokenAsync(_currentUser);
                    authResult.Token = ssoToken;
                }

                return authResult;
            }
            catch (Exception ex)
            {
                throw new SSOAuthenticationException("Failed to authenticate user", ex);
            }
        }

        /// <summary>
        /// Retrieves the SSO token for the authenticated user.
        /// </summary>
        /// <returns>SSO token</returns>
        public async Task<string> GetSSOTokenAsync()
        {
            if (!_isAuthenticated)
            {
                throw new InvalidOperationException("User is not authenticated. Please authenticate first.");
            }

            try
            {
                string storedToken = await _jwtTokenService.GetStoredTokenAsync(_currentUser.Id);

                if (string.IsNullOrEmpty(storedToken) || _jwtTokenService.IsTokenExpired(storedToken))
                {
                    // Generate a new token if not found or expired
                    storedToken = await _jwtTokenService.GenerateTokenAsync(_currentUser);
                }

                return storedToken;
            }
            catch (Exception ex)
            {
                throw new SSOTokenException("Failed to retrieve SSO token", ex);
            }
        }

        /// <summary>
        /// Validates the given SSO token.
        /// </summary>
        /// <param name="token">SSO token to validate</param>
        /// <returns>Token validity</returns>
        public async Task<bool> ValidateSSOTokenAsync(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new ArgumentNullException(nameof(token));
            }

            try
            {
                return await _jwtTokenService.ValidateTokenAsync(token);
            }
            catch (Exception ex)
            {
                throw new SSOTokenValidationException("Failed to validate SSO token", ex);
            }
        }

        /// <summary>
        /// Signs out the user from the SSO session.
        /// </summary>
        /// <returns>A task representing the asynchronous operation</returns>
        public async Task SignOutSSOAsync()
        {
            if (!_isAuthenticated)
            {
                throw new InvalidOperationException("No user is currently authenticated.");
            }

            try
            {
                // Revoke current SSO token
                await _jwtTokenService.RevokeTokenAsync(_currentUser.Id);

                // Clear stored authentication data
                await _authService.ClearAuthenticationDataAsync();

                // Notify other connected services about sign-out
                await _authService.NotifySignOutAsync(_currentUser.Id);

                // Reset authentication state
                _currentUser = null;
                _isAuthenticated = false;
            }
            catch (Exception ex)
            {
                throw new SSOSignOutException("Failed to sign out user", ex);
            }
        }
    }

    public class SSOConfig
    {
        public OAuthSettings OAuthSettings { get; set; }
        public JwtSettings JwtSettings { get; set; }
        public MicrosoftAccountSettings MicrosoftAccountSettings { get; set; }
        public AzureADSettings AzureADSettings { get; set; }
        public TokenValidationParameters TokenValidationParameters { get; set; }
    }

    public class SSOInitializationException : Exception
    {
        public SSOInitializationException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class SSOAuthenticationException : Exception
    {
        public SSOAuthenticationException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class SSOTokenException : Exception
    {
        public SSOTokenException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class SSOTokenValidationException : Exception
    {
        public SSOTokenValidationException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class SSOSignOutException : Exception
    {
        public SSOSignOutException(string message, Exception innerException) : base(message, innerException) { }
    }
}