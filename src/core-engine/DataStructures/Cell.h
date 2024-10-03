#ifndef EXCEL_CORE_ENGINE_CELL_H
#define EXCEL_CORE_ENGINE_CELL_H

#include <string>
#include <variant>
#include "../Utils/ErrorHandling.h"

namespace Excel::CoreEngine {

// Forward declarations
class CellFormat;
class CellAddress;

/**
 * @class Cell
 * @brief Represents a single cell in an Excel worksheet.
 * 
 * This class encapsulates the data, formatting, and calculation state of a cell.
 */
class Cell {
public:
    /**
     * @brief Constructs a Cell object with the given address.
     * @param address The address of the cell.
     */
    explicit Cell(const CellAddress& address);

    /**
     * @brief Sets the value of the cell.
     * @param newValue The new value to set for the cell.
     */
    void SetValue(const std::variant<std::string, double, bool>& newValue);

    /**
     * @brief Returns the current value of the cell.
     * @return The cell's current value.
     */
    std::variant<std::string, double, bool> GetValue() const;

    /**
     * @brief Sets the formula for the cell.
     * @param formula The formula to set for the cell.
     */
    void SetFormula(const std::string& formula);

    /**
     * @brief Returns the current formula of the cell.
     * @return The cell's current formula.
     */
    std::string GetFormula() const;

    /**
     * @brief Sets the formatting for the cell.
     * @param format The formatting to apply to the cell.
     */
    void SetFormat(const CellFormat& format);

    /**
     * @brief Returns the current formatting of the cell.
     * @return The cell's current formatting.
     */
    CellFormat GetFormat() const;

    /**
     * @brief Returns the address of the cell.
     * @return The cell's address.
     */
    CellAddress GetAddress() const;

    /**
     * @brief Marks the cell as needing recalculation.
     */
    void MarkDirty();

    /**
     * @brief Returns whether the cell needs recalculation.
     * @return True if the cell needs recalculation, false otherwise.
     */
    bool IsDirty() const;

private:
    std::variant<std::string, double, bool> value;
    std::string formula;
    CellFormat format;
    CellAddress address;
    bool isDirty;
};

} // namespace Excel::CoreEngine

#endif // EXCEL_CORE_ENGINE_CELL_H