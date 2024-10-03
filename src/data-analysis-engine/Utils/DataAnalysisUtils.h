#ifndef DATA_ANALYSIS_UTILS_H
#define DATA_ANALYSIS_UTILS_H

#include <vector>
#include <string>
#include <map>
#include <cmath>
#include <utility>

namespace DataAnalysisEngine {
namespace Utils {

/**
 * @brief Utility functions for data analysis operations in Microsoft Excel.
 * 
 * This class provides common operations and algorithms used across various
 * data analysis tasks in the Data Analysis Engine component of Microsoft Excel.
 */
class DataAnalysisUtils {
public:
    /**
     * @brief Calculates the arithmetic mean of a vector of numerical data.
     * 
     * @param data A vector of double values representing the dataset.
     * @return The calculated mean as a double.
     */
    static double CalculateMean(const std::vector<double>& data);

    /**
     * @brief Calculates the median of a vector of numerical data.
     * 
     * @param data A vector of double values representing the dataset.
     * @return The calculated median as a double.
     */
    static double CalculateMedian(std::vector<double> data);

    /**
     * @brief Calculates the standard deviation of a vector of numerical data.
     * 
     * @param data A vector of double values representing the dataset.
     * @return The calculated standard deviation as a double.
     */
    static double CalculateStandardDeviation(const std::vector<double>& data);

    /**
     * @brief Performs simple linear regression on two vectors of data.
     * 
     * @param x A vector of double values representing the independent variable.
     * @param y A vector of double values representing the dependent variable.
     * @return A pair of doubles representing the slope and y-intercept of the regression line.
     */
    static std::pair<double, double> LinearRegression(const std::vector<double>& x, const std::vector<double>& y);

    /**
     * @brief Calculates the moving average of a vector of numerical data.
     * 
     * @param data A vector of double values representing the dataset.
     * @param windowSize The size of the moving window.
     * @return A vector of doubles representing the calculated moving average.
     */
    static std::vector<double> MovingAverage(const std::vector<double>& data, int windowSize);

    /**
     * @brief Calculates the Pearson correlation coefficient between two vectors of data.
     * 
     * @param x A vector of double values representing the first dataset.
     * @param y A vector of double values representing the second dataset.
     * @return The calculated correlation coefficient as a double.
     */
    static double Correlation(const std::vector<double>& x, const std::vector<double>& y);
};

} // namespace Utils
} // namespace DataAnalysisEngine

#endif // DATA_ANALYSIS_UTILS_H