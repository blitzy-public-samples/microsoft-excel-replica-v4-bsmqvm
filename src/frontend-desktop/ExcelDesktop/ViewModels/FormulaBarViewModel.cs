using System;
using System.ComponentModel;
using System.Threading.Tasks;
using System.Windows.Input;
using ExcelDesktop.Models;
using ExcelDesktop.Services;
using ExcelDesktop.Helpers;

namespace ExcelDesktop.ViewModels
{
    /// <summary>
    /// ViewModel for the Formula Bar, handling the display and editing of cell contents and formulas.
    /// </summary>
    public class FormulaBarViewModel : INotifyPropertyChanged
    {
        private readonly WorksheetViewModel _worksheetViewModel;
        private readonly CalculationEngineService _calculationEngineService;
        private CellModel _currentCell;
        private string _formulaText;
        private bool _isEditing;

        public event PropertyChangedEventHandler PropertyChanged;

        public CellModel CurrentCell
        {
            get => _currentCell;
            set
            {
                if (_currentCell != value)
                {
                    _currentCell = value;
                    UpdateFormulaText();
                    OnPropertyChanged(nameof(CurrentCell));
                }
            }
        }

        public string FormulaText
        {
            get => _formulaText;
            set
            {
                if (_formulaText != value)
                {
                    _formulaText = value;
                    OnPropertyChanged(nameof(FormulaText));
                }
            }
        }

        public bool IsEditing
        {
            get => _isEditing;
            set
            {
                if (_isEditing != value)
                {
                    _isEditing = value;
                    OnPropertyChanged(nameof(IsEditing));
                }
            }
        }

        public ICommand BeginEditCommand { get; }
        public ICommand EndEditCommand { get; }
        public ICommand CancelEditCommand { get; }

        /// <summary>
        /// Initializes a new instance of the FormulaBarViewModel class.
        /// </summary>
        /// <param name="worksheetViewModel">The WorksheetViewModel instance.</param>
        /// <param name="calculationEngineService">The CalculationEngineService instance.</param>
        public FormulaBarViewModel(WorksheetViewModel worksheetViewModel, CalculationEngineService calculationEngineService)
        {
            _worksheetViewModel = worksheetViewModel ?? throw new ArgumentNullException(nameof(worksheetViewModel));
            _calculationEngineService = calculationEngineService ?? throw new ArgumentNullException(nameof(calculationEngineService));

            BeginEditCommand = new RelayCommand(BeginEdit);
            EndEditCommand = new RelayCommand(async () => await EndEditAsync());
            CancelEditCommand = new RelayCommand(CancelEdit);

            _worksheetViewModel.PropertyChanged += WorksheetViewModel_PropertyChanged;
        }

        private void WorksheetViewModel_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(WorksheetViewModel.SelectedCell))
            {
                CurrentCell = _worksheetViewModel.SelectedCell;
            }
        }

        /// <summary>
        /// Updates the FormulaText property based on the current cell's contents.
        /// </summary>
        private void UpdateFormulaText()
        {
            FormulaText = CurrentCell?.Formula ?? CurrentCell?.Value?.ToString() ?? string.Empty;
        }

        /// <summary>
        /// Starts the editing mode for the formula bar.
        /// </summary>
        public void BeginEdit()
        {
            IsEditing = true;
        }

        /// <summary>
        /// Ends the editing mode and applies the changes to the current cell.
        /// </summary>
        public async Task EndEditAsync()
        {
            if (CurrentCell == null)
            {
                IsEditing = false;
                return;
            }

            try
            {
                string parsedFormula = await ParseFormulaAsync(FormulaText);
                CurrentCell.Formula = parsedFormula;
                await _worksheetViewModel.UpdateCellValueAsync(CurrentCell);
                IsEditing = false;
                UpdateFormulaText();
            }
            catch (Exception ex)
            {
                // Handle formula parsing or calculation errors
                // You might want to show an error message to the user
                Console.WriteLine($"Error updating cell: {ex.Message}");
                IsEditing = false;
                UpdateFormulaText();
            }
        }

        /// <summary>
        /// Cancels the current edit operation and reverts changes.
        /// </summary>
        public void CancelEdit()
        {
            IsEditing = false;
            UpdateFormulaText();
        }

        /// <summary>
        /// Parses the given formula using the CalculationEngineService.
        /// </summary>
        /// <param name="formula">The formula to parse.</param>
        /// <returns>The parsed formula.</returns>
        private async Task<string> ParseFormulaAsync(string formula)
        {
            if (string.IsNullOrWhiteSpace(formula) || !formula.StartsWith("="))
            {
                return formula;
            }

            try
            {
                return await _calculationEngineService.ParseFormulaAsync(formula);
            }
            catch (Exception ex)
            {
                throw new FormulaParseException($"Error parsing formula: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Raises the PropertyChanged event for the specified property.
        /// </summary>
        /// <param name="propertyName">The name of the property that changed.</param>
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    public class RelayCommand : ICommand
    {
        private readonly Action _execute;
        private readonly Func<bool> _canExecute;

        public RelayCommand(Action execute, Func<bool> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute();

        public void Execute(object parameter) => _execute();
    }

    public class FormulaParseException : Exception
    {
        public FormulaParseException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}