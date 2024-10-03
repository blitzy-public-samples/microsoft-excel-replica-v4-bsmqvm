#include "ArrayFormulaHandler.h"
#include <algorithm>
#include <stdexcept>

ArrayFormulaHandler::ArrayFormulaHandler(
    std::shared_ptr<FormulaParser> formulaParser,
    std::shared_ptr<CalculationChain> calculationChain)
    : formulaParser_(std::move(formulaParser)),
      calculationChain_(std::move(calculationChain)) {}

std::vector<std::vector<std::variant<double, std::string, bool>>> ArrayFormulaHandler::EvaluateArrayFormula(
    const std::string& formula,
    const Range& inputRange) {
    // Step 1: Parse the array formula using formulaParser_
    auto parsedFormula = formulaParser_->ParseFormula(formula);

    // Step 2: Evaluate the parsed formula for each cell in the inputRange
    std::vector<std::vector<std::variant<double, std::string, bool>>> result;
    result.reserve(inputRange.GetRowCount());

    for (int row = inputRange.GetStartRow(); row <= inputRange.GetEndRow(); ++row) {
        std::vector<std::variant<double, std::string, bool>> rowResult;
        rowResult.reserve(inputRange.GetColumnCount());

        for (int col = inputRange.GetStartColumn(); col <= inputRange.GetEndColumn(); ++col) {
            // Evaluate the formula for each cell
            auto cellResult = EvaluateFormulaForCell(parsedFormula, row, col);
            rowResult.push_back(cellResult);
        }

        result.push_back(std::move(rowResult));
    }

    // Step 3: Handle any array-specific operations or functions
    HandleArraySpecificOperations(result);

    // Step 4: Perform error checking and handling
    PerformErrorChecking(result);

    return result;
}

void ArrayFormulaHandler::ApplyArrayFormulaResult(
    const Range& outputRange,
    const std::vector<std::vector<std::variant<double, std::string, bool>>>& result) {
    // Step 1: Validate the dimensions of the result against the outputRange
    if (result.size() != outputRange.GetRowCount() ||
        (result.size() > 0 && result[0].size() != outputRange.GetColumnCount())) {
        throw std::runtime_error("Array formula result dimensions do not match the output range");
    }

    // Step 2: Iterate through the cells in the outputRange
    for (int row = 0; row < outputRange.GetRowCount(); ++row) {
        for (int col = 0; col < outputRange.GetColumnCount(); ++col) {
            // Step 3: Set the value of each cell to the corresponding result
            Cell& cell = outputRange.GetCell(row, col);
            cell.SetValue(result[row][col]);

            // Step 4: Mark affected cells as dirty in the calculationChain_
            calculationChain_->MarkCellAsDirty(cell);
        }
    }

    // Step 5: Handle any #SPILL! errors if the result doesn't fit in the outputRange
    if (result.size() > outputRange.GetRowCount() ||
        (result.size() > 0 && result[0].size() > outputRange.GetColumnCount())) {
        HandleSpillError(outputRange);
    }

    // Step 6: Update cell formatting if necessary
    UpdateCellFormatting(outputRange);
}

void ArrayFormulaHandler::UpdateArrayFormulaDependencies(
    const Range& formulaRange,
    const Range& dependencyRange) {
    // Step 1: Iterate through cells in the formulaRange
    for (int row = formulaRange.GetStartRow(); row <= formulaRange.GetEndRow(); ++row) {
        for (int col = formulaRange.GetStartColumn(); col <= formulaRange.GetEndColumn(); ++col) {
            Cell& cell = formulaRange.GetCell(row, col);

            // Step 2: Update dependencies for each cell using the calculationChain_
            calculationChain_->UpdateCellDependencies(cell, dependencyRange);
        }
    }

    // Step 3: Handle any changes in the dependency structure
    calculationChain_->OptimizeDependencies(formulaRange);

    // Step 4: Mark affected cells as dirty in the calculationChain_
    calculationChain_->MarkRangeAsDirty(formulaRange);

    // Step 5: Optimize dependency tracking for large array formulas
    if (formulaRange.GetCellCount() > 1000) {
        calculationChain_->OptimizeLargeArrayFormulaDependencies(formulaRange);
    }
}

std::variant<double, std::string, bool> ArrayFormulaHandler::EvaluateFormulaForCell(
    const ParsedFormula& parsedFormula,
    int row,
    int col) {
    // Implement the logic to evaluate the parsed formula for a specific cell
    // This may involve calling back into the CalculationEngine or using a separate evaluator
    // For simplicity, we'll return a placeholder value
    return 0.0;
}

void ArrayFormulaHandler::HandleArraySpecificOperations(
    std::vector<std::vector<std::variant<double, std::string, bool>>>& result) {
    // Implement any array-specific operations or functions
    // This could include operations like array transposition, filtering, etc.
}

void ArrayFormulaHandler::PerformErrorChecking(
    std::vector<std::vector<std::variant<double, std::string, bool>>>& result) {
    // Implement error checking logic
    // This could include checking for division by zero, #VALUE! errors, etc.
    for (auto& row : result) {
        for (auto& cell : row) {
            if (std::holds_alternative<std::string>(cell)) {
                const auto& value = std::get<std::string>(cell);
                if (value == "#DIV/0!" || value == "#VALUE!" || value == "#REF!") {
                    // Handle the error appropriately
                }
            }
        }
    }
}

void ArrayFormulaHandler::HandleSpillError(const Range& outputRange) {
    // Implement logic to handle #SPILL! errors
    // This could include setting an error value in the first cell of the output range
    Cell& firstCell = outputRange.GetCell(0, 0);
    firstCell.SetValue("#SPILL!");
    calculationChain_->MarkCellAsDirty(firstCell);
}

void ArrayFormulaHandler::UpdateCellFormatting(const Range& outputRange) {
    // Implement logic to update cell formatting if necessary
    // This could include setting number formats, alignments, etc.
}