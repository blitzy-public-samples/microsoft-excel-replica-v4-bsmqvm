#include "InferentialStatistics.h"
#include "DescriptiveStatistics.h"
#include <vector>
#include <cmath>
#include <algorithm>
#include <numeric>
#include <stdexcept>

namespace DataAnalysisEngine {
namespace Statistics {

double InferentialStatistics::performTTest(const std::vector<double>& sample1, const std::vector<double>& sample2, bool pairedTest) {
    if (sample1.size() != sample2.size()) {
        throw std::invalid_argument("Samples must have the same size for t-test");
    }

    double mean1 = DescriptiveStatistics::calculateMean(sample1);
    double mean2 = DescriptiveStatistics::calculateMean(sample2);
    double var1 = DescriptiveStatistics::calculateVariance(sample1);
    double var2 = DescriptiveStatistics::calculateVariance(sample2);

    double n = static_cast<double>(sample1.size());
    double df = 2 * n - 2;  // Degrees of freedom

    double t_statistic;
    if (pairedTest) {
        std::vector<double> differences(n);
        for (size_t i = 0; i < n; ++i) {
            differences[i] = sample1[i] - sample2[i];
        }
        double mean_diff = DescriptiveStatistics::calculateMean(differences);
        double var_diff = DescriptiveStatistics::calculateVariance(differences);
        t_statistic = mean_diff / std::sqrt(var_diff / n);
        df = n - 1;
    } else {
        double pooled_var = ((n - 1) * var1 + (n - 1) * var2) / (2 * n - 2);
        t_statistic = (mean1 - mean2) / std::sqrt(2 * pooled_var / n);
    }

    // Calculate p-value (this is a simplified approximation)
    double p_value = 2 * (1 - std::erf(std::abs(t_statistic) / std::sqrt(2)));

    return p_value;
}

double InferentialStatistics::performANOVA(const std::vector<std::vector<double>>& groups) {
    size_t k = groups.size();  // Number of groups
    size_t N = 0;  // Total number of observations
    double grand_mean = 0.0;

    std::vector<double> group_means(k);
    std::vector<size_t> group_sizes(k);

    for (size_t i = 0; i < k; ++i) {
        group_sizes[i] = groups[i].size();
        N += group_sizes[i];
        group_means[i] = DescriptiveStatistics::calculateMean(groups[i]);
        grand_mean += group_means[i] * group_sizes[i];
    }
    grand_mean /= N;

    double ss_between = 0.0;
    double ss_within = 0.0;

    for (size_t i = 0; i < k; ++i) {
        ss_between += group_sizes[i] * std::pow(group_means[i] - grand_mean, 2);
        for (const auto& value : groups[i]) {
            ss_within += std::pow(value - group_means[i], 2);
        }
    }

    double df_between = k - 1;
    double df_within = N - k;

    double ms_between = ss_between / df_between;
    double ms_within = ss_within / df_within;

    double f_statistic = ms_between / ms_within;

    // Calculate p-value (this is a simplified approximation)
    double p_value = 1 - std::erf(std::sqrt(f_statistic / 2));

    return p_value;
}

double InferentialStatistics::performChiSquareTest(const std::vector<std::vector<double>>& observedFrequencies,
                                                   const std::vector<std::vector<double>>& expectedFrequencies) {
    if (observedFrequencies.size() != expectedFrequencies.size() ||
        observedFrequencies[0].size() != expectedFrequencies[0].size()) {
        throw std::invalid_argument("Observed and expected frequencies must have the same dimensions");
    }

    double chi_square = 0.0;
    size_t df = 0;

    for (size_t i = 0; i < observedFrequencies.size(); ++i) {
        for (size_t j = 0; j < observedFrequencies[i].size(); ++j) {
            double diff = observedFrequencies[i][j] - expectedFrequencies[i][j];
            chi_square += (diff * diff) / expectedFrequencies[i][j];
        }
        df += observedFrequencies[i].size() - 1;
    }
    df += observedFrequencies.size() - 1;

    // Calculate p-value (this is a simplified approximation)
    double p_value = 1 - std::erf(std::sqrt(chi_square / 2));

    return p_value;
}

std::pair<double, double> InferentialStatistics::calculateConfidenceInterval(const std::vector<double>& data, double confidenceLevel) {
    double mean = DescriptiveStatistics::calculateMean(data);
    double std_dev = std::sqrt(DescriptiveStatistics::calculateVariance(data));
    double n = static_cast<double>(data.size());

    // Calculate t-value (this is a simplified approximation)
    double t_value = std::erf(confidenceLevel / std::sqrt(2));

    double margin_of_error = t_value * (std_dev / std::sqrt(n));

    return std::make_pair(mean - margin_of_error, mean + margin_of_error);
}

std::pair<double, double> InferentialStatistics::performLinearRegression(const std::vector<double>& x, const std::vector<double>& y) {
    if (x.size() != y.size()) {
        throw std::invalid_argument("X and Y must have the same size for linear regression");
    }

    double n = static_cast<double>(x.size());
    double sum_x = std::accumulate(x.begin(), x.end(), 0.0);
    double sum_y = std::accumulate(y.begin(), y.end(), 0.0);
    double sum_xy = std::inner_product(x.begin(), x.end(), y.begin(), 0.0);
    double sum_x_squared = std::inner_product(x.begin(), x.end(), x.begin(), 0.0);

    double slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x_squared - sum_x * sum_x);
    double intercept = (sum_y - slope * sum_x) / n;

    return std::make_pair(slope, intercept);
}

double InferentialStatistics::calculateCorrelationCoefficient(const std::vector<double>& x, const std::vector<double>& y) {
    if (x.size() != y.size()) {
        throw std::invalid_argument("X and Y must have the same size for correlation calculation");
    }

    double n = static_cast<double>(x.size());
    double sum_x = std::accumulate(x.begin(), x.end(), 0.0);
    double sum_y = std::accumulate(y.begin(), y.end(), 0.0);
    double sum_xy = std::inner_product(x.begin(), x.end(), y.begin(), 0.0);
    double sum_x_squared = std::inner_product(x.begin(), x.end(), x.begin(), 0.0);
    double sum_y_squared = std::inner_product(y.begin(), y.end(), y.begin(), 0.0);

    double numerator = n * sum_xy - sum_x * sum_y;
    double denominator = std::sqrt((n * sum_x_squared - sum_x * sum_x) * (n * sum_y_squared - sum_y * sum_y));

    return numerator / denominator;
}

} // namespace Statistics
} // namespace DataAnalysisEngine