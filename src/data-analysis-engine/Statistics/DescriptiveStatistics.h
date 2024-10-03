#ifndef DESCRIPTIVE_STATISTICS_H
#define DESCRIPTIVE_STATISTICS_H

#include <vector>
#include <string>
#include "src/data-analysis-engine/DataAnalysisEngine.h"

namespace DataAnalysisEngine {
namespace Statistics {

/**
 * @class DescriptiveStatistics
 * @brief A class that provides static methods for calculating various descriptive statistics.
 * 
 * This class is responsible for performing various descriptive statistical calculations
 * on datasets within the Microsoft Excel Data Analysis Engine.
 */
class DescriptiveStatistics {
public:
    /**
     * @brief Calculates the arithmetic mean of a given dataset.
     * @param data The input dataset.
     * @return The calculated mean.
     */
    static double calculateMean(const std::vector<double>& data);

    /**
     * @brief Calculates the median of a given dataset.
     * @param data The input dataset.
     * @return The calculated median.
     */
    static double calculateMedian(std::vector<double> data);

    /**
     * @brief Calculates the mode(s) of a given dataset.
     * @param data The input dataset.
     * @return A vector containing the calculated mode(s).
     */
    static std::vector<double> calculateMode(const std::vector<double>& data);

    /**
     * @brief Calculates the variance of a given dataset.
     * @param data The input dataset.
     * @return The calculated variance.
     */
    static double calculateVariance(const std::vector<double>& data);

    /**
     * @brief Calculates the standard deviation of a given dataset.
     * @param data The input dataset.
     * @return The calculated standard deviation.
     */
    static double calculateStandardDeviation(const std::vector<double>& data);

    /**
     * @brief Calculates the skewness of a given dataset.
     * @param data The input dataset.
     * @return The calculated skewness.
     */
    static double calculateSkewness(const std::vector<double>& data);

    /**
     * @brief Calculates the kurtosis of a given dataset.
     * @param data The input dataset.
     * @return The calculated kurtosis.
     */
    static double calculateKurtosis(const std::vector<double>& data);

    /**
     * @brief Calculates the specified percentile of a given dataset.
     * @param data The input dataset.
     * @param percentile The percentile to calculate (0-100).
     * @return The calculated percentile value.
     */
    static double calculatePercentile(const std::vector<double>& data, double percentile);

    /**
     * @brief Generates a summary of various descriptive statistics for a given dataset.
     * @param data The input dataset.
     * @return A string containing a summary of descriptive statistics.
     */
    static std::string generateSummaryStatistics(const std::vector<double>& data);
};

} // namespace Statistics
} // namespace DataAnalysisEngine

#endif // DESCRIPTIVE_STATISTICS_H