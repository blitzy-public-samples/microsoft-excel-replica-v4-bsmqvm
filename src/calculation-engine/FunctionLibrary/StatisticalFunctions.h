#ifndef STATISTICAL_FUNCTIONS_H
#define STATISTICAL_FUNCTIONS_H

#include <string>
#include <vector>
#include <variant>
#include <cmath>
#include <algorithm>
#include <numeric>

// Assuming these are the correct paths for the dependencies
#include "../Interfaces/IFunctionLibrary.h"
#include "../ErrorHandling/CalculationErrors.h"
#include "MathFunctions.h"

class StatisticalFunctions : public IFunctionLibrary {
public:
    StatisticalFunctions() = default;
    ~StatisticalFunctions() = default;

    // Implement the IFunctionLibrary interface
    std::variant<double, std::string, bool> ExecuteFunction(
        const std::string& functionName,
        const std::vector<std::variant<double, std::string, bool>>& arguments) override;

    bool IsFunctionSupported(const std::string& functionName) override;

private:
    // Helper functions for statistical calculations
    double CalculateMean(const std::vector<double>& values);
    double CalculateMedian(std::vector<double> values);
    double CalculateStandardDeviation(const std::vector<double>& values);
    double CalculateVariance(const std::vector<double>& values);
    double CalculateCorrelation(const std::vector<double>& x, const std::vector<double>& y);

    // Statistical functions
    std::variant<double, std::string, bool> Average(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> Median(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> StDev(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> Var(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> Correl(const std::vector<std::variant<double, std::string, bool>>& arguments);

    // Utility functions
    std::vector<double> ConvertToDoubleVector(const std::vector<std::variant<double, std::string, bool>>& arguments);
};

#endif // STATISTICAL_FUNCTIONS_H