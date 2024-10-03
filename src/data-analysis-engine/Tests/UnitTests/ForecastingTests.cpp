#include <gtest/gtest.h>
#include "../../Forecasting/TimeSeries.h"
#include "../../Utils/DataAnalysisUtils.h"
#include <vector>
#include <map>
#include <cmath>
#include <chrono>

class ForecastingTests : public ::testing::Test {
protected:
    void SetUp() override {
        // Common setup for all tests
    }

    void TearDown() override {
        // Common cleanup for all tests
    }

    // Helper function to generate test data
    std::vector<double> generateTestData(int size, double trend = 0.1, double seasonality = 10.0, double noise = 1.0) {
        std::vector<double> data;
        for (int i = 0; i < size; ++i) {
            double value = i * trend + seasonality * std::sin(i * 2 * M_PI / 12) + noise * (rand() % 100 - 50) / 50.0;
            data.push_back(value);
        }
        return data;
    }
};

TEST_F(ForecastingTests, TestForecast) {
    // Initialize test data
    std::vector<double> testData = generateTestData(100);
    TimeSeries timeSeries(testData);

    // Call Forecast method
    int forecastHorizon = 12;
    std::vector<double> forecast = timeSeries.Forecast(forecastHorizon);

    // Assert expected forecast results
    ASSERT_EQ(forecast.size(), forecastHorizon);
    for (const auto& value : forecast) {
        ASSERT_FALSE(std::isnan(value));
        ASSERT_FALSE(std::isinf(value));
    }

    // Check if the forecast follows the general trend of the data
    double lastValue = testData.back();
    double forecastTrend = (forecast.back() - lastValue) / forecastHorizon;
    double dataTrend = (lastValue - testData[0]) / testData.size();
    ASSERT_NEAR(forecastTrend, dataTrend, 0.5); // Allow for some deviation
}

TEST_F(ForecastingTests, TestCalculateMovingAverage) {
    // Initialize test data
    std::vector<double> testData = generateTestData(100);
    TimeSeries timeSeries(testData);

    // Call CalculateMovingAverage method
    int windowSize = 5;
    std::vector<double> movingAverage = timeSeries.CalculateMovingAverage(windowSize);

    // Assert expected moving average results
    ASSERT_EQ(movingAverage.size(), testData.size() - windowSize + 1);
    for (size_t i = 0; i < movingAverage.size(); ++i) {
        double expectedAvg = 0;
        for (int j = 0; j < windowSize; ++j) {
            expectedAvg += testData[i + j];
        }
        expectedAvg /= windowSize;
        ASSERT_NEAR(movingAverage[i], expectedAvg, 1e-6);
    }
}

TEST_F(ForecastingTests, TestPerformSeasonalDecomposition) {
    // Initialize test data with known seasonality
    int seasonLength = 12;
    std::vector<double> testData = generateTestData(120, 0.1, 10.0, 0.5);
    TimeSeries timeSeries(testData);

    // Call PerformSeasonalDecomposition method
    std::map<std::string, std::vector<double>> decomposition = timeSeries.PerformSeasonalDecomposition(seasonLength);

    // Assert expected seasonal decomposition results
    ASSERT_EQ(decomposition.size(), 4); // Trend, Seasonal, Residual, and Original components
    ASSERT_EQ(decomposition["trend"].size(), testData.size());
    ASSERT_EQ(decomposition["seasonal"].size(), testData.size());
    ASSERT_EQ(decomposition["residual"].size(), testData.size());
    ASSERT_EQ(decomposition["original"].size(), testData.size());

    // Check if the seasonal component repeats
    for (size_t i = 0; i < decomposition["seasonal"].size() - seasonLength; ++i) {
        ASSERT_NEAR(decomposition["seasonal"][i], decomposition["seasonal"][i + seasonLength], 1e-6);
    }

    // Check if the components sum up to the original data
    for (size_t i = 0; i < testData.size(); ++i) {
        double sum = decomposition["trend"][i] + decomposition["seasonal"][i] + decomposition["residual"][i];
        ASSERT_NEAR(sum, testData[i], 1e-6);
    }
}

TEST_F(ForecastingTests, TestDetectOutliers) {
    // Initialize test data with known outliers
    std::vector<double> testData = generateTestData(100);
    testData[25] = testData[25] * 5; // Introduce an outlier
    testData[75] = testData[75] * -5; // Introduce another outlier
    TimeSeries timeSeries(testData);

    // Call DetectOutliers method
    std::vector<size_t> outliers = timeSeries.DetectOutliers();

    // Assert correct identification of outliers
    ASSERT_EQ(outliers.size(), 2);
    ASSERT_TRUE(std::find(outliers.begin(), outliers.end(), 25) != outliers.end());
    ASSERT_TRUE(std::find(outliers.begin(), outliers.end(), 75) != outliers.end());
}

TEST_F(ForecastingTests, TestPerformanceWithLargeDataset) {
    // Generate large test dataset
    std::vector<double> largeTestData = generateTestData(1000000);
    TimeSeries timeSeries(largeTestData);

    // Measure execution time of various methods
    auto start = std::chrono::high_resolution_clock::now();
    
    timeSeries.Forecast(12);
    timeSeries.CalculateMovingAverage(30);
    timeSeries.PerformSeasonalDecomposition(12);
    timeSeries.DetectOutliers();

    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);

    // Assert performance meets specified benchmarks
    ASSERT_LT(duration.count(), 5000); // Assuming 5 seconds is the maximum acceptable time
}

// Additional tests can be added here to cover more scenarios and edge cases