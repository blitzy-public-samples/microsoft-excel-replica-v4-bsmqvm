#include "CalculationErrors.h"
#include "../../core-engine/Utils/ErrorHandling.h"
#include <string>
#include <unordered_map>

// Static initialization of the error messages map
static const std::unordered_map<CalculationErrorCode, std::string> errorMessages = {
    {CalculationErrorCode::DivisionByZero, "Division by zero"},
    {CalculationErrorCode::InvalidFormula, "Invalid formula"},
    {CalculationErrorCode::CircularReference, "Circular reference detected"},
    {CalculationErrorCode::InvalidCellReference, "Invalid cell reference"},
    {CalculationErrorCode::InvalidArgument, "Invalid argument"},
    {CalculationErrorCode::OutOfRange, "Value out of range"},
    {CalculationErrorCode::DataTypeMismatch, "Data type mismatch"},
    {CalculationErrorCode::OverflowError, "Arithmetic overflow"},
    {CalculationErrorCode::UnderflowError, "Arithmetic underflow"},
    {CalculationErrorCode::NameError, "Name not recognized"},
    {CalculationErrorCode::NullError, "Null value encountered"},
    {CalculationErrorCode::ParseError, "Unable to parse the formula"},
    {CalculationErrorCode::Unknown, "Unknown calculation error"}
};

CalculationException::CalculationException(CalculationErrorCode code, const std::string& message)
    : ExcelException(static_cast<int>(code), message), calculationErrorCode(code) {
    // Initialize base ExcelException with the error code and message
    // The static_cast is used to convert CalculationErrorCode to int for the base class
}

CalculationErrorCode CalculationException::getCalculationErrorCode() const {
    return calculationErrorCode;
}

std::string GetCalculationErrorMessage(CalculationErrorCode code) {
    auto it = errorMessages.find(code);
    if (it != errorMessages.end()) {
        return it->second;
    }
    return "Unknown calculation error";
}

// Additional utility functions for error handling

bool IsCalculationError(const CalculationErrorCode& code) {
    return code != CalculationErrorCode::NoError;
}

void ThrowIfCalculationError(const CalculationErrorCode& code) {
    if (IsCalculationError(code)) {
        throw CalculationException(code, GetCalculationErrorMessage(code));
    }
}

CalculationErrorCode ConvertToCalculationErrorCode(const std::exception& e) {
    // Attempt to convert standard exceptions to CalculationErrorCode
    if (dynamic_cast<const std::invalid_argument*>(&e)) {
        return CalculationErrorCode::InvalidArgument;
    } else if (dynamic_cast<const std::out_of_range*>(&e)) {
        return CalculationErrorCode::OutOfRange;
    } else if (dynamic_cast<const std::overflow_error*>(&e)) {
        return CalculationErrorCode::OverflowError;
    } else if (dynamic_cast<const std::underflow_error*>(&e)) {
        return CalculationErrorCode::UnderflowError;
    }
    // If no specific match, return Unknown
    return CalculationErrorCode::Unknown;
}

void LogCalculationError(const CalculationException& e) {
    // Implement logging functionality here
    // This is a placeholder and should be replaced with actual logging code
    // For example, you might use a logging library or write to a log file
    std::cerr << "Calculation Error: " << e.what() 
              << " (Code: " << static_cast<int>(e.getCalculationErrorCode()) << ")" << std::endl;
}