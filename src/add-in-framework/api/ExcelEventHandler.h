#ifndef EXCEL_EVENT_HANDLER_H
#define EXCEL_EVENT_HANDLER_H

#include <functional>
#include <string>
#include "../interfaces/IAddIn.h"
#include "../interfaces/IExcelInterop.h"

namespace ExcelAddInFramework {

/**
 * @class ExcelEventHandler
 * @brief Provides methods for add-ins to register and handle various Excel events, allowing them to respond to user actions and Excel operations.
 */
class ExcelEventHandler {
public:
    /**
     * @brief Registers a handler for the Workbook Open event.
     * @param handler A function to be called when a workbook is opened.
     */
    void RegisterWorkbookOpenHandler(std::function<void(const std::string&)> handler);

    /**
     * @brief Registers a handler for the Workbook Close event.
     * @param handler A function to be called when a workbook is closed.
     */
    void RegisterWorkbookCloseHandler(std::function<void(const std::string&)> handler);

    /**
     * @brief Registers a handler for the Sheet Activate event.
     * @param handler A function to be called when a sheet is activated.
     */
    void RegisterSheetActivateHandler(std::function<void(const std::string&)> handler);

    /**
     * @brief Registers a handler for the Cell Change event.
     * @param handler A function to be called when a cell's value changes.
     */
    void RegisterCellChangeHandler(std::function<void(const std::string&, const std::string&, const CellValue&)> handler);

    /**
     * @brief Registers a handler for the Calculation Complete event.
     * @param handler A function to be called when Excel completes a calculation.
     */
    void RegisterCalculationCompleteHandler(std::function<void()> handler);

    /**
     * @brief Unregisters all event handlers.
     */
    void UnregisterAllHandlers();

private:
    // Private member variables to store the registered handlers
    std::function<void(const std::string&)> m_workbookOpenHandler;
    std::function<void(const std::string&)> m_workbookCloseHandler;
    std::function<void(const std::string&)> m_sheetActivateHandler;
    std::function<void(const std::string&, const std::string&, const CellValue&)> m_cellChangeHandler;
    std::function<void()> m_calculationCompleteHandler;

    // Private methods to set up event listeners and configure events
    void SetupWorkbookOpenListener();
    void SetupWorkbookCloseListener();
    void SetupSheetActivateListener();
    void SetupCellChangeListener();
    void SetupCalculationCompleteListener();
};

} // namespace ExcelAddInFramework

#endif // EXCEL_EVENT_HANDLER_H