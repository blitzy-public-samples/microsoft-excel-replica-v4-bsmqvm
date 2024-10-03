#ifndef REGRESSION_ANALYSIS_H
#define REGRESSION_ANALYSIS_H

#include <vector>
#include <string>
#include <utility>
#include "../Interfaces/IDataAnalysisEngine.h"
#include "../Utils/DataAnalysisUtils.h"
#include "TimeSeries.h"
#include "../Statistics/InferentialStatistics.h"

namespace Excel::DataAnalysis {

class RegressionAnalysis {
public:
    // Default constructor
    RegressionAnalysis();

    /**
     * @brief Performs simple linear regression and returns the slope and intercept.
     * @param x The independent variable values.
     * @param y The dependent variable values.
     * @return A pair containing the slope and intercept of the regression line.
     */
    std::pair<double, double> PerformSimpleLinearRegression(const std::vector<double>& x, const std::vector<double>& y);

    /**
     * @brief Performs multiple linear regression and returns the coefficients.
     * @param X The matrix of independent variables.
     * @param y The dependent variable values.
     * @return A vector of coefficients for the multiple linear regression.
     */
    std::vector<double> PerformMultipleLinearRegression(const std::vector<std::vector<double>>& X, const std::vector<double>& y);

    /**
     * @brief Performs polynomial regression of the specified degree and returns the coefficients.
     * @param x The independent variable values.
     * @param y The dependent variable values.
     * @param degree The degree of the polynomial.
     * @return A vector of coefficients for the polynomial regression.
     */
    std::vector<double> PerformPolynomialRegression(const std::vector<double>& x, const std::vector<double>& y, int degree);

    /**
     * @brief Calculates the R-squared value for a regression model.
     * @param y_actual The actual values of the dependent variable.
     * @param y_predicted The predicted values of the dependent variable.
     * @return The R-squared value.
     */
    double CalculateRSquared(const std::vector<double>& y_actual, const std::vector<double>& y_predicted);

    /**
     * @brief Performs logistic regression and returns the coefficients.
     * @param X The matrix of independent variables.
     * @param y The binary dependent variable values (0 or 1).
     * @return A vector of coefficients for the logistic regression.
     */
    std::vector<double> PerformLogisticRegression(const std::vector<std::vector<double>>& X, const std::vector<int>& y);

private:
    // Add any private member variables or helper functions here
};

} // namespace Excel::DataAnalysis

#endif // REGRESSION_ANALYSIS_H