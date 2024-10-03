#include "Worksheet.h"
#include "Cell.h"
#include "../Utils/ErrorHandling.h"
#include <algorithm>
#include <stdexcept>

Worksheet::Worksheet(const std::string& name, size_t rows, size_t columns)
    : name(name), rowCount(rows), columnCount(columns) {
    // Initialize the cells map with empty cells
    for (size_t row = 0; row < rows; ++row) {
        for (size_t col = 0; col < columns; ++col) {
            CellAddress address{row, col};
            cells[address] = std::make_unique<Cell>();
        }
    }
}

Cell& Worksheet::GetCell(const CellAddress& address) {
    auto it = cells.find(address);
    if (it == cells.end()) {
        // If the cell doesn't exist, create it
        auto [newIt, inserted] = cells.emplace(address, std::make_unique<Cell>());
        return *newIt->second;
    }
    return *it->second;
}

std::vector<Cell*> Worksheet::GetRange(const RangeAddress& range) {
    std::vector<Cell*> result;
    for (size_t row = range.startRow; row <= range.endRow; ++row) {
        for (size_t col = range.startCol; col <= range.endCol; ++col) {
            CellAddress address{row, col};
            result.push_back(&GetCell(address));
        }
    }
    return result;
}

void Worksheet::SetName(const std::string& newName) {
    if (newName.empty()) {
        throw std::invalid_argument("Worksheet name cannot be empty");
    }
    name = newName;
}

std::string Worksheet::GetName() const {
    return name;
}

size_t Worksheet::GetRowCount() const {
    return rowCount;
}

size_t Worksheet::GetColumnCount() const {
    return columnCount;
}

void Worksheet::InsertRow(size_t rowIndex) {
    if (rowIndex > rowCount) {
        throw std::out_of_range("Row index out of range");
    }

    // Shift existing cells down
    for (size_t row = rowCount; row > rowIndex; --row) {
        for (size_t col = 0; col < columnCount; ++col) {
            CellAddress oldAddress{row - 1, col};
            CellAddress newAddress{row, col};
            cells[newAddress] = std::move(cells[oldAddress]);
        }
    }

    // Insert new empty cells in the new row
    for (size_t col = 0; col < columnCount; ++col) {
        CellAddress address{rowIndex, col};
        cells[address] = std::make_unique<Cell>();
    }

    ++rowCount;
}

void Worksheet::InsertColumn(size_t columnIndex) {
    if (columnIndex > columnCount) {
        throw std::out_of_range("Column index out of range");
    }

    // Shift existing cells right
    for (size_t row = 0; row < rowCount; ++row) {
        for (size_t col = columnCount; col > columnIndex; --col) {
            CellAddress oldAddress{row, col - 1};
            CellAddress newAddress{row, col};
            cells[newAddress] = std::move(cells[oldAddress]);
        }
    }

    // Insert new empty cells in the new column
    for (size_t row = 0; row < rowCount; ++row) {
        CellAddress address{row, columnIndex};
        cells[address] = std::make_unique<Cell>();
    }

    ++columnCount;
}

void Worksheet::DeleteRow(size_t rowIndex) {
    if (rowIndex >= rowCount) {
        throw std::out_of_range("Row index out of range");
    }

    // Shift cells up
    for (size_t row = rowIndex; row < rowCount - 1; ++row) {
        for (size_t col = 0; col < columnCount; ++col) {
            CellAddress oldAddress{row + 1, col};
            CellAddress newAddress{row, col};
            cells[newAddress] = std::move(cells[oldAddress]);
        }
    }

    // Remove the last row
    for (size_t col = 0; col < columnCount; ++col) {
        CellAddress address{rowCount - 1, col};
        cells.erase(address);
    }

    --rowCount;
}

void Worksheet::DeleteColumn(size_t columnIndex) {
    if (columnIndex >= columnCount) {
        throw std::out_of_range("Column index out of range");
    }

    // Shift cells left
    for (size_t row = 0; row < rowCount; ++row) {
        for (size_t col = columnIndex; col < columnCount - 1; ++col) {
            CellAddress oldAddress{row, col + 1};
            CellAddress newAddress{row, col};
            cells[newAddress] = std::move(cells[oldAddress]);
        }
    }

    // Remove the last column
    for (size_t row = 0; row < rowCount; ++row) {
        CellAddress address{row, columnCount - 1};
        cells.erase(address);
    }

    --columnCount;
}