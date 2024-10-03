#pragma once

#include "../interfaces/IExcelInterop.h"
#include <string>
#include <vector>

class ExcelDataAccess {
public:
    ExcelDataAccess(IExcelInterop* excelInterop);
    ~ExcelDataAccess();

    // Cell operations
    CellValue GetCellValue(const std::string& sheetName, const std::string& cellAddress) const;
    void SetCellValue(const std::string& sheetName, const std::string& cellAddress, const CellValue& value);

    // Range operations
    std::vector<std::vector<CellValue>> GetRangeValues(const std::string& sheetName, const std::string& rangeAddress) const;
    void SetRangeValues(const std::string& sheetName, const std::string& rangeAddress, const std::vector<std::vector<CellValue>>& values);

    // Worksheet operations
    void AddWorksheet(const std::string& sheetName);
    void DeleteWorksheet(const std::string& sheetName);
    std::vector<std::string> GetWorksheetNames() const;

private:
    IExcelInterop* m_excelInterop;

    // Helper methods
    void ValidateSheetName(const std::string& sheetName) const;
    void ValidateCellAddress(const std::string& cellAddress) const;
    void ValidateRangeAddress(const std::string& rangeAddress) const;
};

// Human tasks:
// 1. Implement the ExcelDataAccess.cpp file with the method definitions.
// 2. Add error handling for invalid input parameters and Excel interop failures.
// 3. Consider adding more advanced Excel operations as needed by add-ins.
// 4. Implement unit tests for the ExcelDataAccess class.
// 5. Document the usage of this class for add-in developers.