#ifndef WORKSHEET_H
#define WORKSHEET_H

#include <string>
#include <unordered_map>
#include <vector>
#include "Cell.h"
#include "../Utils/ErrorHandling.h"

// Forward declarations
class CellAddress;
class RangeAddress;

class Worksheet {
public:
    // Constructor
    Worksheet(const std::string& name, size_t rows = 1048576, size_t columns = 16384);

    // Cell operations
    Cell& GetCell(const CellAddress& address);
    std::vector<Cell*> GetRange(const RangeAddress& range);

    // Worksheet properties
    void SetName(const std::string& newName);
    std::string GetName() const;
    size_t GetRowCount() const;
    size_t GetColumnCount() const;

    // Worksheet manipulation
    void InsertRow(size_t rowIndex);
    void InsertColumn(size_t columnIndex);
    void DeleteRow(size_t rowIndex);
    void DeleteColumn(size_t columnIndex);

private:
    std::string name;
    std::unordered_map<CellAddress, Cell> cells;
    size_t rowCount;
    size_t columnCount;

    // Helper functions
    void ValidateRowIndex(size_t rowIndex) const;
    void ValidateColumnIndex(size_t columnIndex) const;
    void ShiftCellsDown(size_t fromRow);
    void ShiftCellsRight(size_t fromColumn);
    void ShiftCellsUp(size_t fromRow);
    void ShiftCellsLeft(size_t fromColumn);
};

#endif // WORKSHEET_H