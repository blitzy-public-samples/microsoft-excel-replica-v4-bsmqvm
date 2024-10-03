using System;
using System.Windows;
using System.Windows.Controls;
using ExcelDesktop.ViewModels;
using ExcelDesktop.Models;
using ExcelDesktop.Services;

namespace ExcelDesktop.Views
{
    /// <summary>
    /// Interaction logic for WorksheetView.xaml
    /// </summary>
    public partial class WorksheetView : UserControl
    {
        /// <summary>
        /// The ViewModel associated with this view.
        /// </summary>
        public WorksheetViewModel ViewModel { get; private set; }

        /// <summary>
        /// Constructor for the WorksheetView class.
        /// Initializes the component and sets up event handlers.
        /// </summary>
        public WorksheetView()
        {
            InitializeComponent();
            
            // Set up event handlers
            this.Loaded += OnLoaded;
            this.Unloaded += OnUnloaded;

            // Initialize ViewModel
            ViewModel = new WorksheetViewModel();
            this.DataContext = ViewModel;
        }

        /// <summary>
        /// Event handler for the Loaded event of the UserControl.
        /// Performs necessary initialization when the view is loaded.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">An object that contains the event data.</param>
        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            // Subscribe to events from ViewModel
            ViewModel.PropertyChanged += ViewModel_PropertyChanged;

            // Set up data bindings
            SetupDataBindings();

            // Perform any additional initialization
            InitializeWorksheet();
        }

        /// <summary>
        /// Event handler for the Unloaded event of the UserControl.
        /// Performs cleanup when the view is unloaded.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">An object that contains the event data.</param>
        private void OnUnloaded(object sender, RoutedEventArgs e)
        {
            // Unsubscribe from events
            ViewModel.PropertyChanged -= ViewModel_PropertyChanged;

            // Perform any necessary cleanup
            CleanupWorksheet();
        }

        /// <summary>
        /// Event handler for changes in cell selection.
        /// Updates the ViewModel with the new selection.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">An object that contains the event data.</param>
        private void OnSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (sender is DataGrid dataGrid && dataGrid.SelectedCells.Count > 0)
            {
                var selectedCell = dataGrid.SelectedCells[0];
                var cellInfo = selectedCell.Item as CellInfo;
                if (cellInfo != null)
                {
                    ViewModel.SelectedCell = cellInfo;
                }
            }
        }

        /// <summary>
        /// Event handler for changes in cell values.
        /// Triggers recalculation and updates the ViewModel.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">An object that contains the event data.</param>
        private void OnCellValueChanged(object sender, DataGridCellEditEndingEventArgs e)
        {
            if (e.EditAction == DataGridEditAction.Commit)
            {
                var cellInfo = e.Row.Item as CellInfo;
                var newValue = (e.EditingElement as TextBox)?.Text;

                if (cellInfo != null && newValue != null)
                {
                    ViewModel.UpdateCell(cellInfo, newValue);
                    TriggerRecalculation();
                }
            }
        }

        /// <summary>
        /// Sets up data bindings for the view.
        /// </summary>
        private void SetupDataBindings()
        {
            // Bind the ItemsSource of the DataGrid to the Cells property of the ViewModel
            worksheetDataGrid.SetBinding(ItemsControl.ItemsSourceProperty, new Binding("Cells") { Source = ViewModel });

            // Add more bindings as needed
        }

        /// <summary>
        /// Initializes the worksheet view.
        /// </summary>
        private void InitializeWorksheet()
        {
            // Set up the DataGrid columns
            SetupDataGridColumns();

            // Load initial data
            ViewModel.LoadWorksheetData();

            // Set up event handlers for the DataGrid
            worksheetDataGrid.SelectionChanged += OnSelectionChanged;
            worksheetDataGrid.CellEditEnding += OnCellValueChanged;
        }

        /// <summary>
        /// Sets up the columns for the worksheet DataGrid.
        /// </summary>
        private void SetupDataGridColumns()
        {
            // Add code to dynamically generate columns based on the worksheet structure
            // This might involve adding DataGridTextColumns for each column in the worksheet
        }

        /// <summary>
        /// Triggers a recalculation of the worksheet.
        /// </summary>
        private void TriggerRecalculation()
        {
            // Use the CalculationEngineService to perform recalculations
            var calculationEngine = ServiceLocator.GetService<CalculationEngineService>();
            calculationEngine.RecalculateWorksheet(ViewModel.WorksheetModel);

            // Update the UI to reflect changes
            ViewModel.RefreshCells();
        }

        /// <summary>
        /// Cleans up resources when the worksheet is unloaded.
        /// </summary>
        private void CleanupWorksheet()
        {
            // Remove event handlers
            worksheetDataGrid.SelectionChanged -= OnSelectionChanged;
            worksheetDataGrid.CellEditEnding -= OnCellValueChanged;

            // Perform any additional cleanup
        }

        /// <summary>
        /// Event handler for property changes in the ViewModel.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">An object that contains the event data.</param>
        private void ViewModel_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            // Handle specific property changes if needed
            switch (e.PropertyName)
            {
                case nameof(WorksheetViewModel.SelectedCell):
                    UpdateSelectedCellUI();
                    break;
                // Add more cases as needed
            }
        }

        /// <summary>
        /// Updates the UI to reflect changes in the selected cell.
        /// </summary>
        private void UpdateSelectedCellUI()
        {
            // Update UI elements related to the selected cell
            // For example, update a formula bar or cell details panel
        }
    }
}