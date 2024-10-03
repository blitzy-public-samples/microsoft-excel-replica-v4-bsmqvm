#include "LogicalFunctions.h"
#include "../ErrorHandling/CalculationErrors.h"
#include "../Utils/TypeConversion.h"
#include <algorithm>
#include <stdexcept>

namespace CalculationEngine {
namespace FunctionLibrary {

LogicalFunctions::LogicalFunctions() {
    // Initialize any necessary internal data structures for logical functions
}

std::variant<double, std::string, bool> LogicalFunctions::ExecuteFunction(
    const std::string& functionName,
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    
    if (!IsFunctionSupported(functionName)) {
        throw CalculationException(ErrorType::INVALID_FORMULA, "Unsupported logical function: " + functionName);
    }

    if (functionName == "AND") return AND(arguments);
    if (functionName == "OR") return OR(arguments);
    if (functionName == "NOT") return NOT(arguments);
    if (functionName == "IF") return IF(arguments);
    if (functionName == "IFERROR") return IFERROR(arguments);
    if (functionName == "IFS") return IFS(arguments);
    if (functionName == "SWITCH") return SWITCH(arguments);
    if (functionName == "TRUE") return TRUE();
    if (functionName == "FALSE") return FALSE();
    if (functionName == "XOR") return XOR(arguments);

    // This should never happen if IsFunctionSupported is implemented correctly
    throw CalculationException(ErrorType::INVALID_FORMULA, "Unexpected error in logical function execution");
}

bool LogicalFunctions::IsFunctionSupported(const std::string& functionName) {
    static const std::vector<std::string> supportedFunctions = {
        "AND", "OR", "NOT", "IF", "IFERROR", "IFS", "SWITCH", "TRUE", "FALSE", "XOR"
    };
    return std::find(supportedFunctions.begin(), supportedFunctions.end(), functionName) != supportedFunctions.end();
}

bool LogicalFunctions::AND(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.empty()) {
        throw CalculationException(ErrorType::INVALID_ARGUMENTS, "AND function requires at least one argument");
    }
    return std::all_of(arguments.begin(), arguments.end(), 
        [](const auto& arg) { return TypeConversion::ToBoolean(arg); });
}

bool LogicalFunctions::OR(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.empty()) {
        throw CalculationException(ErrorType::INVALID_ARGUMENTS, "OR function requires at least one argument");
    }
    return std::any_of(arguments.begin(), arguments.end(), 
        [](const auto& arg) { return TypeConversion::ToBoolean(arg); });
}

bool LogicalFunctions::NOT(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() != 1) {
        throw CalculationException(ErrorType::INVALID_ARGUMENTS, "NOT function requires exactly one argument");
    }
    return !TypeConversion::ToBoolean(arguments[0]);
}

std::variant<double, std::string, bool> LogicalFunctions::IF(
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() != 3) {
        throw CalculationException(ErrorType::INVALID_ARGUMENTS, "IF function requires exactly three arguments");
    }
    bool condition = TypeConversion::ToBoolean(arguments[0]);
    return condition ? arguments[1] : arguments[2];
}

std::variant<double, std::string, bool> LogicalFunctions::IFERROR(
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() != 2) {
        throw CalculationException(ErrorType::INVALID_ARGUMENTS, "IFERROR function requires exactly two arguments");
    }
    try {
        // Attempt to evaluate the first argument
        return arguments[0];
    } catch (const std::exception&) {
        // If any error occurs, return the second argument
        return arguments[1];
    }
}

std::variant<double, std::string, bool> LogicalFunctions::IFS(
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() % 2 != 0 || arguments.empty()) {
        throw CalculationException(ErrorType::INVALID_ARGUMENTS, "IFS function requires an even number of arguments");
    }
    for (size_t i = 0; i < arguments.size(); i += 2) {
        if (TypeConversion::ToBoolean(arguments[i])) {
            return arguments[i + 1];
        }
    }
    throw CalculationException(ErrorType::NO_VALUE, "No TRUE condition in IFS function");
}

std::variant<double, std::string, bool> LogicalFunctions::SWITCH(
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() < 3) {
        throw CalculationException(ErrorType::INVALID_ARGUMENTS, "SWITCH function requires at least 3 arguments");
    }
    auto expression = arguments[0];
    for (size_t i = 1; i < arguments.size() - 1; i += 2) {
        if (expression == arguments[i]) {
            return arguments[i + 1];
        }
    }
    if (arguments.size() % 2 == 0) {
        return arguments.back(); // Return the default value if provided
    }
    throw CalculationException(ErrorType::NO_VALUE, "No matching value in SWITCH function");
}

bool LogicalFunctions::TRUE() {
    return true;
}

bool LogicalFunctions::FALSE() {
    return false;
}

bool LogicalFunctions::XOR(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.empty()) {
        throw CalculationException(ErrorType::INVALID_ARGUMENTS, "XOR function requires at least one argument");
    }
    int trueCount = std::count_if(arguments.begin(), arguments.end(), 
        [](const auto& arg) { return TypeConversion::ToBoolean(arg); });
    return trueCount % 2 != 0;
}

} // namespace FunctionLibrary
} // namespace CalculationEngine