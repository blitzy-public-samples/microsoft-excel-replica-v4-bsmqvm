#ifndef EXCEL_UI_ACCESS_H
#define EXCEL_UI_ACCESS_H

#include <string>
#include <map>
#include "../interfaces/IExcelInterop.h"

namespace ExcelAddIn {

/**
 * @class ExcelUIAccess
 * @brief This class provides methods for add-ins to interact with Excel's user interface,
 *        including manipulating ribbons, dialogs, and other UI elements.
 */
class ExcelUIAccess {
public:
    /**
     * @brief Constructor for ExcelUIAccess
     * @param excelInterop Pointer to the IExcelInterop interface
     */
    ExcelUIAccess(IExcelInterop* excelInterop);

    /**
     * @brief Displays a custom dialog in Excel.
     * @param dialogName The name of the dialog to display
     * @param parameters A map of parameters for the dialog
     * @return True if the dialog was successfully displayed, false otherwise
     */
    bool ShowDialog(const std::string& dialogName, const std::map<std::string, std::string>& parameters);

    /**
     * @brief Adds a custom button to the Excel ribbon.
     * @param tabName The name of the tab to add the button to
     * @param groupName The name of the group within the tab
     * @param buttonName The name of the button
     * @param imagePath The path to the button's image
     * @param onClickFunction The function to be called when the button is clicked
     */
    void AddRibbonButton(const std::string& tabName, const std::string& groupName, const std::string& buttonName,
                         const std::string& imagePath, const std::string& onClickFunction);

    /**
     * @brief Removes a custom button from the Excel ribbon.
     * @param tabName The name of the tab containing the button
     * @param groupName The name of the group within the tab
     * @param buttonName The name of the button to remove
     */
    void RemoveRibbonButton(const std::string& tabName, const std::string& groupName, const std::string& buttonName);

    /**
     * @brief Displays a custom task pane in Excel.
     * @param taskPaneName The name of the task pane to display
     */
    void ShowTaskPane(const std::string& taskPaneName);

    /**
     * @brief Hides a custom task pane in Excel.
     * @param taskPaneName The name of the task pane to hide
     */
    void HideTaskPane(const std::string& taskPaneName);

    /**
     * @brief Refreshes the Excel ribbon to reflect any changes made.
     */
    void RefreshRibbon();

private:
    IExcelInterop* m_excelInterop;

    // Helper methods
    bool ValidateInput(const std::string& input) const;
    void LogAction(const std::string& action) const;
};

} // namespace ExcelAddIn

#endif // EXCEL_UI_ACCESS_H