using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Microsoft.Excel.Security.Api
{
    /// <summary>
    /// Implements the OAuth 2.0 protocol handler for Microsoft Excel, providing functionality for secure API authorization and token management.
    /// </summary>
    public class OAuthHandler
    {
        private const int DEFAULT_TOKEN_EXPIRATION = 3600; // 1 hour

        private readonly IConfiguration Configuration;
        private readonly IJwtTokenService JwtTokenService;
        private readonly IApiSecurityService ApiSecurityService;
        private readonly IAuthenticationService AuthenticationService;

        /// <summary>
        /// Initializes a new instance of the OAuthHandler class.
        /// </summary>
        /// <param name="configuration">The application configuration.</param>
        /// <param name="jwtTokenService">The JWT token service.</param>
        /// <param name="apiSecurityService">The API security service.</param>
        /// <param name="authenticationService">The authentication service.</param>
        public OAuthHandler(IConfiguration configuration, IJwtTokenService jwtTokenService, IApiSecurityService apiSecurityService, IAuthenticationService authenticationService)
        {
            Configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            JwtTokenService = jwtTokenService ?? throw new ArgumentNullException(nameof(jwtTokenService));
            ApiSecurityService = apiSecurityService ?? throw new ArgumentNullException(nameof(apiSecurityService));
            AuthenticationService = authenticationService ?? throw new ArgumentNullException(nameof(authenticationService));
        }

        /// <summary>
        /// Configures the OAuth options for the application based on the provided configuration.
        /// </summary>
        /// <param name="options">The OAuth options to configure.</param>
        /// <param name="configuration">The application configuration.</param>
        public void ConfigureOAuthOptions(OAuthOptions options, IConfiguration configuration)
        {
            options.ClientId = configuration["OAuth:ClientId"];
            options.ClientSecret = configuration["OAuth:ClientSecret"];
            options.AuthorizationEndpoint = configuration["OAuth:AuthorizationEndpoint"];
            options.TokenEndpoint = configuration["OAuth:TokenEndpoint"];
            options.UserInformationEndpoint = configuration["OAuth:UserInformationEndpoint"];
            options.CallbackPath = configuration["OAuth:CallbackPath"];

            options.SaveTokens = true;
            options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
            options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
            options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");

            options.Events = new OAuthEvents
            {
                OnCreatingTicket = async context =>
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
                    request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                    request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", context.AccessToken);

                    var response = await context.Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
                    response.EnsureSuccessStatusCode();

                    var user = await response.Content.ReadAsStringAsync();
                    context.RunClaimActions(user);
                }
            };
        }

        /// <summary>
        /// Exchanges an authorization code for an OAuth token.
        /// </summary>
        /// <param name="code">The authorization code.</param>
        /// <param name="redirectUri">The redirect URI used in the authorization request.</param>
        /// <returns>The OAuth token response.</returns>
        public async Task<OAuthTokenResponse> ExchangeCodeForTokenAsync(string code, string redirectUri)
        {
            var tokenEndpoint = Configuration["OAuth:TokenEndpoint"];
            var clientId = Configuration["OAuth:ClientId"];
            var clientSecret = Configuration["OAuth:ClientSecret"];

            var tokenRequest = new HttpRequestMessage(HttpMethod.Post, tokenEndpoint);
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", redirectUri),
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret)
            });
            tokenRequest.Content = content;

            var httpClient = new HttpClient();
            var response = await httpClient.SendAsync(tokenRequest);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            return System.Text.Json.JsonSerializer.Deserialize<OAuthTokenResponse>(responseContent);
        }

        /// <summary>
        /// Validates the given OAuth token.
        /// </summary>
        /// <param name="token">The OAuth token to validate.</param>
        /// <returns>True if the token is valid, false otherwise.</returns>
        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = ApiSecurityService.GetTokenValidationParameters();

                ClaimsPrincipal claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                if (validatedToken is JwtSecurityToken jwtToken)
                {
                    var expirationClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Exp);
                    if (expirationClaim != null)
                    {
                        var expirationDateTime = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expirationClaim.Value));
                        if (expirationDateTime <= DateTimeOffset.UtcNow)
                        {
                            return false; // Token has expired
                        }
                    }

                    return await AuthenticationService.ValidateUserClaimsAsync(claimsPrincipal.Claims);
                }

                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Refreshes an expired OAuth token.
        /// </summary>
        /// <param name="refreshToken">The refresh token.</param>
        /// <returns>The new OAuth token response.</returns>
        public async Task<OAuthTokenResponse> RefreshTokenAsync(string refreshToken)
        {
            var tokenEndpoint = Configuration["OAuth:TokenEndpoint"];
            var clientId = Configuration["OAuth:ClientId"];
            var clientSecret = Configuration["OAuth:ClientSecret"];

            var tokenRequest = new HttpRequestMessage(HttpMethod.Post, tokenEndpoint);
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "refresh_token"),
                new KeyValuePair<string, string>("refresh_token", refreshToken),
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret)
            });
            tokenRequest.Content = content;

            var httpClient = new HttpClient();
            var response = await httpClient.SendAsync(tokenRequest);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            return System.Text.Json.JsonSerializer.Deserialize<OAuthTokenResponse>(responseContent);
        }

        /// <summary>
        /// Revokes an OAuth token.
        /// </summary>
        /// <param name="token">The token to revoke.</param>
        /// <returns>True if the token was successfully revoked, false otherwise.</returns>
        public async Task<bool> RevokeTokenAsync(string token)
        {
            var revokeEndpoint = Configuration["OAuth:RevokeEndpoint"];
            var clientId = Configuration["OAuth:ClientId"];
            var clientSecret = Configuration["OAuth:ClientSecret"];

            var revokeRequest = new HttpRequestMessage(HttpMethod.Post, revokeEndpoint);
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("token", token),
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret)
            });
            revokeRequest.Content = content;

            var httpClient = new HttpClient();
            var response = await httpClient.SendAsync(revokeRequest);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Generates the OAuth authorization URL.
        /// </summary>
        /// <param name="state">The state parameter for CSRF protection.</param>
        /// <param name="scopes">The requested scopes.</param>
        /// <returns>The authorization URL.</returns>
        public string GenerateAuthorizationUrl(string state, string[] scopes)
        {
            var authorizationEndpoint = Configuration["OAuth:AuthorizationEndpoint"];
            var clientId = Configuration["OAuth:ClientId"];
            var redirectUri = Configuration["OAuth:RedirectUri"];

            var queryParams = new Dictionary<string, string>
            {
                { "client_id", clientId },
                { "response_type", "code" },
                { "redirect_uri", redirectUri },
                { "state", state },
                { "scope", string.Join(" ", scopes) }
            };

            var queryString = string.Join("&", queryParams.Select(kvp => $"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value)}"));
            return $"{authorizationEndpoint}?{queryString}";
        }
    }

    /// <summary>
    /// Represents the response from an OAuth token request.
    /// </summary>
    public class OAuthTokenResponse
    {
        public string AccessToken { get; set; }
        public string TokenType { get; set; }
        public int ExpiresIn { get; set; }
        public string RefreshToken { get; set; }
        public string Scope { get; set; }
    }
}