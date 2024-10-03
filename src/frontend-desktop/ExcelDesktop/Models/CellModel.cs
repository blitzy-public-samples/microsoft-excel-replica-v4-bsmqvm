using System;
using System.ComponentModel;

namespace ExcelDesktop.Models
{
    /// <summary>
    /// The CellModel class represents a single cell in an Excel worksheet.
    /// It encapsulates the cell's data, formatting, and behavior.
    /// This class is designed to work within the MVVM (Model-View-ViewModel) pattern,
    /// implementing INotifyPropertyChanged to support data binding in the WPF desktop application.
    /// </summary>
    public class CellModel : INotifyPropertyChanged
    {
        private int _row;
        private int _column;
        private object _value;
        private string _formula;
        private string _formattedValue;
        private CellFormat _cellFormat;
        private bool _isReadOnly;
        private bool _hasError;
        private string _errorMessage;

        /// <summary>
        /// Event raised when a property value changes.
        /// </summary>
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Gets or sets the row index of the cell.
        /// </summary>
        public int Row
        {
            get => _row;
            set
            {
                if (_row != value)
                {
                    _row = value;
                    OnPropertyChanged(nameof(Row));
                }
            }
        }

        /// <summary>
        /// Gets or sets the column index of the cell.
        /// </summary>
        public int Column
        {
            get => _column;
            set
            {
                if (_column != value)
                {
                    _column = value;
                    OnPropertyChanged(nameof(Column));
                }
            }
        }

        /// <summary>
        /// Gets or sets the value of the cell.
        /// </summary>
        public object Value
        {
            get => _value;
            set
            {
                if (_value != value)
                {
                    _value = value;
                    OnPropertyChanged(nameof(Value));
                    UpdateFormattedValue();
                }
            }
        }

        /// <summary>
        /// Gets or sets the formula of the cell.
        /// </summary>
        public string Formula
        {
            get => _formula;
            set
            {
                if (_formula != value)
                {
                    _formula = value;
                    OnPropertyChanged(nameof(Formula));
                    RecalculateValue();
                }
            }
        }

        /// <summary>
        /// Gets or sets the formatted value of the cell.
        /// </summary>
        public string FormattedValue
        {
            get => _formattedValue;
            private set
            {
                if (_formattedValue != value)
                {
                    _formattedValue = value;
                    OnPropertyChanged(nameof(FormattedValue));
                }
            }
        }

        /// <summary>
        /// Gets or sets the cell format.
        /// </summary>
        public CellFormat CellFormat
        {
            get => _cellFormat;
            set
            {
                if (_cellFormat != value)
                {
                    _cellFormat = value;
                    OnPropertyChanged(nameof(CellFormat));
                    UpdateFormattedValue();
                }
            }
        }

        /// <summary>
        /// Gets or sets whether the cell is read-only.
        /// </summary>
        public bool IsReadOnly
        {
            get => _isReadOnly;
            set
            {
                if (_isReadOnly != value)
                {
                    _isReadOnly = value;
                    OnPropertyChanged(nameof(IsReadOnly));
                }
            }
        }

        /// <summary>
        /// Gets or sets whether the cell has an error.
        /// </summary>
        public bool HasError
        {
            get => _hasError;
            private set
            {
                if (_hasError != value)
                {
                    _hasError = value;
                    OnPropertyChanged(nameof(HasError));
                }
            }
        }

        /// <summary>
        /// Gets or sets the error message for the cell.
        /// </summary>
        public string ErrorMessage
        {
            get => _errorMessage;
            private set
            {
                if (_errorMessage != value)
                {
                    _errorMessage = value;
                    OnPropertyChanged(nameof(ErrorMessage));
                }
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

        /// <summary>
        /// Sets the value of the cell and updates the FormattedValue accordingly.
        /// </summary>
        /// <param name="value">The new value for the cell.</param>
        public void SetValue(object value)
        {
            Value = value;
            UpdateFormattedValue();
        }

        /// <summary>
        /// Sets the formula for the cell and triggers a recalculation of the cell's value.
        /// </summary>
        /// <param name="formula">The new formula for the cell.</param>
        public void SetFormula(string formula)
        {
            Formula = formula;
            RecalculateValue();
        }

        /// <summary>
        /// Updates the FormattedValue based on the current Value and CellFormat.
        /// </summary>
        private void UpdateFormattedValue()
        {
            // TODO: Implement formatting logic based on CellFormat
            FormattedValue = Value?.ToString() ?? string.Empty;
        }

        /// <summary>
        /// Recalculates the cell's value based on its formula.
        /// </summary>
        private void RecalculateValue()
        {
            // TODO: Implement formula calculation logic
            // This should interact with the CalculationEngine to evaluate the formula
            // For now, we'll just set the Value to the Formula string
            try
            {
                Value = Formula;
                HasError = false;
                ErrorMessage = string.Empty;
            }
            catch (Exception ex)
            {
                HasError = true;
                ErrorMessage = ex.Message;
            }
        }
    }

    /// <summary>
    /// Represents the formatting options for a cell.
    /// </summary>
    public class CellFormat
    {
        // TODO: Implement cell formatting properties
        // Such as font, color, number format, etc.
    }
}