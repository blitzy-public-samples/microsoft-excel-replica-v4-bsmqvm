#include "FormulaCache.h"
#include <chrono>
#include <sstream>

FormulaCache::FormulaCache(std::shared_ptr<ICalculationChain> calculationChain)
    : m_calculationChain(std::move(calculationChain)) {}

std::optional<CellValue> FormulaCache::GetCachedResult(const Cell& cell, const Workbook& workbook) {
    std::string cacheKey = GenerateCacheKey(cell, workbook);
    auto it = m_cache.find(cacheKey);
    
    if (it != m_cache.end()) {
        const CacheEntry& entry = it->second;
        auto now = std::chrono::steady_clock::now();
        
        // Check if the cache entry is still valid
        if (now - entry.timestamp < std::chrono::seconds(CACHE_EXPIRATION_SECONDS)) {
            return entry.result;
        } else {
            // Remove expired entry
            m_cache.erase(it);
        }
    }
    
    return std::nullopt;
}

void FormulaCache::CacheResult(const Cell& cell, const Workbook& workbook, const CellValue& result) {
    std::string cacheKey = GenerateCacheKey(cell, workbook);
    CacheEntry entry{result, std::chrono::steady_clock::now()};
    m_cache[cacheKey] = entry;
    
    // Implement cache size management if needed
    if (m_cache.size() > MAX_CACHE_SIZE) {
        // Remove the oldest entry
        auto oldest = m_cache.begin();
        for (auto it = m_cache.begin(); it != m_cache.end(); ++it) {
            if (it->second.timestamp < oldest->second.timestamp) {
                oldest = it;
            }
        }
        m_cache.erase(oldest);
    }
}

void FormulaCache::InvalidateCache(const Cell& cell) {
    // Since we don't have the workbook here, we need to invalidate all entries for this cell
    // across all workbooks. This might be less efficient but ensures correctness.
    for (auto it = m_cache.begin(); it != m_cache.end();) {
        if (it->first.find(cell.GetAddress()) != std::string::npos) {
            it = m_cache.erase(it);
        } else {
            ++it;
        }
    }
    
    // Notify the calculation chain that this cell's dependencies need to be recalculated
    m_calculationChain->InvalidateCell(cell);
}

void FormulaCache::ClearCache() {
    m_cache.clear();
}

std::string FormulaCache::GenerateCacheKey(const Cell& cell, const Workbook& workbook) {
    std::stringstream ss;
    ss << workbook.GetId() << "_" << cell.GetWorksheet().GetName() << "_" << cell.GetAddress();
    return ss.str();
}