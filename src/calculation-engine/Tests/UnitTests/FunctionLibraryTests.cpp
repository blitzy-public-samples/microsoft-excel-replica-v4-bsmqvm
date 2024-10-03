#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include <variant>
#include "../../FunctionLibrary/MathFunctions.h"
#include "../../FunctionLibrary/StatisticalFunctions.h"
#include "../../FunctionLibrary/FinancialFunctions.h"
#include "../../FunctionLibrary/LogicalFunctions.h"
#include "../../FunctionLibrary/TextFunctions.h"
#include "../../FunctionLibrary/DateTimeFunctions.h"
#include "../../FunctionLibrary/LookupFunctions.h"
#include "../../Interfaces/IFunctionLibrary.h"
#include "../../ErrorHandling/CalculationErrors.h"

using ::testing::Return;
using ::testing::_;

class FunctionLibraryTest : public ::testing::Test {
protected:
    std::unique_ptr<MathFunctions> mathFunctions;
    std::unique_ptr<StatisticalFunctions> statisticalFunctions;
    std::unique_ptr<FinancialFunctions> financialFunctions;
    std::unique_ptr<LogicalFunctions> logicalFunctions;
    std::unique_ptr<TextFunctions> textFunctions;
    std::unique_ptr<DateTimeFunctions> dateTimeFunctions;
    std::unique_ptr<LookupFunctions> lookupFunctions;

    void SetUp() override {
        mathFunctions = std::make_unique<MathFunctions>();
        statisticalFunctions = std::make_unique<StatisticalFunctions>();
        financialFunctions = std::make_unique<FinancialFunctions>();
        logicalFunctions = std::make_unique<LogicalFunctions>();
        textFunctions = std::make_unique<TextFunctions>();
        dateTimeFunctions = std::make_unique<DateTimeFunctions>();
        lookupFunctions = std::make_unique<LookupFunctions>();
    }

    void TearDown() override {
        mathFunctions.reset();
        statisticalFunctions.reset();
        financialFunctions.reset();
        logicalFunctions.reset();
        textFunctions.reset();
        dateTimeFunctions.reset();
        lookupFunctions.reset();
    }
};

// Math Functions Tests
TEST_F(FunctionLibraryTest, SumFunction) {
    std::vector<std::variant<int, double, std::string>> args = {1.0, 2.0, 3.0};
    auto result = mathFunctions->Sum(args);
    EXPECT_EQ(std::get<double>(result), 6.0);
}

TEST_F(FunctionLibraryTest, AverageFunction) {
    std::vector<std::variant<int, double, std::string>> args = {1.0, 2.0, 3.0};
    auto result = mathFunctions->Average(args);
    EXPECT_EQ(std::get<double>(result), 2.0);
}

// Statistical Functions Tests
TEST_F(FunctionLibraryTest, MedianFunction) {
    std::vector<std::variant<int, double, std::string>> args = {1.0, 2.0, 3.0, 4.0, 5.0};
    auto result = statisticalFunctions->Median(args);
    EXPECT_EQ(std::get<double>(result), 3.0);
}

TEST_F(FunctionLibraryTest, StdevFunction) {
    std::vector<std::variant<int, double, std::string>> args = {2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0};
    auto result = statisticalFunctions->Stdev(args);
    EXPECT_NEAR(std::get<double>(result), 2.0, 0.0001);
}

// Financial Functions Tests
TEST_F(FunctionLibraryTest, NPVFunction) {
    std::vector<std::variant<int, double, std::string>> args = {0.1, -10000.0, 3000.0, 4200.0, 6800.0};
    auto result = financialFunctions->NPV(args);
    EXPECT_NEAR(std::get<double>(result), 1188.44, 0.01);
}

// Logical Functions Tests
TEST_F(FunctionLibraryTest, IFFunction) {
    std::vector<std::variant<int, double, std::string>> args = {true, "True", "False"};
    auto result = logicalFunctions->IF(args);
    EXPECT_EQ(std::get<std::string>(result), "True");
}

// Text Functions Tests
TEST_F(FunctionLibraryTest, ConcatenateFunction) {
    std::vector<std::variant<int, double, std::string>> args = {"Hello", " ", "World"};
    auto result = textFunctions->Concatenate(args);
    EXPECT_EQ(std::get<std::string>(result), "Hello World");
}

// DateTime Functions Tests
TEST_F(FunctionLibraryTest, NowFunction) {
    auto result = dateTimeFunctions->Now();
    EXPECT_NE(std::get<double>(result), 0.0);
}

// Lookup Functions Tests
TEST_F(FunctionLibraryTest, VLookupFunction) {
    // Mock data for VLOOKUP
    std::vector<std::variant<int, double, std::string>> args = {
        "B", 
        {{"A", 1.0}, {"B", 2.0}, {"C", 3.0}},
        2,
        false
    };
    auto result = lookupFunctions->VLOOKUP(args);
    EXPECT_EQ(std::get<double>(result), 2.0);
}

// Error Handling Tests
TEST_F(FunctionLibraryTest, DivideByZeroError) {
    std::vector<std::variant<int, double, std::string>> args = {1.0, 0.0};
    EXPECT_THROW({
        try {
            mathFunctions->Divide(args);
        } catch (const CalculationError& e) {
            EXPECT_STREQ(e.what(), "Division by zero");
            throw;
        }
    }, CalculationError);
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}