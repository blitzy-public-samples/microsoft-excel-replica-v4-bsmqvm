using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using LiveCharts.Wpf;
using LiveCharts;
using ExcelDesktop.ViewModels;
using ExcelDesktop.Services;
using ExcelDesktop.Models;

namespace ExcelDesktop.Controls
{
    /// <summary>
    /// Interaction logic for ChartControl.xaml
    /// </summary>
    public partial class ChartControl : UserControl
    {
        private ChartViewModel _viewModel;
        private ChartingService _chartingService;

        public ChartControl()
        {
            InitializeComponent();
            _chartingService = new ChartingService();
            _viewModel = new ChartViewModel(_chartingService);
            DataContext = _viewModel;

            // Set up initial bindings and event handlers
            SetupBindings();
            SetupEventHandlers();
        }

        private void SetupBindings()
        {
            // Bind chart properties to the ViewModel
            var chartBinding = new Binding("ChartData");
            chartBinding.Mode = BindingMode.TwoWay;
            this.SetBinding(ChartProperty, chartBinding);

            var titleBinding = new Binding("Title");
            titleBinding.Mode = BindingMode.TwoWay;
            this.SetBinding(TitleProperty, titleBinding);

            var xAxisTitleBinding = new Binding("XAxisTitle");
            xAxisTitleBinding.Mode = BindingMode.TwoWay;
            this.SetBinding(XAxisTitleProperty, xAxisTitleBinding);

            var yAxisTitleBinding = new Binding("YAxisTitle");
            yAxisTitleBinding.Mode = BindingMode.TwoWay;
            this.SetBinding(YAxisTitleProperty, yAxisTitleBinding);
        }

        private void SetupEventHandlers()
        {
            // Set up event handlers for user interactions
            ChartTypeComboBox.SelectionChanged += OnChartTypeChanged;
            ExportButton.Click += ExportChart;
            ZoomResetButton.Click += (s, e) => _viewModel.ResetZoom();
        }

        private void OnChartTypeChanged(object sender, SelectionChangedEventArgs e)
        {
            if (sender is ComboBox comboBox && comboBox.SelectedItem is ChartTypeEnum selectedChartType)
            {
                _viewModel.ChartType = selectedChartType;
                UpdateChartData();
            }
        }

        private void UpdateChartData()
        {
            // Retrieve updated data from the ViewModel
            var updatedData = _viewModel.GetUpdatedChartData();

            // Update the chart's data series
            Chart.Series.Clear();
            foreach (var series in updatedData)
            {
                Chart.Series.Add(new LineSeries
                {
                    Title = series.Key,
                    Values = new ChartValues<double>(series.Value)
                });
            }

            // Call ConfigureAxes to update axis configuration
            ConfigureAxes();

            // Call ApplyChartStyle to refresh the chart's appearance
            ApplyChartStyle();
        }

        private void ConfigureAxes()
        {
            // Set X-axis title and format based on data type
            Chart.AxisX.Clear();
            Chart.AxisX.Add(new Axis
            {
                Title = _viewModel.XAxisTitle,
                LabelFormatter = value => value.ToString(_viewModel.XAxisFormat)
            });

            // Set Y-axis title and format based on data type
            Chart.AxisY.Clear();
            Chart.AxisY.Add(new Axis
            {
                Title = _viewModel.YAxisTitle,
                LabelFormatter = value => value.ToString(_viewModel.YAxisFormat)
            });

            // Configure axis ranges and intervals
            Chart.AxisX[0].MinValue = _viewModel.XAxisMinValue;
            Chart.AxisX[0].MaxValue = _viewModel.XAxisMaxValue;
            Chart.AxisY[0].MinValue = _viewModel.YAxisMinValue;
            Chart.AxisY[0].MaxValue = _viewModel.YAxisMaxValue;

            // Apply any custom axis settings from the ViewModel
            ApplyCustomAxisSettings();
        }

        private void ApplyCustomAxisSettings()
        {
            // Apply custom axis settings from the ViewModel
            // This method can be expanded based on specific requirements
        }

        private void ApplyChartStyle()
        {
            // Apply color scheme based on the current theme
            var colorScheme = _viewModel.GetCurrentColorScheme();
            for (int i = 0; i < Chart.Series.Count; i++)
            {
                Chart.Series[i].Stroke = colorScheme[i % colorScheme.Count];
                Chart.Series[i].Fill = colorScheme[i % colorScheme.Count];
            }

            // Set font styles for titles, labels, and legends
            Chart.Title.FontSize = _viewModel.TitleFontSize;
            Chart.Title.FontWeight = _viewModel.TitleFontWeight;

            foreach (var axis in Chart.AxisX.Concat(Chart.AxisY))
            {
                axis.FontSize = _viewModel.AxisLabelFontSize;
                axis.Foreground = _viewModel.AxisLabelColor;
            }

            // Configure chart background and border
            Chart.Background = _viewModel.ChartBackground;
            Chart.BorderBrush = _viewModel.ChartBorderColor;
            Chart.BorderThickness = _viewModel.ChartBorderThickness;

            // Apply any custom style settings from the ViewModel
            ApplyCustomStyleSettings();
        }

        private void ApplyCustomStyleSettings()
        {
            // Apply custom style settings from the ViewModel
            // This method can be expanded based on specific requirements
        }

        private void ExportChart(object sender, RoutedEventArgs e)
        {
            // Show export options dialog to user
            var exportOptions = _viewModel.GetExportOptions();
            var selectedOption = ShowExportOptionsDialog(exportOptions);

            if (selectedOption != null)
            {
                // Get selected export format and settings
                var format = selectedOption.Format;
                var settings = selectedOption.Settings;

                // Call ChartingService to export the chart
                var exportedChart = _chartingService.ExportChart(Chart, format, settings);

                // Save the exported chart to the user-specified location
                var saveLocation = ShowSaveFileDialog(format);
                if (saveLocation != null)
                {
                    _chartingService.SaveExportedChart(exportedChart, saveLocation);
                    MessageBox.Show("Chart exported successfully!", "Export Complete", MessageBoxButton.OK, MessageBoxImage.Information);
                }
            }
        }

        private ExportOption ShowExportOptionsDialog(List<ExportOption> options)
        {
            // Implement a dialog to show export options to the user
            // Return the selected option
            // This is a placeholder implementation
            return options.FirstOrDefault();
        }

        private string ShowSaveFileDialog(string format)
        {
            // Implement a save file dialog to get the save location from the user
            // Return the selected file path
            // This is a placeholder implementation
            return $"C:\\ExportedChart.{format.ToLower()}";
        }

        private void OnZoomChanged(object sender, LiveCharts.Events.RangeChangedEventArgs e)
        {
            // Update the visible data range based on zoom level
            _viewModel.UpdateVisibleRange(e.Range);

            // Reconfigure axes for the new zoom level
            ConfigureAxes();

            // Update data labels and tooltips for visible data points
            UpdateDataLabelsAndTooltips();
        }

        private void UpdateDataLabelsAndTooltips()
        {
            // Update data labels and tooltips based on the current visible range
            // This method can be implemented based on specific requirements
        }

        // Dependency properties
        public static readonly DependencyProperty ChartProperty =
            DependencyProperty.Register("Chart", typeof(ChartModel), typeof(ChartControl));

        public static readonly DependencyProperty TitleProperty =
            DependencyProperty.Register("Title", typeof(string), typeof(ChartControl));

        public static readonly DependencyProperty XAxisTitleProperty =
            DependencyProperty.Register("XAxisTitle", typeof(string), typeof(ChartControl));

        public static readonly DependencyProperty YAxisTitleProperty =
            DependencyProperty.Register("YAxisTitle", typeof(string), typeof(ChartControl));

        // Properties
        public ChartModel Chart
        {
            get { return (ChartModel)GetValue(ChartProperty); }
            set { SetValue(ChartProperty, value); }
        }

        public string Title
        {
            get { return (string)GetValue(TitleProperty); }
            set { SetValue(TitleProperty, value); }
        }

        public string XAxisTitle
        {
            get { return (string)GetValue(XAxisTitleProperty); }
            set { SetValue(XAxisTitleProperty, value); }
        }

        public string YAxisTitle
        {
            get { return (string)GetValue(YAxisTitleProperty); }
            set { SetValue(YAxisTitleProperty, value); }
        }
    }
}