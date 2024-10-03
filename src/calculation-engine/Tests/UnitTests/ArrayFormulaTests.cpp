#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../../ArrayFormulas/ArrayFormulaHandler.h"
#include "../../Interfaces/IFormulaParser.h"
#include "../../../core-engine/DataStructures/Range.h"
#include "../../../core-engine/DataStructures/Cell.h"
#include "../../CalculationChain/CalculationChain.h"

using ::testing::_;
using ::testing::Return;
using ::testing::NiceMock;

class MockFormulaParser : public IFormulaParser {
public:
    MOCK_METHOD(std::string, ParseFormula, (const std::string&), (override));
};

class MockCalculationChain : public CalculationChain {
public:
    MOCK_METHOD(void, AddDependency, (const Cell*, const Cell*), (override));
    MOCK_METHOD(void, MarkAsDirty, (const Cell*), (override));
};

class ArrayFormulaTests : public ::testing::Test {
protected:
    void SetUp() override {
        mockFormulaParser = std::make_shared<NiceMock<MockFormulaParser>>();
        mockCalculationChain = std::make_shared<NiceMock<MockCalculationChain>>();
        arrayFormulaHandler = std::make_unique<ArrayFormulaHandler>(mockFormulaParser, mockCalculationChain);
    }

    void TearDown() override {
        arrayFormulaHandler.reset();
        mockFormulaParser.reset();
        mockCalculationChain.reset();
    }

    std::shared_ptr<MockFormulaParser> mockFormulaParser;
    std::shared_ptr<MockCalculationChain> mockCalculationChain;
    std::unique_ptr<ArrayFormulaHandler> arrayFormulaHandler;
};

TEST_F(ArrayFormulaTests, TestSimpleArrayFormula) {
    // Arrange
    Range inputRange(Cell("A1"), Cell("B2"));
    std::string formula = "{=A1:B2*2}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("MULTIPLY(A1:B2,2)"));

    // Act
    auto result = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);

    // Assert
    ASSERT_EQ(result.size(), 2);
    ASSERT_EQ(result[0].size(), 2);
    // Add more specific assertions based on the expected output
}

TEST_F(ArrayFormulaTests, TestComplexArrayFormula) {
    // Arrange
    Range inputRange(Cell("A1"), Cell("C3"));
    std::string formula = "{=SUMIF(A1:C3,\">5\",A1:C3)}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("SUMIF(A1:C3,\">5\",A1:C3)"));

    // Act
    auto result = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);

    // Assert
    ASSERT_EQ(result.size(), 3);
    ASSERT_EQ(result[0].size(), 3);
    // Add more specific assertions based on the expected output
}

TEST_F(ArrayFormulaTests, TestArrayFormulaWithRangeInput) {
    // Arrange
    Range inputRange(Cell("A1"), Cell("B2"));
    std::string formula = "{=TRANSPOSE(A1:B2)}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("TRANSPOSE(A1:B2)"));

    // Act
    auto result = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);

    // Assert
    ASSERT_EQ(result.size(), 2);
    ASSERT_EQ(result[0].size(), 2);
    // Add more specific assertions based on the expected output
}

TEST_F(ArrayFormulaTests, TestDynamicArrayFormula) {
    // Arrange
    Range inputRange(Cell("A1"), Cell("A1"));
    std::string formula = "{=SEQUENCE(3,2)}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("SEQUENCE(3,2)"));

    // Act
    auto result = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);

    // Assert
    ASSERT_EQ(result.size(), 3);
    ASSERT_EQ(result[0].size(), 2);
    // Add more specific assertions based on the expected output
}

TEST_F(ArrayFormulaTests, TestArrayFormulaDependencies) {
    // Arrange
    Range inputRange(Cell("A1"), Cell("B2"));
    std::string formula = "{=A1:B2*C1:D2}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("MULTIPLY(A1:B2,C1:D2)"));

    EXPECT_CALL(*mockCalculationChain, AddDependency(_, _))
        .Times(4);

    // Act
    arrayFormulaHandler->UpdateArrayFormulaDependencies(formula, inputRange);

    // Assert
    // Verification is done by the EXPECT_CALL above
}

TEST_F(ArrayFormulaTests, TestArrayFormulaErrorHandling) {
    // Arrange
    Range inputRange(Cell("A1"), Cell("B2"));
    std::string formula = "{=A1:B2/0}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("DIVIDE(A1:B2,0)"));

    // Act
    auto result = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);

    // Assert
    ASSERT_EQ(result.size(), 2);
    ASSERT_EQ(result[0].size(), 2);
    for (const auto& row : result) {
        for (const auto& cell : row) {
            EXPECT_EQ(cell.GetError(), "#DIV/0!");
        }
    }
}

TEST_F(ArrayFormulaTests, TestLargeArrayFormula) {
    // Arrange
    Range inputRange(Cell("A1"), Cell("Z100"));
    std::string formula = "{=RAND(100,26)}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("RAND(100,26)"));

    // Act
    auto start = std::chrono::high_resolution_clock::now();
    auto result = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);
    auto end = std::chrono::high_resolution_clock::now();

    // Assert
    ASSERT_EQ(result.size(), 100);
    ASSERT_EQ(result[0].size(), 26);
    
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    EXPECT_LT(duration.count(), 1000); // Expect execution time to be less than 1 second
}

TEST_F(ArrayFormulaTests, TestArrayFormulaWithNestedFunctions) {
    // Arrange
    Range inputRange(Cell("A1"), Cell("B2"));
    std::string formula = "{=IF(A1:B2>5,SQRT(A1:B2),A1:B2^2)}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("IF(GREATER(A1:B2,5),SQRT(A1:B2),POWER(A1:B2,2))"));

    // Act
    auto result = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);

    // Assert
    ASSERT_EQ(result.size(), 2);
    ASSERT_EQ(result[0].size(), 2);
    // Add more specific assertions based on the expected output
}

TEST_F(ArrayFormulaTests, TestArrayFormulaRecalculation) {
    // Arrange
    Range inputRange(Cell("A1"), Cell("B2"));
    std::string formula = "{=A1:B2*2}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("MULTIPLY(A1:B2,2)"));

    // Act
    auto initialResult = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);
    
    // Simulate changing a dependent cell
    EXPECT_CALL(*mockCalculationChain, MarkAsDirty(_))
        .Times(1);
    arrayFormulaHandler->NotifyDependentCellChanged(Cell("A1"));

    auto recalculatedResult = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);

    // Assert
    ASSERT_EQ(recalculatedResult.size(), 2);
    ASSERT_EQ(recalculatedResult[0].size(), 2);
    // Add more specific assertions to check if the recalculation produced the expected result
}

TEST_F(ArrayFormulaTests, TestArrayFormulaWithMixedReferences) {
    // Arrange
    Range inputRange(Cell("B2"), Cell("C3"));
    std::string formula = "{=$A$1:$A$2*B2:C3}";
    
    ON_CALL(*mockFormulaParser, ParseFormula(_))
        .WillByDefault(Return("MULTIPLY($A$1:$A$2,B2:C3)"));

    // Act
    auto result = arrayFormulaHandler->EvaluateArrayFormula(formula, inputRange);

    // Assert
    ASSERT_EQ(result.size(), 2);
    ASSERT_EQ(result[0].size(), 2);
    // Add more specific assertions based on the expected output, 
    // checking that absolute and relative references are handled correctly
}

// Add more test cases as needed to cover edge cases and specific scenarios