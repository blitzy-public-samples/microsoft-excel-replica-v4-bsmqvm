using System;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Microsoft.Excel.Security.Authentication
{
    /// <summary>
    /// Implements the Multi-Factor Authentication (MFA) functionality for Microsoft Excel.
    /// </summary>
    public class MultiFactorAuth
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;

        public MultiFactorAuth(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Enables Multi-Factor Authentication for a specific user.
        /// </summary>
        /// <param name="userId">The ID of the user to enable MFA for.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean indicating whether MFA was successfully enabled.</returns>
        public async Task<bool> EnableMfaAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found", nameof(userId));
            }

            await _userManager.SetTwoFactorEnabledAsync(user, true);
            return await _userManager.GetTwoFactorEnabledAsync(user);
        }

        /// <summary>
        /// Disables Multi-Factor Authentication for a specific user.
        /// </summary>
        /// <param name="userId">The ID of the user to disable MFA for.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean indicating whether MFA was successfully disabled.</returns>
        public async Task<bool> DisableMfaAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found", nameof(userId));
            }

            await _userManager.SetTwoFactorEnabledAsync(user, false);
            return !(await _userManager.GetTwoFactorEnabledAsync(user));
        }

        /// <summary>
        /// Generates a two-factor authentication token for the specified user and provider.
        /// </summary>
        /// <param name="userId">The ID of the user to generate the token for.</param>
        /// <param name="provider">The name of the two-factor authentication provider.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the generated two-factor authentication token.</returns>
        public async Task<string> GenerateTwoFactorTokenAsync(string userId, string provider)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found", nameof(userId));
            }

            return await _userManager.GenerateTwoFactorTokenAsync(user, provider);
        }

        /// <summary>
        /// Verifies the two-factor authentication token provided by the user.
        /// </summary>
        /// <param name="userId">The ID of the user to verify the token for.</param>
        /// <param name="provider">The name of the two-factor authentication provider.</param>
        /// <param name="token">The token to verify.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean indicating whether the token is valid.</returns>
        public async Task<bool> VerifyTwoFactorTokenAsync(string userId, string provider, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found", nameof(userId));
            }

            return await _userManager.VerifyTwoFactorTokenAsync(user, provider, token);
        }

        /// <summary>
        /// Retrieves available MFA providers for a user.
        /// </summary>
        /// <param name="userId">The ID of the user to get the providers for.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a collection of available MFA providers.</returns>
        public async Task<IEnumerable<string>> GetAvailableProvidersAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found", nameof(userId));
            }

            return await _userManager.GetValidTwoFactorProvidersAsync(user);
        }

        /// <summary>
        /// Sets the preferred MFA provider for a user.
        /// </summary>
        /// <param name="userId">The ID of the user to set the preferred provider for.</param>
        /// <param name="provider">The name of the preferred MFA provider.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean indicating whether the preferred provider was successfully set.</returns>
        public async Task<bool> SetPreferredProviderAsync(string userId, string provider)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found", nameof(userId));
            }

            var availableProviders = await GetAvailableProvidersAsync(userId);
            if (!availableProviders.Contains(provider))
            {
                throw new ArgumentException("Invalid provider", nameof(provider));
            }

            await _userManager.SetAuthenticationTokenAsync(user, "MFA", "PreferredProvider", provider);
            return true;
        }
    }
}