#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../../DataAnalysisEngine.h"
#include "../../../core-engine/Interfaces/IDataAnalysisEngine.h"
#include "../../test-helpers.ts"
#include "../../mock-data-generator.ts"

class DataAnalysisEngineIntegrationTest : public ::testing::Test {
protected:
    std::unique_ptr<IDataAnalysisEngine> dataAnalysisEngine;

    void SetUp() override {
        dataAnalysisEngine = std::make_unique<DataAnalysisEngine>();
    }

    void TearDown() override {
        dataAnalysisEngine.reset();
    }
};

TEST_F(DataAnalysisEngineIntegrationTest, SortLargeDataset) {
    // Generate large dataset
    auto largeDataset = MockDataGenerator::generateLargeDataset();

    // Call DataAnalysisEngine::SortData
    auto startTime = std::chrono::high_resolution_clock::now();
    auto sortedData = dataAnalysisEngine->SortData(largeDataset);
    auto endTime = std::chrono::high_resolution_clock::now();

    // Verify sorting correctness
    EXPECT_TRUE(std::is_sorted(sortedData.begin(), sortedData.end()));

    // Measure and assert performance
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    EXPECT_LT(duration.count(), 5000); // Assuming sorting should take less than 5 seconds for a large dataset
}

TEST_F(DataAnalysisEngineIntegrationTest, FilterComplexData) {
    // Generate complex dataset
    auto complexDataset = MockDataGenerator::generateComplexDataset();

    // Define filtering conditions
    auto filterConditions = MockDataGenerator::generateComplexFilterConditions();

    // Call DataAnalysisEngine::FilterData
    auto startTime = std::chrono::high_resolution_clock::now();
    auto filteredData = dataAnalysisEngine->FilterData(complexDataset, filterConditions);
    auto endTime = std::chrono::high_resolution_clock::now();

    // Verify filtering results
    EXPECT_TRUE(TestHelpers::verifyFilteredData(filteredData, complexDataset, filterConditions));

    // Measure and assert performance
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    EXPECT_LT(duration.count(), 3000); // Assuming filtering should take less than 3 seconds for a complex dataset
}

TEST_F(DataAnalysisEngineIntegrationTest, GenerateLargePivotTable) {
    // Generate large dataset
    auto largeDataset = MockDataGenerator::generateLargeDataset();

    // Define pivot table parameters
    auto pivotParams = MockDataGenerator::generatePivotTableParameters();

    // Call DataAnalysisEngine::GeneratePivotTable
    auto startTime = std::chrono::high_resolution_clock::now();
    auto pivotTable = dataAnalysisEngine->GeneratePivotTable(largeDataset, pivotParams);
    auto endTime = std::chrono::high_resolution_clock::now();

    // Verify pivot table correctness
    EXPECT_TRUE(TestHelpers::verifyPivotTable(pivotTable, largeDataset, pivotParams));

    // Measure and assert performance
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    EXPECT_LT(duration.count(), 10000); // Assuming pivot table generation should take less than 10 seconds for a large dataset
}

TEST_F(DataAnalysisEngineIntegrationTest, PerformAdvancedStatisticalAnalysis) {
    // Generate dataset for statistical analysis
    auto statisticalDataset = MockDataGenerator::generateStatisticalDataset();

    // Call DataAnalysisEngine::PerformStatisticalAnalysis
    auto startTime = std::chrono::high_resolution_clock::now();
    auto statisticalResults = dataAnalysisEngine->PerformStatisticalAnalysis(statisticalDataset);
    auto endTime = std::chrono::high_resolution_clock::now();

    // Verify statistical results
    EXPECT_TRUE(TestHelpers::verifyStatisticalResults(statisticalResults, statisticalDataset));

    // Measure and assert performance
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    EXPECT_LT(duration.count(), 5000); // Assuming statistical analysis should take less than 5 seconds
}

TEST_F(DataAnalysisEngineIntegrationTest, ForecastLongTimeSeries) {
    // Generate long historical time series data
    auto timeSeriesData = MockDataGenerator::generateLongTimeSeriesData();

    // Define forecasting parameters
    auto forecastParams = MockDataGenerator::generateForecastingParameters();

    // Call DataAnalysisEngine::ForecastTimeSeries
    auto startTime = std::chrono::high_resolution_clock::now();
    auto forecastResults = dataAnalysisEngine->ForecastTimeSeries(timeSeriesData, forecastParams);
    auto endTime = std::chrono::high_resolution_clock::now();

    // Verify forecasting results
    EXPECT_TRUE(TestHelpers::verifyForecastResults(forecastResults, timeSeriesData, forecastParams));

    // Measure and assert performance
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    EXPECT_LT(duration.count(), 15000); // Assuming time series forecasting should take less than 15 seconds for a long dataset
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}