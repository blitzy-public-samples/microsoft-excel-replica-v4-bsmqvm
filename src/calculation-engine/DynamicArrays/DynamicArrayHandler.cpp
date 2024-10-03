#include "DynamicArrayHandler.h"
#include <stdexcept>
#include <algorithm>

DynamicArrayHandler::DynamicArrayHandler(
    std::shared_ptr<ICalculationChain> calculationChain,
    std::shared_ptr<FormulaParser> formulaParser)
    : calculationChain_(std::move(calculationChain)),
      formulaParser_(std::move(formulaParser)) {}

std::vector<std::vector<std::variant<double, std::string, bool>>> 
DynamicArrayHandler::EvaluateDynamicArray(const std::string& formula, const Cell& originCell) {
    try {
        // Parse the formula
        auto parsedFormula = formulaParser_->Parse(formula);

        // Evaluate the parsed formula
        auto result = EvaluateParsedFormula(parsedFormula, originCell);

        // Handle any errors during evaluation
        if (result.empty()) {
            throw std::runtime_error("Dynamic array evaluation resulted in an empty array");
        }

        return result;
    } catch (const std::exception& e) {
        // Log the error and return an error value
        // In a real implementation, we would use a proper logging mechanism
        std::cerr << "Error evaluating dynamic array: " << e.what() << std::endl;
        return {{{std::string("#ERROR!")}}};
    }
}

void DynamicArrayHandler::ApplyDynamicArrayResult(
    const Cell& originCell,
    const std::vector<std::vector<std::variant<double, std::string, bool>>>& result) {
    try {
        // Determine the range for spilling the result
        Range spillRange = DetermineSpillRange(originCell, result);

        // Check for potential #SPILL! errors
        if (IsSpillError(spillRange)) {
            HandleSpillError(originCell);
            return;
        }

        // Apply the result to the determined range
        ApplyResultToRange(spillRange, result);

        // Update affected cells in the calculationChain_
        UpdateDynamicArrayDependencies(originCell, spillRange);
    } catch (const std::exception& e) {
        // Log the error and handle it appropriately
        std::cerr << "Error applying dynamic array result: " << e.what() << std::endl;
        HandleSpillError(originCell);
    }
}

void DynamicArrayHandler::UpdateDynamicArrayDependencies(const Cell& originCell, const Range& dependencyRange) {
    // Update the dependencies in the calculationChain_
    calculationChain_->UpdateDependencies(originCell, dependencyRange);

    // Mark affected cells for recalculation
    for (const auto& cell : dependencyRange.GetCells()) {
        calculationChain_->MarkForRecalculation(cell);
    }
}

void DynamicArrayHandler::HandleSpillError(const Cell& originCell) {
    // Set the #SPILL! error in the origin cell
    originCell.SetValue(std::string("#SPILL!"));

    // Clear any previous spill range
    Range previousSpillRange = GetPreviousSpillRange(originCell);
    ClearRange(previousSpillRange);

    // Update the calculationChain_ to reflect the error state
    calculationChain_->UpdateErrorState(originCell, "SPILL");
}

std::vector<std::vector<std::variant<double, std::string, bool>>> 
DynamicArrayHandler::EvaluateParsedFormula(const ParsedFormula& parsedFormula, const Cell& originCell) {
    // This is a placeholder implementation. In a real scenario, this would involve
    // complex logic to evaluate the parsed formula and return a dynamic array result.
    // For demonstration purposes, we'll return a simple 2x2 array.
    return {
        {1.0, 2.0},
        {3.0, 4.0}
    };
}

Range DynamicArrayHandler::DetermineSpillRange(
    const Cell& originCell,
    const std::vector<std::vector<std::variant<double, std::string, bool>>>& result) {
    // Calculate the dimensions of the result
    size_t rowCount = result.size();
    size_t colCount = rowCount > 0 ? result[0].size() : 0;

    // Get the worksheet from the origin cell
    Worksheet& worksheet = originCell.GetWorksheet();

    // Calculate the end cell of the spill range
    Cell endCell = worksheet.GetCell(
        originCell.GetRow() + rowCount - 1,
        originCell.GetColumn() + colCount - 1
    );

    // Create and return the Range
    return Range(originCell, endCell);
}

bool DynamicArrayHandler::IsSpillError(const Range& spillRange) {
    // Check if any cell in the spill range is occupied or locked
    for (const auto& cell : spillRange.GetCells()) {
        if (!cell.IsEmpty() || cell.IsLocked()) {
            return true;
        }
    }
    return false;
}

void DynamicArrayHandler::ApplyResultToRange(
    const Range& spillRange,
    const std::vector<std::vector<std::variant<double, std::string, bool>>>& result) {
    auto cells = spillRange.GetCells();
    size_t rowIndex = 0;
    for (const auto& row : result) {
        size_t colIndex = 0;
        for (const auto& value : row) {
            if (rowIndex < cells.size() && colIndex < cells[rowIndex].size()) {
                cells[rowIndex][colIndex].SetValue(value);
            }
            ++colIndex;
        }
        ++rowIndex;
    }
}

Range DynamicArrayHandler::GetPreviousSpillRange(const Cell& originCell) {
    // This is a placeholder implementation. In a real scenario, we would need to
    // retrieve the previous spill range associated with this origin cell.
    // For now, we'll return an empty range.
    return Range(originCell, originCell);
}

void DynamicArrayHandler::ClearRange(const Range& range) {
    for (const auto& cell : range.GetCells()) {
        cell.Clear();
    }
}