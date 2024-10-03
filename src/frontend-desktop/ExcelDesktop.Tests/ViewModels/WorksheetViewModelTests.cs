using System;
using System.Windows.Input;
using Xunit;
using Moq;
using ExcelDesktop.ViewModels;
using ExcelDesktop.Models;
using ExcelDesktop.Services;

namespace ExcelDesktop.Tests.ViewModels
{
    public class WorksheetViewModelTests
    {
        private readonly Mock<WorksheetModel> _mockWorksheetModel;
        private readonly Mock<ICalculationEngineService> _mockCalculationEngineService;
        private readonly Mock<IChartingService> _mockChartingService;
        private readonly WorksheetViewModel _viewModel;

        public WorksheetViewModelTests()
        {
            // Initialize mock objects
            _mockWorksheetModel = new Mock<WorksheetModel>();
            _mockCalculationEngineService = new Mock<ICalculationEngineService>();
            _mockChartingService = new Mock<IChartingService>();

            // Create an instance of WorksheetViewModel with the mock objects
            _viewModel = new WorksheetViewModel(
                _mockWorksheetModel.Object,
                _mockCalculationEngineService.Object,
                _mockChartingService.Object
            );
        }

        [Fact]
        public void UpdateCell_ShouldUpdateModelAndTriggerCalculations()
        {
            // Arrange
            var cellAddress = "A1";
            var newValue = "42";
            _mockWorksheetModel.Setup(m => m.UpdateCell(cellAddress, newValue)).Verifiable();
            _mockCalculationEngineService.Setup(s => s.RecalculateWorksheet(_mockWorksheetModel.Object)).Verifiable();

            // Act
            _viewModel.UpdateCell(cellAddress, newValue);

            // Assert
            _mockWorksheetModel.Verify(m => m.UpdateCell(cellAddress, newValue), Times.Once);
            _mockCalculationEngineService.Verify(s => s.RecalculateWorksheet(_mockWorksheetModel.Object), Times.Once);
        }

        [Fact]
        public void AddChart_ShouldCreateNewChartAndAddToCollection()
        {
            // Arrange
            var chartType = "Bar";
            var dataRange = "A1:B10";
            var newChart = new ChartModel { Type = chartType, DataRange = dataRange };
            _mockChartingService.Setup(s => s.CreateChart(chartType, dataRange)).Returns(newChart);

            // Act
            _viewModel.AddChart(chartType, dataRange);

            // Assert
            Assert.Contains(newChart, _viewModel.Charts);
            _mockChartingService.Verify(s => s.CreateChart(chartType, dataRange), Times.Once);
        }

        [Fact]
        public void RemoveChart_ShouldRemoveChartFromCollection()
        {
            // Arrange
            var chartToRemove = new ChartModel { Id = "Chart1" };
            _viewModel.Charts.Add(chartToRemove);

            // Act
            _viewModel.RemoveChart(chartToRemove);

            // Assert
            Assert.DoesNotContain(chartToRemove, _viewModel.Charts);
        }

        [Fact]
        public void SelectCellCommand_ShouldUpdateSelectedCell()
        {
            // Arrange
            var cellAddress = "B2";

            // Act
            (_viewModel.SelectCellCommand as ICommand).Execute(cellAddress);

            // Assert
            Assert.Equal(cellAddress, _viewModel.SelectedCell);
        }

        [Fact]
        public void EnterFormulaCommand_ShouldUpdateCellAndTriggerCalculations()
        {
            // Arrange
            var formula = "=SUM(A1:A10)";
            _mockWorksheetModel.Setup(m => m.UpdateCell(_viewModel.SelectedCell, formula)).Verifiable();
            _mockCalculationEngineService.Setup(s => s.RecalculateWorksheet(_mockWorksheetModel.Object)).Verifiable();

            // Act
            (_viewModel.EnterFormulaCommand as ICommand).Execute(formula);

            // Assert
            _mockWorksheetModel.Verify(m => m.UpdateCell(_viewModel.SelectedCell, formula), Times.Once);
            _mockCalculationEngineService.Verify(s => s.RecalculateWorksheet(_mockWorksheetModel.Object), Times.Once);
        }

        [Fact]
        public void FormatCellCommand_ShouldApplyFormattingToCell()
        {
            // Arrange
            var formatting = new CellFormatting { Bold = true, FontSize = 14 };
            _mockWorksheetModel.Setup(m => m.FormatCell(_viewModel.SelectedCell, formatting)).Verifiable();

            // Act
            (_viewModel.FormatCellCommand as ICommand).Execute(formatting);

            // Assert
            _mockWorksheetModel.Verify(m => m.FormatCell(_viewModel.SelectedCell, formatting), Times.Once);
        }
    }

    // Dummy classes to make the code compile
    public class ChartModel
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string DataRange { get; set; }
    }

    public class CellFormatting
    {
        public bool Bold { get; set; }
        public int FontSize { get; set; }
    }
}