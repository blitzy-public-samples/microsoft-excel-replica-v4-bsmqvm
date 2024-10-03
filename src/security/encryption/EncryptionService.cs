using System;
using System.IO;
using System.Security.Cryptography;
using System.Net.Security;
using System.Security.Authentication;

namespace Microsoft.Excel.Security.Encryption
{
    /// <summary>
    /// This class serves as the main entry point for encryption-related operations in the Microsoft Excel application.
    /// It coordinates different encryption methods and provides a unified interface for secure data handling.
    /// </summary>
    public class EncryptionService
    {
        private readonly AesEncryption _aesEncryption;
        private readonly TlsHandler _tlsHandler;
        private readonly FileEncryption _fileEncryption;

        public EncryptionService(AesEncryption aesEncryption, TlsHandler tlsHandler, FileEncryption fileEncryption)
        {
            _aesEncryption = aesEncryption ?? throw new ArgumentNullException(nameof(aesEncryption));
            _tlsHandler = tlsHandler ?? throw new ArgumentNullException(nameof(tlsHandler));
            _fileEncryption = fileEncryption ?? throw new ArgumentNullException(nameof(fileEncryption));
        }

        /// <summary>
        /// Encrypts the provided data using AES encryption.
        /// </summary>
        /// <param name="data">The data to be encrypted.</param>
        /// <param name="key">The encryption key.</param>
        /// <returns>Encrypted data as a byte array.</returns>
        public byte[] EncryptData(byte[] data, string key)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty.", nameof(data));
            }

            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentException("Key cannot be null or empty.", nameof(key));
            }

            byte[] iv = _aesEncryption.GenerateIV();
            byte[] encryptedData = _aesEncryption.Encrypt(data, key, iv);

            // Combine IV and encrypted data
            byte[] result = new byte[iv.Length + encryptedData.Length];
            Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
            Buffer.BlockCopy(encryptedData, 0, result, iv.Length, encryptedData.Length);

            return result;
        }

        /// <summary>
        /// Decrypts the provided encrypted data using AES decryption.
        /// </summary>
        /// <param name="encryptedData">The encrypted data to be decrypted.</param>
        /// <param name="key">The decryption key.</param>
        /// <returns>Decrypted data as a byte array.</returns>
        public byte[] DecryptData(byte[] encryptedData, string key)
        {
            if (encryptedData == null || encryptedData.Length == 0)
            {
                throw new ArgumentException("Encrypted data cannot be null or empty.", nameof(encryptedData));
            }

            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentException("Key cannot be null or empty.", nameof(key));
            }

            // Extract IV from the encrypted data
            byte[] iv = new byte[16]; // Assuming 128-bit IV
            Buffer.BlockCopy(encryptedData, 0, iv, 0, iv.Length);

            // Extract the actual encrypted data
            byte[] actualEncryptedData = new byte[encryptedData.Length - iv.Length];
            Buffer.BlockCopy(encryptedData, iv.Length, actualEncryptedData, 0, actualEncryptedData.Length);

            return _aesEncryption.Decrypt(actualEncryptedData, key, iv);
        }

        /// <summary>
        /// Encrypts the specified Excel file using the provided password.
        /// </summary>
        /// <param name="filePath">The path of the Excel file to be encrypted.</param>
        /// <param name="password">The password for encryption.</param>
        public void EncryptFile(string filePath, string password)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));
            }

            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentException("Password cannot be null or empty.", nameof(password));
            }

            _fileEncryption.EncryptFile(filePath, password);
        }

        /// <summary>
        /// Decrypts the specified encrypted Excel file using the provided password.
        /// </summary>
        /// <param name="filePath">The path of the encrypted Excel file to be decrypted.</param>
        /// <param name="password">The password for decryption.</param>
        public void DecryptFile(string filePath, string password)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));
            }

            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentException("Password cannot be null or empty.", nameof(password));
            }

            _fileEncryption.DecryptFile(filePath, password);
        }

        /// <summary>
        /// Configures the TLS settings for secure communication.
        /// </summary>
        /// <param name="protocols">The SSL protocols to be used.</param>
        /// <param name="checkCertificateRevocation">Whether to check for certificate revocation.</param>
        public void ConfigureTlsSettings(SslProtocols protocols, bool checkCertificateRevocation)
        {
            _tlsHandler.ConfigureTlsSettings(protocols, checkCertificateRevocation);
        }

        /// <summary>
        /// Creates a secure SSL/TLS connection for data transmission.
        /// </summary>
        /// <param name="innerStream">The underlying stream to secure.</param>
        /// <param name="leaveInnerStreamOpen">Whether to leave the inner stream open when the SslStream is disposed.</param>
        /// <param name="validationCallback">The remote certificate validation callback.</param>
        /// <returns>A secure SSL/TLS stream.</returns>
        public SslStream CreateSecureConnection(Stream innerStream, bool leaveInnerStreamOpen, RemoteCertificateValidationCallback validationCallback)
        {
            if (innerStream == null)
            {
                throw new ArgumentNullException(nameof(innerStream));
            }

            if (validationCallback == null)
            {
                throw new ArgumentNullException(nameof(validationCallback));
            }

            return _tlsHandler.CreateTlsStream(innerStream, leaveInnerStreamOpen, validationCallback);
        }
    }
}