#ifndef LOOKUP_FUNCTIONS_H
#define LOOKUP_FUNCTIONS_H

#include <string>
#include <vector>
#include <variant>
#include "../Interfaces/IFunctionLibrary.h"
#include "../ErrorHandling/CalculationErrors.h"

namespace ExcelCalculationEngine {

/**
 * @class LookupFunctions
 * @brief Implements the IFunctionLibrary interface for lookup and reference functions.
 * 
 * This class provides implementation for Excel's built-in lookup and reference functions,
 * offering tools for performing complex data lookups and references.
 */
class LookupFunctions : public IFunctionLibrary {
public:
    /**
     * @brief Default constructor for LookupFunctions.
     */
    LookupFunctions() = default;

    /**
     * @brief Executes the specified lookup or reference function.
     * 
     * @param functionName The name of the function to execute.
     * @param arguments The arguments for the function.
     * @return The result of the executed function.
     */
    std::variant<double, std::string, bool> ExecuteFunction(
        const std::string& functionName,
        const std::vector<std::variant<double, std::string, bool>>& arguments) override;

    /**
     * @brief Checks if the specified function is supported by the LookupFunctions library.
     * 
     * @param functionName The name of the function to check.
     * @return True if the function is supported, false otherwise.
     */
    bool IsFunctionSupported(const std::string& functionName) override;

private:
    // Helper functions for specific lookup and reference operations
    std::variant<double, std::string, bool> ExecuteVLookup(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> ExecuteHLookup(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> ExecuteIndex(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::variant<double, std::string, bool> ExecuteMatch(const std::vector<std::variant<double, std::string, bool>>& arguments);
    // Add more helper functions for other lookup and reference functions as needed

    // Utility functions
    bool ValidateArguments(const std::string& functionName, const std::vector<std::variant<double, std::string, bool>>& arguments);
    CalculationError GetCalculationError(const std::string& errorMessage);
};

} // namespace ExcelCalculationEngine

#endif // LOOKUP_FUNCTIONS_H