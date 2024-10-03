using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This class provides methods for validating data before it is processed or stored in the data access layer of Microsoft Excel.
    /// </summary>
    public class DataValidator
    {
        private readonly IDataSource _dataSource;

        public DataValidator(IDataSource dataSource)
        {
            _dataSource = dataSource ?? throw new ArgumentNullException(nameof(dataSource));
        }

        /// <summary>
        /// Validates if the given value matches the expected data type.
        /// </summary>
        /// <param name="value">The value to validate.</param>
        /// <param name="expectedType">The expected type of the value.</param>
        /// <returns>True if the value matches the expected type, false otherwise.</returns>
        public bool ValidateDataType(object value, Type expectedType)
        {
            if (value == null)
            {
                return expectedType.IsClass || Nullable.GetUnderlyingType(expectedType) != null;
            }

            return expectedType.IsInstanceOfType(value);
        }

        /// <summary>
        /// Validates if the given value falls within the specified range.
        /// </summary>
        /// <param name="value">The value to validate.</param>
        /// <param name="min">The minimum allowed value.</param>
        /// <param name="max">The maximum allowed value.</param>
        /// <returns>True if the value is within the specified range, false otherwise.</returns>
        public bool ValidateRange(IComparable value, IComparable min, IComparable max)
        {
            return value.CompareTo(min) >= 0 && value.CompareTo(max) <= 0;
        }

        /// <summary>
        /// Validates if the given string value matches the specified regex pattern.
        /// </summary>
        /// <param name="value">The string value to validate.</param>
        /// <param name="pattern">The regex pattern to match against.</param>
        /// <returns>True if the value matches the pattern, false otherwise.</returns>
        public bool ValidatePattern(string value, string pattern)
        {
            if (string.IsNullOrEmpty(value) || string.IsNullOrEmpty(pattern))
            {
                return false;
            }

            return Regex.IsMatch(value, pattern);
        }

        /// <summary>
        /// Validates if the given value is unique in the specified column of the data source.
        /// </summary>
        /// <param name="columnName">The name of the column to check for uniqueness.</param>
        /// <param name="value">The value to check for uniqueness.</param>
        /// <returns>A task that returns true if the value is unique, false otherwise.</returns>
        public async Task<bool> ValidateUniqueness(string columnName, object value)
        {
            if (string.IsNullOrEmpty(columnName) || value == null)
            {
                throw new ArgumentException("Column name and value must not be null or empty.");
            }

            try
            {
                // Assuming IDataSource has a method to check for existence
                bool exists = await _dataSource.ExistsAsync(columnName, value);
                return !exists;
            }
            catch (Exception ex)
            {
                throw new DataAccessException($"Error validating uniqueness for column {columnName}", ex);
            }
        }

        /// <summary>
        /// Validates if the given value exists in the referenced table and column.
        /// </summary>
        /// <param name="tableName">The name of the referenced table.</param>
        /// <param name="columnName">The name of the referenced column.</param>
        /// <param name="value">The value to check for existence.</param>
        /// <returns>A task that returns true if the value exists in the referenced table and column, false otherwise.</returns>
        public async Task<bool> ValidateReferentialIntegrity(string tableName, string columnName, object value)
        {
            if (string.IsNullOrEmpty(tableName) || string.IsNullOrEmpty(columnName) || value == null)
            {
                throw new ArgumentException("Table name, column name, and value must not be null or empty.");
            }

            try
            {
                // Assuming IDataSource has a method to check for existence in a specific table
                bool exists = await _dataSource.ExistsInTableAsync(tableName, columnName, value);
                return exists;
            }
            catch (Exception ex)
            {
                throw new DataAccessException($"Error validating referential integrity for table {tableName}, column {columnName}", ex);
            }
        }
    }
}