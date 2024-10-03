#include "DataAnalysisUtils.h"
#include <algorithm>
#include <cmath>
#include <numeric>
#include <stdexcept>

namespace DataAnalysisUtils {

double CalculateMean(const std::vector<double>& data) {
    if (data.empty()) {
        throw std::invalid_argument("Cannot calculate mean of an empty vector");
    }
    return std::accumulate(data.begin(), data.end(), 0.0) / data.size();
}

double CalculateMedian(std::vector<double> data) {
    if (data.empty()) {
        throw std::invalid_argument("Cannot calculate median of an empty vector");
    }
    std::sort(data.begin(), data.end());
    size_t size = data.size();
    if (size % 2 == 0) {
        return (data[size / 2 - 1] + data[size / 2]) / 2.0;
    } else {
        return data[size / 2];
    }
}

double CalculateStandardDeviation(const std::vector<double>& data) {
    if (data.size() < 2) {
        throw std::invalid_argument("Cannot calculate standard deviation with less than two data points");
    }
    double mean = CalculateMean(data);
    double sum_squared_diff = 0.0;
    for (const double& value : data) {
        double diff = value - mean;
        sum_squared_diff += diff * diff;
    }
    return std::sqrt(sum_squared_diff / (data.size() - 1));
}

std::pair<double, double> LinearRegression(const std::vector<double>& x, const std::vector<double>& y) {
    if (x.size() != y.size() || x.empty()) {
        throw std::invalid_argument("Input vectors must have the same non-zero size");
    }
    double n = static_cast<double>(x.size());
    double sum_x = std::accumulate(x.begin(), x.end(), 0.0);
    double sum_y = std::accumulate(y.begin(), y.end(), 0.0);
    double sum_xy = std::inner_product(x.begin(), x.end(), y.begin(), 0.0);
    double sum_x_squared = std::inner_product(x.begin(), x.end(), x.begin(), 0.0);
    
    double denominator = n * sum_x_squared - sum_x * sum_x;
    if (std::abs(denominator) < 1e-10) {
        throw std::runtime_error("Cannot perform linear regression: x values are constant");
    }
    
    double slope = (n * sum_xy - sum_x * sum_y) / denominator;
    double intercept = (sum_y - slope * sum_x) / n;
    
    return std::make_pair(slope, intercept);
}

std::vector<double> MovingAverage(const std::vector<double>& data, int windowSize) {
    if (windowSize <= 0 || windowSize > static_cast<int>(data.size())) {
        throw std::invalid_argument("Invalid window size");
    }
    std::vector<double> result;
    result.reserve(data.size() - windowSize + 1);
    
    double windowSum = std::accumulate(data.begin(), data.begin() + windowSize, 0.0);
    result.push_back(windowSum / windowSize);
    
    for (size_t i = windowSize; i < data.size(); ++i) {
        windowSum = windowSum - data[i - windowSize] + data[i];
        result.push_back(windowSum / windowSize);
    }
    
    return result;
}

double Correlation(const std::vector<double>& x, const std::vector<double>& y) {
    if (x.size() != y.size() || x.empty()) {
        throw std::invalid_argument("Input vectors must have the same non-zero size");
    }
    double n = static_cast<double>(x.size());
    double sum_x = std::accumulate(x.begin(), x.end(), 0.0);
    double sum_y = std::accumulate(y.begin(), y.end(), 0.0);
    double sum_xy = std::inner_product(x.begin(), x.end(), y.begin(), 0.0);
    double sum_x_squared = std::inner_product(x.begin(), x.end(), x.begin(), 0.0);
    double sum_y_squared = std::inner_product(y.begin(), y.end(), y.begin(), 0.0);
    
    double numerator = n * sum_xy - sum_x * sum_y;
    double denominator = std::sqrt((n * sum_x_squared - sum_x * sum_x) * (n * sum_y_squared - sum_y * sum_y));
    
    if (std::abs(denominator) < 1e-10) {
        throw std::runtime_error("Cannot calculate correlation: one or both variables have zero variance");
    }
    
    return numerator / denominator;
}

} // namespace DataAnalysisUtils