#include "Range.h"
#include "Cell.h"
#include "../Utils/ErrorHandling.h"
#include <algorithm>
#include <stdexcept>

Range::Range(const CellAddress& topLeft, const CellAddress& bottomRight)
    : topLeft(topLeft), bottomRight(bottomRight) {
    // Validate that topLeft is actually top-left of bottomRight
    if (topLeft.row > bottomRight.row || topLeft.column > bottomRight.column) {
        throw ExcelException("Invalid range: topLeft must be above and to the left of bottomRight");
    }

    // Populate cells vector with Cell pointers within the range
    for (int row = topLeft.row; row <= bottomRight.row; ++row) {
        for (int col = topLeft.column; col <= bottomRight.column; ++col) {
            cells.push_back(new Cell(CellAddress(row, col)));
        }
    }
}

Range::~Range() {
    // Clean up dynamically allocated Cell objects
    for (Cell* cell : cells) {
        delete cell;
    }
}

Cell* Range::GetCell(const CellAddress& address) const {
    // Check if the address is within the range
    if (address.row < topLeft.row || address.row > bottomRight.row ||
        address.column < topLeft.column || address.column > bottomRight.column) {
        throw ExcelException("Cell address is out of range");
    }

    // Calculate the index in the cells vector
    int index = (address.row - topLeft.row) * (bottomRight.column - topLeft.column + 1) +
                (address.column - topLeft.column);
    return cells[index];
}

std::vector<Cell*> Range::GetCells() const {
    return cells;
}

void Range::SetValues(const std::vector<std::variant<std::string, double, bool>>& values) {
    if (values.size() != cells.size()) {
        throw ExcelException("Number of values does not match the range size");
    }

    for (size_t i = 0; i < cells.size(); ++i) {
        cells[i]->SetValue(values[i]);
        cells[i]->MarkDirty();
    }
}

std::vector<std::variant<std::string, double, bool>> Range::GetValues() const {
    std::vector<std::variant<std::string, double, bool>> values;
    values.reserve(cells.size());

    for (const Cell* cell : cells) {
        values.push_back(cell->GetValue());
    }

    return values;
}

void Range::SetFormula(const std::string& formula) {
    for (Cell* cell : cells) {
        cell->SetFormula(formula);
        cell->MarkDirty();
    }
}

std::vector<std::string> Range::GetFormulas() const {
    std::vector<std::string> formulas;
    formulas.reserve(cells.size());

    for (const Cell* cell : cells) {
        formulas.push_back(cell->GetFormula());
    }

    return formulas;
}

std::string Range::GetAddress() const {
    return topLeft.ToString() + ":" + bottomRight.ToString();
}

int Range::GetRowCount() const {
    return bottomRight.row - topLeft.row + 1;
}

int Range::GetColumnCount() const {
    return bottomRight.column - topLeft.column + 1;
}

void Range::MarkDirty() {
    for (Cell* cell : cells) {
        cell->MarkDirty();
    }
}