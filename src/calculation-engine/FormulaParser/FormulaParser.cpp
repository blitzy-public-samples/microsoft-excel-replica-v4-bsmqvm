#include "FormulaParser.h"
#include "TokenizerUtils.h"
#include "CalculationErrors.h"
#include <stack>
#include <algorithm>
#include <cctype>
#include <stdexcept>

// Define the operator precedence map
const std::unordered_map<std::string, int> OPERATOR_PRECEDENCE = {
    {"+", 1}, {"-", 1},
    {"*", 2}, {"/", 2},
    {"^", 3}
};

FormulaParser::FormulaParser(std::shared_ptr<IFunctionLibrary> functionLibrary)
    : m_functionLibrary(functionLibrary) {}

std::vector<Token> FormulaParser::ParseFormula(const std::string& formula) {
    try {
        if (!ValidateFormula(formula)) {
            throw CalculationError("Invalid formula syntax");
        }

        std::vector<Token> tokens = TokenizeFormula(formula);
        return ShuntingYardAlgorithm(tokens);
    } catch (const std::exception& e) {
        throw CalculationError(std::string("Error parsing formula: ") + e.what());
    }
}

bool FormulaParser::ValidateFormula(const std::string& formula) {
    std::stack<char> parentheses;
    bool lastWasOperator = true;
    bool expectOperand = true;

    for (char c : formula) {
        if (std::isspace(c)) continue;

        if (c == '(') {
            parentheses.push(c);
            expectOperand = true;
        } else if (c == ')') {
            if (parentheses.empty() || lastWasOperator) return false;
            parentheses.pop();
            expectOperand = false;
        } else if (std::isalpha(c) || c == '_') {
            if (!expectOperand) return false;
            while (std::isalnum(c) || c == '_') c++;
            expectOperand = false;
        } else if (std::isdigit(c) || c == '.') {
            if (!expectOperand) return false;
            while (std::isdigit(c) || c == '.') c++;
            expectOperand = false;
        } else if (c == '+' || c == '-' || c == '*' || c == '/' || c == '^') {
            if (expectOperand && (c != '+' && c != '-')) return false;
            expectOperand = true;
        } else {
            return false;
        }

        lastWasOperator = expectOperand;
    }

    return parentheses.empty() && !lastWasOperator;
}

std::vector<Token> FormulaParser::TokenizeFormula(const std::string& formula) {
    return TokenizerUtils::TokenizeFormula(formula);
}

std::vector<Token> FormulaParser::ShuntingYardAlgorithm(const std::vector<Token>& tokens) {
    std::vector<Token> output;
    std::stack<Token> operators;

    for (const Token& token : tokens) {
        switch (token.type) {
            case TokenType::Number:
            case TokenType::CellReference:
                output.push_back(token);
                break;

            case TokenType::Function:
                operators.push(token);
                break;

            case TokenType::Operator:
                while (!operators.empty() &&
                       operators.top().type == TokenType::Operator &&
                       OPERATOR_PRECEDENCE.at(operators.top().value) >= OPERATOR_PRECEDENCE.at(token.value)) {
                    output.push_back(operators.top());
                    operators.pop();
                }
                operators.push(token);
                break;

            case TokenType::LeftParenthesis:
                operators.push(token);
                break;

            case TokenType::RightParenthesis:
                while (!operators.empty() && operators.top().type != TokenType::LeftParenthesis) {
                    output.push_back(operators.top());
                    operators.pop();
                }
                if (operators.empty()) {
                    throw CalculationError("Mismatched parentheses");
                }
                operators.pop(); // Remove the left parenthesis

                if (!operators.empty() && operators.top().type == TokenType::Function) {
                    output.push_back(operators.top());
                    operators.pop();
                }
                break;

            case TokenType::Comma:
                while (!operators.empty() && operators.top().type != TokenType::LeftParenthesis) {
                    output.push_back(operators.top());
                    operators.pop();
                }
                if (operators.empty()) {
                    throw CalculationError("Misplaced comma or mismatched parentheses");
                }
                break;

            default:
                throw CalculationError("Unknown token type");
        }
    }

    while (!operators.empty()) {
        if (operators.top().type == TokenType::LeftParenthesis) {
            throw CalculationError("Mismatched parentheses");
        }
        output.push_back(operators.top());
        operators.pop();
    }

    return output;
}