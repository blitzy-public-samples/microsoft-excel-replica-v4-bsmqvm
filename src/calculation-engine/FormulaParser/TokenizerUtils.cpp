#include "TokenizerUtils.h"
#include <cctype>
#include <string>
#include <vector>

namespace ExcelFormula {

bool IsOperator(char c) {
    static const std::string operators = "+-*/^=><";
    return operators.find(c) != std::string::npos;
}

bool IsDigit(char c) {
    return std::isdigit(static_cast<unsigned char>(c)) != 0;
}

bool IsAlpha(char c) {
    return std::isalpha(static_cast<unsigned char>(c)) != 0;
}

std::vector<Token> TokenizeFormula(const std::string& formula) {
    std::vector<Token> tokens;
    std::string currentToken;
    TokenType currentType = TokenType::Unknown;

    auto flushToken = [&]() {
        if (!currentToken.empty()) {
            tokens.push_back({currentType, currentToken});
            currentToken.clear();
            currentType = TokenType::Unknown;
        }
    };

    for (size_t i = 0; i < formula.length(); ++i) {
        char c = formula[i];

        if (std::isspace(static_cast<unsigned char>(c))) {
            flushToken();
            continue;
        }

        if (IsOperator(c)) {
            flushToken();
            tokens.push_back({TokenType::Operator, std::string(1, c)});
            continue;
        }

        if (IsDigit(c) || (c == '.' && currentType == TokenType::Number)) {
            if (currentType != TokenType::Number) {
                flushToken();
                currentType = TokenType::Number;
            }
            currentToken += c;
        } else if (IsAlpha(c) || c == '_' || (currentType == TokenType::Identifier && IsDigit(c))) {
            if (currentType != TokenType::Identifier) {
                flushToken();
                currentType = TokenType::Identifier;
            }
            currentToken += c;
        } else if (c == '"') {
            flushToken();
            currentType = TokenType::String;
            currentToken += c;
            ++i;
            while (i < formula.length() && formula[i] != '"') {
                currentToken += formula[i];
                ++i;
            }
            if (i < formula.length()) {
                currentToken += formula[i];
            }
            flushToken();
        } else if (c == '(' || c == ')' || c == ',' || c == ':') {
            flushToken();
            tokens.push_back({TokenType::Special, std::string(1, c)});
        } else {
            // Handle unexpected characters
            flushToken();
            tokens.push_back({TokenType::Unknown, std::string(1, c)});
        }
    }

    flushToken();
    return tokens;
}

} // namespace ExcelFormula