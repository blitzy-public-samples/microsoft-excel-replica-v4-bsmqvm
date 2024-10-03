using System;
using System.Text.RegularExpressions;
using Microsoft.Office.Interop.Excel;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.Excel.Security.DLP
{
    /// <summary>
    /// ContentScanner class is responsible for scanning and analyzing the content of Excel workbooks
    /// to identify and protect sensitive information as part of the Data Loss Prevention (DLP) system.
    /// </summary>
    public class ContentScanner
    {
        private const int DEFAULT_SCAN_DEPTH = 1000; // Default number of cells to scan

        private readonly ClassificationEngine _classificationEngine;
        private readonly SecurityManager _securityManager;

        /// <summary>
        /// Initializes a new instance of the ContentScanner class.
        /// </summary>
        /// <param name="classificationEngine">The classification engine to use for content analysis.</param>
        /// <param name="securityManager">The security manager to access security configurations and policies.</param>
        public ContentScanner(ClassificationEngine classificationEngine, SecurityManager securityManager)
        {
            _classificationEngine = classificationEngine ?? throw new ArgumentNullException(nameof(classificationEngine));
            _securityManager = securityManager ?? throw new ArgumentNullException(nameof(securityManager));
        }

        /// <summary>
        /// Gets or sets the maximum number of cells to scan in a worksheet.
        /// </summary>
        public int ScanDepth { get; set; } = DEFAULT_SCAN_DEPTH;

        /// <summary>
        /// Scans an entire workbook for sensitive content.
        /// </summary>
        /// <param name="workbook">The workbook to scan.</param>
        /// <returns>A ScanResult object containing the results of the workbook scan.</returns>
        public async Task<ScanResult> ScanWorkbook(IWorkbook workbook)
        {
            if (workbook == null)
                throw new ArgumentNullException(nameof(workbook));

            var scanResult = new ScanResult();

            foreach (IWorksheet worksheet in workbook.Worksheets)
            {
                var worksheetResult = await ScanWorksheet(worksheet);
                scanResult.MergeResults(worksheetResult);
            }

            return scanResult;
        }

        /// <summary>
        /// Scans a single worksheet for sensitive content.
        /// </summary>
        /// <param name="worksheet">The worksheet to scan.</param>
        /// <returns>A ScanResult object containing the results of the worksheet scan.</returns>
        public async Task<ScanResult> ScanWorksheet(IWorksheet worksheet)
        {
            if (worksheet == null)
                throw new ArgumentNullException(nameof(worksheet));

            var scanResult = new ScanResult();

            var usedRange = worksheet.UsedRange;
            var rowCount = Math.Min(usedRange.Rows.Count, ScanDepth);
            var columnCount = usedRange.Columns.Count;

            for (int row = 1; row <= rowCount; row++)
            {
                for (int col = 1; col <= columnCount; col++)
                {
                    ICell cell = worksheet.Cells[row, col];
                    var cellResult = await ScanCell(cell);
                    scanResult.MergeResults(cellResult);
                }
            }

            return scanResult;
        }

        /// <summary>
        /// Scans a single cell for sensitive content.
        /// </summary>
        /// <param name="cell">The cell to scan.</param>
        /// <returns>A ScanResult object containing the results of the cell scan.</returns>
        public async Task<ScanResult> ScanCell(ICell cell)
        {
            if (cell == null)
                throw new ArgumentNullException(nameof(cell));

            var scanResult = new ScanResult();

            if (cell.Value != null)
            {
                string cellContent = cell.Value.ToString();
                bool isSensitive = await IdentifySensitiveContent(cellContent);

                if (isSensitive)
                {
                    scanResult.AddSensitiveContent(new SensitiveContent
                    {
                        Location = $"{cell.Worksheet.Name}!{cell.Address}",
                        Content = cellContent,
                        ClassificationType = await _classificationEngine.ClassifyContent(cellContent)
                    });
                }
            }

            return scanResult;
        }

        /// <summary>
        /// Analyzes the given content to identify if it contains sensitive information.
        /// </summary>
        /// <param name="content">The content to analyze.</param>
        /// <returns>True if the content is identified as sensitive, false otherwise.</returns>
        private async Task<bool> IdentifySensitiveContent(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                return false;

            // Use the ClassificationEngine to identify sensitive content
            var classificationType = await _classificationEngine.ClassifyContent(content);

            // Check if the classification type is considered sensitive based on security policies
            return _securityManager.IsSensitiveClassification(classificationType);
        }
    }

    /// <summary>
    /// Represents the result of a content scan, including any identified sensitive content.
    /// </summary>
    public class ScanResult
    {
        public List<SensitiveContent> SensitiveContents { get; } = new List<SensitiveContent>();

        public void AddSensitiveContent(SensitiveContent sensitiveContent)
        {
            SensitiveContents.Add(sensitiveContent);
        }

        public void MergeResults(ScanResult other)
        {
            SensitiveContents.AddRange(other.SensitiveContents);
        }
    }

    /// <summary>
    /// Represents a piece of sensitive content identified during a scan.
    /// </summary>
    public class SensitiveContent
    {
        public string Location { get; set; }
        public string Content { get; set; }
        public string ClassificationType { get; set; }
    }
}