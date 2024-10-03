using System;
using System.Diagnostics;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// A static class that provides methods for handling and processing errors in the data access layer.
    /// </summary>
    public static class ErrorHandler
    {
        // Constant for default error message
        private const string DefaultErrorMessage = "An error occurred in the data access layer.";

        /// <summary>
        /// Handles exceptions by logging the error and throwing a custom DataAccessException.
        /// </summary>
        /// <param name="ex">The exception to handle.</param>
        /// <param name="methodName">The name of the method where the exception occurred.</param>
        /// <param name="additionalInfo">Additional information about the error context.</param>
        public static void HandleException(Exception ex, string methodName, string additionalInfo = "")
        {
            // Log the error
            LogError(ex, methodName, additionalInfo);

            // Throw a new DataAccessException with formatted error message
            throw new DataAccessException(FormatErrorMessage(ex, methodName, additionalInfo));
        }

        /// <summary>
        /// Logs the error information using the DataAccessLogger.
        /// </summary>
        /// <param name="ex">The exception to log.</param>
        /// <param name="methodName">The name of the method where the exception occurred.</param>
        /// <param name="additionalInfo">Additional information about the error context.</param>
        private static void LogError(Exception ex, string methodName, string additionalInfo)
        {
            string logMessage = FormatErrorMessage(ex, methodName, additionalInfo);
            DataAccessLogger.LogError(logMessage);
        }

        /// <summary>
        /// Formats the error message with detailed information.
        /// </summary>
        /// <param name="ex">The exception to format.</param>
        /// <param name="methodName">The name of the method where the exception occurred.</param>
        /// <param name="additionalInfo">Additional information about the error context.</param>
        /// <returns>A formatted error message string.</returns>
        private static string FormatErrorMessage(Exception ex, string methodName, string additionalInfo)
        {
            string errorMessage = $"Error in {methodName}: {ex.Message}";
            if (!string.IsNullOrEmpty(additionalInfo))
            {
                errorMessage += $" Additional Info: {additionalInfo}";
            }
            errorMessage += $"\nStack Trace: {ex.StackTrace}";

            if (ex.InnerException != null)
            {
                errorMessage += $"\nInner Exception: {ex.InnerException.Message}";
            }

            return errorMessage;
        }
    }

    // Placeholder classes for dependencies (these should be replaced with actual implementations)

    public class DataAccessException : Exception
    {
        public DataAccessException(string message) : base(message) { }
    }

    public static class DataAccessLogger
    {
        public static void LogError(string message)
        {
            // Placeholder implementation
            Debug.WriteLine($"[ERROR] {message}");
        }
    }

    public static class DataAccessConstants
    {
        // Add any constants here if needed
    }
}