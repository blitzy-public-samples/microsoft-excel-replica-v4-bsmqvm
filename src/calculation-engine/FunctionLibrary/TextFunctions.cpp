#include "TextFunctions.h"
#include "CalculationErrors.h"
#include <algorithm>
#include <cctype>
#include <locale>
#include <stdexcept>

namespace ExcelCalculationEngine {

TextFunctions::TextFunctions() {
    // Initialize any necessary internal data structures
}

std::variant<double, std::string, bool> TextFunctions::ExecuteFunction(
    const std::string& functionName,
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    
    try {
        if (!IsFunctionSupported(functionName)) {
            throw CalculationException("Unsupported function: " + functionName);
        }

        if (functionName == "CONCATENATE") {
            return CONCATENATE(arguments);
        } else if (functionName == "LEFT") {
            if (arguments.size() != 2) {
                throw CalculationException("LEFT function requires 2 arguments");
            }
            const std::string& text = std::get<std::string>(arguments[0]);
            int numChars = static_cast<int>(std::get<double>(arguments[1]));
            return LEFT(text, numChars);
        }
        // Add more function implementations here

        throw CalculationException("Function not implemented: " + functionName);
    } catch (const std::bad_variant_access& e) {
        throw CalculationException("Invalid argument type for function: " + functionName);
    } catch (const std::exception& e) {
        throw CalculationException(e.what());
    }
}

bool TextFunctions::IsFunctionSupported(const std::string& functionName) const {
    static const std::vector<std::string> supportedFunctions = {
        "CONCATENATE", "LEFT"
        // Add more supported functions here
    };

    return std::find(supportedFunctions.begin(), supportedFunctions.end(), functionName) != supportedFunctions.end();
}

std::string TextFunctions::CONCATENATE(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    std::string result;
    for (const auto& arg : arguments) {
        if (std::holds_alternative<std::string>(arg)) {
            result += std::get<std::string>(arg);
        } else if (std::holds_alternative<double>(arg)) {
            result += std::to_string(std::get<double>(arg));
        } else if (std::holds_alternative<bool>(arg)) {
            result += std::get<bool>(arg) ? "TRUE" : "FALSE";
        }
    }
    return result;
}

std::string TextFunctions::LEFT(const std::string& text, int numChars) {
    if (numChars < 0) {
        throw CalculationException("LEFT function: numChars must be non-negative");
    }
    return text.substr(0, std::min(static_cast<size_t>(numChars), text.length()));
}

} // namespace ExcelCalculationEngine