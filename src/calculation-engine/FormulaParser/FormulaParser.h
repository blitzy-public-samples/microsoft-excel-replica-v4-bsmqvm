#ifndef FORMULA_PARSER_H
#define FORMULA_PARSER_H

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include "../Interfaces/IFormulaParser.h"
#include "../Interfaces/IFunctionLibrary.h"
#include "TokenizerUtils.h"
#include "../ErrorHandling/CalculationErrors.h"

namespace ExcelCalculationEngine {

/**
 * @class FormulaParser
 * @brief Implements the parsing of Excel formulas in the Microsoft Excel Calculation Engine.
 * 
 * This class is responsible for parsing and tokenizing Excel formulas. It implements
 * the IFormulaParser interface and provides concrete implementation for parsing
 * Excel formulas.
 */
class FormulaParser : public IFormulaParser {
public:
    /**
     * @brief Constructor for FormulaParser.
     * @param functionLibrary A shared pointer to the IFunctionLibrary.
     */
    explicit FormulaParser(std::shared_ptr<IFunctionLibrary> functionLibrary);

    /**
     * @brief Parses an Excel formula string into a vector of tokens.
     * @param formula The input formula string to be parsed.
     * @return A vector of Token objects representing the parsed formula.
     * @throws CalculationError if the formula is invalid or cannot be parsed.
     */
    std::vector<Token> ParseFormula(const std::string& formula) override;

    /**
     * @brief Validates an Excel formula string.
     * @param formula The input formula string to be validated.
     * @return True if the formula is valid, false otherwise.
     */
    bool ValidateFormula(const std::string& formula) override;

private:
    std::shared_ptr<IFunctionLibrary> m_functionLibrary;
    std::unordered_map<std::string, int> m_operatorPrecedence;

    /**
     * @brief Tokenizes the formula string into individual tokens.
     * @param formula The input formula string to be tokenized.
     * @return A vector of Token objects representing the tokenized formula.
     */
    std::vector<Token> TokenizeFormula(const std::string& formula);

    /**
     * @brief Converts infix notation to Reverse Polish Notation (RPN) using the Shunting Yard algorithm.
     * @param tokens The input vector of tokens in infix notation.
     * @return A vector of Token objects in RPN.
     */
    std::vector<Token> ShuntingYardAlgorithm(const std::vector<Token>& tokens);

    /**
     * @brief Initializes the operator precedence map.
     */
    void InitializeOperatorPrecedence();

    /**
     * @brief Checks if the parentheses and brackets in the formula are balanced.
     * @param formula The input formula string to be checked.
     * @return True if the parentheses and brackets are balanced, false otherwise.
     */
    bool AreParenthesesBalanced(const std::string& formula);

    /**
     * @brief Validates the usage of operators in the formula.
     * @param tokens The vector of tokens to be validated.
     * @return True if the operator usage is valid, false otherwise.
     */
    bool ValidateOperatorUsage(const std::vector<Token>& tokens);

    /**
     * @brief Validates the function names and argument counts in the formula.
     * @param tokens The vector of tokens to be validated.
     * @return True if the function usage is valid, false otherwise.
     */
    bool ValidateFunctionUsage(const std::vector<Token>& tokens);
};

} // namespace ExcelCalculationEngine

#endif // FORMULA_PARSER_H