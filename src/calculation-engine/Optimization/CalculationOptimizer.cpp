#include "CalculationOptimizer.h"
#include "../Interfaces/ICalculationChain.h"
#include "../../core-engine/DataStructures/Cell.h"
#include "../../core-engine/DataStructures/Worksheet.h"
#include "../FormulaParser/FormulaParser.h"
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <memory>

CalculationOptimizer::CalculationOptimizer() : m_cellCache() {}

void CalculationOptimizer::OptimizeCalculationChain(const Worksheet& worksheet) {
    // Step 1: Analyze the worksheet structure
    std::vector<Cell> cells = worksheet.GetAllCells();
    std::unordered_map<std::string, std::vector<std::string>> dependencyGraph;

    for (const auto& cell : cells) {
        if (cell.HasFormula()) {
            std::vector<std::string> dependencies = AnalyzeCellDependencies(cell);
            dependencyGraph[cell.GetId()] = dependencies;
        }
    }

    // Step 2: Identify independent calculation groups
    std::vector<std::vector<std::string>> independentGroups = IdentifyIndependentGroups(dependencyGraph);

    // Step 3: Reorder calculations to minimize dependencies
    std::vector<std::string> optimizedOrder = ReorderCalculations(independentGroups, dependencyGraph);

    // Step 4: Update the calculation chain with the optimized order
    UpdateCalculationChain(optimizedOrder);
}

void CalculationOptimizer::CacheCell(const Cell& cell, const CellValue& value) {
    std::string cacheKey = GenerateCacheKey(cell);
    m_cellCache[cacheKey] = value;
}

CellValue CalculationOptimizer::GetCachedValue(const Cell& cell) const {
    std::string cacheKey = GenerateCacheKey(cell);
    auto it = m_cellCache.find(cacheKey);
    if (it != m_cellCache.end()) {
        return it->second;
    }
    return CellValue(); // Return a default value if not found
}

void CalculationOptimizer::InvalidateCache(const std::vector<Cell>& cells) {
    for (const auto& cell : cells) {
        std::string cacheKey = GenerateCacheKey(cell);
        m_cellCache.erase(cacheKey);
    }
}

void CalculationOptimizer::AnalyzeDependencies(const Worksheet& worksheet) {
    m_dependencyGraph.clear();
    m_reverseDependencyGraph.clear();

    std::vector<Cell> cells = worksheet.GetAllCells();

    for (const auto& cell : cells) {
        if (cell.HasFormula()) {
            std::vector<std::string> dependencies = AnalyzeCellDependencies(cell);
            m_dependencyGraph[cell.GetId()] = dependencies;

            for (const auto& dep : dependencies) {
                m_reverseDependencyGraph[dep].push_back(cell.GetId());
            }
        }
    }

    IdentifyCircularReferences();
    DetermineParallelGroups();
}

std::vector<std::string> CalculationOptimizer::AnalyzeCellDependencies(const Cell& cell) const {
    std::vector<std::string> dependencies;
    if (cell.HasFormula()) {
        FormulaParser parser;
        std::vector<std::string> referencedCells = parser.ExtractCellReferences(cell.GetFormula());
        dependencies.insert(dependencies.end(), referencedCells.begin(), referencedCells.end());
    }
    return dependencies;
}

std::vector<std::vector<std::string>> CalculationOptimizer::IdentifyIndependentGroups(
    const std::unordered_map<std::string, std::vector<std::string>>& dependencyGraph) {
    std::vector<std::vector<std::string>> independentGroups;
    std::unordered_set<std::string> visitedCells;

    for (const auto& entry : dependencyGraph) {
        if (visitedCells.find(entry.first) == visitedCells.end()) {
            std::vector<std::string> group;
            DepthFirstSearch(entry.first, dependencyGraph, visitedCells, group);
            independentGroups.push_back(group);
        }
    }

    return independentGroups;
}

void CalculationOptimizer::DepthFirstSearch(const std::string& cellId,
                                            const std::unordered_map<std::string, std::vector<std::string>>& dependencyGraph,
                                            std::unordered_set<std::string>& visitedCells,
                                            std::vector<std::string>& group) {
    visitedCells.insert(cellId);
    group.push_back(cellId);

    auto it = dependencyGraph.find(cellId);
    if (it != dependencyGraph.end()) {
        for (const auto& dependency : it->second) {
            if (visitedCells.find(dependency) == visitedCells.end()) {
                DepthFirstSearch(dependency, dependencyGraph, visitedCells, group);
            }
        }
    }
}

std::vector<std::string> CalculationOptimizer::ReorderCalculations(
    const std::vector<std::vector<std::string>>& independentGroups,
    const std::unordered_map<std::string, std::vector<std::string>>& dependencyGraph) {
    std::vector<std::string> optimizedOrder;

    for (const auto& group : independentGroups) {
        std::vector<std::string> sortedGroup = TopologicalSort(group, dependencyGraph);
        optimizedOrder.insert(optimizedOrder.end(), sortedGroup.begin(), sortedGroup.end());
    }

    return optimizedOrder;
}

std::vector<std::string> CalculationOptimizer::TopologicalSort(
    const std::vector<std::string>& group,
    const std::unordered_map<std::string, std::vector<std::string>>& dependencyGraph) {
    std::unordered_map<std::string, bool> visited;
    std::vector<std::string> sortedOrder;

    for (const auto& cellId : group) {
        if (!visited[cellId]) {
            TopologicalSortUtil(cellId, dependencyGraph, visited, sortedOrder);
        }
    }

    std::reverse(sortedOrder.begin(), sortedOrder.end());
    return sortedOrder;
}

void CalculationOptimizer::TopologicalSortUtil(const std::string& cellId,
                                               const std::unordered_map<std::string, std::vector<std::string>>& dependencyGraph,
                                               std::unordered_map<std::string, bool>& visited,
                                               std::vector<std::string>& sortedOrder) {
    visited[cellId] = true;

    auto it = dependencyGraph.find(cellId);
    if (it != dependencyGraph.end()) {
        for (const auto& dependency : it->second) {
            if (!visited[dependency]) {
                TopologicalSortUtil(dependency, dependencyGraph, visited, sortedOrder);
            }
        }
    }

    sortedOrder.push_back(cellId);
}

void CalculationOptimizer::UpdateCalculationChain(const std::vector<std::string>& optimizedOrder) {
    // This method would interact with the ICalculationChain interface to update the calculation order
    // For now, we'll just print the optimized order as a placeholder
    std::cout << "Optimized Calculation Order:" << std::endl;
    for (const auto& cellId : optimizedOrder) {
        std::cout << cellId << " ";
    }
    std::cout << std::endl;
}

std::string CalculationOptimizer::GenerateCacheKey(const Cell& cell) const {
    // Generate a unique identifier for the cell, combining worksheet ID and cell address
    return cell.GetWorksheetId() + "_" + cell.GetAddress();
}

void CalculationOptimizer::IdentifyCircularReferences() {
    m_circularReferences.clear();
    std::unordered_set<std::string> visited;
    std::unordered_set<std::string> recursionStack;

    for (const auto& entry : m_dependencyGraph) {
        if (HasCircularDependency(entry.first, visited, recursionStack)) {
            m_circularReferences.insert(entry.first);
        }
    }
}

bool CalculationOptimizer::HasCircularDependency(const std::string& cellId,
                                                 std::unordered_set<std::string>& visited,
                                                 std::unordered_set<std::string>& recursionStack) {
    if (recursionStack.find(cellId) != recursionStack.end()) {
        return true;
    }

    if (visited.find(cellId) != visited.end()) {
        return false;
    }

    visited.insert(cellId);
    recursionStack.insert(cellId);

    auto it = m_dependencyGraph.find(cellId);
    if (it != m_dependencyGraph.end()) {
        for (const auto& dependency : it->second) {
            if (HasCircularDependency(dependency, visited, recursionStack)) {
                return true;
            }
        }
    }

    recursionStack.erase(cellId);
    return false;
}

void CalculationOptimizer::DetermineParallelGroups() {
    m_parallelGroups.clear();
    std::unordered_set<std::string> visited;

    for (const auto& entry : m_dependencyGraph) {
        if (visited.find(entry.first) == visited.end()) {
            std::vector<std::string> group;
            CollectIndependentCells(entry.first, visited, group);
            if (!group.empty()) {
                m_parallelGroups.push_back(group);
            }
        }
    }
}

void CalculationOptimizer::CollectIndependentCells(const std::string& cellId,
                                                   std::unordered_set<std::string>& visited,
                                                   std::vector<std::string>& group) {
    visited.insert(cellId);
    group.push_back(cellId);

    auto it = m_reverseDependencyGraph.find(cellId);
    if (it != m_reverseDependencyGraph.end()) {
        for (const auto& dependent : it->second) {
            if (visited.find(dependent) == visited.end()) {
                CollectIndependentCells(dependent, visited, group);
            }
        }
    }
}