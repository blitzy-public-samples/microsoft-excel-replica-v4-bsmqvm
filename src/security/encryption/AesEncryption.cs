using System;
using System.Security.Cryptography;
using System.IO;

namespace Microsoft.Excel.Security.Encryption
{
    /// <summary>
    /// This class encapsulates the AES encryption and decryption functionality for Microsoft Excel.
    /// It provides a secure method for protecting sensitive data within the application.
    /// </summary>
    public class AesEncryption
    {
        private const int KeySize = 256;
        private const int BlockSize = 128;

        /// <summary>
        /// Encrypts the given plaintext using AES encryption with the provided key and initialization vector (IV).
        /// </summary>
        /// <param name="plainText">The data to be encrypted.</param>
        /// <param name="key">The encryption key.</param>
        /// <param name="iv">The initialization vector.</param>
        /// <returns>Encrypted data as byte array.</returns>
        public static byte[] Encrypt(byte[] plainText, byte[] key, byte[] iv)
        {
            if (plainText == null || plainText.Length <= 0)
                throw new ArgumentNullException(nameof(plainText), "PlainText cannot be empty");
            if (key == null || key.Length <= 0)
                throw new ArgumentNullException(nameof(key), "Key cannot be empty");
            if (iv == null || iv.Length <= 0)
                throw new ArgumentNullException(nameof(iv), "IV cannot be empty");

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;
                aesAlg.KeySize = KeySize;
                aesAlg.BlockSize = BlockSize;
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        csEncrypt.Write(plainText, 0, plainText.Length);
                        csEncrypt.FlushFinalBlock();
                        return msEncrypt.ToArray();
                    }
                }
            }
        }

        /// <summary>
        /// Decrypts the given ciphertext using AES decryption with the provided key and initialization vector (IV).
        /// </summary>
        /// <param name="cipherText">The data to be decrypted.</param>
        /// <param name="key">The decryption key.</param>
        /// <param name="iv">The initialization vector.</param>
        /// <returns>Decrypted data as byte array.</returns>
        public static byte[] Decrypt(byte[] cipherText, byte[] key, byte[] iv)
        {
            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException(nameof(cipherText), "CipherText cannot be empty");
            if (key == null || key.Length <= 0)
                throw new ArgumentNullException(nameof(key), "Key cannot be empty");
            if (iv == null || iv.Length <= 0)
                throw new ArgumentNullException(nameof(iv), "IV cannot be empty");

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;
                aesAlg.KeySize = KeySize;
                aesAlg.BlockSize = BlockSize;
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (MemoryStream resultStream = new MemoryStream())
                        {
                            csDecrypt.CopyTo(resultStream);
                            return resultStream.ToArray();
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Generates a random AES encryption key.
        /// </summary>
        /// <returns>Random AES encryption key as byte array.</returns>
        public static byte[] GenerateKey()
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.KeySize = KeySize;
                aesAlg.GenerateKey();
                return aesAlg.Key;
            }
        }

        /// <summary>
        /// Generates a random initialization vector (IV) for AES encryption.
        /// </summary>
        /// <returns>Random initialization vector as byte array.</returns>
        public static byte[] GenerateIV()
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.BlockSize = BlockSize;
                aesAlg.GenerateIV();
                return aesAlg.IV;
            }
        }
    }
}