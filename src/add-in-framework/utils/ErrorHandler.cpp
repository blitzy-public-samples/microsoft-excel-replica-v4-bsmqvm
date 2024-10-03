#include "ErrorHandler.h"
#include "AddInLogger.h"
#include <string>
#include <exception>
#include <sstream>

ErrorHandler::ErrorHandler(AddInLogger* logger) : m_logger(logger) {
    // Initialize m_logger with the provided logger pointer
}

void ErrorHandler::HandleError(const std::exception& e, const std::string& context) {
    // Extract error message from the exception
    std::string errorMessage = e.what();

    // Combine error message with context information
    std::ostringstream combinedMessage;
    combinedMessage << "Error in context '" << context << "': " << errorMessage;

    // Call LogError with the combined message and appropriate severity
    LogError(combinedMessage.str(), ErrorSeverity::Error);
}

void ErrorHandler::ReportError(const std::string& errorMessage, ErrorSeverity severity) {
    // Call LogError with the provided error message and severity
    LogError(errorMessage, severity);
}

void ErrorHandler::LogError(const std::string& errorMessage, ErrorSeverity severity) {
    // Format the error message with severity information
    std::ostringstream formattedMessage;
    formattedMessage << "[" << SeverityToString(severity) << "] " << errorMessage;

    // Call the appropriate logging method on m_logger based on the severity level
    switch (severity) {
        case ErrorSeverity::Info:
            m_logger->LogInfo(formattedMessage.str());
            break;
        case ErrorSeverity::Warning:
            m_logger->LogWarning(formattedMessage.str());
            break;
        case ErrorSeverity::Error:
            m_logger->LogError(formattedMessage.str());
            break;
        case ErrorSeverity::Critical:
            m_logger->LogCritical(formattedMessage.str());
            break;
    }
}

std::string ErrorHandler::SeverityToString(ErrorSeverity severity) {
    switch (severity) {
        case ErrorSeverity::Info:
            return "INFO";
        case ErrorSeverity::Warning:
            return "WARNING";
        case ErrorSeverity::Error:
            return "ERROR";
        case ErrorSeverity::Critical:
            return "CRITICAL";
        default:
            return "UNKNOWN";
    }
}