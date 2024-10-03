#include "ExcelUIAccess.h"
#include "../interfaces/IExcelInterop.h"
#include <string>
#include <map>
#include <stdexcept>

ExcelUIAccess::ExcelUIAccess(IExcelInterop* excelInterop) : m_excelInterop(excelInterop) {
    if (!m_excelInterop) {
        throw std::runtime_error("Invalid IExcelInterop pointer");
    }
}

bool ExcelUIAccess::ShowDialog(const std::string& dialogName, const std::map<std::string, std::string>& parameters) {
    // Validate input parameters
    if (dialogName.empty()) {
        throw std::invalid_argument("Dialog name cannot be empty");
    }

    // Prepare dialog content based on dialogName and parameters
    std::string dialogContent = PrepareDialogContent(dialogName, parameters);

    // Use IExcelInterop to display the dialog
    bool result = m_excelInterop->DisplayDialog(dialogName, dialogContent);

    return result;
}

void ExcelUIAccess::AddRibbonButton(const std::string& tabName, const std::string& groupName, 
                                    const std::string& buttonName, const std::string& imagePath, 
                                    const std::string& onClickFunction) {
    // Validate input parameters
    if (tabName.empty() || groupName.empty() || buttonName.empty() || onClickFunction.empty()) {
        throw std::invalid_argument("Tab name, group name, button name, and onClick function cannot be empty");
    }

    // Use IExcelInterop to add the button to the specified ribbon location
    m_excelInterop->AddRibbonButton(tabName, groupName, buttonName, imagePath, onClickFunction);

    // Associate the onClickFunction with the button
    // This is typically handled by the Excel add-in framework, but we'll add a placeholder here
    AssociateButtonFunction(buttonName, onClickFunction);
}

void ExcelUIAccess::RemoveRibbonButton(const std::string& tabName, const std::string& groupName, const std::string& buttonName) {
    // Validate input parameters
    if (tabName.empty() || groupName.empty() || buttonName.empty()) {
        throw std::invalid_argument("Tab name, group name, and button name cannot be empty");
    }

    // Use IExcelInterop to remove the specified button from the ribbon
    m_excelInterop->RemoveRibbonButton(tabName, groupName, buttonName);
}

void ExcelUIAccess::ShowTaskPane(const std::string& taskPaneName) {
    // Validate input parameter
    if (taskPaneName.empty()) {
        throw std::invalid_argument("Task pane name cannot be empty");
    }

    // Use IExcelInterop to display the specified task pane
    m_excelInterop->ShowTaskPane(taskPaneName);
}

void ExcelUIAccess::HideTaskPane(const std::string& taskPaneName) {
    // Validate input parameter
    if (taskPaneName.empty()) {
        throw std::invalid_argument("Task pane name cannot be empty");
    }

    // Use IExcelInterop to hide the specified task pane
    m_excelInterop->HideTaskPane(taskPaneName);
}

void ExcelUIAccess::RefreshRibbon() {
    // Use IExcelInterop to trigger a ribbon refresh
    m_excelInterop->RefreshRibbon();
}

// Private helper methods

std::string ExcelUIAccess::PrepareDialogContent(const std::string& dialogName, const std::map<std::string, std::string>& parameters) {
    // This is a placeholder implementation. In a real-world scenario, this method would
    // generate the appropriate dialog content based on the dialog name and parameters.
    std::string content = "Dialog: " + dialogName + "\n";
    for (const auto& param : parameters) {
        content += param.first + ": " + param.second + "\n";
    }
    return content;
}

void ExcelUIAccess::AssociateButtonFunction(const std::string& buttonName, const std::string& functionName) {
    // This is a placeholder implementation. In a real-world scenario, this method would
    // associate the button with the specified function in the Excel add-in framework.
    // The actual implementation would depend on the specifics of the add-in framework being used.
    m_buttonFunctions[buttonName] = functionName;
}