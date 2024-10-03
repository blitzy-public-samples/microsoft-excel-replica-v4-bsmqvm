#ifndef GOAL_SEEK_H
#define GOAL_SEEK_H

#include <functional>
#include <vector>
#include "../Utils/DataAnalysisUtils.h"

namespace ExcelDataAnalysisEngine {
namespace WhatIfAnalysis {

/**
 * @class GoalSeek
 * @brief This class implements the Goal Seek functionality for what-if analysis.
 * 
 * Goal Seek is a what-if analysis tool that finds an input value that produces
 * a desired result for a given formula.
 */
class GoalSeek {
public:
    /**
     * @brief Default constructor for GoalSeek class
     */
    GoalSeek();

    /**
     * @brief Solves the goal seek problem by finding an input value that produces the target output value for the given formula.
     * 
     * @param formula The formula to be evaluated
     * @param targetValue The desired output value
     * @param initialGuess The initial input value to start the search
     * @return double The input value that produces the target output
     */
    double Solve(const std::function<double(double)>& formula, double targetValue, double initialGuess);

    /**
     * @brief Sets the tolerance level for the goal seek algorithm.
     * 
     * @param newTolerance The new tolerance value
     */
    void SetTolerance(double newTolerance);

    /**
     * @brief Sets the maximum number of iterations for the goal seek algorithm.
     * 
     * @param newMaxIterations The new maximum number of iterations
     */
    void SetMaxIterations(int newMaxIterations);

private:
    double tolerance;
    int maxIterations;

    // Helper methods
    double calculateError(const std::function<double(double)>& formula, double x, double targetValue);
    double newtonRaphsonStep(const std::function<double(double)>& formula, double x, double targetValue);
};

} // namespace WhatIfAnalysis
} // namespace ExcelDataAnalysisEngine

#endif // GOAL_SEEK_H