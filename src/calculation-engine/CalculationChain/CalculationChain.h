#ifndef CALCULATION_CHAIN_H
#define CALCULATION_CHAIN_H

#include <memory>
#include <vector>
#include <unordered_set>
#include "../Interfaces/ICalculationChain.h"
#include "../CalculationChain/DependencyGraph.h"
#include "../../core-engine/DataStructures/Cell.h"
#include "../FormulaParser/FormulaParser.h"

namespace Excel::CalculationEngine {

/**
 * @class CalculationChain
 * @brief Implements the ICalculationChain interface and manages the calculation chain for Excel.
 * 
 * This class is responsible for managing the order of cell calculations and dependencies
 * for efficient recalculation of formulas in a spreadsheet.
 */
class CalculationChain : public ICalculationChain {
public:
    CalculationChain();
    ~CalculationChain() override;

    /**
     * @brief Adds a cell to the calculation chain.
     * @param cell The cell to be added.
     */
    void AddCell(const std::shared_ptr<Cell>& cell) override;

    /**
     * @brief Removes a cell from the calculation chain.
     * @param cell The cell to be removed.
     */
    void RemoveCell(const std::shared_ptr<Cell>& cell) override;

    /**
     * @brief Updates the dependencies for a given cell.
     * @param cell The cell whose dependencies need to be updated.
     * @param dependencies The new dependencies for the cell.
     */
    void UpdateDependencies(const std::shared_ptr<Cell>& cell, const std::vector<std::shared_ptr<Cell>>& dependencies) override;

    /**
     * @brief Retrieves the current calculation order.
     * @return A vector of cells in the current calculation order.
     */
    std::vector<std::shared_ptr<Cell>> GetCalculationOrder() const override;

    /**
     * @brief Marks a cell as needing recalculation.
     * @param cell The cell to be invalidated.
     */
    void InvalidateCell(const std::shared_ptr<Cell>& cell) override;

    /**
     * @brief Recalculates all dirty cells in the calculation chain.
     */
    void RecalculateChain() override;

private:
    std::unique_ptr<DependencyGraph> dependencyGraph_;
    std::vector<std::shared_ptr<Cell>> calculationOrder_;
    std::unordered_set<std::shared_ptr<Cell>> dirtyNodes_;

    /**
     * @brief Updates the calculation order based on the current dependency graph.
     */
    void UpdateCalculationOrder();

    /**
     * @brief Marks dependent cells as dirty recursively.
     * @param cell The cell whose dependents need to be marked as dirty.
     */
    void MarkDependentsDirty(const std::shared_ptr<Cell>& cell);
};

} // namespace Excel::CalculationEngine

#endif // CALCULATION_CHAIN_H