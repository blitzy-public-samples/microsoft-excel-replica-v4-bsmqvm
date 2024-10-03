#ifndef FORMULA_CACHE_H
#define FORMULA_CACHE_H

#include <memory>
#include <optional>
#include <string>
#include <unordered_map>
#include "../Interfaces/ICalculationChain.h"
#include "../../core-engine/DataStructures/Cell.h"
#include "../../core-engine/DataStructures/Workbook.h"

namespace ExcelCalculationEngine {

class FormulaCache {
public:
    // Constructor
    explicit FormulaCache(std::shared_ptr<ICalculationChain> calculationChain);

    // Retrieve cached result for a given cell
    std::optional<CellValue> GetCachedResult(const Cell& cell, const Workbook& workbook) const;

    // Cache result for a given cell
    void CacheResult(const Cell& cell, const Workbook& workbook, const CellValue& result);

    // Invalidate cached result for a given cell
    void InvalidateCache(const Cell& cell);

    // Clear all cached results
    void ClearCache();

private:
    // Generate a unique key for a cell
    std::string GenerateKey(const Cell& cell, const Workbook& workbook) const;

    struct CacheEntry {
        CellValue value;
        std::chrono::system_clock::time_point timestamp;
    };

    std::unordered_map<std::string, CacheEntry> m_cache;
    std::shared_ptr<ICalculationChain> m_calculationChain;
};

} // namespace ExcelCalculationEngine

#endif // FORMULA_CACHE_H