#ifndef CALCULATION_ERRORS_H
#define CALCULATION_ERRORS_H

#include <string>
#include <stdexcept>

// Base error handling utilities and structures
// TODO: Include the actual ErrorHandling.h once it's available
// #include "src/core-engine/Utils/ErrorHandling.h"

namespace Excel {
namespace CalculationEngine {

// Calculation error base constant
const int CALCULATION_ERROR_BASE = 1000;

// Enum for specific calculation error codes
enum class CalculationErrorCode {
    DIVIDE_BY_ZERO = CALCULATION_ERROR_BASE + 1,
    INVALID_FORMULA = CALCULATION_ERROR_BASE + 2,
    CIRCULAR_REFERENCE = CALCULATION_ERROR_BASE + 3,
    VALUE_ERROR = CALCULATION_ERROR_BASE + 4,
    NAME_ERROR = CALCULATION_ERROR_BASE + 5
};

// Function to get a user-friendly error message based on the error code
std::string GetCalculationErrorMessage(CalculationErrorCode code);

// Exception class for calculation-specific errors
class CalculationException : public std::exception {
public:
    CalculationException(CalculationErrorCode code, const std::string& message)
        : m_calculationErrorCode(code), m_message(message) {}

    CalculationErrorCode getCalculationErrorCode() const {
        return m_calculationErrorCode;
    }

    const char* what() const noexcept override {
        return m_message.c_str();
    }

private:
    CalculationErrorCode m_calculationErrorCode;
    std::string m_message;
};

} // namespace CalculationEngine
} // namespace Excel

#endif // CALCULATION_ERRORS_H