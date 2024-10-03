#ifndef TOKENIZER_UTILS_H
#define TOKENIZER_UTILS_H

#include <string>
#include <vector>

namespace ExcelCalculationEngine {
namespace FormulaParser {

/**
 * @brief Enumeration of token types in Excel formulas.
 */
enum class TOKEN_TYPES {
    OPERATOR,
    OPERAND,
    FUNCTION,
    SEPARATOR,
    PARENTHESIS,
    UNKNOWN
};

/**
 * @brief Represents a token in an Excel formula.
 */
struct Token {
    TOKEN_TYPES type;
    std::string value;
};

/**
 * @brief Utility functions for tokenizing Excel formulas.
 */
class TokenizerUtils {
public:
    /**
     * @brief Checks if a given character is an Excel formula operator.
     * @param c The character to check.
     * @return True if the character is an operator, false otherwise.
     */
    static bool IsOperator(char c);

    /**
     * @brief Checks if a given character is a digit.
     * @param c The character to check.
     * @return True if the character is a digit, false otherwise.
     */
    static bool IsDigit(char c);

    /**
     * @brief Checks if a given character is an alphabetic character.
     * @param c The character to check.
     * @return True if the character is alphabetic, false otherwise.
     */
    static bool IsAlpha(char c);

    /**
     * @brief Tokenizes an Excel formula string into a vector of tokens.
     * @param formula The Excel formula string to tokenize.
     * @return A vector of tokens representing the parsed formula.
     */
    static std::vector<Token> TokenizeFormula(const std::string& formula);

private:
    // Private constructor to prevent instantiation
    TokenizerUtils() = delete;
};

} // namespace FormulaParser
} // namespace ExcelCalculationEngine

#endif // TOKENIZER_UTILS_H