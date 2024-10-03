#include "Cell.h"
#include "../Utils/ErrorHandling.h"
#include <stdexcept>

Cell::Cell(const CellAddress& address) : address(address), isDirty(false) {}

void Cell::SetValue(const std::variant<std::string, double, bool>& newValue) {
    value = newValue;
    MarkDirty();
}

std::variant<std::string, double, bool> Cell::GetValue() const {
    return value;
}

void Cell::SetFormula(const std::string& formula) {
    this->formula = formula;
    MarkDirty();
}

std::string Cell::GetFormula() const {
    return formula;
}

void Cell::SetFormat(const CellFormat& format) {
    this->format = format;
}

CellFormat Cell::GetFormat() const {
    return format;
}

CellAddress Cell::GetAddress() const {
    return address;
}

void Cell::MarkDirty() {
    isDirty = true;
}

bool Cell::IsDirty() const {
    return isDirty;
}

// Error handling for invalid operations
void Cell::ValidateOperation(const std::string& operation) const {
    if (value.index() == 0 && operation != "string") {
        throw std::invalid_argument("Cannot perform " + operation + " operation on a string cell.");
    } else if (value.index() == 2 && operation != "boolean") {
        throw std::invalid_argument("Cannot perform " + operation + " operation on a boolean cell.");
    }
}

double Cell::GetNumericValue() const {
    ValidateOperation("numeric");
    try {
        return std::get<double>(value);
    } catch (const std::bad_variant_access&) {
        ErrorHandling::ReportError("Failed to get numeric value from cell.");
        return 0.0;
    }
}

std::string Cell::GetStringValue() const {
    ValidateOperation("string");
    try {
        return std::get<std::string>(value);
    } catch (const std::bad_variant_access&) {
        ErrorHandling::ReportError("Failed to get string value from cell.");
        return "";
    }
}

bool Cell::GetBooleanValue() const {
    ValidateOperation("boolean");
    try {
        return std::get<bool>(value);
    } catch (const std::bad_variant_access&) {
        ErrorHandling::ReportError("Failed to get boolean value from cell.");
        return false;
    }
}