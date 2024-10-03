#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../../DynamicArrays/DynamicArrayHandler.h"
#include "../../Interfaces/IFormulaParser.h"
#include "../../CalculationChain/CalculationChain.h"
#include "../../../core-engine/DataStructures/Range.h"
#include "../../../core-engine/DataStructures/Cell.h"

using ::testing::_;
using ::testing::Return;
using ::testing::NiceMock;

class MockFormulaParser : public IFormulaParser {
public:
    MOCK_METHOD(std::string, ParseFormula, (const std::string&), (override));
};

class MockCalculationChain : public CalculationChain {
public:
    MOCK_METHOD(void, UpdateDependencies, (const Range&), (override));
};

class DynamicArrayTests : public ::testing::Test {
protected:
    void SetUp() override {
        mockFormulaParser = std::make_shared<NiceMock<MockFormulaParser>>();
        mockCalculationChain = std::make_shared<NiceMock<MockCalculationChain>>();
        dynamicArrayHandler = std::make_unique<DynamicArrayHandler>(mockFormulaParser, mockCalculationChain);
    }

    void TearDown() override {
        dynamicArrayHandler.reset();
        mockFormulaParser.reset();
        mockCalculationChain.reset();
    }

    std::shared_ptr<MockFormulaParser> mockFormulaParser;
    std::shared_ptr<MockCalculationChain> mockCalculationChain;
    std::unique_ptr<DynamicArrayHandler> dynamicArrayHandler;
};

TEST_F(DynamicArrayTests, TestSimpleDynamicArray) {
    // Set up test data
    Range inputRange("A1:B3");
    std::vector<std::vector<Cell>> inputData = {
        {Cell("1"), Cell("2")},
        {Cell("3"), Cell("4")},
        {Cell("5"), Cell("6")}
    };
    std::string formula = "=A1:B3";

    // Set up expectations
    EXPECT_CALL(*mockFormulaParser, ParseFormula(formula))
        .WillOnce(Return("DYNAMICARRAY(A1:B3)"));

    // Call DynamicArrayHandler
    auto result = dynamicArrayHandler->EvaluateDynamicArray(formula, inputRange);

    // Assert results
    ASSERT_EQ(result.size(), 3);
    ASSERT_EQ(result[0].size(), 2);
    EXPECT_EQ(result[0][0].GetValue(), "1");
    EXPECT_EQ(result[0][1].GetValue(), "2");
    EXPECT_EQ(result[1][0].GetValue(), "3");
    EXPECT_EQ(result[1][1].GetValue(), "4");
    EXPECT_EQ(result[2][0].GetValue(), "5");
    EXPECT_EQ(result[2][1].GetValue(), "6");
}

TEST_F(DynamicArrayTests, TestComplexDynamicArray) {
    // Set up complex test data
    Range inputRange("A1:C3");
    std::vector<std::vector<Cell>> inputData = {
        {Cell("10"), Cell("20"), Cell("30")},
        {Cell("40"), Cell("50"), Cell("60")},
        {Cell("70"), Cell("80"), Cell("90")}
    };
    std::string formula = "=TRANSPOSE(A1:C3)";

    // Set up expectations
    EXPECT_CALL(*mockFormulaParser, ParseFormula(formula))
        .WillOnce(Return("DYNAMICARRAY(TRANSPOSE(A1:C3))"));

    // Call DynamicArrayHandler
    auto result = dynamicArrayHandler->EvaluateDynamicArray(formula, inputRange);

    // Assert complex results
    ASSERT_EQ(result.size(), 3);
    ASSERT_EQ(result[0].size(), 3);
    EXPECT_EQ(result[0][0].GetValue(), "10");
    EXPECT_EQ(result[0][1].GetValue(), "40");
    EXPECT_EQ(result[0][2].GetValue(), "70");
    EXPECT_EQ(result[1][0].GetValue(), "20");
    EXPECT_EQ(result[1][1].GetValue(), "50");
    EXPECT_EQ(result[1][2].GetValue(), "80");
    EXPECT_EQ(result[2][0].GetValue(), "30");
    EXPECT_EQ(result[2][1].GetValue(), "60");
    EXPECT_EQ(result[2][2].GetValue(), "90");
}

TEST_F(DynamicArrayTests, TestDynamicArraySpilling) {
    // Set up spill scenario
    Range inputRange("A1:B2");
    std::vector<std::vector<Cell>> inputData = {
        {Cell("1"), Cell("2")},
        {Cell("3"), Cell("4")}
    };
    std::string formula = "=A1:B2";
    Range spillRange("C3:D4");

    // Set up expectations
    EXPECT_CALL(*mockFormulaParser, ParseFormula(formula))
        .WillOnce(Return("DYNAMICARRAY(A1:B2)"));
    EXPECT_CALL(*mockCalculationChain, UpdateDependencies(spillRange));

    // Call DynamicArrayHandler
    auto result = dynamicArrayHandler->EvaluateDynamicArrayWithSpill(formula, inputRange, spillRange);

    // Assert spill behavior
    ASSERT_EQ(result.size(), 2);
    ASSERT_EQ(result[0].size(), 2);
    EXPECT_EQ(result[0][0].GetValue(), "1");
    EXPECT_EQ(result[0][1].GetValue(), "2");
    EXPECT_EQ(result[1][0].GetValue(), "3");
    EXPECT_EQ(result[1][1].GetValue(), "4");
}

TEST_F(DynamicArrayTests, TestDynamicArrayDependencies) {
    // Set up dependencies
    Range inputRange("A1:B2");
    std::vector<std::vector<Cell>> inputData = {
        {Cell("1"), Cell("=A1*2")},
        {Cell("3"), Cell("=B1*2")}
    };
    std::string formula = "=A1:B2";

    // Set up expectations
    EXPECT_CALL(*mockFormulaParser, ParseFormula(formula))
        .WillOnce(Return("DYNAMICARRAY(A1:B2)"));
    EXPECT_CALL(*mockCalculationChain, UpdateDependencies(inputRange));

    // Call DynamicArrayHandler
    auto result = dynamicArrayHandler->EvaluateDynamicArrayWithDependencies(formula, inputRange);

    // Assert dependency updates
    ASSERT_EQ(result.size(), 2);
    ASSERT_EQ(result[0].size(), 2);
    EXPECT_EQ(result[0][0].GetValue(), "1");
    EXPECT_EQ(result[0][1].GetValue(), "2");
    EXPECT_EQ(result[1][0].GetValue(), "3");
    EXPECT_EQ(result[1][1].GetValue(), "4");
}

TEST_F(DynamicArrayTests, TestDynamicArrayErrorHandling) {
    // Set up error scenario
    Range inputRange("A1:B2");
    std::string formula = "=A1:B2/0";

    // Set up expectations
    EXPECT_CALL(*mockFormulaParser, ParseFormula(formula))
        .WillOnce(Return("DYNAMICARRAY(A1:B2/0)"));

    // Call DynamicArrayHandler
    auto result = dynamicArrayHandler->EvaluateDynamicArray(formula, inputRange);

    // Assert error handling
    ASSERT_EQ(result.size(), 1);
    ASSERT_EQ(result[0].size(), 1);
    EXPECT_EQ(result[0][0].GetValue(), "#DIV/0!");
}

// Additional tests can be added here to cover more scenarios