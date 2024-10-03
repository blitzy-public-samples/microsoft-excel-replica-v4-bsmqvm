using System;
using System.Windows;
using System.Windows.Input;
using Microsoft.Office.Interop.Excel;
using System.ComponentModel;
using ExcelDesktop.ViewModels;
using ExcelDesktop.Services;

namespace ExcelDesktop
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private Workbook _workbook;
        public WorksheetViewModel WorksheetViewModel { get; private set; }
        public RibbonViewModel RibbonViewModel { get; private set; }
        public FormulaBarViewModel FormulaBarViewModel { get; private set; }

        private readonly CoreEngineService _coreEngineService;
        private readonly CalculationEngineService _calculationEngineService;
        private readonly ChartingService _chartingService;
        private readonly CollaborationService _collaborationService;
        private readonly FileIOService _fileIOService;

        public MainWindow()
        {
            InitializeComponent();
            InitializeServices();
            SetupViewModels();
            SetupEventHandlers();
        }

        private void InitializeServices()
        {
            _coreEngineService = new CoreEngineService();
            _calculationEngineService = new CalculationEngineService();
            _chartingService = new ChartingService();
            _collaborationService = new CollaborationService();
            _fileIOService = new FileIOService();
        }

        private void SetupViewModels()
        {
            WorksheetViewModel = new WorksheetViewModel(_coreEngineService, _calculationEngineService);
            RibbonViewModel = new RibbonViewModel();
            FormulaBarViewModel = new FormulaBarViewModel(_calculationEngineService);

            DataContext = this;
        }

        private void SetupEventHandlers()
        {
            Loaded += OnLoaded;
            Closing += OnClosing;

            RibbonViewModel.NewWorkbookRequested += CreateNewWorkbook;
            RibbonViewModel.OpenFileRequested += OpenFile;
            RibbonViewModel.SaveFileRequested += SaveFile;
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            CreateNewWorkbook();
        }

        private void OnClosing(object sender, CancelEventArgs e)
        {
            // Prompt for saving if there are unsaved changes
            if (WorksheetViewModel.HasUnsavedChanges)
            {
                var result = MessageBox.Show("Do you want to save changes before closing?", "Save Changes", MessageBoxButton.YesNoCancel);
                switch (result)
                {
                    case MessageBoxResult.Yes:
                        SaveFile();
                        break;
                    case MessageBoxResult.Cancel:
                        e.Cancel = true;
                        return;
                }
            }

            // Perform cleanup
            _workbook?.Close();
            _coreEngineService.Dispose();
            _collaborationService.Disconnect();
        }

        private void CreateNewWorkbook()
        {
            _workbook = _coreEngineService.CreateNewWorkbook();
            UpdateUIForWorkbook();
        }

        private void OpenFile()
        {
            var filePath = _fileIOService.ShowOpenFileDialog();
            if (!string.IsNullOrEmpty(filePath))
            {
                _workbook = _fileIOService.OpenWorkbook(filePath);
                UpdateUIForWorkbook();
            }
        }

        private void SaveFile()
        {
            if (_workbook == null) return;

            var filePath = _fileIOService.ShowSaveFileDialog();
            if (!string.IsNullOrEmpty(filePath))
            {
                _fileIOService.SaveWorkbook(_workbook, filePath);
                WorksheetViewModel.HasUnsavedChanges = false;
            }
        }

        private void UpdateUIForWorkbook()
        {
            if (_workbook == null) return;

            WorksheetViewModel.LoadWorkbook(_workbook);
            RibbonViewModel.UpdateForWorkbook(_workbook);
            FormulaBarViewModel.UpdateForWorkbook(_workbook);

            // Update window title
            Title = $"Excel Desktop - {_workbook.Name}";
        }

        // Additional methods for handling user interactions and updating the UI can be added here
    }
}