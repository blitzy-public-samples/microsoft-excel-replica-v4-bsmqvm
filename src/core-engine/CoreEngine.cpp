#include "CoreEngine.h"
#include "Interfaces/ICalculationEngine.h"
#include "Interfaces/IDataAnalysisEngine.h"
#include "Interfaces/IChartingEngine.h"
#include "Interfaces/ICollaborationService.h"
#include "Interfaces/ISecurityManager.h"
#include "DataStructures/Workbook.h"
#include "DataStructures/Worksheet.h"
#include "DataStructures/Cell.h"
#include "Memory/MemoryManager.h"
#include "FileIO/FileReader.h"
#include "FileIO/FileWriter.h"
#include "Utils/ErrorHandling.h"
#include "Utils/Logging.h"
#include <memory>
#include <vector>
#include <string>
#include <exception>

CoreEngine::CoreEngine()
    : m_calculationEngine(std::make_unique<CalculationEngine>()),
      m_dataAnalysisEngine(std::make_unique<DataAnalysisEngine>()),
      m_chartingEngine(std::make_unique<ChartingEngine>()),
      m_collaborationService(std::make_unique<CollaborationService>()),
      m_securityManager(std::make_unique<SecurityManager>()),
      m_memoryManager(std::make_unique<MemoryManager>()),
      m_fileReader(std::make_unique<FileReader>()),
      m_fileWriter(std::make_unique<FileWriter>()),
      m_currentWorkbook(nullptr)
{
    Logging::Log(LogLevel::Info, "CoreEngine initialized successfully");
}

CoreEngine::~CoreEngine() = default;

void CoreEngine::InitializeWorkbook(const std::string& name)
{
    try
    {
        m_currentWorkbook = std::make_unique<Workbook>(name);
        Logging::Log(LogLevel::Info, "New workbook created: " + name);
    }
    catch (const std::exception& e)
    {
        ErrorHandling::HandleError(ErrorType::WorkbookCreationError, "Failed to create workbook: " + std::string(e.what()));
    }
}

void CoreEngine::LoadWorkbook(const std::string& filePath)
{
    try
    {
        auto workbookData = m_fileReader->ReadWorkbook(filePath);
        m_currentWorkbook = std::make_unique<Workbook>(workbookData);
        Logging::Log(LogLevel::Info, "Workbook loaded successfully: " + filePath);
    }
    catch (const std::exception& e)
    {
        ErrorHandling::HandleError(ErrorType::WorkbookLoadError, "Failed to load workbook: " + std::string(e.what()));
    }
}

void CoreEngine::SaveWorkbook(const std::string& filePath)
{
    if (!m_currentWorkbook)
    {
        ErrorHandling::HandleError(ErrorType::NoActiveWorkbookError, "No active workbook to save");
        return;
    }

    try
    {
        m_fileWriter->WriteWorkbook(*m_currentWorkbook, filePath);
        Logging::Log(LogLevel::Info, "Workbook saved successfully: " + filePath);
    }
    catch (const std::exception& e)
    {
        ErrorHandling::HandleError(ErrorType::WorkbookSaveError, "Failed to save workbook: " + std::string(e.what()));
    }
}

double CoreEngine::PerformCalculation(const std::string& formula)
{
    try
    {
        return m_calculationEngine->CalculateFormula(formula);
    }
    catch (const std::exception& e)
    {
        ErrorHandling::HandleError(ErrorType::CalculationError, "Error in calculation: " + std::string(e.what()));
        return 0.0;
    }
}

void CoreEngine::UpdateCell(const std::string& cellReference, const std::string& value)
{
    if (!m_currentWorkbook)
    {
        ErrorHandling::HandleError(ErrorType::NoActiveWorkbookError, "No active workbook for cell update");
        return;
    }

    try
    {
        auto [sheetName, cellCoords] = ParseCellReference(cellReference);
        auto& sheet = m_currentWorkbook->GetWorksheet(sheetName);
        auto& cell = sheet.GetCell(cellCoords);
        cell.SetValue(value);

        m_calculationEngine->UpdateCell(cellReference, value);
        Logging::Log(LogLevel::Info, "Cell updated: " + cellReference);
    }
    catch (const std::exception& e)
    {
        ErrorHandling::HandleError(ErrorType::CellUpdateError, "Failed to update cell: " + std::string(e.what()));
    }
}

void CoreEngine::GenerateChart(const std::string& chartType, const std::string& dataRange)
{
    if (!m_currentWorkbook)
    {
        ErrorHandling::HandleError(ErrorType::NoActiveWorkbookError, "No active workbook for chart generation");
        return;
    }

    try
    {
        auto [sheetName, rangeCoords] = ParseDataRange(dataRange);
        auto& sheet = m_currentWorkbook->GetWorksheet(sheetName);
        auto rangeData = sheet.GetRangeData(rangeCoords);

        auto chart = m_chartingEngine->CreateChart(chartType, rangeData);
        sheet.AddChart(std::move(chart));
        Logging::Log(LogLevel::Info, "Chart generated: " + chartType + " for range " + dataRange);
    }
    catch (const std::exception& e)
    {
        ErrorHandling::HandleError(ErrorType::ChartGenerationError, "Failed to generate chart: " + std::string(e.what()));
    }
}

std::vector<double> CoreEngine::PerformDataAnalysis(const std::string& analysisType, const std::string& dataRange)
{
    if (!m_currentWorkbook)
    {
        ErrorHandling::HandleError(ErrorType::NoActiveWorkbookError, "No active workbook for data analysis");
        return {};
    }

    try
    {
        auto [sheetName, rangeCoords] = ParseDataRange(dataRange);
        auto& sheet = m_currentWorkbook->GetWorksheet(sheetName);
        auto rangeData = sheet.GetRangeData(rangeCoords);

        auto result = m_dataAnalysisEngine->PerformDataAnalysis(analysisType, rangeData);
        Logging::Log(LogLevel::Info, "Data analysis performed: " + analysisType + " on range " + dataRange);
        return result;
    }
    catch (const std::exception& e)
    {
        ErrorHandling::HandleError(ErrorType::DataAnalysisError, "Error in data analysis: " + std::string(e.what()));
        return {};
    }
}

std::pair<std::string, CellCoordinates> CoreEngine::ParseCellReference(const std::string& cellReference)
{
    // Implementation of cell reference parsing
    // This is a placeholder and should be implemented based on the specific cell reference format
    return {"Sheet1", {0, 0}};
}

std::pair<std::string, RangeCoordinates> CoreEngine::ParseDataRange(const std::string& dataRange)
{
    // Implementation of data range parsing
    // This is a placeholder and should be implemented based on the specific range format
    return {"Sheet1", {{0, 0}, {5, 5}}};
}