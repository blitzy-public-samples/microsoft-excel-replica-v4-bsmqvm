using System;
using System.Net.Security;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;
using System.IO;

namespace Microsoft.Excel.Security.Encryption
{
    /// <summary>
    /// This class encapsulates the functionality for handling TLS encryption in the Microsoft Excel application.
    /// </summary>
    public class TlsHandler
    {
        /// <summary>
        /// Gets or sets the supported SSL/TLS protocols.
        /// </summary>
        public SslProtocols SupportedProtocols { get; private set; }

        /// <summary>
        /// Initializes a new instance of the TlsHandler class.
        /// </summary>
        public TlsHandler()
        {
            // Initialize SupportedProtocols property with TLS 1.3 as per the technical specification
            SupportedProtocols = SslProtocols.Tls13;
            SetDefaultTlsConfiguration();
        }

        /// <summary>
        /// Sets the default TLS configuration.
        /// </summary>
        private void SetDefaultTlsConfiguration()
        {
            // Implement default TLS configuration
            // This method can be expanded in the future if needed
        }

        /// <summary>
        /// Configures the TLS settings for the application, including the allowed protocols and certificate revocation checking.
        /// </summary>
        /// <param name="protocols">The SSL/TLS protocols to be allowed.</param>
        /// <param name="checkCertificateRevocation">Whether to check for certificate revocation.</param>
        public void ConfigureTlsSettings(SslProtocols protocols, bool checkCertificateRevocation)
        {
            // Set the allowed SSL/TLS protocols
            SupportedProtocols = protocols;

            // Configure certificate revocation checking
            ServicePointManager.CheckCertificateRevocationList = checkCertificateRevocation;

            // Log the configuration change
            // Note: Actual logging implementation will depend on the logging framework used in the project
            Console.WriteLine($"TLS settings configured. Protocols: {protocols}, Check Revocation: {checkCertificateRevocation}");
        }

        /// <summary>
        /// Validates the provided X.509 certificate to ensure it meets the security requirements.
        /// </summary>
        /// <param name="certificate">The X.509 certificate to validate.</param>
        /// <returns>True if the certificate is valid, false otherwise.</returns>
        public bool ValidateCertificate(X509Certificate2 certificate)
        {
            // Check the certificate's validity period
            if (DateTime.Now < certificate.NotBefore || DateTime.Now > certificate.NotAfter)
            {
                return false;
            }

            // Verify the certificate's trust chain
            using (var chain = new X509Chain())
            {
                chain.ChainPolicy.RevocationFlag = X509RevocationFlag.EntireChain;
                chain.ChainPolicy.RevocationMode = X509RevocationMode.Online;
                chain.ChainPolicy.VerificationFlags = X509VerificationFlags.NoFlag;

                if (!chain.Build(certificate))
                {
                    return false;
                }
            }

            // Perform additional custom validation checks
            // Add any specific validation logic required for your application

            // Return the validation result
            return true;
        }

        /// <summary>
        /// Creates a new SSL/TLS stream for secure communication.
        /// </summary>
        /// <param name="innerStream">The underlying stream to secure.</param>
        /// <param name="leaveInnerStreamOpen">Whether to leave the inner stream open when the SslStream is disposed.</param>
        /// <param name="validationCallback">The remote certificate validation callback.</param>
        /// <returns>A new SSL/TLS stream for secure communication.</returns>
        public SslStream CreateTlsStream(Stream innerStream, bool leaveInnerStreamOpen, RemoteCertificateValidationCallback validationCallback)
        {
            // Create a new SslStream instance
            var sslStream = new SslStream(innerStream, leaveInnerStreamOpen, validationCallback);

            // Configure the SSL/TLS settings
            var sslClientAuthenticationOptions = new SslClientAuthenticationOptions
            {
                EnabledSslProtocols = SupportedProtocols,
                CertificateRevocationCheckMode = X509RevocationMode.Online
            };

            try
            {
                // Perform the SSL/TLS handshake
                sslStream.AuthenticateAsClient(sslClientAuthenticationOptions);
            }
            catch (AuthenticationException ex)
            {
                // Handle authentication failure
                Console.WriteLine($"SSL/TLS authentication failed: {ex.Message}");
                sslStream.Dispose();
                throw;
            }

            // Return the configured SslStream
            return sslStream;
        }
    }
}