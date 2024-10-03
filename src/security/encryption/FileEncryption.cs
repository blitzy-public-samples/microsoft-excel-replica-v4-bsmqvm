using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.Excel.Security.Encryption
{
    /// <summary>
    /// This class is responsible for handling the encryption and decryption of Excel files.
    /// </summary>
    public class FileEncryption
    {
        private readonly AesEncryption _aesEncryption;
        private readonly EncryptionService _encryptionService;

        public FileEncryption(AesEncryption aesEncryption, EncryptionService encryptionService)
        {
            _aesEncryption = aesEncryption ?? throw new ArgumentNullException(nameof(aesEncryption));
            _encryptionService = encryptionService ?? throw new ArgumentNullException(nameof(encryptionService));
        }

        /// <summary>
        /// Encrypts the specified Excel file using the provided password.
        /// </summary>
        /// <param name="filePath">The path to the Excel file to be encrypted.</param>
        /// <param name="password">The password to use for encryption.</param>
        public async Task EncryptFileAsync(string filePath, string password)
        {
            ValidateInputParameters(filePath, password);

            try
            {
                byte[] fileContent = await File.ReadAllBytesAsync(filePath);
                byte[] salt = _encryptionService.GenerateSalt();
                byte[] key = _encryptionService.DeriveKeyFromPassword(password, salt);
                byte[] iv = _encryptionService.GenerateIV();

                byte[] encryptedContent = _aesEncryption.Encrypt(fileContent, key, iv);

                byte[] encryptedFile = CombineEncryptedData(salt, iv, encryptedContent);

                await File.WriteAllBytesAsync(filePath, encryptedFile);
            }
            catch (Exception ex)
            {
                throw new EncryptionException("Error occurred while encrypting the file.", ex);
            }
        }

        /// <summary>
        /// Decrypts the specified encrypted Excel file using the provided password.
        /// </summary>
        /// <param name="filePath">The path to the encrypted Excel file to be decrypted.</param>
        /// <param name="password">The password to use for decryption.</param>
        public async Task DecryptFileAsync(string filePath, string password)
        {
            ValidateInputParameters(filePath, password);

            try
            {
                byte[] encryptedFile = await File.ReadAllBytesAsync(filePath);

                (byte[] salt, byte[] iv, byte[] encryptedContent) = ExtractEncryptedData(encryptedFile);

                byte[] key = _encryptionService.DeriveKeyFromPassword(password, salt);

                byte[] decryptedContent = _aesEncryption.Decrypt(encryptedContent, key, iv);

                await File.WriteAllBytesAsync(filePath, decryptedContent);
            }
            catch (Exception ex)
            {
                throw new DecryptionException("Error occurred while decrypting the file.", ex);
            }
        }

        /// <summary>
        /// Checks if the specified Excel file is encrypted.
        /// </summary>
        /// <param name="filePath">The path of the file to check.</param>
        /// <returns>True if the file is encrypted, false otherwise.</returns>
        public bool ValidateFileEncryption(string filePath)
        {
            if (string.IsNullOrWhiteSpace(filePath))
            {
                throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));
            }

            try
            {
                using (var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                {
                    byte[] header = new byte[8];
                    fileStream.Read(header, 0, 8);

                    // Check for the encryption signature
                    return BitConverter.ToString(header) == "D0-CF-11-E0-A1-B1-1A-E1";
                }
            }
            catch (Exception ex)
            {
                throw new FileAccessException("Error occurred while accessing the file.", ex);
            }
        }

        private void ValidateInputParameters(string filePath, string password)
        {
            if (string.IsNullOrWhiteSpace(filePath))
            {
                throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));
            }

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Password cannot be null or empty.", nameof(password));
            }
        }

        private byte[] CombineEncryptedData(byte[] salt, byte[] iv, byte[] encryptedContent)
        {
            byte[] result = new byte[salt.Length + iv.Length + encryptedContent.Length];
            Buffer.BlockCopy(salt, 0, result, 0, salt.Length);
            Buffer.BlockCopy(iv, 0, result, salt.Length, iv.Length);
            Buffer.BlockCopy(encryptedContent, 0, result, salt.Length + iv.Length, encryptedContent.Length);
            return result;
        }

        private (byte[] salt, byte[] iv, byte[] encryptedContent) ExtractEncryptedData(byte[] encryptedFile)
        {
            const int saltSize = 32;
            const int ivSize = 16;

            byte[] salt = new byte[saltSize];
            byte[] iv = new byte[ivSize];
            byte[] encryptedContent = new byte[encryptedFile.Length - saltSize - ivSize];

            Buffer.BlockCopy(encryptedFile, 0, salt, 0, saltSize);
            Buffer.BlockCopy(encryptedFile, saltSize, iv, 0, ivSize);
            Buffer.BlockCopy(encryptedFile, saltSize + ivSize, encryptedContent, 0, encryptedContent.Length);

            return (salt, iv, encryptedContent);
        }
    }

    public class EncryptionException : Exception
    {
        public EncryptionException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class DecryptionException : Exception
    {
        public DecryptionException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class FileAccessException : Exception
    {
        public FileAccessException(string message, Exception innerException) : base(message, innerException) { }
    }
}