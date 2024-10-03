#ifndef CORE_ENGINE_H
#define CORE_ENGINE_H

#include <memory>
#include <vector>
#include <string>

// Forward declarations
class ICalculationEngine;
class IDataAnalysisEngine;
class IChartingEngine;
class ICollaborationService;
class ISecurityManager;
class Workbook;
class Worksheet;
class Cell;
class MemoryManager;
class FileReader;
class FileWriter;

/**
 * @class CoreEngine
 * @brief The main class representing the core engine of Microsoft Excel, integrating various components and services.
 * 
 * This class serves as the central component of Microsoft Excel's core functionality.
 * It integrates various engines and services to provide a comprehensive spreadsheet application.
 */
class CoreEngine {
public:
    /**
     * @brief Constructor for the CoreEngine class, initializing all components and services.
     */
    CoreEngine();

    /**
     * @brief Destructor for the CoreEngine class, ensuring proper cleanup of resources.
     */
    ~CoreEngine();

    /**
     * @brief Initializes a new workbook with the given name.
     * @param name The name of the new workbook.
     */
    void InitializeWorkbook(const std::string& name);

    /**
     * @brief Loads an existing workbook from the specified file path.
     * @param filePath The path of the file to load.
     */
    void LoadWorkbook(const std::string& filePath);

    /**
     * @brief Saves the current workbook to the specified file path.
     * @param filePath The path where the workbook should be saved.
     */
    void SaveWorkbook(const std::string& filePath);

    /**
     * @brief Performs a calculation based on the given formula.
     * @param formula The formula to calculate.
     * @return The result of the calculation.
     */
    double PerformCalculation(const std::string& formula);

    /**
     * @brief Updates the value of a specific cell.
     * @param cellReference The reference of the cell to update.
     * @param value The new value for the cell.
     */
    void UpdateCell(const std::string& cellReference, const std::string& value);

    /**
     * @brief Generates a chart based on the specified chart type and data range.
     * @param chartType The type of chart to generate.
     * @param dataRange The range of data to use for the chart.
     */
    void GenerateChart(const std::string& chartType, const std::string& dataRange);

    /**
     * @brief Performs data analysis on the specified data range using the given analysis type.
     * @param analysisType The type of analysis to perform.
     * @param dataRange The range of data to analyze.
     * @return The result of the data analysis.
     */
    std::vector<double> PerformDataAnalysis(const std::string& analysisType, const std::string& dataRange);

private:
    std::unique_ptr<ICalculationEngine> m_calculationEngine;
    std::unique_ptr<IDataAnalysisEngine> m_dataAnalysisEngine;
    std::unique_ptr<IChartingEngine> m_chartingEngine;
    std::unique_ptr<ICollaborationService> m_collaborationService;
    std::unique_ptr<ISecurityManager> m_securityManager;
    std::unique_ptr<Workbook> m_currentWorkbook;
    std::unique_ptr<MemoryManager> m_memoryManager;
    std::unique_ptr<FileReader> m_fileReader;
    std::unique_ptr<FileWriter> m_fileWriter;
};

#endif // CORE_ENGINE_H