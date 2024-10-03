#ifndef MATH_FUNCTIONS_H
#define MATH_FUNCTIONS_H

#include <string>
#include <vector>
#include <variant>
#include <cmath>
#include "../Interfaces/IFunctionLibrary.h"
#include "../ErrorHandling/CalculationErrors.h"

namespace ExcelCalculationEngine {

class MathFunctions : public IFunctionLibrary {
public:
    // Default constructor
    MathFunctions() = default;

    // Destructor
    virtual ~MathFunctions() = default;

    // Implement IFunctionLibrary interface
    std::variant<double, std::string, bool> ExecuteFunction(
        const std::string& functionName,
        const std::vector<std::variant<double, std::string, bool>>& arguments) override;

    bool IsFunctionSupported(const std::string& functionName) const override;

private:
    // Helper functions for specific mathematical operations
    double SUM(const std::vector<std::variant<double, std::string, bool>>& arguments);
    double AVERAGE(const std::vector<std::variant<double, std::string, bool>>& arguments);

    // Helper function to convert variant to double
    double ConvertToDouble(const std::variant<double, std::string, bool>& value) const;
};

} // namespace ExcelCalculationEngine

#endif // MATH_FUNCTIONS_H