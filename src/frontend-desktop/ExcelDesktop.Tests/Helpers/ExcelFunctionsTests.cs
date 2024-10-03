using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using ExcelDesktop.Helpers;

namespace ExcelDesktop.Tests.Helpers
{
    [TestClass]
    public class ExcelFunctionsTests
    {
        [TestMethod]
        public void TestSUM()
        {
            // Prepare test data
            double[] numbers = { 1, 2, 3, 4, 5 };
            double expected = 15;

            // Call the SUM function
            double result = ExcelFunctions.SUM(numbers);

            // Assert the result
            Assert.AreEqual(expected, result, 0.001, "SUM function failed to calculate the correct sum.");

            // Test edge cases
            Assert.AreEqual(0, ExcelFunctions.SUM(new double[] { }), "SUM should return 0 for an empty array.");
            Assert.AreEqual(42, ExcelFunctions.SUM(new double[] { 42 }), "SUM should return the same value for a single element array.");
            Assert.AreEqual(1e10, ExcelFunctions.SUM(new double[] { 5e9, 5e9 }), "SUM should handle large numbers correctly.");
        }

        [TestMethod]
        public void TestAVERAGE()
        {
            // Prepare test data
            double[] numbers = { 2, 4, 6, 8, 10 };
            double expected = 6;

            // Call the AVERAGE function
            double result = ExcelFunctions.AVERAGE(numbers);

            // Assert the result
            Assert.AreEqual(expected, result, 0.001, "AVERAGE function failed to calculate the correct average.");

            // Test edge cases
            Assert.ThrowsException<InvalidOperationException>(() => ExcelFunctions.AVERAGE(new double[] { }), "AVERAGE should throw an exception for an empty array.");
            Assert.AreEqual(42, ExcelFunctions.AVERAGE(new double[] { 42 }), "AVERAGE should return the same value for a single element array.");
            Assert.AreEqual(5e9, ExcelFunctions.AVERAGE(new double[] { 0, 1e10 }), "AVERAGE should handle large numbers correctly.");
        }

        [TestMethod]
        public void TestCOUNT()
        {
            // Prepare test data
            object[] values = { 1, "text", 3.14, null, true, 42 };
            int expected = 3; // Only numeric values should be counted

            // Call the COUNT function
            int result = ExcelFunctions.COUNT(values);

            // Assert the result
            Assert.AreEqual(expected, result, "COUNT function failed to count the correct number of numeric values.");

            // Test edge cases
            Assert.AreEqual(0, ExcelFunctions.COUNT(new object[] { }), "COUNT should return 0 for an empty array.");
            Assert.AreEqual(0, ExcelFunctions.COUNT(new object[] { "text", true, null }), "COUNT should return 0 when there are no numeric values.");
            Assert.AreEqual(1, ExcelFunctions.COUNT(new object[] { 42 }), "COUNT should return 1 for a single numeric value.");
        }

        [TestMethod]
        public void TestMAX()
        {
            // Prepare test data
            double[] numbers = { -5, 0, 10, 3, 8 };
            double expected = 10;

            // Call the MAX function
            double result = ExcelFunctions.MAX(numbers);

            // Assert the result
            Assert.AreEqual(expected, result, 0.001, "MAX function failed to find the correct maximum value.");

            // Test edge cases
            Assert.ThrowsException<InvalidOperationException>(() => ExcelFunctions.MAX(new double[] { }), "MAX should throw an exception for an empty array.");
            Assert.AreEqual(42, ExcelFunctions.MAX(new double[] { 42 }), "MAX should return the same value for a single element array.");
            Assert.AreEqual(-1, ExcelFunctions.MAX(new double[] { -1, -2, -3 }), "MAX should work correctly with negative numbers.");
        }

        [TestMethod]
        public void TestMIN()
        {
            // Prepare test data
            double[] numbers = { 5, 0, -10, 3, -8 };
            double expected = -10;

            // Call the MIN function
            double result = ExcelFunctions.MIN(numbers);

            // Assert the result
            Assert.AreEqual(expected, result, 0.001, "MIN function failed to find the correct minimum value.");

            // Test edge cases
            Assert.ThrowsException<InvalidOperationException>(() => ExcelFunctions.MIN(new double[] { }), "MIN should throw an exception for an empty array.");
            Assert.AreEqual(42, ExcelFunctions.MIN(new double[] { 42 }), "MIN should return the same value for a single element array.");
            Assert.AreEqual(1, ExcelFunctions.MIN(new double[] { 1, 2, 3 }), "MIN should work correctly with positive numbers.");
        }

        [TestMethod]
        public void TestIF()
        {
            // Test cases
            Assert.AreEqual(true, ExcelFunctions.IF(true, true, false), "IF function failed for true condition.");
            Assert.AreEqual(false, ExcelFunctions.IF(false, true, false), "IF function failed for false condition.");
            Assert.AreEqual("Yes", ExcelFunctions.IF(5 > 3, "Yes", "No"), "IF function failed for numeric comparison.");
            Assert.AreEqual(42, ExcelFunctions.IF(string.IsNullOrEmpty(""), 42, 0), "IF function failed for string check.");

            // Test with different data types
            Assert.AreEqual(3.14, ExcelFunctions.IF(true, 3.14, "pi"), "IF function should handle different return types.");
        }

        [TestMethod]
        public void TestVLOOKUP()
        {
            // Prepare test data
            var table = new object[,]
            {
                { "A", 1 },
                { "B", 2 },
                { "C", 3 }
            };

            // Test exact match
            Assert.AreEqual(2, ExcelFunctions.VLOOKUP("B", table, 2, false), "VLOOKUP failed for exact match.");

            // Test approximate match
            Assert.AreEqual(3, ExcelFunctions.VLOOKUP("D", table, 2, true), "VLOOKUP failed for approximate match.");

            // Test not found
            Assert.ThrowsException<KeyNotFoundException>(() => ExcelFunctions.VLOOKUP("D", table, 2, false), "VLOOKUP should throw an exception when key is not found with exact match.");

            // Test invalid column index
            Assert.ThrowsException<ArgumentOutOfRangeException>(() => ExcelFunctions.VLOOKUP("A", table, 3, false), "VLOOKUP should throw an exception for invalid column index.");
        }

        [TestMethod]
        public void TestTODAY()
        {
            // Get the result of TODAY function
            DateTime result = ExcelFunctions.TODAY();

            // Get the current date
            DateTime currentDate = DateTime.Now.Date;

            // Assert that the result matches the current date
            Assert.AreEqual(currentDate, result, "TODAY function failed to return the current date.");

            // Ensure only the date part is returned, without time
            Assert.AreEqual(TimeSpan.Zero, result.TimeOfDay, "TODAY function should return date without time component.");
        }

        [TestMethod]
        public void TestNOW()
        {
            // Get the result of NOW function
            DateTime result = ExcelFunctions.NOW();

            // Get the current date and time
            DateTime currentDateTime = DateTime.Now;

            // Assert that the result is within 1 second of the current date and time
            Assert.IsTrue((currentDateTime - result).Duration() < TimeSpan.FromSeconds(1), "NOW function failed to return the current date and time within 1 second tolerance.");
        }

        [TestMethod]
        public void TestCONCATENATE()
        {
            // Test basic concatenation
            Assert.AreEqual("HelloWorld", ExcelFunctions.CONCATENATE("Hello", "World"), "CONCATENATE failed for basic string concatenation.");

            // Test with multiple arguments
            Assert.AreEqual("ABC123", ExcelFunctions.CONCATENATE("A", "B", "C", "1", "2", "3"), "CONCATENATE failed with multiple arguments.");

            // Test with empty strings
            Assert.AreEqual("Test", ExcelFunctions.CONCATENATE("", "Test", ""), "CONCATENATE should handle empty strings correctly.");

            // Test with null values
            Assert.AreEqual("TestNull", ExcelFunctions.CONCATENATE("Test", null, "Null"), "CONCATENATE should handle null values correctly.");

            // Test with non-string inputs
            Assert.AreEqual("The answer is 42", ExcelFunctions.CONCATENATE("The answer is ", 42), "CONCATENATE should handle non-string inputs correctly.");
        }
    }
}