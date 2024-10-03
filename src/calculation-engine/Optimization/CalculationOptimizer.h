#ifndef CALCULATION_OPTIMIZER_H
#define CALCULATION_OPTIMIZER_H

#include <memory>
#include <unordered_map>
#include <vector>
#include "../Interfaces/ICalculationChain.h"
#include "../../core-engine/DataStructures/Cell.h"
#include "../../core-engine/DataStructures/Worksheet.h"

namespace ExcelCalculationEngine {

class CalculationOptimizer {
public:
    CalculationOptimizer();
    ~CalculationOptimizer();

    // Optimizes the calculation chain for a given worksheet
    void OptimizeCalculationChain(const Worksheet& worksheet);

    // Caches the calculated value of a cell
    void CacheCell(const Cell& cell, const CellValue& value);

    // Retrieves the cached value of a cell
    CellValue GetCachedValue(const Cell& cell) const;

    // Invalidates the cache for a set of cells
    void InvalidateCache(const std::vector<Cell>& cells);

    // Analyzes cell dependencies to identify optimization opportunities
    void AnalyzeDependencies(const Worksheet& worksheet);

private:
    std::shared_ptr<ICalculationChain> m_calculationChain;
    std::unordered_map<CellId, CellValue> m_cellCache;

    // Helper methods for optimization
    void IdentifyIndependentGroups(const Worksheet& worksheet);
    void ReorderCalculations();
    void UpdateCalculationChain();

    // Helper methods for dependency analysis
    void BuildDependencyGraph(const Worksheet& worksheet);
    void IdentifyCircularReferences();
    void DetermineParallelGroups();

    // Helper methods for caching
    CellId GenerateCellId(const Cell& cell) const;
};

} // namespace ExcelCalculationEngine

#endif // CALCULATION_OPTIMIZER_H