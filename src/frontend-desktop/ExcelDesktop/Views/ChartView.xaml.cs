using System;
using System.Windows;
using System.Windows.Controls;
using ExcelDesktop.ViewModels;
using ExcelDesktop.Controls;
using ExcelDesktop.Services;
using ExcelDesktop.Models;

namespace ExcelDesktop.Views
{
    /// <summary>
    /// Interaction logic for ChartView.xaml
    /// </summary>
    public partial class ChartView : UserControl
    {
        private ChartViewModel _viewModel;
        private ChartingService _chartingService;

        public ChartView()
        {
            InitializeComponent();
            _chartingService = new ChartingService();
            _viewModel = new ChartViewModel(_chartingService);
            DataContext = _viewModel;

            Loaded += OnLoaded;
            Unloaded += OnUnloaded;
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            // Perform initialization tasks
            _viewModel.InitializeChart();

            // Set up data bindings
            SetupDataBindings();

            // Update chart if necessary
            UpdateChart();
        }

        private void OnUnloaded(object sender, RoutedEventArgs e)
        {
            // Perform cleanup tasks
            _viewModel.CleanupChart();

            // Unsubscribe from events
            UnsubscribeFromEvents();
        }

        private void SetupDataBindings()
        {
            // Bind chart type selector
            chartTypeComboBox.ItemsSource = _viewModel.AvailableChartTypes;
            chartTypeComboBox.SelectedItem = _viewModel.SelectedChartType;

            // Bind data range input
            dataRangeTextBox.Text = _viewModel.DataRange;

            // Bind chart control
            chartControl.ChartModel = _viewModel.ChartModel;
        }

        private void UnsubscribeFromEvents()
        {
            chartTypeComboBox.SelectionChanged -= HandleChartTypeChanged;
            dataRangeTextBox.TextChanged -= HandleDataRangeChanged;
            exportButton.Click -= ExportChart;
        }

        private void UpdateChart()
        {
            _viewModel.UpdateChart();
            chartControl.Refresh();
        }

        private void HandleChartTypeChanged(object sender, SelectionChangedEventArgs e)
        {
            if (sender is ComboBox comboBox && comboBox.SelectedItem is string selectedChartType)
            {
                _viewModel.SelectedChartType = selectedChartType;
                UpdateChart();
            }
        }

        private void HandleDataRangeChanged(object sender, TextChangedEventArgs e)
        {
            if (sender is TextBox textBox)
            {
                string newDataRange = textBox.Text;
                if (_viewModel.ValidateDataRange(newDataRange))
                {
                    _viewModel.DataRange = newDataRange;
                    UpdateChart();
                }
                else
                {
                    // Show error message or highlight invalid input
                    MessageBox.Show("Invalid data range. Please enter a valid range (e.g., A1:B10).", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        private async void ExportChart(object sender, RoutedEventArgs e)
        {
            try
            {
                // Show export options dialog
                var exportOptions = ShowExportOptionsDialog();
                if (exportOptions != null)
                {
                    // Call export method on ChartingService
                    var result = await _chartingService.ExportChartAsync(_viewModel.ChartModel, exportOptions);

                    // Handle export result
                    if (result.Success)
                    {
                        MessageBox.Show($"Chart exported successfully to: {result.FilePath}", "Export Successful", MessageBoxButton.OK, MessageBoxImage.Information);
                    }
                    else
                    {
                        MessageBox.Show($"Failed to export chart: {result.ErrorMessage}", "Export Failed", MessageBoxButton.OK, MessageBoxImage.Error);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred while exporting the chart: {ex.Message}", "Export Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private ExportOptions ShowExportOptionsDialog()
        {
            // Implement a dialog to get export options from the user
            // This is a placeholder implementation
            var dialog = new ExportOptionsDialog();
            if (dialog.ShowDialog() == true)
            {
                return dialog.ExportOptions;
            }
            return null;
        }
    }

    // Placeholder class for export options
    public class ExportOptions
    {
        public string Format { get; set; }
        public string FilePath { get; set; }
    }

    // Placeholder class for export options dialog
    public class ExportOptionsDialog : Window
    {
        public ExportOptions ExportOptions { get; private set; }

        public ExportOptionsDialog()
        {
            // Implement the dialog UI and logic here
        }
    }
}