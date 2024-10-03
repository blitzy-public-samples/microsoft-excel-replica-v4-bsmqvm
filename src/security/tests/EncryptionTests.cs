using System;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Excel.Security.Encryption;

namespace Microsoft.Excel.Security.Tests
{
    [TestClass]
    public class EncryptionTests
    {
        private AesEncryption _aesEncryption;
        private EncryptionService _encryptionService;

        [TestInitialize]
        public void TestInitialize()
        {
            _aesEncryption = new AesEncryption();
            _encryptionService = new EncryptionService();
        }

        [TestMethod]
        public void TestAesEncryption()
        {
            // Arrange
            string plaintext = "This is a test plaintext for AES encryption";
            byte[] key = _aesEncryption.GenerateKey();
            byte[] iv = _aesEncryption.GenerateIV();

            // Act
            byte[] encryptedData = _aesEncryption.Encrypt(Encoding.UTF8.GetBytes(plaintext), key, iv);
            byte[] decryptedData = _aesEncryption.Decrypt(encryptedData, key, iv);
            string decryptedText = Encoding.UTF8.GetString(decryptedData);

            // Assert
            Assert.AreEqual(plaintext, decryptedText, "The decrypted text should match the original plaintext");
        }

        [TestMethod]
        public void TestAesEncryptionParameters()
        {
            // Test encryption with empty input
            Assert.ThrowsException<ArgumentNullException>(() => _aesEncryption.Encrypt(null, new byte[32], new byte[16]));

            // Test encryption with invalid key size
            Assert.ThrowsException<ArgumentException>(() => _aesEncryption.Encrypt(new byte[10], new byte[10], new byte[16]));

            // Test encryption with invalid IV size
            Assert.ThrowsException<ArgumentException>(() => _aesEncryption.Encrypt(new byte[10], new byte[32], new byte[10]));
        }

        [TestMethod]
        public void TestAesEncryptionPerformance()
        {
            // Arrange
            byte[] smallData = new byte[1024]; // 1 KB
            byte[] mediumData = new byte[1024 * 1024]; // 1 MB
            byte[] largeData = new byte[10 * 1024 * 1024]; // 10 MB
            new Random().NextBytes(largeData);
            byte[] key = _aesEncryption.GenerateKey();
            byte[] iv = _aesEncryption.GenerateIV();

            // Act & Assert
            TestEncryptionPerformance(smallData, key, iv, 10); // Should be very fast
            TestEncryptionPerformance(mediumData, key, iv, 100); // Should be reasonably fast
            TestEncryptionPerformance(largeData, key, iv, 1000); // Should be completed within a reasonable time
        }

        private void TestEncryptionPerformance(byte[] data, byte[] key, byte[] iv, int maxMilliseconds)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();
            byte[] encryptedData = _aesEncryption.Encrypt(data, key, iv);
            byte[] decryptedData = _aesEncryption.Decrypt(encryptedData, key, iv);
            stopwatch.Stop();

            Assert.IsTrue(stopwatch.ElapsedMilliseconds < maxMilliseconds, 
                $"Encryption and decryption of {data.Length} bytes took longer than {maxMilliseconds} ms");
            CollectionAssert.AreEqual(data, decryptedData, "Decrypted data should match the original data");
        }

        [TestMethod]
        public void TestFileEncryption()
        {
            // Arrange
            string testFilePath = "test_excel_file.xlsx";
            string encryptedFilePath = "encrypted_test_excel_file.xlsx";
            string decryptedFilePath = "decrypted_test_excel_file.xlsx";
            byte[] originalContent = Encoding.UTF8.GetBytes("This is a test Excel file content");
            System.IO.File.WriteAllBytes(testFilePath, originalContent);

            // Act
            _encryptionService.EncryptFile(testFilePath, encryptedFilePath, "test_password");
            _encryptionService.DecryptFile(encryptedFilePath, decryptedFilePath, "test_password");

            // Assert
            byte[] decryptedContent = System.IO.File.ReadAllBytes(decryptedFilePath);
            CollectionAssert.AreEqual(originalContent, decryptedContent, "Decrypted file content should match the original content");

            // Clean up
            System.IO.File.Delete(testFilePath);
            System.IO.File.Delete(encryptedFilePath);
            System.IO.File.Delete(decryptedFilePath);
        }

        [TestMethod]
        public void TestEncryptionWithUserDefinedPassword()
        {
            // Arrange
            string plaintext = "Sensitive Excel data";
            string password = "UserDefinedPassword123!";

            // Act
            string encryptedData = _encryptionService.EncryptWithPassword(plaintext, password);
            string decryptedData = _encryptionService.DecryptWithPassword(encryptedData, password);

            // Assert
            Assert.AreEqual(plaintext, decryptedData, "Decrypted data should match the original plaintext");
        }

        [TestMethod]
        public void TestDecryptionWithIncorrectPassword()
        {
            // Arrange
            string plaintext = "Sensitive Excel data";
            string correctPassword = "CorrectPassword123!";
            string incorrectPassword = "IncorrectPassword456!";

            // Act
            string encryptedData = _encryptionService.EncryptWithPassword(plaintext, correctPassword);

            // Assert
            Assert.ThrowsException<InvalidOperationException>(() => 
                _encryptionService.DecryptWithPassword(encryptedData, incorrectPassword),
                "Decryption with incorrect password should throw an exception");
        }

        [TestMethod]
        public void TestEncryptionKeyGeneration()
        {
            // Arrange & Act
            byte[] key1 = _aesEncryption.GenerateKey();
            byte[] key2 = _aesEncryption.GenerateKey();

            // Assert
            Assert.AreEqual(32, key1.Length, "Generated key should be 256 bits (32 bytes) long");
            Assert.AreEqual(32, key2.Length, "Generated key should be 256 bits (32 bytes) long");
            CollectionAssert.AreNotEqual(key1, key2, "Generated keys should be unique");
        }

        [TestMethod]
        public void TestInitializationVectorGeneration()
        {
            // Arrange & Act
            byte[] iv1 = _aesEncryption.GenerateIV();
            byte[] iv2 = _aesEncryption.GenerateIV();

            // Assert
            Assert.AreEqual(16, iv1.Length, "Generated IV should be 128 bits (16 bytes) long");
            Assert.AreEqual(16, iv2.Length, "Generated IV should be 128 bits (16 bytes) long");
            CollectionAssert.AreNotEqual(iv1, iv2, "Generated IVs should be unique");
        }
    }
}