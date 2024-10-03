#include "RegressionAnalysis.h"
#include "../Utils/DataAnalysisUtils.h"
#include "../Statistics/DescriptiveStatistics.h"
#include <vector>
#include <utility>
#include <cmath>
#include <Eigen/Dense>
#include <stdexcept>

RegressionAnalysis::RegressionAnalysis() {}

std::pair<double, double> RegressionAnalysis::PerformSimpleLinearRegression(const std::vector<double>& x, const std::vector<double>& y) {
    // Validate input data
    if (x.empty() || y.empty() || x.size() != y.size()) {
        throw std::invalid_argument("Input vectors must be non-empty and of equal size");
    }

    // Calculate means of x and y
    double x_mean = DataAnalysisUtils::CalculateMean(x);
    double y_mean = DataAnalysisUtils::CalculateMean(y);

    // Calculate the slope using the least squares method
    double numerator = 0.0, denominator = 0.0;
    for (size_t i = 0; i < x.size(); ++i) {
        numerator += (x[i] - x_mean) * (y[i] - y_mean);
        denominator += std::pow(x[i] - x_mean, 2);
    }
    
    double slope = numerator / denominator;

    // Calculate the intercept
    double intercept = y_mean - slope * x_mean;

    return std::make_pair(slope, intercept);
}

std::vector<double> RegressionAnalysis::PerformMultipleLinearRegression(const std::vector<std::vector<double>>& X, const std::vector<double>& y) {
    // Validate input data
    if (X.empty() || y.empty() || X[0].size() != y.size()) {
        throw std::invalid_argument("Input data must be non-empty and consistent in size");
    }

    // Convert input data to Eigen matrices
    Eigen::MatrixXd X_matrix(X[0].size(), X.size());
    Eigen::VectorXd y_vector(y.size());

    for (size_t i = 0; i < X[0].size(); ++i) {
        for (size_t j = 0; j < X.size(); ++j) {
            X_matrix(i, j) = X[j][i];
        }
        y_vector(i) = y[i];
    }

    // Calculate coefficients using the normal equation: (X'X)^(-1)X'y
    Eigen::VectorXd coefficients = (X_matrix.transpose() * X_matrix).inverse() * X_matrix.transpose() * y_vector;

    // Convert Eigen vector result back to std::vector
    return std::vector<double>(coefficients.data(), coefficients.data() + coefficients.size());
}

std::vector<double> RegressionAnalysis::PerformPolynomialRegression(const std::vector<double>& x, const std::vector<double>& y, int degree) {
    // Validate input data
    if (x.empty() || y.empty() || x.size() != y.size() || degree < 1) {
        throw std::invalid_argument("Invalid input data or degree");
    }

    // Create Vandermonde matrix
    Eigen::MatrixXd X(x.size(), degree + 1);
    for (size_t i = 0; i < x.size(); ++i) {
        for (int j = 0; j <= degree; ++j) {
            X(i, j) = std::pow(x[i], j);
        }
    }

    // Convert y to Eigen vector
    Eigen::VectorXd y_vector = Eigen::Map<const Eigen::VectorXd>(y.data(), y.size());

    // Use PerformMultipleLinearRegression method with Vandermonde matrix
    Eigen::VectorXd coefficients = (X.transpose() * X).inverse() * X.transpose() * y_vector;

    // Convert Eigen vector result back to std::vector
    return std::vector<double>(coefficients.data(), coefficients.data() + coefficients.size());
}

double RegressionAnalysis::CalculateRSquared(const std::vector<double>& y_actual, const std::vector<double>& y_predicted) {
    // Validate input data
    if (y_actual.empty() || y_predicted.empty() || y_actual.size() != y_predicted.size()) {
        throw std::invalid_argument("Input vectors must be non-empty and of equal size");
    }

    double y_mean = DataAnalysisUtils::CalculateMean(y_actual);
    double tss = 0.0, rss = 0.0;

    for (size_t i = 0; i < y_actual.size(); ++i) {
        tss += std::pow(y_actual[i] - y_mean, 2);
        rss += std::pow(y_actual[i] - y_predicted[i], 2);
    }

    // Calculate R-squared as 1 - (RSS / TSS)
    return 1.0 - (rss / tss);
}

std::vector<double> RegressionAnalysis::PerformLogisticRegression(const std::vector<std::vector<double>>& X, const std::vector<int>& y) {
    // Validate input data
    if (X.empty() || y.empty() || X[0].size() != y.size()) {
        throw std::invalid_argument("Input data must be non-empty and consistent in size");
    }

    // Check if y values are binary (0 or 1)
    for (int val : y) {
        if (val != 0 && val != 1) {
            throw std::invalid_argument("y values must be binary (0 or 1)");
        }
    }

    // Convert input data to Eigen matrices
    Eigen::MatrixXd X_matrix(X[0].size(), X.size() + 1);  // Add column for intercept
    Eigen::VectorXd y_vector(y.size());

    for (size_t i = 0; i < X[0].size(); ++i) {
        X_matrix(i, 0) = 1.0;  // Intercept term
        for (size_t j = 0; j < X.size(); ++j) {
            X_matrix(i, j + 1) = X[j][i];
        }
        y_vector(i) = y[i];
    }

    // Initialize coefficients
    Eigen::VectorXd coefficients = Eigen::VectorXd::Zero(X.size() + 1);

    // Perform gradient descent
    const int max_iterations = 1000;
    const double learning_rate = 0.01;
    const double convergence_threshold = 1e-6;

    for (int iteration = 0; iteration < max_iterations; ++iteration) {
        Eigen::VectorXd h = (X_matrix * coefficients).array().exp() / (1 + (X_matrix * coefficients).array().exp());
        Eigen::VectorXd gradient = X_matrix.transpose() * (h - y_vector);
        Eigen::VectorXd new_coefficients = coefficients - learning_rate * gradient;

        if ((new_coefficients - coefficients).norm() < convergence_threshold) {
            coefficients = new_coefficients;
            break;
        }

        coefficients = new_coefficients;
    }

    // Convert Eigen vector result back to std::vector
    return std::vector<double>(coefficients.data(), coefficients.data() + coefficients.size());
}