#include "DataAnalysisEngine.h"
#include "Utils/DataAnalysisUtils.h"
#include "Sorting/DataSorter.h"
#include "Filtering/DataFilter.h"
#include "PivotTables/PivotTableGenerator.h"
#include "WhatIfAnalysis/GoalSeek.h"
#include "WhatIfAnalysis/Solver.h"
#include "Statistics/DescriptiveStatistics.h"
#include "Statistics/InferentialStatistics.h"
#include "Forecasting/TimeSeries.h"
#include "Forecasting/RegressionAnalysis.h"
#include "MachineLearning/MLIntegration.h"
#include "DataModel/DataModelManager.h"
#include "PowerPivot/PowerPivotEngine.h"
#include "Optimization/AnalysisOptimizer.h"

#include <stdexcept>
#include <algorithm>

DataAnalysisEngine::DataAnalysisEngine()
    : m_dataSorter(std::make_unique<DataSorter>()),
      m_dataFilter(std::make_unique<DataFilter>()),
      m_pivotTableGenerator(std::make_unique<PivotTableGenerator>()),
      m_goalSeek(std::make_unique<GoalSeek>()),
      m_solver(std::make_unique<Solver>()),
      m_descriptiveStats(std::make_unique<DescriptiveStatistics>()),
      m_inferentialStats(std::make_unique<InferentialStatistics>()),
      m_timeSeries(std::make_unique<TimeSeries>()),
      m_regressionAnalysis(std::make_unique<RegressionAnalysis>()),
      m_mlIntegration(std::make_unique<MLIntegration>()),
      m_dataModelManager(std::make_unique<DataModelManager>()),
      m_powerPivotEngine(std::make_unique<PowerPivotEngine>()),
      m_analysisOptimizer(std::make_unique<AnalysisOptimizer>())
{
}

void DataAnalysisEngine::SortData(std::vector<double>& data, bool ascending)
{
    // Validate input data
    if (data.empty()) {
        throw std::invalid_argument("Input data is empty");
    }

    try {
        // Apply optimization techniques for large datasets
        m_analysisOptimizer->OptimizeSorting(data);

        // Perform the sorting operation
        m_dataSorter->Sort(data, ascending);
    }
    catch (const std::exception& e) {
        // Handle any exceptions that may occur during sorting
        throw std::runtime_error("Error during sorting: " + std::string(e.what()));
    }
}

std::vector<double> DataAnalysisEngine::FilterData(const std::vector<double>& data, double threshold, bool greaterThan)
{
    // Validate input data and threshold
    if (data.empty()) {
        throw std::invalid_argument("Input data is empty");
    }

    try {
        // Optimize filtering process for large datasets
        m_analysisOptimizer->OptimizeFiltering(data);

        // Perform the filtering operation
        return m_dataFilter->Filter(data, threshold, greaterThan);
    }
    catch (const std::exception& e) {
        // Handle any exceptions that may occur during filtering
        throw std::runtime_error("Error during filtering: " + std::string(e.what()));
    }
}

std::vector<std::vector<std::string>> DataAnalysisEngine::GeneratePivotTable(
    const std::vector<std::vector<std::string>>& data, int rowField, int colField, int valueField)
{
    // Validate input data and field indices
    if (data.empty() || data[0].size() <= std::max({rowField, colField, valueField})) {
        throw std::invalid_argument("Invalid input data or field indices");
    }

    try {
        // Optimize the generation process for large datasets
        m_analysisOptimizer->OptimizePivotTableGeneration(data);

        // Create the pivot table
        return m_pivotTableGenerator->Generate(data, rowField, colField, valueField);
    }
    catch (const std::exception& e) {
        // Handle any exceptions that may occur during pivot table generation
        throw std::runtime_error("Error during pivot table generation: " + std::string(e.what()));
    }
}

std::map<std::string, double> DataAnalysisEngine::PerformStatisticalAnalysis(const std::vector<double>& data)
{
    // Validate input data
    if (data.empty()) {
        throw std::invalid_argument("Input data is empty");
    }

    try {
        // Optimize the analysis process for large datasets
        m_analysisOptimizer->OptimizeStatisticalAnalysis(data);

        // Calculate basic statistics
        std::map<std::string, double> results = m_descriptiveStats->Calculate(data);

        // Perform advanced statistical analysis if needed
        std::map<std::string, double> advancedStats = m_inferentialStats->Analyze(data);

        // Merge the results
        results.insert(advancedStats.begin(), advancedStats.end());

        return results;
    }
    catch (const std::exception& e) {
        // Handle any exceptions that may occur during statistical calculations
        throw std::runtime_error("Error during statistical analysis: " + std::string(e.what()));
    }
}

std::vector<double> DataAnalysisEngine::ForecastTimeSeries(const std::vector<double>& historicalData, int periods)
{
    // Validate input historical data and number of periods
    if (historicalData.empty() || periods <= 0) {
        throw std::invalid_argument("Invalid historical data or number of periods");
    }

    try {
        // Optimize the forecasting process for large datasets
        m_analysisOptimizer->OptimizeForecasting(historicalData, periods);

        // Perform time series analysis and forecasting
        return m_timeSeries->Forecast(historicalData, periods);
    }
    catch (const std::exception& e) {
        // Handle any exceptions that may occur during forecasting
        throw std::runtime_error("Error during time series forecasting: " + std::string(e.what()));
    }
}

// Additional methods can be implemented here to cover other functionalities
// such as regression analysis, machine learning integration, data model management, etc.