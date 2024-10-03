using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Microsoft.Excel.DataAccess.Tests
{
    [TestClass]
    public class DataImportExportTests
    {
        private Mock<IDataSource> _mockDataSource;
        private Mock<IDataAccessFactory> _dataAccessFactory;
        private DataImporter _dataImporter;
        private DataExporter _dataExporter;
        private DataAccessManager _dataAccessManager;

        [TestInitialize]
        public void TestInitialize()
        {
            // Initialize mock objects
            _mockDataSource = new Mock<IDataSource>();
            _dataAccessFactory = new Mock<IDataAccessFactory>();
            _dataAccessFactory.Setup(f => f.CreateDataSource(It.IsAny<string>())).Returns(_mockDataSource.Object);

            // Create instances of DataImporter, DataExporter, and DataAccessManager
            _dataImporter = new DataImporter(_dataAccessFactory.Object);
            _dataExporter = new DataExporter(_dataAccessFactory.Object);
            _dataAccessManager = new DataAccessManager(_dataImporter, _dataExporter);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            // Dispose of any resources created during the test
            _mockDataSource = null;
            _dataAccessFactory = null;
            _dataImporter = null;
            _dataExporter = null;
            _dataAccessManager = null;
        }

        [TestMethod]
        public async Task TestImportDataFromFile()
        {
            // Arrange
            string filePath = "test_import.csv";
            var testData = new[] { new[] { "A1", "B1" }, new[] { "A2", "B2" } };
            _mockDataSource.Setup(ds => ds.ImportDataAsync(filePath)).ReturnsAsync(testData);

            // Act
            var result = await _dataImporter.ImportData(filePath);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Length);
            Assert.AreEqual(2, result[0].Length);
            Assert.AreEqual("A1", result[0][0]);
            Assert.AreEqual("B2", result[1][1]);
            _mockDataSource.Verify(ds => ds.ImportDataAsync(filePath), Times.Once);
        }

        [TestMethod]
        public async Task TestExportDataToFile()
        {
            // Arrange
            string filePath = "test_export.csv";
            var testData = new[] { new[] { "A1", "B1" }, new[] { "A2", "B2" } };
            _mockDataSource.Setup(ds => ds.ExportDataAsync(filePath, testData)).Returns(Task.CompletedTask);

            // Act
            await _dataExporter.ExportToFile(filePath, testData);

            // Assert
            _mockDataSource.Verify(ds => ds.ExportDataAsync(filePath, testData), Times.Once);
        }

        [TestMethod]
        public async Task TestImportDataFromExternalSource()
        {
            // Arrange
            string externalSourceUrl = "https://api.example.com/data";
            var testData = new[] { new[] { "X1", "Y1" }, new[] { "X2", "Y2" } };
            _mockDataSource.Setup(ds => ds.ImportDataAsync(externalSourceUrl)).ReturnsAsync(testData);

            // Act
            var result = await _dataImporter.ImportData(externalSourceUrl);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Length);
            Assert.AreEqual(2, result[0].Length);
            Assert.AreEqual("X1", result[0][0]);
            Assert.AreEqual("Y2", result[1][1]);
            _mockDataSource.Verify(ds => ds.ImportDataAsync(externalSourceUrl), Times.Once);
        }

        [TestMethod]
        public async Task TestExportDataToExternalSource()
        {
            // Arrange
            string externalSourceUrl = "https://api.example.com/data";
            var testData = new[] { new[] { "X1", "Y1" }, new[] { "X2", "Y2" } };
            _mockDataSource.Setup(ds => ds.ExportDataAsync(externalSourceUrl, testData)).Returns(Task.CompletedTask);

            // Act
            await _dataExporter.ExportToDataSource(externalSourceUrl, testData);

            // Assert
            _mockDataSource.Verify(ds => ds.ExportDataAsync(externalSourceUrl, testData), Times.Once);
        }

        [TestMethod]
        public async Task TestDataAccessManagerImportExport()
        {
            // Arrange
            string importPath = "test_import.csv";
            string exportPath = "test_export.csv";
            var testData = new[] { new[] { "A1", "B1" }, new[] { "A2", "B2" } };
            _mockDataSource.Setup(ds => ds.ImportDataAsync(importPath)).ReturnsAsync(testData);
            _mockDataSource.Setup(ds => ds.ExportDataAsync(exportPath, testData)).Returns(Task.CompletedTask);

            // Act
            var importedData = await _dataAccessManager.ImportData(importPath);
            await _dataAccessManager.ExportData(exportPath, importedData);

            // Assert
            Assert.IsNotNull(importedData);
            Assert.AreEqual(2, importedData.Length);
            Assert.AreEqual(2, importedData[0].Length);
            _mockDataSource.Verify(ds => ds.ImportDataAsync(importPath), Times.Once);
            _mockDataSource.Verify(ds => ds.ExportDataAsync(exportPath, testData), Times.Once);
        }

        [TestMethod]
        public async Task TestImportExportWithDifferentDataTypes()
        {
            // Arrange
            string importPath = "test_import_types.csv";
            string exportPath = "test_export_types.csv";
            var testData = new object[][]
            {
                new object[] { "String", 42, 3.14, true, DateTime.Now },
                new object[] { "Another String", -10, 2.718, false, DateTime.UtcNow }
            };
            _mockDataSource.Setup(ds => ds.ImportDataAsync(importPath)).ReturnsAsync(testData);
            _mockDataSource.Setup(ds => ds.ExportDataAsync(exportPath, testData)).Returns(Task.CompletedTask);

            // Act
            var importedData = await _dataImporter.ImportData(importPath);
            await _dataExporter.ExportToFile(exportPath, importedData);

            // Assert
            Assert.IsNotNull(importedData);
            Assert.AreEqual(2, importedData.Length);
            Assert.AreEqual(5, importedData[0].Length);
            Assert.IsInstanceOfType(importedData[0][0], typeof(string));
            Assert.IsInstanceOfType(importedData[0][1], typeof(int));
            Assert.IsInstanceOfType(importedData[0][2], typeof(double));
            Assert.IsInstanceOfType(importedData[0][3], typeof(bool));
            Assert.IsInstanceOfType(importedData[0][4], typeof(DateTime));
            _mockDataSource.Verify(ds => ds.ImportDataAsync(importPath), Times.Once);
            _mockDataSource.Verify(ds => ds.ExportDataAsync(exportPath, testData), Times.Once);
        }

        [TestMethod]
        public async Task TestImportExportWithLargeDataSet()
        {
            // Arrange
            string importPath = "test_import_large.csv";
            string exportPath = "test_export_large.csv";
            var testData = GenerateLargeDataSet(10000, 20);
            _mockDataSource.Setup(ds => ds.ImportDataAsync(importPath)).ReturnsAsync(testData);
            _mockDataSource.Setup(ds => ds.ExportDataAsync(exportPath, testData)).Returns(Task.CompletedTask);

            // Act
            var startTime = DateTime.Now;
            var importedData = await _dataImporter.ImportData(importPath);
            var importDuration = DateTime.Now - startTime;

            startTime = DateTime.Now;
            await _dataExporter.ExportToFile(exportPath, importedData);
            var exportDuration = DateTime.Now - startTime;

            // Assert
            Assert.IsNotNull(importedData);
            Assert.AreEqual(10000, importedData.Length);
            Assert.AreEqual(20, importedData[0].Length);
            Assert.IsTrue(importDuration.TotalSeconds < 5, "Import operation took too long");
            Assert.IsTrue(exportDuration.TotalSeconds < 5, "Export operation took too long");
            _mockDataSource.Verify(ds => ds.ImportDataAsync(importPath), Times.Once);
            _mockDataSource.Verify(ds => ds.ExportDataAsync(exportPath, testData), Times.Once);
        }

        [TestMethod]
        public async Task TestConcurrentImportExport()
        {
            // Arrange
            string importPath1 = "test_import1.csv";
            string importPath2 = "test_import2.csv";
            string exportPath1 = "test_export1.csv";
            string exportPath2 = "test_export2.csv";
            var testData1 = new[] { new[] { "A1", "B1" }, new[] { "A2", "B2" } };
            var testData2 = new[] { new[] { "X1", "Y1" }, new[] { "X2", "Y2" } };
            _mockDataSource.Setup(ds => ds.ImportDataAsync(importPath1)).ReturnsAsync(testData1);
            _mockDataSource.Setup(ds => ds.ImportDataAsync(importPath2)).ReturnsAsync(testData2);
            _mockDataSource.Setup(ds => ds.ExportDataAsync(It.IsAny<string>(), It.IsAny<object[][]>())).Returns(Task.CompletedTask);

            // Act
            var importTask1 = _dataImporter.ImportData(importPath1);
            var importTask2 = _dataImporter.ImportData(importPath2);
            var exportTask1 = _dataExporter.ExportToFile(exportPath1, testData1);
            var exportTask2 = _dataExporter.ExportToFile(exportPath2, testData2);

            await Task.WhenAll(importTask1, importTask2, exportTask1, exportTask2);

            // Assert
            _mockDataSource.Verify(ds => ds.ImportDataAsync(importPath1), Times.Once);
            _mockDataSource.Verify(ds => ds.ImportDataAsync(importPath2), Times.Once);
            _mockDataSource.Verify(ds => ds.ExportDataAsync(exportPath1, testData1), Times.Once);
            _mockDataSource.Verify(ds => ds.ExportDataAsync(exportPath2, testData2), Times.Once);
        }

        private object[][] GenerateLargeDataSet(int rows, int columns)
        {
            var result = new object[rows][];
            for (int i = 0; i < rows; i++)
            {
                result[i] = new object[columns];
                for (int j = 0; j < columns; j++)
                {
                    result[i][j] = $"Data_{i}_{j}";
                }
            }
            return result;
        }
    }
}