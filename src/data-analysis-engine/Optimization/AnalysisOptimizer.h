#ifndef ANALYSIS_OPTIMIZER_H
#define ANALYSIS_OPTIMIZER_H

#include <memory>
#include <string>
#include <vector>
#include <unordered_map>

// Forward declarations for dependencies that are not yet available
class IDataAnalysisEngine;
class OptimizationUtils;
class IOptimizer;

/**
 * @class AnalysisOptimizer
 * @brief This class is responsible for optimizing the performance of data analysis operations in Excel.
 * 
 * The AnalysisOptimizer class implements optimization techniques for various data analysis
 * operations to improve performance and efficiency within the Microsoft Excel Data Analysis Engine.
 */
class AnalysisOptimizer : public IOptimizer {
public:
    /**
     * @brief Constructor for AnalysisOptimizer
     * @param dataAnalysisEngine A shared pointer to the IDataAnalysisEngine
     */
    explicit AnalysisOptimizer(std::shared_ptr<IDataAnalysisEngine> dataAnalysisEngine);

    /**
     * @brief Destructor for AnalysisOptimizer
     */
    ~AnalysisOptimizer() override = default;

    /**
     * @brief Optimizes the data analysis process for a given analysis type and dataset.
     * @param analysisType The type of analysis to be performed
     * @param data The input dataset for the analysis
     * @return A vector of doubles representing the optimized result of the data analysis
     */
    std::vector<double> OptimizeDataAnalysis(const std::string& analysisType, const std::vector<double>& data) override;

    /**
     * @brief Optimizes the process of generating statistics from a given dataset.
     * @param data The input dataset for statistical analysis
     * @return An unordered map of statistical measures and their optimized values
     */
    std::unordered_map<std::string, double> OptimizeStatisticsGeneration(const std::vector<double>& data) override;

    /**
     * @brief Optimizes the regression analysis process for two sets of data.
     * @param x The independent variable dataset
     * @param y The dependent variable dataset
     * @return A pair of doubles representing the optimized slope and intercept of the regression line
     */
    std::pair<double, double> OptimizeRegression(const std::vector<double>& x, const std::vector<double>& y) override;

    /**
     * @brief Optimizes the process of performing hypothesis tests on given datasets.
     * @param testType The type of hypothesis test to be performed
     * @param data1 The first dataset for the hypothesis test
     * @param data2 The second dataset for the hypothesis test (optional, depending on the test type)
     * @return An unordered map of test results and their optimized values
     */
    std::unordered_map<std::string, double> OptimizeHypothesisTest(const std::string& testType, 
                                                                   const std::vector<double>& data1, 
                                                                   const std::vector<double>& data2 = {}) override;

private:
    std::shared_ptr<IDataAnalysisEngine> m_dataAnalysisEngine;

    // Helper methods for optimization strategies
    void ApplyParallelProcessing(const std::string& analysisType, const std::vector<double>& data);
    void ImplementCaching(const std::string& analysisType, const std::vector<double>& data);
    void OptimizeMemoryUsage(const std::string& analysisType, const std::vector<double>& data);
    void ApplyAlgorithmicImprovements(const std::string& analysisType, const std::vector<double>& data);
};

#endif // ANALYSIS_OPTIMIZER_H