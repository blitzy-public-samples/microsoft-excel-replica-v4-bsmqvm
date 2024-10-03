#ifndef EXCEL_CORE_ENGINE_RANGE_H
#define EXCEL_CORE_ENGINE_RANGE_H

#include <vector>
#include <string>
#include <variant>
#include "Cell.h"
#include "../Utils/ErrorHandling.h"

namespace Excel::CoreEngine {

class Range {
public:
    // Represents a cell address (e.g., "A1")
    struct CellAddress {
        std::string address;
        // Constructor and other methods can be added here if needed
    };

    // Constructor
    Range(const CellAddress& topLeft, const CellAddress& bottomRight);

    // Public methods
    Cell* GetCell(const CellAddress& address) const;
    std::vector<Cell*> GetCells() const;
    void SetValues(const std::vector<std::variant<std::string, double, bool>>& values);
    std::vector<std::variant<std::string, double, bool>> GetValues() const;
    void SetFormula(const std::string& formula);
    std::vector<std::string> GetFormulas() const;
    std::string GetAddress() const;
    int GetRowCount() const;
    int GetColumnCount() const;
    void MarkDirty();

private:
    CellAddress topLeft;
    CellAddress bottomRight;
    std::vector<Cell*> cells;

    // Helper methods
    bool IsAddressWithinRange(const CellAddress& address) const;
    void PopulateCells();
};

} // namespace Excel::CoreEngine

#endif // EXCEL_CORE_ENGINE_RANGE_H