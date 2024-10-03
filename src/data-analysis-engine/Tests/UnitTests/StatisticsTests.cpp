#include <gtest/gtest.h>
#include <vector>
#include <cmath>
#include "../../Statistics/DescriptiveStatistics.h"

class StatisticsTests : public ::testing::Test {
protected:
    DescriptiveStatistics stats;
    const double EPSILON = 1e-6;
};

TEST_F(StatisticsTests, CalculateMean) {
    std::vector<double> data = {1.0, 2.0, 3.0, 4.0, 5.0};
    double expected_mean = 3.0;
    EXPECT_DOUBLE_EQ(stats.calculateMean(data), expected_mean);
}

TEST_F(StatisticsTests, CalculateMedian) {
    std::vector<double> odd_data = {1.0, 3.0, 2.0, 5.0, 4.0};
    std::vector<double> even_data = {1.0, 2.0, 3.0, 4.0};
    
    EXPECT_DOUBLE_EQ(stats.calculateMedian(odd_data), 3.0);
    EXPECT_DOUBLE_EQ(stats.calculateMedian(even_data), 2.5);
}

TEST_F(StatisticsTests, CalculateMode) {
    std::vector<double> single_mode_data = {1.0, 2.0, 2.0, 3.0, 4.0};
    std::vector<double> multi_mode_data = {1.0, 2.0, 2.0, 3.0, 3.0, 4.0};
    
    std::vector<double> expected_single_mode = {2.0};
    std::vector<double> expected_multi_mode = {2.0, 3.0};
    
    EXPECT_EQ(stats.calculateMode(single_mode_data), expected_single_mode);
    EXPECT_EQ(stats.calculateMode(multi_mode_data), expected_multi_mode);
}

TEST_F(StatisticsTests, CalculateVariance) {
    std::vector<double> data = {2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0};
    double expected_variance = 4.0;
    EXPECT_NEAR(stats.calculateVariance(data), expected_variance, EPSILON);
}

TEST_F(StatisticsTests, CalculateStandardDeviation) {
    std::vector<double> data = {2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0};
    double expected_std_dev = 2.0;
    EXPECT_NEAR(stats.calculateStandardDeviation(data), expected_std_dev, EPSILON);
}

TEST_F(StatisticsTests, CalculateSkewness) {
    std::vector<double> positive_skew = {1.0, 2.0, 2.0, 3.0, 3.0, 3.0, 4.0, 5.0, 6.0};
    std::vector<double> negative_skew = {1.0, 2.0, 3.0, 4.0, 5.0, 5.0, 5.0, 6.0, 6.0};
    std::vector<double> zero_skew = {1.0, 2.0, 3.0, 3.0, 3.0, 4.0, 5.0};
    
    EXPECT_GT(stats.calculateSkewness(positive_skew), 0);
    EXPECT_LT(stats.calculateSkewness(negative_skew), 0);
    EXPECT_NEAR(stats.calculateSkewness(zero_skew), 0, EPSILON);
}

TEST_F(StatisticsTests, CalculateKurtosis) {
    std::vector<double> normal_dist = {-3, -2, -1, 0, 1, 2, 3};
    std::vector<double> high_kurtosis = {-7, -5, 1, 1, 1, 5, 7};
    std::vector<double> low_kurtosis = {-1, 0, 0, 0, 0, 0, 1};
    
    double normal_kurtosis = stats.calculateKurtosis(normal_dist);
    double high_kurtosis_value = stats.calculateKurtosis(high_kurtosis);
    double low_kurtosis_value = stats.calculateKurtosis(low_kurtosis);
    
    EXPECT_NEAR(normal_kurtosis, 3.0, EPSILON);
    EXPECT_GT(high_kurtosis_value, normal_kurtosis);
    EXPECT_LT(low_kurtosis_value, normal_kurtosis);
}

TEST_F(StatisticsTests, CalculatePercentile) {
    std::vector<double> data = {15, 20, 35, 40, 50};
    
    EXPECT_NEAR(stats.calculatePercentile(data, 25), 20, EPSILON);
    EXPECT_NEAR(stats.calculatePercentile(data, 50), 35, EPSILON);
    EXPECT_NEAR(stats.calculatePercentile(data, 75), 40, EPSILON);
    EXPECT_NEAR(stats.calculatePercentile(data, 100), 50, EPSILON);
}

TEST_F(StatisticsTests, GenerateSummaryStatistics) {
    std::vector<double> data = {2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0};
    std::string summary = stats.generateSummaryStatistics(data);
    
    EXPECT_TRUE(summary.find("Mean") != std::string::npos);
    EXPECT_TRUE(summary.find("Median") != std::string::npos);
    EXPECT_TRUE(summary.find("Mode") != std::string::npos);
    EXPECT_TRUE(summary.find("Variance") != std::string::npos);
    EXPECT_TRUE(summary.find("Standard Deviation") != std::string::npos);
    EXPECT_TRUE(summary.find("Skewness") != std::string::npos);
    EXPECT_TRUE(summary.find("Kurtosis") != std::string::npos);
}