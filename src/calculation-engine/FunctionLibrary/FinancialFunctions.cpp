#include "FinancialFunctions.h"
#include "../ErrorHandling/CalculationErrors.h"
#include "../Utils/MathUtils.h"
#include "../Utils/DateUtils.h"
#include <cmath>
#include <algorithm>
#include <stdexcept>

namespace ExcelCalculationEngine {
namespace FunctionLibrary {

FinancialFunctions::FinancialFunctions() {
    // Initialize the m_functions map with financial function implementations
    m_functions["NPV"] = &FinancialFunctions::NPV;
    m_functions["IRR"] = &FinancialFunctions::IRR;
    m_functions["PMT"] = &FinancialFunctions::PMT;
    m_functions["FV"] = &FinancialFunctions::FV;
    m_functions["PV"] = &FinancialFunctions::PV;
}

std::variant<double, std::string, bool> FinancialFunctions::ExecuteFunction(
    const std::string& functionName,
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    
    // Check if the function is supported
    if (!IsFunctionSupported(functionName)) {
        throw CalculationError(ErrorCode::UNSUPPORTED_FUNCTION, "Function not supported: " + functionName);
    }

    try {
        // Execute the corresponding financial function
        return (this->*m_functions[functionName])(arguments);
    } catch (const CalculationError& e) {
        // Propagate calculation errors
        throw;
    } catch (const std::exception& e) {
        // Handle unexpected errors
        throw CalculationError(ErrorCode::UNEXPECTED_ERROR, "Unexpected error in " + functionName + ": " + e.what());
    }
}

bool FinancialFunctions::IsFunctionSupported(const std::string& functionName) const {
    return m_functions.find(functionName) != m_functions.end();
}

std::variant<double, std::string, bool> FinancialFunctions::NPV(
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    
    if (arguments.size() < 2) {
        throw CalculationError(ErrorCode::INVALID_ARGUMENT_COUNT, "NPV requires at least 2 arguments");
    }

    double rate = std::get<double>(arguments[0]);
    double npv = 0.0;

    for (size_t i = 1; i < arguments.size(); ++i) {
        double cashFlow = std::get<double>(arguments[i]);
        npv += cashFlow / std::pow(1 + rate, static_cast<double>(i));
    }

    return npv;
}

std::variant<double, std::string, bool> FinancialFunctions::IRR(
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    
    if (arguments.empty()) {
        throw CalculationError(ErrorCode::INVALID_ARGUMENT_COUNT, "IRR requires at least one cash flow");
    }

    const double EPSILON = 1e-7;
    const int MAX_ITERATIONS = 100;

    auto npv_function = [&](double rate) {
        double npv = 0.0;
        for (size_t i = 0; i < arguments.size(); ++i) {
            npv += std::get<double>(arguments[i]) / std::pow(1 + rate, static_cast<double>(i));
        }
        return npv;
    };

    double low = -0.99;
    double high = 0.99;

    for (int i = 0; i < MAX_ITERATIONS; ++i) {
        double mid = (low + high) / 2;
        double npv = npv_function(mid);

        if (std::abs(npv) < EPSILON) {
            return mid;
        }

        if (npv > 0) {
            low = mid;
        } else {
            high = mid;
        }
    }

    throw CalculationError(ErrorCode::CONVERGENCE_ERROR, "IRR failed to converge");
}

std::variant<double, std::string, bool> FinancialFunctions::PMT(
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    
    if (arguments.size() != 3) {
        throw CalculationError(ErrorCode::INVALID_ARGUMENT_COUNT, "PMT requires 3 arguments");
    }

    double rate = std::get<double>(arguments[0]);
    double nper = std::get<double>(arguments[1]);
    double pv = std::get<double>(arguments[2]);

    if (rate == 0) {
        return -pv / nper;
    }

    return -rate * pv * std::pow(1 + rate, nper) / (std::pow(1 + rate, nper) - 1);
}

std::variant<double, std::string, bool> FinancialFunctions::FV(
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    
    if (arguments.size() != 4) {
        throw CalculationError(ErrorCode::INVALID_ARGUMENT_COUNT, "FV requires 4 arguments");
    }

    double rate = std::get<double>(arguments[0]);
    double nper = std::get<double>(arguments[1]);
    double pmt = std::get<double>(arguments[2]);
    double pv = std::get<double>(arguments[3]);

    if (rate == 0) {
        return -(pv + pmt * nper);
    }

    return -(pv * std::pow(1 + rate, nper) + pmt * (std::pow(1 + rate, nper) - 1) / rate);
}

std::variant<double, std::string, bool> FinancialFunctions::PV(
    const std::vector<std::variant<double, std::string, bool>>& arguments) {
    
    if (arguments.size() != 3) {
        throw CalculationError(ErrorCode::INVALID_ARGUMENT_COUNT, "PV requires 3 arguments");
    }

    double rate = std::get<double>(arguments[0]);
    double nper = std::get<double>(arguments[1]);
    double pmt = std::get<double>(arguments[2]);

    if (rate == 0) {
        return -pmt * nper;
    }

    return -pmt * (1 - std::pow(1 + rate, -nper)) / rate;
}

} // namespace FunctionLibrary
} // namespace ExcelCalculationEngine