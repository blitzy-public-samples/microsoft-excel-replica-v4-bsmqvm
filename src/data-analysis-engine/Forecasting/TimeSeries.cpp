#include "TimeSeries.h"
#include "../Utils/DataAnalysisUtils.h"
#include <vector>
#include <string>
#include <map>
#include <algorithm>
#include <numeric>
#include <cmath>

TimeSeries::TimeSeries(const std::vector<double>& data) : m_data(data) {}

std::vector<double> TimeSeries::Forecast(int periods) {
    // Implement advanced forecasting techniques (e.g., ARIMA or exponential smoothing)
    // For this example, we'll use a simple moving average forecast
    if (periods <= 0 || m_data.empty()) {
        return {};
    }

    int window = std::min(static_cast<int>(m_data.size()), 5); // Use last 5 periods or all if less
    double sum = std::accumulate(m_data.end() - window, m_data.end(), 0.0);
    double average = sum / window;

    return std::vector<double>(periods, average);
}

std::vector<double> TimeSeries::CalculateMovingAverage(int window) {
    if (window <= 0 || window > static_cast<int>(m_data.size())) {
        throw std::invalid_argument("Invalid window size");
    }

    std::vector<double> result;
    result.reserve(m_data.size() - window + 1);

    double sum = std::accumulate(m_data.begin(), m_data.begin() + window, 0.0);
    result.push_back(sum / window);

    for (size_t i = window; i < m_data.size(); ++i) {
        sum = sum - m_data[i - window] + m_data[i];
        result.push_back(sum / window);
    }

    return result;
}

std::map<std::string, std::vector<double>> TimeSeries::PerformSeasonalDecomposition() {
    // Implement STL (Seasonal and Trend decomposition using Loess) or similar technique
    // For this example, we'll use a simple decomposition method
    std::map<std::string, std::vector<double>> result;
    int seasonLength = 4; // Assume quarterly seasonality

    // Calculate trend using moving average
    std::vector<double> trend = CalculateMovingAverage(seasonLength);

    // Calculate seasonal component
    std::vector<double> seasonal(m_data.size());
    for (size_t i = 0; i < m_data.size(); ++i) {
        size_t seasonIndex = i % seasonLength;
        seasonal[i] = m_data[i] - trend[i / seasonLength];
    }

    // Calculate residual
    std::vector<double> residual(m_data.size());
    for (size_t i = 0; i < m_data.size(); ++i) {
        residual[i] = m_data[i] - trend[i / seasonLength] - seasonal[i];
    }

    result["trend"] = trend;
    result["seasonal"] = seasonal;
    result["residual"] = residual;

    return result;
}

std::vector<size_t> TimeSeries::DetectOutliers() {
    std::vector<size_t> outliers;
    if (m_data.size() < 4) {
        return outliers; // Not enough data to detect outliers
    }

    // Calculate Q1, Q3, and IQR
    std::vector<double> sortedData = m_data;
    std::sort(sortedData.begin(), sortedData.end());
    size_t n = sortedData.size();
    double q1 = sortedData[n / 4];
    double q3 = sortedData[3 * n / 4];
    double iqr = q3 - q1;

    // Define outlier bounds
    double lowerBound = q1 - 1.5 * iqr;
    double upperBound = q3 + 1.5 * iqr;

    // Detect outliers
    for (size_t i = 0; i < m_data.size(); ++i) {
        if (m_data[i] < lowerBound || m_data[i] > upperBound) {
            outliers.push_back(i);
        }
    }

    return outliers;
}

// Additional helper functions can be added here as needed