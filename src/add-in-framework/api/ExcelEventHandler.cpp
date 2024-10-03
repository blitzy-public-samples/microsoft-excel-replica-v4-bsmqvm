#include "ExcelEventHandler.h"
#include "../interfaces/IExcelInterop.h"
#include <functional>
#include <string>
#include <unordered_map>

class ExcelEventHandler {
private:
    IExcelInterop* m_excelInterop;
    std::unordered_map<std::string, std::function<void(const std::string&)>> m_workbookHandlers;
    std::unordered_map<std::string, std::function<void(const std::string&)>> m_sheetHandlers;
    std::function<void(const std::string&, const std::string&, const CellValue&)> m_cellChangeHandler;
    std::function<void()> m_calculationCompleteHandler;

public:
    ExcelEventHandler(IExcelInterop* excelInterop) : m_excelInterop(excelInterop) {}

    void RegisterWorkbookOpenHandler(std::function<void(const std::string&)> handler) {
        // Store the provided handler function
        m_workbookHandlers["open"] = handler;

        // Set up the event listener for workbook open events
        m_excelInterop->SetWorkbookOpenEventListener([this](const std::string& workbookName) {
            auto it = m_workbookHandlers.find("open");
            if (it != m_workbookHandlers.end()) {
                it->second(workbookName);
            }
        });
    }

    void RegisterWorkbookCloseHandler(std::function<void(const std::string&)> handler) {
        // Store the provided handler function
        m_workbookHandlers["close"] = handler;

        // Set up the event listener for workbook close events
        m_excelInterop->SetWorkbookCloseEventListener([this](const std::string& workbookName) {
            auto it = m_workbookHandlers.find("close");
            if (it != m_workbookHandlers.end()) {
                it->second(workbookName);
            }
        });
    }

    void RegisterSheetActivateHandler(std::function<void(const std::string&)> handler) {
        // Store the provided handler function
        m_sheetHandlers["activate"] = handler;

        // Set up the event listener for sheet activation events
        m_excelInterop->SetSheetActivateEventListener([this](const std::string& sheetName) {
            auto it = m_sheetHandlers.find("activate");
            if (it != m_sheetHandlers.end()) {
                it->second(sheetName);
            }
        });
    }

    void RegisterCellChangeHandler(std::function<void(const std::string&, const std::string&, const CellValue&)> handler) {
        // Store the provided handler function
        m_cellChangeHandler = handler;

        // Set up the event listener for cell change events
        m_excelInterop->SetCellChangeEventListener([this](const std::string& sheetName, const std::string& cellAddress, const CellValue& newValue) {
            if (m_cellChangeHandler) {
                m_cellChangeHandler(sheetName, cellAddress, newValue);
            }
        });
    }

    void RegisterCalculationCompleteHandler(std::function<void()> handler) {
        // Store the provided handler function
        m_calculationCompleteHandler = handler;

        // Set up the event listener for calculation complete events
        m_excelInterop->SetCalculationCompleteEventListener([this]() {
            if (m_calculationCompleteHandler) {
                m_calculationCompleteHandler();
            }
        });
    }

    void UnregisterAllHandlers() {
        // Iterate through all stored event handlers and remove each event listener
        m_excelInterop->RemoveWorkbookOpenEventListener();
        m_excelInterop->RemoveWorkbookCloseEventListener();
        m_excelInterop->RemoveSheetActivateEventListener();
        m_excelInterop->RemoveCellChangeEventListener();
        m_excelInterop->RemoveCalculationCompleteEventListener();

        // Clear all stored handler functions
        m_workbookHandlers.clear();
        m_sheetHandlers.clear();
        m_cellChangeHandler = nullptr;
        m_calculationCompleteHandler = nullptr;
    }
};