#include "StatisticalFunctions.h"
#include "IFunctionLibrary.h"
#include "CalculationErrors.h"
#include <string>
#include <vector>
#include <variant>
#include <cmath>
#include <algorithm>
#include <numeric>
#include <stdexcept>

namespace ExcelCalculationEngine {

StatisticalFunctions::StatisticalFunctions() {}

std::variant<double, std::string, bool> StatisticalFunctions::ExecuteFunction(
    const std::string& functionName,
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    
    try {
        if (functionName == "AVERAGE") {
            return Average(arguments);
        } else if (functionName == "MEDIAN") {
            return Median(arguments);
        } else if (functionName == "STDEV") {
            return StandardDeviation(arguments);
        } else if (functionName == "COUNT") {
            return Count(arguments);
        } else if (functionName == "MAX") {
            return Max(arguments);
        } else if (functionName == "MIN") {
            return Min(arguments);
        } else {
            throw std::invalid_argument("Unsupported statistical function: " + functionName);
        }
    } catch (const std::exception& e) {
        return CalculationErrors::GetErrorString(CalculationErrors::InvalidArgument);
    }
}

bool StatisticalFunctions::IsFunctionSupported(const std::string& functionName) {
    static const std::vector<std::string> supportedFunctions = {
        "AVERAGE", "MEDIAN", "STDEV", "COUNT", "MAX", "MIN"
    };
    return std::find(supportedFunctions.begin(), supportedFunctions.end(), functionName) != supportedFunctions.end();
}

double StatisticalFunctions::Average(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    std::vector<double> numbers = ExtractNumbers(arguments);
    if (numbers.empty()) {
        throw std::invalid_argument("No numeric values found for AVERAGE");
    }
    return std::accumulate(numbers.begin(), numbers.end(), 0.0) / numbers.size();
}

double StatisticalFunctions::Median(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    std::vector<double> numbers = ExtractNumbers(arguments);
    if (numbers.empty()) {
        throw std::invalid_argument("No numeric values found for MEDIAN");
    }
    std::sort(numbers.begin(), numbers.end());
    size_t size = numbers.size();
    if (size % 2 == 0) {
        return (numbers[size / 2 - 1] + numbers[size / 2]) / 2;
    } else {
        return numbers[size / 2];
    }
}

double StatisticalFunctions::StandardDeviation(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    std::vector<double> numbers = ExtractNumbers(arguments);
    if (numbers.size() < 2) {
        throw std::invalid_argument("At least two numeric values are required for STDEV");
    }
    double mean = Average(arguments);
    double squaredDiffSum = std::accumulate(numbers.begin(), numbers.end(), 0.0,
        [mean](double sum, double value) {
            double diff = value - mean;
            return sum + diff * diff;
        });
    return std::sqrt(squaredDiffSum / (numbers.size() - 1));
}

int StatisticalFunctions::Count(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    return std::count_if(arguments.begin(), arguments.end(),
        [](const auto& arg) { return std::holds_alternative<double>(arg); });
}

double StatisticalFunctions::Max(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    std::vector<double> numbers = ExtractNumbers(arguments);
    if (numbers.empty()) {
        throw std::invalid_argument("No numeric values found for MAX");
    }
    return *std::max_element(numbers.begin(), numbers.end());
}

double StatisticalFunctions::Min(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    std::vector<double> numbers = ExtractNumbers(arguments);
    if (numbers.empty()) {
        throw std::invalid_argument("No numeric values found for MIN");
    }
    return *std::min_element(numbers.begin(), numbers.end());
}

std::vector<double> StatisticalFunctions::ExtractNumbers(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    std::vector<double> numbers;
    for (const auto& arg : arguments) {
        if (std::holds_alternative<double>(arg)) {
            numbers.push_back(std::get<double>(arg));
        } else if (std::holds_alternative<bool>(arg)) {
            numbers.push_back(std::get<bool>(arg) ? 1.0 : 0.0);
        }
    }
    return numbers;
}

} // namespace ExcelCalculationEngine