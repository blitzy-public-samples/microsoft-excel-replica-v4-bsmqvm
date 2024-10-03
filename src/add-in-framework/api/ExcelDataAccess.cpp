#include "ExcelDataAccess.h"
#include "../interfaces/IExcelInterop.h"
#include "../utils/ErrorHandler.h"
#include "../security/PermissionManager.h"
#include <stdexcept>
#include <vector>

ExcelDataAccess::ExcelDataAccess(std::shared_ptr<IExcelInterop> excelInterop, 
                                 std::shared_ptr<ErrorHandler> errorHandler,
                                 std::shared_ptr<PermissionManager> permissionManager)
    : m_excelInterop(excelInterop), m_errorHandler(errorHandler), m_permissionManager(permissionManager) {}

CellValue ExcelDataAccess::GetCellValue(const std::string& sheetName, const std::string& cellAddress) {
    try {
        // Validate input parameters
        if (sheetName.empty() || cellAddress.empty()) {
            throw std::invalid_argument("Sheet name and cell address must not be empty");
        }

        // Check permissions
        if (!m_permissionManager->CheckPermission("ReadCell")) {
            throw std::runtime_error("Permission denied: Cannot read cell value");
        }

        // Use IExcelInterop to retrieve the cell value
        return m_excelInterop->GetCellValue(sheetName, cellAddress);
    }
    catch (const std::exception& e) {
        m_errorHandler->HandleError("GetCellValue", e.what());
        throw;
    }
}

void ExcelDataAccess::SetCellValue(const std::string& sheetName, const std::string& cellAddress, const CellValue& value) {
    try {
        // Validate input parameters
        if (sheetName.empty() || cellAddress.empty()) {
            throw std::invalid_argument("Sheet name and cell address must not be empty");
        }

        // Check permissions
        if (!m_permissionManager->CheckPermission("WriteCell")) {
            throw std::runtime_error("Permission denied: Cannot write cell value");
        }

        // Use IExcelInterop to set the cell value
        m_excelInterop->SetCellValue(sheetName, cellAddress, value);
    }
    catch (const std::exception& e) {
        m_errorHandler->HandleError("SetCellValue", e.what());
        throw;
    }
}

std::vector<std::vector<CellValue>> ExcelDataAccess::GetRangeValues(const std::string& sheetName, const std::string& rangeAddress) {
    try {
        // Validate input parameters
        if (sheetName.empty() || rangeAddress.empty()) {
            throw std::invalid_argument("Sheet name and range address must not be empty");
        }

        // Check permissions
        if (!m_permissionManager->CheckPermission("ReadRange")) {
            throw std::runtime_error("Permission denied: Cannot read range values");
        }

        // Use IExcelInterop to retrieve the range values
        return m_excelInterop->GetRangeValues(sheetName, rangeAddress);
    }
    catch (const std::exception& e) {
        m_errorHandler->HandleError("GetRangeValues", e.what());
        throw;
    }
}

void ExcelDataAccess::SetRangeValues(const std::string& sheetName, const std::string& rangeAddress, const std::vector<std::vector<CellValue>>& values) {
    try {
        // Validate input parameters
        if (sheetName.empty() || rangeAddress.empty() || values.empty()) {
            throw std::invalid_argument("Sheet name, range address, and values must not be empty");
        }

        // Check permissions
        if (!m_permissionManager->CheckPermission("WriteRange")) {
            throw std::runtime_error("Permission denied: Cannot write range values");
        }

        // Use IExcelInterop to set the range values
        m_excelInterop->SetRangeValues(sheetName, rangeAddress, values);
    }
    catch (const std::exception& e) {
        m_errorHandler->HandleError("SetRangeValues", e.what());
        throw;
    }
}

void ExcelDataAccess::AddWorksheet(const std::string& sheetName) {
    try {
        // Validate input parameter
        if (sheetName.empty()) {
            throw std::invalid_argument("Sheet name must not be empty");
        }

        // Check permissions
        if (!m_permissionManager->CheckPermission("AddWorksheet")) {
            throw std::runtime_error("Permission denied: Cannot add worksheet");
        }

        // Use IExcelInterop to add a new worksheet
        m_excelInterop->AddWorksheet(sheetName);
    }
    catch (const std::exception& e) {
        m_errorHandler->HandleError("AddWorksheet", e.what());
        throw;
    }
}

void ExcelDataAccess::DeleteWorksheet(const std::string& sheetName) {
    try {
        // Validate input parameter
        if (sheetName.empty()) {
            throw std::invalid_argument("Sheet name must not be empty");
        }

        // Check permissions
        if (!m_permissionManager->CheckPermission("DeleteWorksheet")) {
            throw std::runtime_error("Permission denied: Cannot delete worksheet");
        }

        // Use IExcelInterop to delete the specified worksheet
        m_excelInterop->DeleteWorksheet(sheetName);
    }
    catch (const std::exception& e) {
        m_errorHandler->HandleError("DeleteWorksheet", e.what());
        throw;
    }
}

std::vector<std::string> ExcelDataAccess::GetWorksheetNames() {
    try {
        // Check permissions
        if (!m_permissionManager->CheckPermission("ReadWorksheetNames")) {
            throw std::runtime_error("Permission denied: Cannot read worksheet names");
        }

        // Use IExcelInterop to retrieve all worksheet names
        return m_excelInterop->GetWorksheetNames();
    }
    catch (const std::exception& e) {
        m_errorHandler->HandleError("GetWorksheetNames", e.what());
        throw;
    }
}