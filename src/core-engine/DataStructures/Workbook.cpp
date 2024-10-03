#include "Workbook.h"
#include "Worksheet.h"
#include "../Utils/ErrorHandling.h"
#include <algorithm>

Workbook::Workbook(const std::string& name) : name(name), isModified(false), activeSheet(nullptr) {
    // Initialize the workbook with the given name
}

Worksheet* Workbook::AddWorksheet(const std::string& name) {
    // Create a new Worksheet object with the given name
    auto newWorksheet = std::make_unique<Worksheet>(name);
    Worksheet* worksheetPtr = newWorksheet.get();

    // Add the new worksheet to the worksheets vector
    worksheets.push_back(std::move(newWorksheet));

    // Set isModified to true
    isModified = true;

    // Return a pointer to the new worksheet
    return worksheetPtr;
}

Worksheet* Workbook::GetWorksheet(const std::string& name) {
    // Search for a worksheet with the given name in the worksheets vector
    auto it = std::find_if(worksheets.begin(), worksheets.end(),
        [&name](const std::unique_ptr<Worksheet>& worksheet) {
            return worksheet->GetName() == name;
        });

    // If found, return a pointer to the worksheet
    if (it != worksheets.end()) {
        return it->get();
    }

    // If not found, return nullptr
    return nullptr;
}

void Workbook::RemoveWorksheet(const std::string& name) {
    // Search for a worksheet with the given name in the worksheets vector
    auto it = std::find_if(worksheets.begin(), worksheets.end(),
        [&name](const std::unique_ptr<Worksheet>& worksheet) {
            return worksheet->GetName() == name;
        });

    // If found, remove the worksheet from the vector
    if (it != worksheets.end()) {
        // If the removed worksheet was the active sheet, set activeSheet to nullptr
        if (activeSheet == it->get()) {
            activeSheet = nullptr;
        }

        worksheets.erase(it);

        // Set isModified to true
        isModified = true;
    } else {
        // If not found, throw an ExcelException
        throw ExcelException("Worksheet not found: " + name);
    }
}

void Workbook::SetActiveSheet(const std::string& name) {
    // Search for a worksheet with the given name in the worksheets vector
    Worksheet* worksheet = GetWorksheet(name);

    // If found, set activeSheet to point to this worksheet
    if (worksheet) {
        activeSheet = worksheet;
    } else {
        // If not found, throw an ExcelException
        throw ExcelException("Worksheet not found: " + name);
    }
}

Worksheet* Workbook::GetActiveSheet() {
    // Return the activeSheet pointer
    return activeSheet;
}

void Workbook::Save() {
    // Implement saving logic (e.g., serialization)
    // This is a placeholder for the actual implementation
    // You would typically serialize the workbook data to a file or database here

    // Set isModified to false
    isModified = false;
}

bool Workbook::IsModified() const {
    // Return the value of isModified
    return isModified;
}

const std::string& Workbook::GetName() const {
    return name;
}

void Workbook::SetName(const std::string& newName) {
    name = newName;
    isModified = true;
}

size_t Workbook::GetWorksheetCount() const {
    return worksheets.size();
}

Worksheet* Workbook::GetWorksheetByIndex(size_t index) {
    if (index < worksheets.size()) {
        return worksheets[index].get();
    }
    return nullptr;
}