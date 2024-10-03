#ifndef DEPENDENCY_GRAPH_H
#define DEPENDENCY_GRAPH_H

#include <unordered_map>
#include <vector>
#include <memory>
#include <string>

// Forward declarations
class Cell;
class Range;
class ICalculationChain;

// Alias for CellID
using CellID = std::string;

/**
 * @class DependencyGraph
 * @brief Represents the dependency graph for cell calculations in Excel.
 * 
 * This class manages the dependencies between cells in a spreadsheet,
 * enabling efficient recalculation of formulas.
 */
class DependencyGraph {
public:
    /**
     * @brief Default constructor
     */
    DependencyGraph() = default;

    /**
     * @brief Adds a dependency between two cells.
     * @param dependent The cell that depends on another cell
     * @param dependsOn The cell that is depended upon
     */
    void AddDependency(const CellID& dependent, const CellID& dependsOn);

    /**
     * @brief Removes a dependency between two cells.
     * @param dependent The cell that no longer depends on another cell
     * @param dependsOn The cell that is no longer depended upon
     */
    void RemoveDependency(const CellID& dependent, const CellID& dependsOn);

    /**
     * @brief Retrieves all cells that depend on the given cell.
     * @param cell The cell to find dependents for
     * @return A vector of CellIDs that depend on the given cell
     */
    std::vector<CellID> GetDependents(const CellID& cell) const;

    /**
     * @brief Retrieves all cells that the given cell depends on.
     * @param cell The cell to find dependencies for
     * @return A vector of CellIDs that the given cell depends on
     */
    std::vector<CellID> GetDependencies(const CellID& cell) const;

    /**
     * @brief Updates the dependencies for a given cell.
     * @param cell The cell to update dependencies for
     * @param newDependencies A vector of new dependencies for the cell
     */
    void UpdateDependencies(const CellID& cell, const std::vector<CellID>& newDependencies);

private:
    // Map of cell dependencies (cell -> cells it depends on)
    std::unordered_map<CellID, std::vector<CellID>> dependencies_;

    // Map of reverse dependencies (cell -> cells that depend on it)
    std::unordered_map<CellID, std::vector<CellID>> reverseDependencies_;

    /**
     * @brief Helper function to add a single dependency
     * @param dependent The cell that depends on another cell
     * @param dependsOn The cell that is depended upon
     */
    void AddSingleDependency(const CellID& dependent, const CellID& dependsOn);

    /**
     * @brief Helper function to remove a single dependency
     * @param dependent The cell that no longer depends on another cell
     * @param dependsOn The cell that is no longer depended upon
     */
    void RemoveSingleDependency(const CellID& dependent, const CellID& dependsOn);
};

#endif // DEPENDENCY_GRAPH_H