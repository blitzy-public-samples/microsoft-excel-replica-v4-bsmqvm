#ifndef DATA_ANALYSIS_ENGINE_FORECASTING_TIME_SERIES_H
#define DATA_ANALYSIS_ENGINE_FORECASTING_TIME_SERIES_H

#include "../Interfaces/IDataAnalysisEngine.h"
#include "../Utils/DataAnalysisUtils.h"
#include <vector>
#include <string>
#include <map>

namespace DataAnalysisEngine {
namespace Forecasting {

/**
 * @class TimeSeries
 * @brief This class implements time series analysis and forecasting methods.
 * 
 * The TimeSeries class is responsible for time series analysis and forecasting
 * within the Data Analysis Engine of Microsoft Excel. It provides methods for
 * forecasting, calculating moving averages, performing seasonal decomposition,
 * and detecting outliers in time series data.
 */
class TimeSeries {
public:
    /**
     * @brief Constructor that initializes the TimeSeries object with input data.
     * @param data The time series data to be analyzed.
     */
    explicit TimeSeries(const std::vector<double>& data);

    /**
     * @brief Performs time series forecasting for the specified number of periods.
     * @param periods The number of periods to forecast.
     * @return A vector of forecasted data points.
     */
    std::vector<double> Forecast(int periods);

    /**
     * @brief Calculates the moving average of the time series data.
     * @param window The size of the moving average window.
     * @return A vector containing the moving average data.
     */
    std::vector<double> CalculateMovingAverage(int window);

    /**
     * @brief Performs seasonal decomposition of the time series data.
     * @return A map containing the components of the seasonal decomposition (trend, seasonal, residual).
     */
    std::map<std::string, std::vector<double>> PerformSeasonalDecomposition();

    /**
     * @brief Detects outliers in the time series data.
     * @return A vector of indices corresponding to detected outliers.
     */
    std::vector<size_t> DetectOutliers();

private:
    std::vector<double> m_data; ///< The time series data

    // Helper methods (declarations only, implementations in the .cpp file)
    void ValidateData();
    std::vector<double> ComputeTrend();
    std::vector<double> ComputeSeasonality();
    std::vector<double> ComputeResiduals(const std::vector<double>& trend, const std::vector<double>& seasonality);
    double CalculateStandardDeviation(const std::vector<double>& data);
};

} // namespace Forecasting
} // namespace DataAnalysisEngine

#endif // DATA_ANALYSIS_ENGINE_FORECASTING_TIME_SERIES_H