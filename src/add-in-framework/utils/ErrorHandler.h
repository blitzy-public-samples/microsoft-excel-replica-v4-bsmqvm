#ifndef ERROR_HANDLER_H
#define ERROR_HANDLER_H

#include <string>
#include <exception>

// Forward declaration of AddInLogger
class AddInLogger;

/**
 * @brief Enumeration for error severity levels
 */
enum class ErrorSeverity {
    INFO,
    WARNING,
    ERROR,
    CRITICAL
};

/**
 * @class ErrorHandler
 * @brief Provides error handling functionality for Excel add-ins
 * 
 * This class allows add-ins to handle, report, and log errors in a consistent manner.
 * It supports the extensibility and security objectives of the Excel system.
 */
class ErrorHandler {
public:
    /**
     * @brief Constructs an ErrorHandler object with a reference to the AddInLogger
     * @param logger Pointer to the AddInLogger instance
     */
    explicit ErrorHandler(AddInLogger* logger);

    /**
     * @brief Handles and logs an exception with additional context information
     * @param e The exception to handle
     * @param context Additional context information
     */
    void HandleError(const std::exception& e, const std::string& context);

    /**
     * @brief Reports and logs an error message with a specified severity level
     * @param errorMessage The error message to report
     * @param severity The severity level of the error
     */
    void ReportError(const std::string& errorMessage, ErrorSeverity severity);

private:
    /**
     * @brief Logs an error message with the specified severity level using the AddInLogger
     * @param errorMessage The error message to log
     * @param severity The severity level of the error
     */
    void LogError(const std::string& errorMessage, ErrorSeverity severity);

    AddInLogger* m_logger; ///< Pointer to the AddInLogger instance
};

#endif // ERROR_HANDLER_H