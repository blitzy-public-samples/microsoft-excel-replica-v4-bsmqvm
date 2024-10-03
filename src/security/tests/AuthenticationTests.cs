using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Microsoft.Excel.Security.Authentication;

namespace Microsoft.Excel.Security.Tests
{
    [TestClass]
    public class AuthenticationTests
    {
        private Mock<IAuthProvider> _mockAuthProvider;
        private IAuthenticationService _authService;

        [TestInitialize]
        public void SetUp()
        {
            // Initialize the mock auth provider
            _mockAuthProvider = new Mock<IAuthProvider>();

            // Create an instance of AuthenticationService with mocked dependencies
            _authService = new AuthenticationService(_mockAuthProvider.Object);
        }

        [TestMethod]
        public async Task TestAuthenticateAsync_ValidCredentials_ReturnsSuccessResult()
        {
            // Arrange
            string validUsername = "testuser";
            string validPassword = "testpassword";
            _mockAuthProvider.Setup(p => p.ValidateCredentialsAsync(validUsername, validPassword))
                .ReturnsAsync(true);

            // Act
            AuthResult result = await _authService.AuthenticateAsync(validUsername, validPassword);

            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsNotNull(result.Token);
            Assert.AreEqual("Authentication successful", result.Message);
        }

        [TestMethod]
        public async Task TestAuthenticateAsync_InvalidCredentials_ReturnsFailureResult()
        {
            // Arrange
            string invalidUsername = "invaliduser";
            string invalidPassword = "invalidpassword";
            _mockAuthProvider.Setup(p => p.ValidateCredentialsAsync(invalidUsername, invalidPassword))
                .ReturnsAsync(false);

            // Act
            AuthResult result = await _authService.AuthenticateAsync(invalidUsername, invalidPassword);

            // Assert
            Assert.IsFalse(result.Success);
            Assert.IsNull(result.Token);
            Assert.AreEqual("Invalid username or password", result.Message);
        }

        [TestMethod]
        public async Task TestValidateTokenAsync_ValidToken_ReturnsTrue()
        {
            // Arrange
            string validToken = "valid_token_123";
            _mockAuthProvider.Setup(p => p.ValidateTokenAsync(validToken))
                .ReturnsAsync(true);

            // Act
            bool isValid = await _authService.ValidateTokenAsync(validToken);

            // Assert
            Assert.IsTrue(isValid);
        }

        [TestMethod]
        public async Task TestValidateTokenAsync_InvalidToken_ReturnsFalse()
        {
            // Arrange
            string invalidToken = "invalid_token_456";
            _mockAuthProvider.Setup(p => p.ValidateTokenAsync(invalidToken))
                .ReturnsAsync(false);

            // Act
            bool isValid = await _authService.ValidateTokenAsync(invalidToken);

            // Assert
            Assert.IsFalse(isValid);
        }

        [TestMethod]
        public async Task TestEnableMFAAsync_ValidUser_ReturnsTrue()
        {
            // Arrange
            string validUserId = "user123";
            _mockAuthProvider.Setup(p => p.EnableMFAAsync(validUserId))
                .ReturnsAsync(true);

            // Act
            bool result = await _authService.EnableMFAAsync(validUserId);

            // Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public async Task TestEnableMFAAsync_InvalidUser_ReturnsFalse()
        {
            // Arrange
            string invalidUserId = "invaliduser456";
            _mockAuthProvider.Setup(p => p.EnableMFAAsync(invalidUserId))
                .ReturnsAsync(false);

            // Act
            bool result = await _authService.EnableMFAAsync(invalidUserId);

            // Assert
            Assert.IsFalse(result);
        }
    }
}