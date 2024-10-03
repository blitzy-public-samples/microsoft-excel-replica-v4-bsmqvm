#ifndef IFORMULA_PARSER_H
#define IFORMULA_PARSER_H

#include <string>
#include <vector>

namespace ExcelCalculationEngine {

// Forward declaration of Token class
class Token;

/**
 * @class IFormulaParser
 * @brief Interface for the Formula Parser component of the Excel Calculation Engine.
 *
 * This abstract class defines the interface for parsing and tokenizing Excel formulas.
 * It provides the contract for the Formula Parser component, ensuring integration
 * with the Calculation Engine.
 */
class IFormulaParser {
public:
    /**
     * @brief Virtual destructor to ensure proper cleanup of derived classes.
     */
    virtual ~IFormulaParser() = default;

    /**
     * @brief Parse an Excel formula string into a vector of tokens.
     * 
     * @param formula The Excel formula string to be parsed.
     * @return std::vector<Token> A vector of tokens representing the parsed formula.
     */
    virtual std::vector<Token> ParseFormula(const std::string& formula) = 0;

    /**
     * @brief Validate an Excel formula string.
     * 
     * @param formula The Excel formula string to be validated.
     * @return bool True if the formula is valid, false otherwise.
     */
    virtual bool ValidateFormula(const std::string& formula) = 0;
};

} // namespace ExcelCalculationEngine

#endif // IFORMULA_PARSER_H