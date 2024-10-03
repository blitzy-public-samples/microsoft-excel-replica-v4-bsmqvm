#pragma once

#include "../interfaces/IAddIn.h"

/**
 * @interface IExcelInterop
 * @brief This interface defines methods for interacting with Excel, providing add-ins with access to Excel's functionality and data.
 */
class IExcelInterop {
public:
    virtual ~IExcelInterop() = default;

    /**
     * @brief Retrieves a pointer to the currently active workbook.
     * @return Pointer to the active workbook
     */
    virtual IWorkbook* GetActiveWorkbook() = 0;

    /**
     * @brief Retrieves a pointer to a worksheet by its name.
     * @param name The name of the worksheet to retrieve
     * @return Pointer to the requested worksheet
     */
    virtual IWorksheet* GetWorksheetByName(const char* name) = 0;

    /**
     * @brief Retrieves the value of a cell as a string.
     * @param sheetName The name of the worksheet containing the cell
     * @param cellAddress The address of the cell (e.g., "A1")
     * @return The value of the cell as a string
     */
    virtual const char* GetCellValue(const char* sheetName, const char* cellAddress) = 0;

    /**
     * @brief Sets the value of a cell.
     * @param sheetName The name of the worksheet containing the cell
     * @param cellAddress The address of the cell (e.g., "A1")
     * @param value The value to set in the cell
     */
    virtual void SetCellValue(const char* sheetName, const char* cellAddress, const char* value) = 0;

    /**
     * @brief Adds a new worksheet to the active workbook.
     * @param name The name of the new worksheet
     * @return Pointer to the newly created worksheet
     */
    virtual IWorksheet* AddWorksheet(const char* name) = 0;

    /**
     * @brief Deletes a worksheet from the active workbook.
     * @param name The name of the worksheet to delete
     */
    virtual void DeleteWorksheet(const char* name) = 0;

    /**
     * @brief Executes an Excel function and returns the result as a string.
     * @param functionName The name of the Excel function to execute
     * @param args An array of function arguments
     * @param argCount The number of arguments in the args array
     * @return The result of the Excel function as a string
     */
    virtual const char* ExecuteExcelFunction(const char* functionName, const char** args, int argCount) = 0;

    /**
     * @brief Refreshes all data connections in the workbook.
     */
    virtual void RefreshAllData() = 0;
};