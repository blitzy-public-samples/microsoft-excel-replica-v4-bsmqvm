using System;
using System.Globalization;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This static class provides methods for converting data types between Excel formats and various data source formats.
    /// </summary>
    public static class DataTypeConverter
    {
        /// <summary>
        /// Converts a value from a data source type to the corresponding Excel type.
        /// </summary>
        /// <param name="value">The value to convert.</param>
        /// <param name="targetType">The target Excel type.</param>
        /// <returns>The converted value in Excel format.</returns>
        public static object ConvertToExcelType(object value, Type targetType)
        {
            try
            {
                if (value == null)
                {
                    return DBNull.Value;
                }

                if (targetType == typeof(string))
                {
                    return Convert.ToString(value, CultureInfo.InvariantCulture);
                }
                else if (targetType == typeof(int) || targetType == typeof(long))
                {
                    return ConvertNumericType(value, targetType);
                }
                else if (targetType == typeof(double) || targetType == typeof(decimal))
                {
                    return ConvertNumericType(value, targetType);
                }
                else if (targetType == typeof(DateTime))
                {
                    return ConvertDateTimeType(value, targetType);
                }
                else if (targetType == typeof(bool))
                {
                    return Convert.ToBoolean(value);
                }

                throw new DataAccessException($"Unsupported target type: {targetType}");
            }
            catch (Exception ex)
            {
                throw new DataAccessException($"Error converting to Excel type: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Converts a value from an Excel type to the corresponding data source type.
        /// </summary>
        /// <param name="value">The Excel value to convert.</param>
        /// <param name="targetType">The target data source type.</param>
        /// <returns>The converted value in the target data source format.</returns>
        public static object ConvertFromExcelType(object value, Type targetType)
        {
            try
            {
                if (value == null || value == DBNull.Value)
                {
                    return null;
                }

                if (targetType == typeof(string))
                {
                    return Convert.ToString(value, CultureInfo.InvariantCulture);
                }
                else if (targetType == typeof(int) || targetType == typeof(long))
                {
                    return ConvertNumericType(value, targetType);
                }
                else if (targetType == typeof(double) || targetType == typeof(decimal))
                {
                    return ConvertNumericType(value, targetType);
                }
                else if (targetType == typeof(DateTime))
                {
                    return ConvertDateTimeType(value, targetType);
                }
                else if (targetType == typeof(bool))
                {
                    return Convert.ToBoolean(value);
                }

                throw new DataAccessException($"Unsupported target type: {targetType}");
            }
            catch (Exception ex)
            {
                throw new DataAccessException($"Error converting from Excel type: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Handles conversion between different numeric types.
        /// </summary>
        /// <param name="value">The numeric value to convert.</param>
        /// <param name="targetType">The target numeric type.</param>
        /// <returns>The converted numeric value.</returns>
        private static object ConvertNumericType(object value, Type targetType)
        {
            if (!IsNumericType(value.GetType()))
            {
                throw new DataAccessException($"Invalid numeric type: {value.GetType()}");
            }

            try
            {
                if (targetType == typeof(int))
                {
                    return Convert.ToInt32(value);
                }
                else if (targetType == typeof(long))
                {
                    return Convert.ToInt64(value);
                }
                else if (targetType == typeof(double))
                {
                    return Convert.ToDouble(value);
                }
                else if (targetType == typeof(decimal))
                {
                    return Convert.ToDecimal(value);
                }

                throw new DataAccessException($"Unsupported numeric target type: {targetType}");
            }
            catch (OverflowException ex)
            {
                throw new DataAccessException($"Numeric overflow during conversion: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Handles conversion between different date and time types.
        /// </summary>
        /// <param name="value">The date/time value to convert.</param>
        /// <param name="targetType">The target date/time type.</param>
        /// <returns>The converted date/time value.</returns>
        private static object ConvertDateTimeType(object value, Type targetType)
        {
            if (value is DateTime dateTime)
            {
                return dateTime;
            }
            else if (value is string dateString)
            {
                if (DateTime.TryParse(dateString, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDateTime))
                {
                    return parsedDateTime;
                }
                throw new DataAccessException($"Invalid date/time string format: {dateString}");
            }

            throw new DataAccessException($"Invalid date/time type: {value.GetType()}");
        }

        /// <summary>
        /// Checks if the given type is a numeric type.
        /// </summary>
        /// <param name="type">The type to check.</param>
        /// <returns>True if the type is numeric, false otherwise.</returns>
        private static bool IsNumericType(Type type)
        {
            return type == typeof(int) || type == typeof(long) || type == typeof(float) || 
                   type == typeof(double) || type == typeof(decimal) || type == typeof(short) || 
                   type == typeof(uint) || type == typeof(ulong) || type == typeof(ushort);
        }
    }
}