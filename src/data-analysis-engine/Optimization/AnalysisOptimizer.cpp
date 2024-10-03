#include "AnalysisOptimizer.h"
#include "IDataAnalysisEngine.h"
#include "OptimizationUtils.h"
#include <vector>
#include <unordered_map>
#include <memory>
#include <algorithm>
#include <numeric>

AnalysisOptimizer::AnalysisOptimizer(std::shared_ptr<IDataAnalysisEngine> engine)
    : m_dataAnalysisEngine(std::move(engine)) {}

std::vector<double> AnalysisOptimizer::OptimizeDataAnalysis(const std::string& analysisType, const std::vector<double>& data) {
    // Determine the type of analysis and apply specific optimization techniques
    if (analysisType == "descriptive_statistics") {
        return OptimizeDescriptiveStatistics(data);
    } else if (analysisType == "regression") {
        return OptimizeRegression(data);
    } else if (analysisType == "hypothesis_test") {
        return OptimizeHypothesisTest(data);
    } else {
        // For unknown analysis types, return the original data
        return data;
    }
}

std::vector<double> AnalysisOptimizer::OptimizeDescriptiveStatistics(const std::vector<double>& data) {
    // Implement optimized algorithms for calculating statistical measures
    std::vector<double> result;
    
    // Calculate mean and variance in a single pass
    double mean = 0.0, M2 = 0.0;
    int count = 0;
    
    for (const double& x : data) {
        count++;
        double delta = x - mean;
        mean += delta / count;
        M2 += delta * (x - mean);
    }
    
    double variance = M2 / (count - 1);
    double stdDev = std::sqrt(variance);
    
    // Calculate median
    std::vector<double> sortedData = data;
    std::nth_element(sortedData.begin(), sortedData.begin() + sortedData.size() / 2, sortedData.end());
    double median = sortedData[sortedData.size() / 2];
    
    // Calculate min and max
    auto [min, max] = std::minmax_element(data.begin(), data.end());
    
    result = {mean, median, stdDev, *min, *max};
    return result;
}

std::vector<double> AnalysisOptimizer::OptimizeRegression(const std::vector<double>& data) {
    // Assuming the data is in the format [x1, y1, x2, y2, ...]
    std::vector<double> x, y;
    for (size_t i = 0; i < data.size(); i += 2) {
        x.push_back(data[i]);
        y.push_back(data[i + 1]);
    }
    
    // Implement an efficient algorithm for linear regression
    double n = x.size();
    double sum_x = std::accumulate(x.begin(), x.end(), 0.0);
    double sum_y = std::accumulate(y.begin(), y.end(), 0.0);
    double sum_xy = std::inner_product(x.begin(), x.end(), y.begin(), 0.0);
    double sum_x2 = std::inner_product(x.begin(), x.end(), x.begin(), 0.0);
    
    double slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x);
    double intercept = (sum_y - slope * sum_x) / n;
    
    return {slope, intercept};
}

std::vector<double> AnalysisOptimizer::OptimizeHypothesisTest(const std::vector<double>& data) {
    // Implement optimized algorithms for various statistical tests
    // For this example, we'll implement a simple t-test
    
    size_t n = data.size() / 2;
    std::vector<double> group1(data.begin(), data.begin() + n);
    std::vector<double> group2(data.begin() + n, data.end());
    
    double mean1 = std::accumulate(group1.begin(), group1.end(), 0.0) / n;
    double mean2 = std::accumulate(group2.begin(), group2.end(), 0.0) / n;
    
    double var1 = std::inner_product(group1.begin(), group1.end(), group1.begin(), 0.0,
                                     std::plus<>(), [mean1](double x, double y) { return (x - mean1) * (y - mean1); }) / (n - 1);
    double var2 = std::inner_product(group2.begin(), group2.end(), group2.begin(), 0.0,
                                     std::plus<>(), [mean2](double x, double y) { return (x - mean2) * (y - mean2); }) / (n - 1);
    
    double t_statistic = (mean1 - mean2) / std::sqrt((var1 + var2) / n);
    double degrees_of_freedom = 2 * n - 2;
    
    // Note: p-value calculation is omitted for simplicity
    // In a real implementation, you would use a t-distribution to calculate the p-value
    
    return {t_statistic, degrees_of_freedom};
}

std::unordered_map<std::string, double> AnalysisOptimizer::OptimizeStatisticsGeneration(const std::vector<double>& data) {
    std::unordered_map<std::string, double> result;
    
    // Implement optimized algorithms for calculating statistical measures
    double sum = 0.0, sum_sq = 0.0;
    double min = data[0], max = data[0];
    
    // Use SIMD operations for parallel computations where possible
    #pragma omp simd reduction(+:sum,sum_sq) reduction(min:min) reduction(max:max)
    for (const double& x : data) {
        sum += x;
        sum_sq += x * x;
        min = std::min(min, x);
        max = std::max(max, x);
    }
    
    size_t n = data.size();
    double mean = sum / n;
    double variance = (sum_sq - (sum * sum / n)) / (n - 1);
    double std_dev = std::sqrt(variance);
    
    result["mean"] = mean;
    result["variance"] = variance;
    result["std_dev"] = std_dev;
    result["min"] = min;
    result["max"] = max;
    
    // Calculate median
    std::vector<double> sorted_data = data;
    std::nth_element(sorted_data.begin(), sorted_data.begin() + n / 2, sorted_data.end());
    result["median"] = sorted_data[n / 2];
    
    return result;
}

std::pair<double, double> AnalysisOptimizer::OptimizeRegression(const std::vector<double>& x, const std::vector<double>& y) {
    // Implement an efficient algorithm for linear regression
    size_t n = x.size();
    double sum_x = 0.0, sum_y = 0.0, sum_xy = 0.0, sum_x2 = 0.0;
    
    #pragma omp parallel for reduction(+:sum_x,sum_y,sum_xy,sum_x2)
    for (size_t i = 0; i < n; ++i) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += x[i] * y[i];
        sum_x2 += x[i] * x[i];
    }
    
    double slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x);
    double intercept = (sum_y - slope * sum_x) / n;
    
    return {slope, intercept};
}

std::unordered_map<std::string, double> AnalysisOptimizer::OptimizeHypothesisTest(const std::string& testType, const std::vector<double>& data1, const std::vector<double>& data2) {
    std::unordered_map<std::string, double> result;
    
    if (testType == "t_test") {
        // Implement optimized t-test
        double mean1 = std::accumulate(data1.begin(), data1.end(), 0.0) / data1.size();
        double mean2 = std::accumulate(data2.begin(), data2.end(), 0.0) / data2.size();
        
        double var1 = 0.0, var2 = 0.0;
        
        #pragma omp parallel sections
        {
            #pragma omp section
            {
                var1 = std::inner_product(data1.begin(), data1.end(), data1.begin(), 0.0,
                                          std::plus<>(), [mean1](double x, double y) { return (x - mean1) * (y - mean1); }) / (data1.size() - 1);
            }
            #pragma omp section
            {
                var2 = std::inner_product(data2.begin(), data2.end(), data2.begin(), 0.0,
                                          std::plus<>(), [mean2](double x, double y) { return (x - mean2) * (y - mean2); }) / (data2.size() - 1);
            }
        }
        
        double t_statistic = (mean1 - mean2) / std::sqrt((var1 / data1.size()) + (var2 / data2.size()));
        double degrees_of_freedom = data1.size() + data2.size() - 2;
        
        result["t_statistic"] = t_statistic;
        result["degrees_of_freedom"] = degrees_of_freedom;
        
        // Note: p-value calculation is omitted for simplicity
        // In a real implementation, you would use a t-distribution to calculate the p-value
    }
    // Add more hypothesis tests as needed
    
    return result;
}