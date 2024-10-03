#ifndef LOGICAL_FUNCTIONS_H
#define LOGICAL_FUNCTIONS_H

#include <string>
#include <vector>
#include <variant>
#include "../Interfaces/IFunctionLibrary.h"
#include "../ErrorHandling/CalculationErrors.h"

namespace ExcelCalculationEngine {

class LogicalFunctions : public IFunctionLibrary {
public:
    LogicalFunctions() = default;
    ~LogicalFunctions() override = default;

    // Implement IFunctionLibrary interface
    std::variant<double, std::string, bool> ExecuteFunction(
        const std::string& functionName,
        const std::vector<std::variant<double, std::string, bool>>& arguments) override;

    bool IsFunctionSupported(const std::string& functionName) override;

private:
    // Logical function implementations
    bool AND(const std::vector<std::variant<double, std::string, bool>>& arguments);
    bool OR(const std::vector<std::variant<double, std::string, bool>>& arguments);
    bool NOT(const std::variant<double, std::string, bool>& argument);
    std::variant<double, std::string, bool> IF(
        const std::variant<double, std::string, bool>& condition,
        const std::variant<double, std::string, bool>& trueValue,
        const std::variant<double, std::string, bool>& falseValue);
    std::variant<double, std::string, bool> IFERROR(
        const std::variant<double, std::string, bool>& value,
        const std::variant<double, std::string, bool>& valueIfError);
    std::variant<double, std::string, bool> IFS(
        const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> SWITCH(
        const std::variant<double, std::string, bool>& expression,
        const std::vector<std::variant<double, std::string, bool>>& cases);
    bool TRUE();
    bool FALSE();
    bool XOR(const std::vector<std::variant<double, std::string, bool>>& arguments);

    // Helper functions
    bool ConvertToBool(const std::variant<double, std::string, bool>& value);
    bool IsError(const std::variant<double, std::string, bool>& value);
};

} // namespace ExcelCalculationEngine

#endif // LOGICAL_FUNCTIONS_H