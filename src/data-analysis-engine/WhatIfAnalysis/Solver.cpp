#include "Solver.h"
#include "../Utils/DataAnalysisUtils.h"
#include "GoalSeek.h"
#include <algorithm>
#include <cmath>
#include <limits>
#include <stdexcept>

namespace DataAnalysisEngine {
namespace WhatIfAnalysis {

Solver::Solver() : maxIterations_(1000), convergenceTolerance_(1e-6) {}

std::vector<double> Solver::Solve(const std::vector<double>& initialGuess) {
    if (objectiveFunction_ == nullptr) {
        throw std::runtime_error("Objective function not set");
    }

    std::vector<double> currentSolution = initialGuess;
    std::vector<double> bestSolution = currentSolution;
    double bestObjectiveValue = std::numeric_limits<double>::max();

    // Implement Generalized Reduced Gradient (GRG) algorithm
    for (int iteration = 0; iteration < maxIterations_; ++iteration) {
        // Calculate gradient
        std::vector<double> gradient = calculateGradient(currentSolution);

        // Check for convergence
        if (Utils::DataAnalysisUtils::VectorNorm(gradient) < convergenceTolerance_) {
            break;
        }

        // Determine step size using line search
        double stepSize = lineSearch(currentSolution, gradient);

        // Update solution
        for (size_t i = 0; i < currentSolution.size(); ++i) {
            currentSolution[i] -= stepSize * gradient[i];
        }

        // Apply constraints
        applyConstraints(currentSolution);

        // Evaluate objective function
        double objectiveValue = objectiveFunction_(currentSolution);

        // Update best solution if improved
        if (objectiveValue < bestObjectiveValue) {
            bestSolution = currentSolution;
            bestObjectiveValue = objectiveValue;
        }
    }

    return bestSolution;
}

void Solver::SetObjectiveFunction(std::function<double(const std::vector<double>&)> function) {
    objectiveFunction_ = function;
}

void Solver::AddConstraint(std::function<bool(const std::vector<double>&)> constraint) {
    constraints_.push_back(constraint);
}

void Solver::SetMaxIterations(int iterations) {
    if (iterations <= 0) {
        throw std::invalid_argument("Max iterations must be positive");
    }
    maxIterations_ = iterations;
}

void Solver::SetConvergenceTolerance(double tolerance) {
    if (tolerance <= 0) {
        throw std::invalid_argument("Convergence tolerance must be positive");
    }
    convergenceTolerance_ = tolerance;
}

std::vector<double> Solver::calculateGradient(const std::vector<double>& point) {
    const double h = 1e-8; // Small step for numerical differentiation
    std::vector<double> gradient(point.size());

    for (size_t i = 0; i < point.size(); ++i) {
        std::vector<double> pointPlusH = point;
        pointPlusH[i] += h;

        gradient[i] = (objectiveFunction_(pointPlusH) - objectiveFunction_(point)) / h;
    }

    return gradient;
}

double Solver::lineSearch(const std::vector<double>& point, const std::vector<double>& direction) {
    // Implement Armijo line search
    const double c = 0.5;
    const double rho = 0.5;
    double alpha = 1.0;

    double initialValue = objectiveFunction_(point);
    std::vector<double> newPoint(point.size());

    while (true) {
        for (size_t i = 0; i < point.size(); ++i) {
            newPoint[i] = point[i] - alpha * direction[i];
        }

        double newValue = objectiveFunction_(newPoint);
        if (newValue <= initialValue - c * alpha * Utils::DataAnalysisUtils::DotProduct(direction, direction)) {
            return alpha;
        }

        alpha *= rho;
        if (alpha < 1e-10) {
            return 0.0; // Minimum step size reached
        }
    }
}

void Solver::applyConstraints(std::vector<double>& point) {
    for (const auto& constraint : constraints_) {
        if (!constraint(point)) {
            // If constraint is violated, project the point onto the feasible region
            // This is a simplified approach and may not work for all types of constraints
            // For complex constraints, more sophisticated projection methods should be used
            std::vector<double> prevPoint = point;
            double step = 0.1;
            while (!constraint(point) && step > 1e-10) {
                for (size_t i = 0; i < point.size(); ++i) {
                    point[i] = prevPoint[i] + step * (point[i] - prevPoint[i]);
                }
                step *= 0.5;
            }
        }
    }
}

} // namespace WhatIfAnalysis
} // namespace DataAnalysisEngine