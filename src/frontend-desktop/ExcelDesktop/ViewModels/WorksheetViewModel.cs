using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using ExcelDesktop.Models;
using ExcelDesktop.Services;

namespace ExcelDesktop.ViewModels
{
    /// <summary>
    /// This class serves as the view model for a worksheet, providing properties and commands that the view can bind to and interact with.
    /// </summary>
    public class WorksheetViewModel : INotifyPropertyChanged
    {
        private readonly CalculationEngineService _calculationEngineService;
        private readonly ChartingService _chartingService;

        public WorksheetModel Model { get; private set; }
        
        private CellModel _selectedCell;
        public CellModel SelectedCell
        {
            get => _selectedCell;
            set
            {
                if (_selectedCell != value)
                {
                    _selectedCell = value;
                    OnPropertyChanged(nameof(SelectedCell));
                }
            }
        }

        public ObservableCollection<CellModel> VisibleCells { get; private set; }
        public ObservableCollection<ChartViewModel> Charts { get; private set; }

        public ICommand SelectCellCommand { get; private set; }
        public ICommand EnterFormulaCommand { get; private set; }
        public ICommand FormatCellCommand { get; private set; }

        public WorksheetViewModel(WorksheetModel model, CalculationEngineService calculationEngineService, ChartingService chartingService)
        {
            Model = model ?? throw new ArgumentNullException(nameof(model));
            _calculationEngineService = calculationEngineService ?? throw new ArgumentNullException(nameof(calculationEngineService));
            _chartingService = chartingService ?? throw new ArgumentNullException(nameof(chartingService));

            VisibleCells = new ObservableCollection<CellModel>();
            Charts = new ObservableCollection<ChartViewModel>();

            InitializeCommands();
            InitializeVisibleCells();
            InitializeCharts();
        }

        private void InitializeCommands()
        {
            SelectCellCommand = new RelayCommand<string>(ExecuteSelectCell);
            EnterFormulaCommand = new RelayCommand<string>(ExecuteEnterFormula);
            FormatCellCommand = new RelayCommand<string>(ExecuteFormatCell);
        }

        private void InitializeVisibleCells()
        {
            // Logic to populate VisibleCells based on the current view
            // This would depend on the scrolling position and visible range
        }

        private void InitializeCharts()
        {
            foreach (var chart in Model.Charts)
            {
                Charts.Add(new ChartViewModel(chart));
            }
        }

        public void UpdateCell(string cellReference, object value)
        {
            // Locate the cell in the Model using the cellReference
            var cell = Model.GetCell(cellReference);
            if (cell == null)
            {
                throw new ArgumentException($"Cell {cellReference} not found.");
            }

            // Update the cell's value using the Model's SetCellValue method
            Model.SetCellValue(cellReference, value);

            // Trigger recalculation using CalculationEngineService
            _calculationEngineService.RecalculateWorksheet(Model);

            // Update VisibleCells if the updated cell is visible
            var visibleCell = VisibleCells.FirstOrDefault(c => c.Reference == cellReference);
            if (visibleCell != null)
            {
                visibleCell.Value = value;
            }

            // Raise PropertyChanged event for affected properties
            OnPropertyChanged(nameof(VisibleCells));
        }

        public void AddChart(ChartType chartType, string dataRange)
        {
            // Use ChartingService to create a new chart based on chartType and dataRange
            var newChart = _chartingService.CreateChart(Model, chartType, dataRange);

            // Add the new chart to the Model's Charts collection
            Model.Charts.Add(newChart);

            // Create a new ChartViewModel for the chart and add it to the Charts collection
            Charts.Add(new ChartViewModel(newChart));

            // Raise PropertyChanged event for the Charts property
            OnPropertyChanged(nameof(Charts));
        }

        public void RemoveChart(ChartViewModel chart)
        {
            // Remove the chart from the Model's Charts collection
            Model.Charts.Remove(chart.Model);

            // Remove the ChartViewModel from the Charts collection
            Charts.Remove(chart);

            // Raise PropertyChanged event for the Charts property
            OnPropertyChanged(nameof(Charts));
        }

        private void ExecuteSelectCell(string cellReference)
        {
            SelectedCell = Model.GetCell(cellReference);
        }

        private void ExecuteEnterFormula(string formula)
        {
            if (SelectedCell != null)
            {
                UpdateCell(SelectedCell.Reference, formula);
            }
        }

        private void ExecuteFormatCell(string formatString)
        {
            if (SelectedCell != null)
            {
                SelectedCell.Format = formatString;
                OnPropertyChanged(nameof(SelectedCell));
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    // Helper class for ICommand implementation
    public class RelayCommand<T> : ICommand
    {
        private readonly Action<T> _execute;
        private readonly Func<T, bool> _canExecute;

        public RelayCommand(Action<T> execute, Func<T, bool> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute((T)parameter);

        public void Execute(object parameter) => _execute((T)parameter);

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
    }
}