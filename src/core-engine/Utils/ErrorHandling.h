#ifndef CORE_ENGINE_UTILS_ERROR_HANDLING_H
#define CORE_ENGINE_UTILS_ERROR_HANDLING_H

#include <exception>
#include <string>

// Forward declaration for Logging
namespace CoreEngine {
namespace Utils {
class Logging;
}
}

namespace CoreEngine {
namespace Utils {

// Error codes for Excel operations
enum class ErrorCode {
    SUCCESS = 0,
    INVALID_INPUT,
    CALCULATION_ERROR,
    MEMORY_ERROR,
    FILE_IO_ERROR,
    NETWORK_ERROR,
    UNKNOWN_ERROR
};

/**
 * @class ExcelException
 * @brief Custom exception class for Excel operations
 */
class ExcelException : public std::exception {
public:
    /**
     * @brief Constructs an ExcelException object
     * @param code The error code associated with the exception
     * @param message The error message describing the exception
     */
    ExcelException(ErrorCode code, const std::string& message)
        : m_errorCode(code), m_errorMessage(message) {}

    /**
     * @brief Returns the error message associated with this exception
     * @return A C-style string containing the error message
     */
    const char* what() const noexcept override {
        return m_errorMessage.c_str();
    }

    /**
     * @brief Returns the error code associated with this exception
     * @return The ErrorCode enum value
     */
    ErrorCode getErrorCode() const noexcept {
        return m_errorCode;
    }

private:
    ErrorCode m_errorCode;
    std::string m_errorMessage;
};

/**
 * @brief Handles exceptions thrown during core engine operations
 * @param e The exception to be handled
 */
void HandleError(const std::exception& e);

/**
 * @brief Returns a user-friendly error message based on the provided error code
 * @param code The error code
 * @return A string containing the user-friendly error message
 */
std::string GetErrorMessage(ErrorCode code);

} // namespace Utils
} // namespace CoreEngine

#endif // CORE_ENGINE_UTILS_ERROR_HANDLING_H