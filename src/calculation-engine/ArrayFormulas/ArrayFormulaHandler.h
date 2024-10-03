#ifndef ARRAY_FORMULA_HANDLER_H
#define ARRAY_FORMULA_HANDLER_H

#include <memory>
#include <string>
#include <vector>
#include <variant>
#include "../Interfaces/IFormulaParser.h"
#include "../CalculationChain/CalculationChain.h"
#include "../../core-engine/DataStructures/Range.h"
#include "../../core-engine/DataStructures/Cell.h"

namespace ExcelCalculationEngine {

/**
 * @class ArrayFormulaHandler
 * @brief Handles the execution and management of array formulas in Excel.
 * 
 * This class is responsible for evaluating array formulas, applying their results,
 * and managing dependencies for array formulas in the Excel calculation engine.
 */
class ArrayFormulaHandler {
public:
    /**
     * @brief Constructor for ArrayFormulaHandler.
     * @param formulaParser Shared pointer to the formula parser.
     * @param calculationChain Shared pointer to the calculation chain.
     */
    ArrayFormulaHandler(std::shared_ptr<IFormulaParser> formulaParser,
                        std::shared_ptr<CalculationChain> calculationChain);

    /**
     * @brief Evaluates an array formula and returns the result.
     * @param formula The array formula to evaluate.
     * @param inputRange The range of cells to use as input for the formula.
     * @return A 2D vector containing the results of the array formula evaluation.
     */
    std::vector<std::vector<std::variant<double, std::string, bool>>> EvaluateArrayFormula(
        const std::string& formula,
        const Range& inputRange);

    /**
     * @brief Applies the result of an array formula to the specified output range.
     * @param outputRange The range of cells to which the result should be applied.
     * @param result The result of the array formula evaluation.
     */
    void ApplyArrayFormulaResult(
        const Range& outputRange,
        const std::vector<std::vector<std::variant<double, std::string, bool>>>& result);

    /**
     * @brief Updates the dependencies for an array formula.
     * @param formulaRange The range of cells containing the array formula.
     * @param dependencyRange The range of cells on which the array formula depends.
     */
    void UpdateArrayFormulaDependencies(
        const Range& formulaRange,
        const Range& dependencyRange);

private:
    std::shared_ptr<IFormulaParser> formulaParser_;
    std::shared_ptr<CalculationChain> calculationChain_;

    // Helper methods
    void ParseArrayFormula(const std::string& formula);
    void EvaluateFormulaForCell(const Cell& cell);
    void CollectResults();
    void MarkAffectedCellsDirty(const Range& range);
};

} // namespace ExcelCalculationEngine

#endif // ARRAY_FORMULA_HANDLER_H