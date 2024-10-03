#include "MathFunctions.h"
#include "../Interfaces/IFunctionLibrary.h"
#include "../ErrorHandling/CalculationErrors.h"
#include <cmath>
#include <string>
#include <vector>
#include <variant>
#include <stdexcept>
#include <algorithm>

class MathFunctions : public IFunctionLibrary {
public:
    std::variant<double, std::string, bool> ExecuteFunction(const std::string& functionName, const std::vector<std::variant<double, std::string, bool>>& arguments) override {
        if (!IsFunctionSupported(functionName)) {
            throw CalculationException(ErrorCode::INVALID_FORMULA, "Unsupported function: " + functionName);
        }

        try {
            if (functionName == "SUM") {
                return SUM(arguments);
            } else if (functionName == "AVERAGE") {
                return AVERAGE(arguments);
            }
            // Add more functions here as they are implemented
        } catch (const std::exception& e) {
            throw CalculationException(ErrorCode::CALCULATION_ERROR, e.what());
        }

        // This should never be reached due to the IsFunctionSupported check
        throw CalculationException(ErrorCode::INVALID_FORMULA, "Unexpected error in function execution");
    }

    bool IsFunctionSupported(const std::string& functionName) const override {
        static const std::vector<std::string> supportedFunctions = {"SUM", "AVERAGE"};
        return std::find(supportedFunctions.begin(), supportedFunctions.end(), functionName) != supportedFunctions.end();
    }

private:
    double SUM(const std::vector<std::variant<double, std::string, bool>>& arguments) {
        double sum = 0.0;
        for (const auto& arg : arguments) {
            if (const auto value = std::get_if<double>(&arg)) {
                sum += *value;
            } else if (const auto strValue = std::get_if<std::string>(&arg)) {
                try {
                    sum += std::stod(*strValue);
                } catch (const std::invalid_argument&) {
                    // Ignore non-numeric strings
                } catch (const std::out_of_range&) {
                    throw CalculationException(ErrorCode::CALCULATION_ERROR, "Number out of range in SUM function");
                }
            } else if (const auto boolValue = std::get_if<bool>(&arg)) {
                sum += *boolValue ? 1.0 : 0.0;
            }
        }
        return sum;
    }

    double AVERAGE(const std::vector<std::variant<double, std::string, bool>>& arguments) {
        double sum = SUM(arguments);
        int count = 0;
        for (const auto& arg : arguments) {
            if (std::holds_alternative<double>(arg) || 
                (std::holds_alternative<std::string>(arg) && !std::get<std::string>(arg).empty()) ||
                std::holds_alternative<bool>(arg)) {
                ++count;
            }
        }
        if (count == 0) {
            throw CalculationException(ErrorCode::CALCULATION_ERROR, "AVERAGE function requires at least one numeric value");
        }
        return sum / count;
    }
};

// Factory function to create an instance of MathFunctions
extern "C" IFunctionLibrary* CreateMathFunctions() {
    return new MathFunctions();
}