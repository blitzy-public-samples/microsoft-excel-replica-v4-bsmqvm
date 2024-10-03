using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace ExcelDesktop.Models
{
    /// <summary>
    /// This class represents a worksheet in the Excel desktop application, containing properties and methods to manage worksheet data and behavior.
    /// </summary>
    public class WorksheetModel : INotifyPropertyChanged
    {
        private string _name;
        private Dictionary<string, CellModel> _cells;
        private List<ChartModel> _charts;
        private bool _isSelected;
        private int _rowCount;
        private int _columnCount;

        /// <summary>
        /// Gets or sets the name of the worksheet.
        /// </summary>
        public string Name
        {
            get => _name;
            set
            {
                if (_name != value)
                {
                    _name = value;
                    OnPropertyChanged(nameof(Name));
                }
            }
        }

        /// <summary>
        /// Gets or sets the dictionary of cells in the worksheet, keyed by cell reference.
        /// </summary>
        public Dictionary<string, CellModel> Cells
        {
            get => _cells;
            set
            {
                if (_cells != value)
                {
                    _cells = value;
                    OnPropertyChanged(nameof(Cells));
                }
            }
        }

        /// <summary>
        /// Gets or sets the list of charts in the worksheet.
        /// </summary>
        public List<ChartModel> Charts
        {
            get => _charts;
            set
            {
                if (_charts != value)
                {
                    _charts = value;
                    OnPropertyChanged(nameof(Charts));
                }
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the worksheet is currently selected.
        /// </summary>
        public bool IsSelected
        {
            get => _isSelected;
            set
            {
                if (_isSelected != value)
                {
                    _isSelected = value;
                    OnPropertyChanged(nameof(IsSelected));
                }
            }
        }

        /// <summary>
        /// Gets or sets the number of rows in the worksheet.
        /// </summary>
        public int RowCount
        {
            get => _rowCount;
            set
            {
                if (_rowCount != value)
                {
                    _rowCount = value;
                    OnPropertyChanged(nameof(RowCount));
                }
            }
        }

        /// <summary>
        /// Gets or sets the number of columns in the worksheet.
        /// </summary>
        public int ColumnCount
        {
            get => _columnCount;
            set
            {
                if (_columnCount != value)
                {
                    _columnCount = value;
                    OnPropertyChanged(nameof(ColumnCount));
                }
            }
        }

        /// <summary>
        /// Initializes a new instance of the WorksheetModel class.
        /// </summary>
        public WorksheetModel()
        {
            Cells = new Dictionary<string, CellModel>();
            Charts = new List<ChartModel>();
        }

        /// <summary>
        /// Retrieves a cell model based on its cell reference.
        /// </summary>
        /// <param name="cellReference">The cell reference (e.g., "A1", "B2").</param>
        /// <returns>The cell model corresponding to the given cell reference, or null if not found.</returns>
        public CellModel GetCell(string cellReference)
        {
            if (Cells.TryGetValue(cellReference, out CellModel cell))
            {
                return cell;
            }
            return null;
        }

        /// <summary>
        /// Sets the value of a cell in the worksheet.
        /// </summary>
        /// <param name="cellReference">The cell reference (e.g., "A1", "B2").</param>
        /// <param name="value">The value to set in the cell.</param>
        public void SetCellValue(string cellReference, object value)
        {
            if (Cells.TryGetValue(cellReference, out CellModel cell))
            {
                cell.Value = value;
            }
            else
            {
                cell = new CellModel { Value = value };
                Cells[cellReference] = cell;
            }

            // Trigger any necessary updates or calculations
            // This is a placeholder for potential future implementation
            OnCellValueChanged(cellReference);
        }

        /// <summary>
        /// Adds a new chart to the worksheet.
        /// </summary>
        /// <param name="chart">The chart to add.</param>
        public void AddChart(ChartModel chart)
        {
            Charts.Add(chart);
            OnPropertyChanged(nameof(Charts));
        }

        /// <summary>
        /// Removes a chart from the worksheet.
        /// </summary>
        /// <param name="chart">The chart to remove.</param>
        public void RemoveChart(ChartModel chart)
        {
            if (Charts.Remove(chart))
            {
                OnPropertyChanged(nameof(Charts));
            }
        }

        /// <summary>
        /// Occurs when a property value changes.
        /// </summary>
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Raises the PropertyChanged event when a property value changes.
        /// </summary>
        /// <param name="propertyName">The name of the property that changed.</param>
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        /// <summary>
        /// Raises an event when a cell value has changed.
        /// </summary>
        /// <param name="cellReference">The reference of the cell that changed.</param>
        protected virtual void OnCellValueChanged(string cellReference)
        {
            // This method can be used to trigger recalculations or update dependent cells
            // Implementation depends on the specific requirements of the Excel application
        }
    }
}