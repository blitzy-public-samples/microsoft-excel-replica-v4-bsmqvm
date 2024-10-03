using System;
using System.Threading.Tasks;
using ExcelDesktop.Interfaces;
using ExcelDesktop.Models;
using ExcelDesktop.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace ExcelDesktop.Tests.Services
{
    public class CoreEngineServiceTests
    {
        private readonly Mock<ICoreEngine> _mockCoreEngine;
        private readonly Mock<ILogger<CoreEngineService>> _mockLogger;
        private readonly CoreEngineService _coreEngineService;

        public CoreEngineServiceTests()
        {
            _mockCoreEngine = new Mock<ICoreEngine>();
            _mockLogger = new Mock<ILogger<CoreEngineService>>();
            _coreEngineService = new CoreEngineService(_mockCoreEngine.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task CreateWorkbook_ShouldReturnNewWorkbook()
        {
            // Arrange
            var expectedWorkbook = new WorkbookModel { Id = Guid.NewGuid().ToString(), Name = "New Workbook" };
            _mockCoreEngine.Setup(x => x.CreateWorkbook()).ReturnsAsync(expectedWorkbook);

            // Act
            var result = await _coreEngineService.CreateWorkbook();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedWorkbook.Id, result.Id);
            Assert.Equal(expectedWorkbook.Name, result.Name);
            _mockCoreEngine.Verify(x => x.CreateWorkbook(), Times.Once);
        }

        [Fact]
        public async Task OpenWorkbook_ShouldReturnExistingWorkbook()
        {
            // Arrange
            var workbookId = Guid.NewGuid().ToString();
            var expectedWorkbook = new WorkbookModel { Id = workbookId, Name = "Existing Workbook" };
            _mockCoreEngine.Setup(x => x.OpenWorkbook(workbookId)).ReturnsAsync(expectedWorkbook);

            // Act
            var result = await _coreEngineService.OpenWorkbook(workbookId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedWorkbook.Id, result.Id);
            Assert.Equal(expectedWorkbook.Name, result.Name);
            _mockCoreEngine.Verify(x => x.OpenWorkbook(workbookId), Times.Once);
        }

        [Fact]
        public async Task SaveWorkbook_ShouldCallCoreEngineSaveMethod()
        {
            // Arrange
            var workbook = new WorkbookModel { Id = Guid.NewGuid().ToString(), Name = "Test Workbook" };
            _mockCoreEngine.Setup(x => x.SaveWorkbook(workbook)).Returns(Task.CompletedTask);

            // Act
            await _coreEngineService.SaveWorkbook(workbook);

            // Assert
            _mockCoreEngine.Verify(x => x.SaveWorkbook(workbook), Times.Once);
        }

        [Fact]
        public async Task AddWorksheet_ShouldReturnNewWorksheet()
        {
            // Arrange
            var workbookId = Guid.NewGuid().ToString();
            var expectedWorksheet = new WorksheetModel { Id = Guid.NewGuid().ToString(), Name = "New Worksheet" };
            _mockCoreEngine.Setup(x => x.AddWorksheet(workbookId)).ReturnsAsync(expectedWorksheet);

            // Act
            var result = await _coreEngineService.AddWorksheet(workbookId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedWorksheet.Id, result.Id);
            Assert.Equal(expectedWorksheet.Name, result.Name);
            _mockCoreEngine.Verify(x => x.AddWorksheet(workbookId), Times.Once);
        }

        [Fact]
        public async Task GetCell_ShouldReturnCellModel()
        {
            // Arrange
            var workbookId = Guid.NewGuid().ToString();
            var worksheetId = Guid.NewGuid().ToString();
            var cellAddress = "A1";
            var expectedCell = new CellModel { Address = cellAddress, Value = "Test Value" };
            _mockCoreEngine.Setup(x => x.GetCell(workbookId, worksheetId, cellAddress)).ReturnsAsync(expectedCell);

            // Act
            var result = await _coreEngineService.GetCell(workbookId, worksheetId, cellAddress);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedCell.Address, result.Address);
            Assert.Equal(expectedCell.Value, result.Value);
            _mockCoreEngine.Verify(x => x.GetCell(workbookId, worksheetId, cellAddress), Times.Once);
        }

        [Fact]
        public async Task SetCellValue_ShouldCallCoreEngineSetCellValueMethod()
        {
            // Arrange
            var workbookId = Guid.NewGuid().ToString();
            var worksheetId = Guid.NewGuid().ToString();
            var cellAddress = "A1";
            var cellValue = "New Value";
            _mockCoreEngine.Setup(x => x.SetCellValue(workbookId, worksheetId, cellAddress, cellValue)).Returns(Task.CompletedTask);

            // Act
            await _coreEngineService.SetCellValue(workbookId, worksheetId, cellAddress, cellValue);

            // Assert
            _mockCoreEngine.Verify(x => x.SetCellValue(workbookId, worksheetId, cellAddress, cellValue), Times.Once);
        }
    }
}