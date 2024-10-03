#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../../FormulaParser/FormulaParser.h"
#include "../../Interfaces/IFormulaParser.h"
#include "../../ErrorHandling/CalculationErrors.h"

class FormulaParserTests : public ::testing::Test {
protected:
    std::unique_ptr<IFormulaParser> formulaParser;

    void SetUp() override {
        formulaParser = std::make_unique<FormulaParser>();
    }
};

TEST_F(FormulaParserTests, ParseSimpleFormula) {
    // This test case verifies that the FormulaParser correctly parses a simple formula.
    const std::string simpleFormula = "=A1+B2";
    auto result = formulaParser->ParseFormula(simpleFormula);

    ASSERT_EQ(result.size(), 3);
    EXPECT_EQ(result[0].type, TokenType::CellReference);
    EXPECT_EQ(result[0].value, "A1");
    EXPECT_EQ(result[1].type, TokenType::Operator);
    EXPECT_EQ(result[1].value, "+");
    EXPECT_EQ(result[2].type, TokenType::CellReference);
    EXPECT_EQ(result[2].value, "B2");
}

TEST_F(FormulaParserTests, ParseComplexFormula) {
    // This test case verifies that the FormulaParser correctly parses a complex formula with multiple operators and functions.
    const std::string complexFormula = "=SUM(A1:A10) + AVERAGE(B1:B5) * 2";
    auto result = formulaParser->ParseFormula(complexFormula);

    ASSERT_EQ(result.size(), 7);
    EXPECT_EQ(result[0].type, TokenType::Function);
    EXPECT_EQ(result[0].value, "SUM");
    EXPECT_EQ(result[1].type, TokenType::Range);
    EXPECT_EQ(result[1].value, "A1:A10");
    EXPECT_EQ(result[2].type, TokenType::Operator);
    EXPECT_EQ(result[2].value, "+");
    EXPECT_EQ(result[3].type, TokenType::Function);
    EXPECT_EQ(result[3].value, "AVERAGE");
    EXPECT_EQ(result[4].type, TokenType::Range);
    EXPECT_EQ(result[4].value, "B1:B5");
    EXPECT_EQ(result[5].type, TokenType::Operator);
    EXPECT_EQ(result[5].value, "*");
    EXPECT_EQ(result[6].type, TokenType::Number);
    EXPECT_EQ(result[6].value, "2");
}

TEST_F(FormulaParserTests, ValidateCorrectFormula) {
    // This test case checks that the FormulaParser correctly validates a syntactically correct formula.
    const std::string validFormula = "=IF(A1>10, SUM(B1:B5), C1)";
    bool isValid = formulaParser->ValidateFormula(validFormula);

    EXPECT_TRUE(isValid);
}

TEST_F(FormulaParserTests, ValidateIncorrectFormula) {
    // This test case ensures that the FormulaParser correctly identifies and rejects an invalid formula.
    const std::string invalidFormula = "=IF(A1>10, SUM(B1:B5), C1";  // Missing closing parenthesis
    bool isValid = formulaParser->ValidateFormula(invalidFormula);

    EXPECT_FALSE(isValid);
}

TEST_F(FormulaParserTests, HandleDivideByZeroError) {
    // This test case verifies that the FormulaParser correctly handles and reports a divide by zero error.
    const std::string divideByZeroFormula = "=10 / 0";

    EXPECT_THROW({
        try {
            formulaParser->ParseFormula(divideByZeroFormula);
        } catch (const CalculationException& e) {
            EXPECT_EQ(e.GetErrorCode(), CalculationErrorCode::DIVIDE_BY_ZERO);
            throw;
        }
    }, CalculationException);
}

// Additional test cases can be added here to cover more scenarios and edge cases

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}