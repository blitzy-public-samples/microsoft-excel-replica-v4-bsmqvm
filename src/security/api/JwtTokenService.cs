using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IO;

namespace Microsoft.Excel.Security.Api
{
    /// <summary>
    /// Implements the JWT token service for handling token-related operations in Microsoft Excel.
    /// </summary>
    public class JwtTokenService
    {
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler;
        private readonly string _jwtSecretKey;
        private readonly int _tokenExpirationMinutes;

        /// <summary>
        /// Initializes a new instance of the JwtTokenService class.
        /// </summary>
        public JwtTokenService()
        {
            _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            LoadJwtConfiguration();
        }

        /// <summary>
        /// Generates a JWT token for the given user ID and roles.
        /// </summary>
        /// <param name="userId">The user ID for which the token is generated.</param>
        /// <param name="roles">The roles associated with the user.</param>
        /// <returns>A Task containing the generated JWT token as a string.</returns>
        public async Task<string> GenerateTokenAsync(string userId, IEnumerable<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtSecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "Microsoft Excel",
                audience: "Excel Users",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_tokenExpirationMinutes),
                signingCredentials: credentials
            );

            return await Task.FromResult(_jwtSecurityTokenHandler.WriteToken(token));
        }

        /// <summary>
        /// Validates the given JWT token.
        /// </summary>
        /// <param name="token">The JWT token to validate.</param>
        /// <returns>A Task containing a boolean indicating whether the token is valid.</returns>
        public async Task<bool> ValidateTokenAsync(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtSecretKey)),
                ValidateIssuer = true,
                ValidIssuer = "Microsoft Excel",
                ValidateAudience = true,
                ValidAudience = "Excel Users",
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                var principal = _jwtSecurityTokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        /// <summary>
        /// Refreshes the given JWT token, extending its expiration time.
        /// </summary>
        /// <param name="token">The JWT token to refresh.</param>
        /// <returns>A Task containing the refreshed JWT token as a string.</returns>
        public async Task<string> RefreshTokenAsync(string token)
        {
            if (!await ValidateTokenAsync(token))
            {
                throw new SecurityTokenException("Invalid token");
            }

            var jwtToken = _jwtSecurityTokenHandler.ReadJwtToken(token);
            var userId = jwtToken.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var roles = jwtToken.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);

            return await GenerateTokenAsync(userId, roles);
        }

        /// <summary>
        /// Decodes a JWT token and extracts its claims.
        /// </summary>
        /// <param name="token">The JWT token to decode.</param>
        /// <returns>A Task containing a dictionary of claims.</returns>
        public async Task<IDictionary<string, object>> DecodeTokenAsync(string token)
        {
            var jwtToken = _jwtSecurityTokenHandler.ReadJwtToken(token);
            var claims = jwtToken.Claims.ToDictionary(c => c.Type, c => (object)c.Value);
            return await Task.FromResult(claims);
        }

        /// <summary>
        /// Revokes a JWT token, making it invalid.
        /// </summary>
        /// <param name="token">The JWT token to revoke.</param>
        /// <returns>A Task containing a boolean indicating whether the token was successfully revoked.</returns>
        public async Task<bool> RevokeTokenAsync(string token)
        {
            // In a real-world scenario, you would typically add the token to a blacklist or
            // revocation list stored in a database or distributed cache.
            // For this example, we'll just return true to simulate a successful revocation.
            return await Task.FromResult(true);
        }

        private void LoadJwtConfiguration()
        {
            var configPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "SecurityConfig.json");
            var configJson = File.ReadAllText(configPath);
            var config = JsonConvert.DeserializeObject<Dictionary<string, object>>(configJson);

            _jwtSecretKey = config["JWT_SECRET_KEY"].ToString();
            _tokenExpirationMinutes = Convert.ToInt32(config["TOKEN_EXPIRATION_MINUTES"]);
        }
    }
}