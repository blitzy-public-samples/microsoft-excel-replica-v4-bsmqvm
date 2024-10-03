#ifndef ICALCULATION_ENGINE_H
#define ICALCULATION_ENGINE_H

#include <string>
#include <unordered_map>

/**
 * @interface ICalculationEngine
 * @brief This interface defines the contract for the Calculation Engine, which is a crucial component of Microsoft Excel's core functionality.
 *
 * The ICalculationEngine interface outlines the contract for performing calculations, managing formulas,
 * and handling computational tasks within the Excel application. It is designed to offer a comprehensive
 * set of tools and functions for performing complex calculations and in-depth data analysis while
 * delivering high performance and scalability to handle large datasets efficiently.
 */
class ICalculationEngine {
public:
    /**
     * @brief Virtual destructor for proper cleanup of derived classes.
     */
    virtual ~ICalculationEngine() = default;

    /**
     * @brief Calculates the result of a given formula.
     * @param formula The formula to be calculated as a string.
     * @param variables A map of variable names to their corresponding values.
     * @return The result of the calculated formula as a double.
     */
    virtual double CalculateFormula(const std::string& formula, const std::unordered_map<std::string, double>& variables) = 0;

    /**
     * @brief Updates the value of a specific cell.
     * @param cellReference The reference of the cell to be updated (e.g., "A1", "B2").
     * @param newValue The new value to be set for the cell.
     */
    virtual void UpdateCell(const std::string& cellReference, const std::string& newValue) = 0;

    /**
     * @brief Recalculates all formulas in the current worksheet.
     */
    virtual void RecalculateWorksheet() = 0;

    /**
     * @brief Retrieves the numeric value of a specific cell.
     * @param cellReference The reference of the cell to retrieve the value from (e.g., "A1", "B2").
     * @return The numeric value of the specified cell as a double.
     */
    virtual double GetCellValue(const std::string& cellReference) = 0;
};

#endif // ICALCULATION_ENGINE_H