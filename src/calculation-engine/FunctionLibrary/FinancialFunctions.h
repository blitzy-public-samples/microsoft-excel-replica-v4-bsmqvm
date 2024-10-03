#ifndef FINANCIAL_FUNCTIONS_H
#define FINANCIAL_FUNCTIONS_H

#include <string>
#include <vector>
#include <variant>
#include <map>
#include <functional>

// Forward declarations
class IFunctionLibrary;
class CalculationErrors;
class MathUtils;
class DateUtils;

class FinancialFunctions : public IFunctionLibrary {
public:
    FinancialFunctions();
    ~FinancialFunctions() = default;

    // Implement IFunctionLibrary interface
    std::variant<double, std::string, bool> ExecuteFunction(const std::string& functionName, const std::vector<std::variant<double, std::string, bool>>& arguments) override;
    bool IsFunctionSupported(const std::string& functionName) override;

private:
    std::map<std::string, std::function<std::variant<double, std::string, bool>(const std::vector<std::variant<double, std::string, bool>>&)>> m_functions;

    // Helper methods
    void InitializeFunctions();
    
    // Financial function implementations
    std::variant<double, std::string, bool> NPV(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> IRR(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> PMT(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> FV(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> PV(const std::vector<std::variant<double, std::string, bool>>& arguments);

    // Utility functions
    double ConvertToDouble(const std::variant<double, std::string, bool>& value);
    std::string ConvertToString(const std::variant<double, std::string, bool>& value);
    bool ConvertToBool(const std::variant<double, std::string, bool>& value);
};

#endif // FINANCIAL_FUNCTIONS_H