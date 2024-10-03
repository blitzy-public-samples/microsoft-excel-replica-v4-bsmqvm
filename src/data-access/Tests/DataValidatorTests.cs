using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Microsoft.Excel.DataAccess.Tests
{
    [TestClass]
    public class DataValidatorTests
    {
        private DataValidator _dataValidator;
        private Mock<IDataSource> _mockDataSource;

        [TestInitialize]
        public void TestInitialize()
        {
            _mockDataSource = new Mock<IDataSource>();
            _dataValidator = new DataValidator(_mockDataSource.Object);
        }

        [TestMethod]
        public void TestValidateDataType()
        {
            // Test valid inputs for different data types
            Assert.IsTrue(_dataValidator.ValidateDataType("123", "Integer"));
            Assert.IsTrue(_dataValidator.ValidateDataType("3.14", "Decimal"));
            Assert.IsTrue(_dataValidator.ValidateDataType("true", "Boolean"));
            Assert.IsTrue(_dataValidator.ValidateDataType("2023-05-20", "Date"));
            Assert.IsTrue(_dataValidator.ValidateDataType("Hello, World!", "String"));

            // Test invalid inputs for different data types
            Assert.IsFalse(_dataValidator.ValidateDataType("abc", "Integer"));
            Assert.IsFalse(_dataValidator.ValidateDataType("1.2.3", "Decimal"));
            Assert.IsFalse(_dataValidator.ValidateDataType("yes", "Boolean"));
            Assert.IsFalse(_dataValidator.ValidateDataType("2023-13-01", "Date"));
        }

        [TestMethod]
        public void TestValidateRange()
        {
            // Test values within the specified range
            Assert.IsTrue(_dataValidator.ValidateRange(5, 1, 10));
            Assert.IsTrue(_dataValidator.ValidateRange(1.5, 0, 2));

            // Test values outside the specified range
            Assert.IsFalse(_dataValidator.ValidateRange(0, 1, 10));
            Assert.IsFalse(_dataValidator.ValidateRange(11, 1, 10));

            // Test edge cases (minimum and maximum values)
            Assert.IsTrue(_dataValidator.ValidateRange(1, 1, 10));
            Assert.IsTrue(_dataValidator.ValidateRange(10, 1, 10));
        }

        [TestMethod]
        public void TestValidatePattern()
        {
            // Test strings that match the specified pattern
            Assert.IsTrue(_dataValidator.ValidatePattern("abc123", @"^[a-z]+\d+$"));
            Assert.IsTrue(_dataValidator.ValidatePattern("test@example.com", @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"));

            // Test strings that do not match the specified pattern
            Assert.IsFalse(_dataValidator.ValidatePattern("123abc", @"^[a-z]+\d+$"));
            Assert.IsFalse(_dataValidator.ValidatePattern("invalid-email", @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"));

            // Test edge cases (empty string, null)
            Assert.IsFalse(_dataValidator.ValidatePattern("", @"^[a-z]+\d+$"));
            Assert.IsFalse(_dataValidator.ValidatePattern(null, @"^[a-z]+\d+$"));
        }

        [TestMethod]
        public async Task TestValidateUniqueness()
        {
            // Configure the mock to return expected results for different scenarios
            _mockDataSource.Setup(ds => ds.IsValueUnique("column1", "unique_value")).ReturnsAsync(true);
            _mockDataSource.Setup(ds => ds.IsValueUnique("column1", "duplicate_value")).ReturnsAsync(false);

            // Test unique values
            Assert.IsTrue(await _dataValidator.ValidateUniqueness("column1", "unique_value"));

            // Test non-unique values
            Assert.IsFalse(await _dataValidator.ValidateUniqueness("column1", "duplicate_value"));

            // Test edge cases (null, empty string)
            Assert.IsFalse(await _dataValidator.ValidateUniqueness("column1", null));
            Assert.IsFalse(await _dataValidator.ValidateUniqueness("column1", ""));
        }

        [TestMethod]
        public async Task TestValidateReferentialIntegrity()
        {
            // Configure the mock to return expected results for different scenarios
            _mockDataSource.Setup(ds => ds.DoesValueExist("referenced_table", "id", "existing_value")).ReturnsAsync(true);
            _mockDataSource.Setup(ds => ds.DoesValueExist("referenced_table", "id", "non_existing_value")).ReturnsAsync(false);

            // Test values that exist in the referenced table
            Assert.IsTrue(await _dataValidator.ValidateReferentialIntegrity("referenced_table", "id", "existing_value"));

            // Test values that do not exist in the referenced table
            Assert.IsFalse(await _dataValidator.ValidateReferentialIntegrity("referenced_table", "id", "non_existing_value"));

            // Test edge cases (null, empty string)
            Assert.IsFalse(await _dataValidator.ValidateReferentialIntegrity("referenced_table", "id", null));
            Assert.IsFalse(await _dataValidator.ValidateReferentialIntegrity("referenced_table", "id", ""));
        }
    }
}