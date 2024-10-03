#ifndef IDATA_ANALYSIS_ENGINE_H
#define IDATA_ANALYSIS_ENGINE_H

#include <vector>
#include <string>
#include <map>

/**
 * @brief Interface for the Data Analysis Engine component of Microsoft Excel.
 * 
 * This abstract base class defines the core functionality for data analysis operations.
 * It addresses the requirements for comprehensive data analysis tools and high performance.
 */
class IDataAnalysisEngine {
public:
    /**
     * @brief Virtual destructor to ensure proper cleanup of derived classes.
     */
    virtual ~IDataAnalysisEngine() = default;

    /**
     * @brief Sort a vector of numerical data.
     * 
     * @param data The vector of double values to be sorted.
     * @param ascending True for ascending order, false for descending order.
     */
    virtual void SortData(std::vector<double>& data, bool ascending) = 0;

    /**
     * @brief Filter numerical data based on a threshold.
     * 
     * @param data The input vector of double values to be filtered.
     * @param threshold The threshold value for filtering.
     * @param greaterThan True to keep values greater than the threshold, false for less than.
     * @return std::vector<double> The filtered data.
     */
    virtual std::vector<double> FilterData(const std::vector<double>& data, double threshold, bool greaterThan) = 0;

    /**
     * @brief Generate a pivot table from tabular data.
     * 
     * @param data The input data as a vector of vector of strings (representing rows and columns).
     * @param rowField The index of the column to use for row labels.
     * @param colField The index of the column to use for column labels.
     * @param valueField The index of the column to use for values.
     * @return std::vector<std::vector<std::string>> The generated pivot table.
     */
    virtual std::vector<std::vector<std::string>> GeneratePivotTable(
        const std::vector<std::vector<std::string>>& data,
        int rowField,
        int colField,
        int valueField) = 0;

    /**
     * @brief Perform basic statistical analysis on numerical data.
     * 
     * @param data The input vector of double values for analysis.
     * @return std::map<std::string, double> A map containing statistical measures and their values.
     */
    virtual std::map<std::string, double> PerformStatisticalAnalysis(const std::vector<double>& data) = 0;

    /**
     * @brief Perform time series forecasting.
     * 
     * @param historicalData The input vector of historical data points.
     * @param periods The number of periods to forecast.
     * @return std::vector<double> The forecasted data points.
     */
    virtual std::vector<double> ForecastTimeSeries(const std::vector<double>& historicalData, int periods) = 0;
};

#endif // IDATA_ANALYSIS_ENGINE_H