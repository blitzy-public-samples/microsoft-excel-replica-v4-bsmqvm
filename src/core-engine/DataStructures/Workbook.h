#ifndef WORKBOOK_H
#define WORKBOOK_H

#include <string>
#include <vector>
#include <memory>
#include "Worksheet.h"
#include "../Utils/ErrorHandling.h"

namespace Excel {
namespace CoreEngine {
namespace DataStructures {

/**
 * @class Workbook
 * @brief Represents an Excel workbook, containing multiple worksheets and managing workbook-level properties and operations.
 * 
 * This class is a crucial data structure in the core engine of Microsoft Excel, providing functionality
 * for efficient input, storage, and organization of structured data, as well as supporting complex
 * calculations and in-depth data analysis.
 */
class Workbook {
public:
    /**
     * @brief Constructs a Workbook object with the given name.
     * @param name The name of the workbook.
     */
    explicit Workbook(const std::string& name);

    /**
     * @brief Adds a new worksheet to the workbook with the given name.
     * @param name The name of the new worksheet.
     * @return A pointer to the newly added worksheet.
     * @throws ExcelException if a worksheet with the same name already exists.
     */
    Worksheet* AddWorksheet(const std::string& name);

    /**
     * @brief Returns a pointer to the worksheet with the given name.
     * @param name The name of the worksheet to retrieve.
     * @return A pointer to the worksheet with the given name, or nullptr if not found.
     */
    Worksheet* GetWorksheet(const std::string& name) const;

    /**
     * @brief Removes the worksheet with the given name from the workbook.
     * @param name The name of the worksheet to remove.
     * @throws ExcelException if the worksheet is not found or if it's the last worksheet in the workbook.
     */
    void RemoveWorksheet(const std::string& name);

    /**
     * @brief Sets the active worksheet to the one with the given name.
     * @param name The name of the worksheet to set as active.
     * @throws ExcelException if the worksheet is not found.
     */
    void SetActiveSheet(const std::string& name);

    /**
     * @brief Returns a pointer to the currently active worksheet.
     * @return A pointer to the active worksheet, or nullptr if no active worksheet.
     */
    Worksheet* GetActiveSheet() const;

    /**
     * @brief Saves the workbook, resetting the modified flag.
     * @throws ExcelException if there's an error during the save operation.
     */
    void Save();

    /**
     * @brief Returns whether the workbook has unsaved changes.
     * @return True if the workbook has unsaved changes, false otherwise.
     */
    bool IsModified() const;

    /**
     * @brief Gets the name of the workbook.
     * @return The name of the workbook.
     */
    const std::string& GetName() const;

private:
    std::string name;
    std::vector<std::unique_ptr<Worksheet>> worksheets;
    Worksheet* activeSheet;
    bool isModified;
};

} // namespace DataStructures
} // namespace CoreEngine
} // namespace Excel

#endif // WORKBOOK_H