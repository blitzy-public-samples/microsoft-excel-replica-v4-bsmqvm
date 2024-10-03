#include "DescriptiveStatistics.h"
#include <algorithm>
#include <cmath>
#include <numeric>
#include <sstream>
#include <iomanip>
#include <stdexcept>

double DescriptiveStatistics::calculateMean(const std::vector<double>& data) {
    if (data.empty()) {
        throw std::invalid_argument("Cannot calculate mean of an empty dataset");
    }
    return std::accumulate(data.begin(), data.end(), 0.0) / data.size();
}

double DescriptiveStatistics::calculateMedian(std::vector<double> data) {
    if (data.empty()) {
        throw std::invalid_argument("Cannot calculate median of an empty dataset");
    }
    std::sort(data.begin(), data.end());
    size_t size = data.size();
    if (size % 2 == 0) {
        return (data[size / 2 - 1] + data[size / 2]) / 2.0;
    } else {
        return data[size / 2];
    }
}

std::vector<double> DescriptiveStatistics::calculateMode(const std::vector<double>& data) {
    if (data.empty()) {
        throw std::invalid_argument("Cannot calculate mode of an empty dataset");
    }
    std::unordered_map<double, int> frequency;
    int max_frequency = 0;
    for (const auto& value : data) {
        max_frequency = std::max(max_frequency, ++frequency[value]);
    }
    std::vector<double> modes;
    for (const auto& pair : frequency) {
        if (pair.second == max_frequency) {
            modes.push_back(pair.first);
        }
    }
    return modes;
}

double DescriptiveStatistics::calculateVariance(const std::vector<double>& data) {
    if (data.size() < 2) {
        throw std::invalid_argument("Cannot calculate variance with less than 2 data points");
    }
    double mean = calculateMean(data);
    double sum_squared_diff = 0.0;
    for (const auto& value : data) {
        double diff = value - mean;
        sum_squared_diff += diff * diff;
    }
    return sum_squared_diff / (data.size() - 1);
}

double DescriptiveStatistics::calculateStandardDeviation(const std::vector<double>& data) {
    return std::sqrt(calculateVariance(data));
}

double DescriptiveStatistics::calculateSkewness(const std::vector<double>& data) {
    if (data.size() < 3) {
        throw std::invalid_argument("Cannot calculate skewness with less than 3 data points");
    }
    double mean = calculateMean(data);
    double std_dev = calculateStandardDeviation(data);
    double sum_cubed_diff = 0.0;
    for (const auto& value : data) {
        double diff = (value - mean) / std_dev;
        sum_cubed_diff += diff * diff * diff;
    }
    return sum_cubed_diff * data.size() / ((data.size() - 1) * (data.size() - 2));
}

double DescriptiveStatistics::calculateKurtosis(const std::vector<double>& data) {
    if (data.size() < 4) {
        throw std::invalid_argument("Cannot calculate kurtosis with less than 4 data points");
    }
    double mean = calculateMean(data);
    double std_dev = calculateStandardDeviation(data);
    double sum_fourth_power = 0.0;
    for (const auto& value : data) {
        double diff = (value - mean) / std_dev;
        sum_fourth_power += std::pow(diff, 4);
    }
    size_t n = data.size();
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum_fourth_power - 
           (3 * std::pow(n - 1, 2)) / ((n - 2) * (n - 3));
}

double DescriptiveStatistics::calculatePercentile(const std::vector<double>& data, double percentile) {
    if (data.empty()) {
        throw std::invalid_argument("Cannot calculate percentile of an empty dataset");
    }
    if (percentile < 0 || percentile > 100) {
        throw std::invalid_argument("Percentile must be between 0 and 100");
    }
    std::vector<double> sorted_data = data;
    std::sort(sorted_data.begin(), sorted_data.end());
    double index = percentile / 100.0 * (sorted_data.size() - 1);
    size_t lower_index = static_cast<size_t>(std::floor(index));
    size_t upper_index = static_cast<size_t>(std::ceil(index));
    if (lower_index == upper_index) {
        return sorted_data[lower_index];
    }
    double lower_value = sorted_data[lower_index];
    double upper_value = sorted_data[upper_index];
    return lower_value + (index - lower_index) * (upper_value - lower_value);
}

std::string DescriptiveStatistics::generateSummaryStatistics(const std::vector<double>& data) {
    if (data.empty()) {
        throw std::invalid_argument("Cannot generate summary statistics for an empty dataset");
    }
    std::ostringstream summary;
    summary << std::fixed << std::setprecision(4);
    summary << "Summary Statistics:\n";
    summary << "Count: " << data.size() << "\n";
    summary << "Mean: " << calculateMean(data) << "\n";
    summary << "Median: " << calculateMedian(data) << "\n";
    std::vector<double> modes = calculateMode(data);
    summary << "Mode(s): ";
    for (size_t i = 0; i < modes.size(); ++i) {
        summary << modes[i];
        if (i < modes.size() - 1) summary << ", ";
    }
    summary << "\n";
    summary << "Variance: " << calculateVariance(data) << "\n";
    summary << "Standard Deviation: " << calculateStandardDeviation(data) << "\n";
    summary << "Skewness: " << calculateSkewness(data) << "\n";
    summary << "Kurtosis: " << calculateKurtosis(data) << "\n";
    summary << "Minimum: " << *std::min_element(data.begin(), data.end()) << "\n";
    summary << "Maximum: " << *std::max_element(data.begin(), data.end()) << "\n";
    summary << "25th Percentile: " << calculatePercentile(data, 25) << "\n";
    summary << "75th Percentile: " << calculatePercentile(data, 75) << "\n";
    return summary.str();
}