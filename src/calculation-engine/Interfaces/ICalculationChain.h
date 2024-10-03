#ifndef ICALCULATION_CHAIN_H
#define ICALCULATION_CHAIN_H

#include <vector>
#include <unordered_set>
#include "DependencyGraph.h"
#include "IFormulaParser.h"
#include "../../../core-engine/DataStructures/Cell.h"

namespace ExcelCalculationEngine {

/**
 * @class ICalculationChain
 * @brief Interface for the Calculation Chain component of the Excel Calculation Engine.
 *
 * This abstract class defines the interface for managing the order of cell calculations
 * and dependencies in the Excel Calculation Engine.
 */
class ICalculationChain {
public:
    /**
     * @brief Virtual destructor to ensure proper cleanup of derived classes.
     */
    virtual ~ICalculationChain() = default;

    /**
     * @brief Adds a cell to the calculation chain.
     * @param cell The cell to be added to the calculation chain.
     */
    virtual void AddCell(const Cell& cell) = 0;

    /**
     * @brief Removes a cell from the calculation chain.
     * @param cell The cell to be removed from the calculation chain.
     */
    virtual void RemoveCell(const Cell& cell) = 0;

    /**
     * @brief Updates the dependencies of a cell.
     * @param cell The cell whose dependencies need to be updated.
     * @param dependencies The new dependencies for the cell.
     */
    virtual void UpdateDependencies(const Cell& cell, const std::vector<Cell>& dependencies) = 0;

    /**
     * @brief Retrieves the current calculation order of cells.
     * @return A vector of cells representing the current calculation order.
     */
    virtual std::vector<Cell> GetCalculationOrder() const = 0;

    /**
     * @brief Marks a cell as needing recalculation.
     * @param cell The cell to be marked for recalculation.
     */
    virtual void InvalidateCell(const Cell& cell) = 0;

protected:
    // Protected member variables that derived classes might need
    DependencyGraph m_dependencyGraph;
    IFormulaParser* m_formulaParser;
    std::unordered_set<Cell> m_invalidatedCells;
};

} // namespace ExcelCalculationEngine

#endif // ICALCULATION_CHAIN_H