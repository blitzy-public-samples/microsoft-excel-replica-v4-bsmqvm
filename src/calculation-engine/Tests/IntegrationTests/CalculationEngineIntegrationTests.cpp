#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "CalculationEngine.h"
#include "Interfaces/IFormulaParser.h"
#include "Interfaces/IFunctionLibrary.h"
#include "Interfaces/ICalculationChain.h"
#include "ErrorHandling/CalculationErrors.h"

class CalculationEngineIntegrationTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Initialize the CalculationEngine and its dependencies
        calculationEngine = std::make_unique<CalculationEngine>();
    }

    void TearDown() override {
        // Clean up resources
        calculationEngine.reset();
    }

    std::unique_ptr<CalculationEngine> calculationEngine;
};

TEST_F(CalculationEngineIntegrationTest, BasicFormulaCalculation) {
    // Test basic formula calculation functionality
    EXPECT_EQ(calculationEngine->Calculate("=1+1"), 2);
    EXPECT_EQ(calculationEngine->Calculate("=5*3"), 15);
    EXPECT_EQ(calculationEngine->Calculate("=10/2"), 5);
}

TEST_F(CalculationEngineIntegrationTest, ComplexFormulaCalculation) {
    // Test complex formula calculation involving multiple functions and cell references
    calculationEngine->SetCellValue("A1", 10);
    calculationEngine->SetCellValue("B1", 20);
    EXPECT_EQ(calculationEngine->Calculate("=SUM(A1:B1) * 2"), 60);
    EXPECT_EQ(calculationEngine->Calculate("=AVERAGE(A1:B1) + 5"), 20);
}

TEST_F(CalculationEngineIntegrationTest, ArrayFormulaHandling) {
    // Test the handling of array formulas
    calculationEngine->SetCellValue("A1:A3", {1, 2, 3});
    calculationEngine->SetCellValue("B1:B3", {4, 5, 6});
    auto result = calculationEngine->Calculate("=A1:A3 * B1:B3");
    EXPECT_EQ(result, std::vector<int>({4, 10, 18}));
}

TEST_F(CalculationEngineIntegrationTest, DynamicArrayHandling) {
    // Test the handling of dynamic arrays
    calculationEngine->SetCellValue("A1:A3", {1, 2, 3});
    auto result = calculationEngine->Calculate("=SORT(A1:A3, 1, -1)");
    EXPECT_EQ(result, std::vector<int>({3, 2, 1}));
}

TEST_F(CalculationEngineIntegrationTest, CircularReferenceDetection) {
    // Test the detection and handling of circular references in formulas
    calculationEngine->SetCellFormula("A1", "=B1");
    calculationEngine->SetCellFormula("B1", "=A1");
    EXPECT_THROW(calculationEngine->Calculate("A1"), CircularReferenceError);
}

TEST_F(CalculationEngineIntegrationTest, LargeDatasetPerformance) {
    // Test the performance of the calculation engine with large datasets
    const int SIZE = 10000;
    for (int i = 0; i < SIZE; ++i) {
        calculationEngine->SetCellValue("A" + std::to_string(i + 1), i);
    }
    auto start = std::chrono::high_resolution_clock::now();
    auto result = calculationEngine->Calculate("=SUM(A1:A10000)");
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    
    EXPECT_EQ(result, (SIZE * (SIZE - 1)) / 2);
    EXPECT_LT(duration.count(), 1000); // Expect calculation to take less than 1 second
}

TEST_F(CalculationEngineIntegrationTest, MultiThreadedCalculation) {
    // Test the parallel calculation capabilities of the engine
    const int THREADS = 4;
    const int CELLS_PER_THREAD = 1000;
    
    std::vector<std::thread> threads;
    for (int t = 0; t < THREADS; ++t) {
        threads.emplace_back([this, t, CELLS_PER_THREAD]() {
            for (int i = 0; i < CELLS_PER_THREAD; ++i) {
                std::string cellRef = "Thread" + std::to_string(t) + "Cell" + std::to_string(i);
                calculationEngine->SetCellValue(cellRef, i);
                calculationEngine->Calculate("=" + cellRef + " * 2");
            }
        });
    }
    
    for (auto& thread : threads) {
        thread.join();
    }
    
    // Verify results
    for (int t = 0; t < THREADS; ++t) {
        for (int i = 0; i < CELLS_PER_THREAD; ++i) {
            std::string cellRef = "Thread" + std::to_string(t) + "Cell" + std::to_string(i);
            EXPECT_EQ(calculationEngine->GetCellValue(cellRef), i * 2);
        }
    }
}

TEST_F(CalculationEngineIntegrationTest, ErrorHandling) {
    // Test various error scenarios and their handling by the calculation engine
    EXPECT_THROW(calculationEngine->Calculate("=1/0"), DivideByZeroError);
    EXPECT_THROW(calculationEngine->Calculate("=SQRT(-1)"), InvalidArgumentError);
    EXPECT_THROW(calculationEngine->Calculate("=VLOOKUP()"), IncorrectNumberOfArgumentsError);
    EXPECT_THROW(calculationEngine->Calculate("=A1"), UndefinedNameError);
}

// Run all the tests
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}