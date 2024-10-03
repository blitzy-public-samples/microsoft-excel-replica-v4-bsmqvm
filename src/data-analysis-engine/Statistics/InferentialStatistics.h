#ifndef INFERENTIAL_STATISTICS_H
#define INFERENTIAL_STATISTICS_H

#include <vector>
#include <string>
#include <utility>
#include "../DataAnalysisEngine.h"
#include "DescriptiveStatistics.h"

namespace Microsoft {
namespace Excel {
namespace DataAnalysisEngine {
namespace Statistics {

class InferentialStatistics {
public:
    // Performs a t-test on two samples and returns the p-value
    static double performTTest(const std::vector<double>& sample1, const std::vector<double>& sample2, bool pairedTest);

    // Performs a one-way ANOVA test on multiple groups and returns the p-value
    static double performANOVA(const std::vector<std::vector<double>>& groups);

    // Performs a chi-square test and returns the p-value
    static double performChiSquareTest(const std::vector<std::vector<double>>& observedFrequencies,
                                       const std::vector<std::vector<double>>& expectedFrequencies);

    // Calculates the confidence interval for a given dataset and confidence level
    static std::pair<double, double> calculateConfidenceInterval(const std::vector<double>& data, double confidenceLevel);

    // Performs simple linear regression and returns the slope and intercept
    static std::pair<double, double> performLinearRegression(const std::vector<double>& x, const std::vector<double>& y);

    // Calculates the Pearson correlation coefficient between two variables
    static double calculateCorrelationCoefficient(const std::vector<double>& x, const std::vector<double>& y);

private:
    // Private constructor to prevent instantiation
    InferentialStatistics() = delete;

    // Helper functions for internal calculations
    static double calculateTStatistic(const std::vector<double>& sample1, const std::vector<double>& sample2, bool pairedTest);
    static double calculateFStatistic(const std::vector<std::vector<double>>& groups);
    static double calculateChiSquareStatistic(const std::vector<std::vector<double>>& observed,
                                              const std::vector<std::vector<double>>& expected);
    static double calculatePValue(double statistic, int degreesOfFreedom, const std::string& testType);
};

} // namespace Statistics
} // namespace DataAnalysisEngine
} // namespace Excel
} // namespace Microsoft

#endif // INFERENTIAL_STATISTICS_H