#ifndef IDATA_ANALYSIS_ENGINE_H
#define IDATA_ANALYSIS_ENGINE_H

#include <string>
#include <vector>
#include <unordered_map>

namespace Microsoft::Excel::CoreEngine {

/**
 * @class IDataAnalysisEngine
 * @brief Interface for the Data Analysis Engine, a crucial component of Microsoft Excel's core functionality.
 *
 * This abstract class defines the contract for performing data analysis tasks within the Excel application.
 * It provides pure virtual functions for core data analysis operations, ensuring high performance
 * and scalability to handle large datasets and complex calculations efficiently.
 */
class IDataAnalysisEngine {
public:
    /**
     * @brief Virtual destructor for proper cleanup of derived classes.
     */
    virtual ~IDataAnalysisEngine() = default;

    /**
     * @brief Performs various types of data analysis on a given dataset.
     * @param analysisType The type of analysis to perform.
     * @param data The input dataset for analysis.
     * @return A vector of doubles representing the result of the data analysis.
     */
    virtual std::vector<double> PerformDataAnalysis(const std::string& analysisType, const std::vector<double>& data) = 0;

    /**
     * @brief Generates statistical measures from a given dataset.
     * @param data The input dataset for statistical analysis.
     * @return An unordered map of statistical measures and their corresponding values.
     */
    virtual std::unordered_map<std::string, double> GenerateStatistics(const std::vector<double>& data) = 0;

    /**
     * @brief Performs linear regression on two sets of data.
     * @param x The independent variable dataset.
     * @param y The dependent variable dataset.
     * @return A pair containing the slope and intercept of the regression line.
     */
    virtual std::pair<double, double> PerformRegression(const std::vector<double>& x, const std::vector<double>& y) = 0;

    /**
     * @brief Performs various types of hypothesis tests on given datasets.
     * @param testType The type of hypothesis test to perform.
     * @param data1 The first dataset for the hypothesis test.
     * @param data2 The second dataset for the hypothesis test (if applicable).
     * @return An unordered map of test results and their corresponding values.
     */
    virtual std::unordered_map<std::string, double> PerformHypothesisTest(const std::string& testType, const std::vector<double>& data1, const std::vector<double>& data2) = 0;
};

} // namespace Microsoft::Excel::CoreEngine

#endif // IDATA_ANALYSIS_ENGINE_H