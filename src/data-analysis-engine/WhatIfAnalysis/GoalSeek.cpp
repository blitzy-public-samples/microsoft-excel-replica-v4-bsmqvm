#include "GoalSeek.h"
#include "../Utils/DataAnalysisUtils.h"
#include <cmath>
#include <stdexcept>
#include <limits>

namespace DataAnalysisEngine {
namespace WhatIfAnalysis {

GoalSeek::GoalSeek() : tolerance(1e-6), maxIterations(100) {}

double GoalSeek::Solve(const std::function<double(double)>& formula, double targetValue, double initialGuess) {
    double x = initialGuess;
    double fx = formula(x);
    double dfx;
    int iteration = 0;

    while (std::abs(fx - targetValue) > tolerance && iteration < maxIterations) {
        // Calculate the derivative using central difference method
        double h = std::max(1e-8, std::abs(x) * 1e-8);
        dfx = (formula(x + h) - formula(x - h)) / (2 * h);

        // Check if the derivative is too close to zero
        if (std::abs(dfx) < std::numeric_limits<double>::epsilon()) {
            throw std::runtime_error("Derivative is too close to zero. Goal seek failed to converge.");
        }

        // Newton-Raphson step
        x = x - (fx - targetValue) / dfx;
        fx = formula(x);
        iteration++;
    }

    if (iteration >= maxIterations) {
        throw std::runtime_error("Goal seek failed to converge within the maximum number of iterations.");
    }

    return x;
}

void GoalSeek::SetTolerance(double newTolerance) {
    if (newTolerance <= 0) {
        throw std::invalid_argument("Tolerance must be a positive number.");
    }
    tolerance = newTolerance;
}

void GoalSeek::SetMaxIterations(int newMaxIterations) {
    if (newMaxIterations <= 0) {
        throw std::invalid_argument("Maximum iterations must be a positive integer.");
    }
    maxIterations = newMaxIterations;
}

} // namespace WhatIfAnalysis
} // namespace DataAnalysisEngine