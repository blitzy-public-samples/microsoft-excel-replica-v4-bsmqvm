using System;
using System.Linq;
using System.Globalization;
using ExcelDesktop.Models;
using ExcelDesktop.Helpers;

namespace ExcelDesktop.Helpers
{
    /// <summary>
    /// This static class provides implementations of various Excel functions for use in the desktop application.
    /// </summary>
    public static class ExcelFunctions
    {
        /// <summary>
        /// Calculates the sum of a series of numbers.
        /// </summary>
        /// <param name="numbers">An array of double values to sum.</param>
        /// <returns>The sum of the input numbers.</returns>
        public static double SUM(double[] numbers)
        {
            return numbers.Sum();
        }

        /// <summary>
        /// Calculates the average (arithmetic mean) of a series of numbers.
        /// </summary>
        /// <param name="numbers">An array of double values to average.</param>
        /// <returns>The average of the input numbers.</returns>
        public static double AVERAGE(double[] numbers)
        {
            return numbers.Length > 0 ? numbers.Average() : 0;
        }

        /// <summary>
        /// Counts the number of cells that contain numbers.
        /// </summary>
        /// <param name="values">An array of objects to count.</param>
        /// <returns>The count of cells containing numbers.</returns>
        public static int COUNT(object[] values)
        {
            return values.Count(v => v is double || (v is string s && double.TryParse(s, out _)));
        }

        /// <summary>
        /// Returns the largest value in a set of numbers.
        /// </summary>
        /// <param name="numbers">An array of double values to find the maximum from.</param>
        /// <returns>The maximum value from the input numbers.</returns>
        public static double MAX(double[] numbers)
        {
            return numbers.Length > 0 ? numbers.Max() : 0;
        }

        /// <summary>
        /// Returns the smallest value in a set of numbers.
        /// </summary>
        /// <param name="numbers">An array of double values to find the minimum from.</param>
        /// <returns>The minimum value from the input numbers.</returns>
        public static double MIN(double[] numbers)
        {
            return numbers.Length > 0 ? numbers.Min() : 0;
        }

        /// <summary>
        /// Returns one value if a condition is true and another value if it's false.
        /// </summary>
        /// <param name="condition">The condition to evaluate.</param>
        /// <param name="trueValue">The value to return if the condition is true.</param>
        /// <param name="falseValue">The value to return if the condition is false.</param>
        /// <returns>The trueValue if condition is true, otherwise falseValue.</returns>
        public static object IF(bool condition, object trueValue, object falseValue)
        {
            return condition ? trueValue : falseValue;
        }

        /// <summary>
        /// Looks for a value in the leftmost column of a table, and then returns a value in the same row from a column you specify.
        /// </summary>
        /// <param name="lookupValue">The value to search for in the first column of the table array.</param>
        /// <param name="tableArray">The table of data to search.</param>
        /// <param name="colIndexNum">The column number in the table array from which to return a value.</param>
        /// <param name="rangeLookup">Specifies whether to find an exact or approximate match.</param>
        /// <returns>The looked-up value from the specified column.</returns>
        public static object VLOOKUP(object lookupValue, object[,] tableArray, int colIndexNum, bool rangeLookup)
        {
            if (tableArray == null || tableArray.GetLength(0) == 0 || tableArray.GetLength(1) == 0)
                throw new ArgumentException("Table array is empty or null.");

            if (colIndexNum < 1 || colIndexNum > tableArray.GetLength(1))
                throw new ArgumentException("Column index is out of range.");

            int rowIndex = -1;

            if (rangeLookup)
            {
                // Implement approximate match logic
                // This is a simplified version and may need to be expanded for full Excel compatibility
                for (int i = 0; i < tableArray.GetLength(0); i++)
                {
                    if (Compare(tableArray[i, 0], lookupValue) >= 0)
                    {
                        rowIndex = i;
                        break;
                    }
                }
            }
            else
            {
                // Exact match
                for (int i = 0; i < tableArray.GetLength(0); i++)
                {
                    if (Equals(tableArray[i, 0], lookupValue))
                    {
                        rowIndex = i;
                        break;
                    }
                }
            }

            if (rowIndex == -1)
                throw new ArgumentException("Lookup value not found.");

            return tableArray[rowIndex, colIndexNum - 1];
        }

        /// <summary>
        /// Returns the current date.
        /// </summary>
        /// <returns>The current date.</returns>
        public static DateTime TODAY()
        {
            return DateTime.Today;
        }

        /// <summary>
        /// Returns the current date and time.
        /// </summary>
        /// <returns>The current date and time.</returns>
        public static DateTime NOW()
        {
            return DateTime.Now;
        }

        /// <summary>
        /// Joins several text strings into one text string.
        /// </summary>
        /// <param name="texts">An array of objects to concatenate.</param>
        /// <returns>The concatenated text string.</returns>
        public static string CONCATENATE(object[] texts)
        {
            return string.Concat(texts.Select(t => t?.ToString() ?? ""));
        }

        // Helper method for comparing objects
        private static int Compare(object a, object b)
        {
            if (a is IComparable comparableA && b is IComparable comparableB)
            {
                return comparableA.CompareTo(comparableB);
            }
            return 0;
        }
    }
}