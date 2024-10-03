using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ExcelDesktop.Models;
using ExcelDesktop.Services.Interfaces;

namespace ExcelDesktop.Services
{
    /// <summary>
    /// This class provides file input/output operations for Excel workbooks, including opening, saving, and exporting files in various formats.
    /// </summary>
    public class FileIOService
    {
        private readonly ICoreEngineService _coreEngineService;
        private readonly ILogger<FileIOService> _logger;

        /// <summary>
        /// Initializes a new instance of the FileIOService class.
        /// </summary>
        /// <param name="coreEngineService">The core engine service for Excel operations.</param>
        /// <param name="logger">The logger for logging operations.</param>
        public FileIOService(ICoreEngineService coreEngineService, ILogger<FileIOService> logger)
        {
            _coreEngineService = coreEngineService ?? throw new ArgumentNullException(nameof(coreEngineService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Opens an Excel workbook from the specified file path.
        /// </summary>
        /// <param name="filePath">The path of the file to open.</param>
        /// <returns>The opened workbook model.</returns>
        public async Task<WorkbookModel> OpenWorkbook(string filePath)
        {
            try
            {
                _logger.LogInformation($"Opening workbook: {filePath}");
                if (string.IsNullOrEmpty(filePath))
                {
                    throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));
                }

                if (!File.Exists(filePath))
                {
                    throw new FileNotFoundException($"File not found: {filePath}");
                }

                return await _coreEngineService.OpenWorkbookAsync(filePath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error opening workbook: {filePath}");
                throw;
            }
        }

        /// <summary>
        /// Saves the specified workbook to the given file path.
        /// </summary>
        /// <param name="workbook">The workbook to save.</param>
        /// <param name="filePath">The path where the workbook should be saved.</param>
        public async Task SaveWorkbook(WorkbookModel workbook, string filePath)
        {
            try
            {
                _logger.LogInformation($"Saving workbook: {filePath}");
                if (workbook == null)
                {
                    throw new ArgumentNullException(nameof(workbook));
                }

                if (string.IsNullOrEmpty(filePath))
                {
                    throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));
                }

                await _coreEngineService.SaveWorkbookAsync(workbook, filePath);
                _logger.LogInformation($"Workbook saved successfully: {filePath}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error saving workbook: {filePath}");
                throw;
            }
        }

        /// <summary>
        /// Exports the specified worksheet to a CSV file.
        /// </summary>
        /// <param name="worksheet">The worksheet to export.</param>
        /// <param name="filePath">The path where the CSV file should be saved.</param>
        public async Task ExportToCsv(WorksheetModel worksheet, string filePath)
        {
            try
            {
                _logger.LogInformation($"Exporting worksheet to CSV: {filePath}");
                if (worksheet == null)
                {
                    throw new ArgumentNullException(nameof(worksheet));
                }

                if (string.IsNullOrEmpty(filePath))
                {
                    throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));
                }

                using (var writer = new StreamWriter(filePath))
                {
                    foreach (var row in worksheet.Cells)
                    {
                        await writer.WriteLineAsync(string.Join(",", row.Select(cell => FormatCellForCsv(cell))));
                    }
                }

                _logger.LogInformation($"Worksheet exported to CSV successfully: {filePath}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error exporting worksheet to CSV: {filePath}");
                throw;
            }
        }

        /// <summary>
        /// Exports the specified workbook to a PDF file.
        /// </summary>
        /// <param name="workbook">The workbook to export.</param>
        /// <param name="filePath">The path where the PDF file should be saved.</param>
        public async Task ExportToPdf(WorkbookModel workbook, string filePath)
        {
            try
            {
                _logger.LogInformation($"Exporting workbook to PDF: {filePath}");
                if (workbook == null)
                {
                    throw new ArgumentNullException(nameof(workbook));
                }

                if (string.IsNullOrEmpty(filePath))
                {
                    throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));
                }

                await _coreEngineService.ExportToPdfAsync(workbook, filePath);
                _logger.LogInformation($"Workbook exported to PDF successfully: {filePath}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error exporting workbook to PDF: {filePath}");
                throw;
            }
        }

        /// <summary>
        /// Imports data from a CSV file into a new worksheet.
        /// </summary>
        /// <param name="filePath">The path of the CSV file to import.</param>
        /// <returns>The imported worksheet model.</returns>
        public async Task<WorksheetModel> ImportFromCsv(string filePath)
        {
            try
            {
                _logger.LogInformation($"Importing CSV file: {filePath}");
                if (string.IsNullOrEmpty(filePath))
                {
                    throw new ArgumentException("File path cannot be null or empty.", nameof(filePath));
                }

                if (!File.Exists(filePath))
                {
                    throw new FileNotFoundException($"CSV file not found: {filePath}");
                }

                var worksheet = new WorksheetModel { Name = Path.GetFileNameWithoutExtension(filePath) };
                var rows = await File.ReadAllLinesAsync(filePath);

                for (int i = 0; i < rows.Length; i++)
                {
                    var cells = rows[i].Split(',');
                    for (int j = 0; j < cells.Length; j++)
                    {
                        worksheet.SetCellValue(i, j, cells[j]);
                    }
                }

                _logger.LogInformation($"CSV file imported successfully: {filePath}");
                return worksheet;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error importing CSV file: {filePath}");
                throw;
            }
        }

        private string FormatCellForCsv(CellModel cell)
        {
            if (cell == null || cell.Value == null)
            {
                return string.Empty;
            }

            string value = cell.Value.ToString();
            if (value.Contains(",") || value.Contains("\"") || value.Contains("\n"))
            {
                return $"\"{value.Replace("\"", "\"\"")}\"";
            }

            return value;
        }
    }
}