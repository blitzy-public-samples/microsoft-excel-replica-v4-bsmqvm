#ifndef TEXT_FUNCTIONS_H
#define TEXT_FUNCTIONS_H

#include <string>
#include <vector>
#include <variant>
#include "../Interfaces/IFunctionLibrary.h"
#include "../ErrorHandling/CalculationErrors.h"

namespace ExcelCalculationEngine {
namespace FunctionLibrary {

class TextFunctions : public IFunctionLibrary {
public:
    TextFunctions();
    ~TextFunctions() override = default;

    // Implement IFunctionLibrary interface
    std::variant<double, std::string, bool> ExecuteFunction(
        const std::string& functionName,
        const std::vector<std::variant<double, std::string, bool>>& arguments) override;

    bool IsFunctionSupported(const std::string& functionName) override;

private:
    // Helper methods for text functions
    std::string Concatenate(const std::vector<std::variant<double, std::string, bool>>& arguments);
    std::string Left(const std::string& text, int numChars);
    std::string Right(const std::string& text, int numChars);
    std::string Mid(const std::string& text, int startPos, int numChars);
    std::string Trim(const std::string& text);
    std::string Upper(const std::string& text);
    std::string Lower(const std::string& text);
    int Len(const std::string& text);
    std::string Replace(const std::string& oldText, int startPos, int numChars, const std::string& newText);
    std::string Substitute(const std::string& text, const std::string& oldText, const std::string& newText, int instanceNum = 0);
    
    // Helper method to convert variant to string
    std::string VariantToString(const std::variant<double, std::string, bool>& value);

    // List of supported text functions
    const std::vector<std::string> supportedFunctions = {
        "CONCATENATE", "LEFT", "RIGHT", "MID", "TRIM", "UPPER", "LOWER", "LEN", "REPLACE", "SUBSTITUTE"
    };
};

} // namespace FunctionLibrary
} // namespace ExcelCalculationEngine

#endif // TEXT_FUNCTIONS_H