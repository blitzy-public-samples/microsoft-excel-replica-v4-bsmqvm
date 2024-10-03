using System;
using System.ComponentModel;
using System.Windows.Input;
using ExcelDesktop.Models;
using ExcelDesktop.Services;

namespace ExcelDesktop.ViewModels
{
    /// <summary>
    /// The ChartViewModel class represents the ViewModel for chart operations in the Excel desktop application.
    /// It encapsulates the chart's data, properties, and user interactions, following the MVVM pattern.
    /// </summary>
    public class ChartViewModel : INotifyPropertyChanged
    {
        private readonly ChartingService _chartingService;
        private Chart _chartModel;

        public event PropertyChangedEventHandler PropertyChanged;

        public ChartViewModel(ChartingService chartingService)
        {
            _chartingService = chartingService ?? throw new ArgumentNullException(nameof(chartingService));
            InitializeCommands();
        }

        #region Properties

        public Chart ChartModel
        {
            get => _chartModel;
            set
            {
                if (_chartModel != value)
                {
                    _chartModel = value;
                    OnPropertyChanged(nameof(ChartModel));
                }
            }
        }

        public string Title
        {
            get => ChartModel?.Title;
            set
            {
                if (ChartModel != null && ChartModel.Title != value)
                {
                    ChartModel.Title = value;
                    OnPropertyChanged(nameof(Title));
                }
            }
        }

        public ChartTypeEnum ChartType
        {
            get => ChartModel?.ChartType ?? ChartTypeEnum.Bar;
            set
            {
                if (ChartModel != null && ChartModel.ChartType != value)
                {
                    ChartModel.ChartType = value;
                    OnPropertyChanged(nameof(ChartType));
                }
            }
        }

        public string DataRange
        {
            get => ChartModel?.DataRange;
            set
            {
                if (ChartModel != null && ChartModel.DataRange != value)
                {
                    ChartModel.DataRange = value;
                    OnPropertyChanged(nameof(DataRange));
                }
            }
        }

        public string XAxisTitle
        {
            get => ChartModel?.XAxisTitle;
            set
            {
                if (ChartModel != null && ChartModel.XAxisTitle != value)
                {
                    ChartModel.XAxisTitle = value;
                    OnPropertyChanged(nameof(XAxisTitle));
                }
            }
        }

        public string YAxisTitle
        {
            get => ChartModel?.YAxisTitle;
            set
            {
                if (ChartModel != null && ChartModel.YAxisTitle != value)
                {
                    ChartModel.YAxisTitle = value;
                    OnPropertyChanged(nameof(YAxisTitle));
                }
            }
        }

        public double Width
        {
            get => ChartModel?.Width ?? 0;
            set
            {
                if (ChartModel != null && !ChartModel.Width.Equals(value))
                {
                    ChartModel.Width = value;
                    OnPropertyChanged(nameof(Width));
                }
            }
        }

        public double Height
        {
            get => ChartModel?.Height ?? 0;
            set
            {
                if (ChartModel != null && !ChartModel.Height.Equals(value))
                {
                    ChartModel.Height = value;
                    OnPropertyChanged(nameof(Height));
                }
            }
        }

        public bool IsSelected
        {
            get => ChartModel?.IsSelected ?? false;
            set
            {
                if (ChartModel != null && ChartModel.IsSelected != value)
                {
                    ChartModel.IsSelected = value;
                    OnPropertyChanged(nameof(IsSelected));
                }
            }
        }

        #endregion

        #region Commands

        public ICommand CreateChartCommand { get; private set; }
        public ICommand UpdateChartCommand { get; private set; }
        public ICommand DeleteChartCommand { get; private set; }
        public ICommand ExportChartCommand { get; private set; }

        #endregion

        #region Methods

        /// <summary>
        /// This method is used to raise the PropertyChanged event when a property value changes.
        /// </summary>
        /// <param name="propertyName">The name of the property that changed.</param>
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        /// <summary>
        /// This method creates a new chart using the ChartingService.
        /// </summary>
        /// <param name="parameter">Optional parameters for chart creation.</param>
        private void CreateChart(object parameter)
        {
            try
            {
                // Validate input parameters
                if (string.IsNullOrWhiteSpace(DataRange))
                {
                    throw new ArgumentException("Data range must be specified.");
                }

                // Call ChartingService to create a new chart
                ChartModel = _chartingService.CreateChart(ChartType, DataRange, Title, XAxisTitle, YAxisTitle);

                // Raise property changed events for affected properties
                OnPropertyChanged(nameof(ChartModel));
                OnPropertyChanged(nameof(Title));
                OnPropertyChanged(nameof(ChartType));
                OnPropertyChanged(nameof(DataRange));
                OnPropertyChanged(nameof(XAxisTitle));
                OnPropertyChanged(nameof(YAxisTitle));
            }
            catch (Exception ex)
            {
                // Handle and log the exception
                // TODO: Implement proper error handling and logging
                Console.WriteLine($"Error creating chart: {ex.Message}");
            }
        }

        /// <summary>
        /// This method updates the existing chart using the ChartingService.
        /// </summary>
        /// <param name="parameter">Optional parameters for chart update.</param>
        private void UpdateChart(object parameter)
        {
            try
            {
                // Validate input parameters
                if (ChartModel == null)
                {
                    throw new InvalidOperationException("No chart selected for update.");
                }

                // Call ChartingService to update the existing chart
                _chartingService.UpdateChart(ChartModel);

                // Raise property changed event for ChartModel
                OnPropertyChanged(nameof(ChartModel));
            }
            catch (Exception ex)
            {
                // Handle and log the exception
                // TODO: Implement proper error handling and logging
                Console.WriteLine($"Error updating chart: {ex.Message}");
            }
        }

        /// <summary>
        /// This method deletes the current chart.
        /// </summary>
        /// <param name="parameter">Optional parameters for chart deletion.</param>
        private void DeleteChart(object parameter)
        {
            try
            {
                // Confirm deletion with user
                // TODO: Implement user confirmation dialog

                // Call ChartingService to delete the current chart
                _chartingService.DeleteChart(ChartModel);

                // Set Chart property to null
                ChartModel = null;

                // Raise property changed events for affected properties
                OnPropertyChanged(nameof(ChartModel));
                OnPropertyChanged(nameof(Title));
                OnPropertyChanged(nameof(ChartType));
                OnPropertyChanged(nameof(DataRange));
                OnPropertyChanged(nameof(XAxisTitle));
                OnPropertyChanged(nameof(YAxisTitle));
            }
            catch (Exception ex)
            {
                // Handle and log the exception
                // TODO: Implement proper error handling and logging
                Console.WriteLine($"Error deleting chart: {ex.Message}");
            }
        }

        /// <summary>
        /// This method exports the current chart using the ChartingService.
        /// </summary>
        /// <param name="parameter">Optional parameters for chart export.</param>
        private void ExportChart(object parameter)
        {
            try
            {
                // Validate export parameters
                if (ChartModel == null)
                {
                    throw new InvalidOperationException("No chart selected for export.");
                }

                // Call ChartingService to export the current chart
                string exportPath = _chartingService.ExportChart(ChartModel);

                // Handle export result (e.g., show success message)
                // TODO: Implement proper success handling
                Console.WriteLine($"Chart exported successfully to: {exportPath}");
            }
            catch (Exception ex)
            {
                // Handle and log the exception
                // TODO: Implement proper error handling and logging
                Console.WriteLine($"Error exporting chart: {ex.Message}");
            }
        }

        private void InitializeCommands()
        {
            CreateChartCommand = new RelayCommand(CreateChart);
            UpdateChartCommand = new RelayCommand(UpdateChart);
            DeleteChartCommand = new RelayCommand(DeleteChart);
            ExportChartCommand = new RelayCommand(ExportChart);
        }

        #endregion
    }

    // TODO: Implement RelayCommand class if not already available in the project
    public class RelayCommand : ICommand
    {
        private readonly Action<object> _execute;
        private readonly Func<object, bool> _canExecute;

        public RelayCommand(Action<object> execute, Func<object, bool> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute(parameter);

        public void Execute(object parameter) => _execute(parameter);
    }
}