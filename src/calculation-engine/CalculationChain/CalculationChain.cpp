#include "CalculationChain.h"
#include "DependencyGraph.h"
#include "src/core-engine/DataStructures/Cell.h"
#include "src/calculation-engine/ErrorHandling/CalculationErrors.h"
#include <algorithm>
#include <stdexcept>

CalculationChain::CalculationChain() : m_dependencyGraph(std::make_unique<DependencyGraph>()) {}

CalculationChain::~CalculationChain() = default;

void CalculationChain::AddCell(const std::shared_ptr<Cell>& cell) {
    if (!cell) {
        throw std::invalid_argument("Cannot add null cell to calculation chain");
    }

    // Add the cell to the calculation chain
    m_cells.push_back(cell);

    // Update the dependency graph with the new cell
    m_dependencyGraph->AddCell(cell);
}

void CalculationChain::RemoveCell(const std::shared_ptr<Cell>& cell) {
    if (!cell) {
        throw std::invalid_argument("Cannot remove null cell from calculation chain");
    }

    // Remove the cell from the calculation chain
    auto it = std::find(m_cells.begin(), m_cells.end(), cell);
    if (it != m_cells.end()) {
        m_cells.erase(it);
    }

    // Update the dependency graph to remove the cell and its dependencies
    m_dependencyGraph->RemoveCell(cell);
}

void CalculationChain::UpdateDependencies(const std::shared_ptr<Cell>& cell, const std::vector<std::shared_ptr<Cell>>& dependencies) {
    if (!cell) {
        throw std::invalid_argument("Cannot update dependencies for null cell");
    }

    // Update the dependencies for the given cell in the dependency graph
    m_dependencyGraph->UpdateDependencies(cell, dependencies);

    // Check for circular dependencies
    if (m_dependencyGraph->HasCircularDependency(cell)) {
        throw CalculationError("Circular dependency detected", CalculationErrorType::CircularReference);
    }

    // Recalculate the calculation order if necessary
    RecalculateOrder();
}

std::vector<std::shared_ptr<Cell>> CalculationChain::GetCalculationOrder() const {
    return m_calculationOrder;
}

void CalculationChain::InvalidateCell(const std::shared_ptr<Cell>& cell) {
    if (!cell) {
        throw std::invalid_argument("Cannot invalidate null cell");
    }

    // Mark the cell as dirty (needing recalculation)
    cell->SetDirty(true);

    // Propagate the invalidation to all dependent cells
    auto dependentCells = m_dependencyGraph->GetDependentCells(cell);
    for (const auto& dependentCell : dependentCells) {
        InvalidateCell(dependentCell);
    }
}

void CalculationChain::RecalculateChain() {
    // Identify all dirty cells
    std::vector<std::shared_ptr<Cell>> dirtyCells;
    for (const auto& cell : m_cells) {
        if (cell->IsDirty()) {
            dirtyCells.push_back(cell);
        }
    }

    // Perform a topological sort to determine the correct calculation order
    m_calculationOrder = m_dependencyGraph->TopologicalSort(dirtyCells);

    // Recalculate dirty cells in the determined order
    for (const auto& cell : m_calculationOrder) {
        if (cell->IsDirty()) {
            try {
                cell->Recalculate();
            } catch (const CalculationError& e) {
                // Handle calculation errors (e.g., log the error, set cell to error state)
                cell->SetErrorState(e.what());
            }
            cell->SetDirty(false);
        }
    }
}

void CalculationChain::RecalculateOrder() {
    // Perform a topological sort on all cells to determine the new calculation order
    m_calculationOrder = m_dependencyGraph->TopologicalSort(m_cells);
}