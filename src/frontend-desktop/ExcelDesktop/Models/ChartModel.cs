using System;
using System.ComponentModel;
using System.Collections.Generic;

namespace ExcelDesktop.Models
{
    /// <summary>
    /// Represents a chart in an Excel worksheet. This class encapsulates the chart's data, properties, and behavior.
    /// It is designed to work within the MVVM (Model-View-ViewModel) pattern, implementing INotifyPropertyChanged
    /// to support data binding in the WPF desktop application.
    /// </summary>
    public class ChartModel : INotifyPropertyChanged
    {
        private Guid _id;
        private string _title;
        private ChartTypeEnum _chartType;
        private string _dataRange;
        private string _xAxisTitle;
        private string _yAxisTitle;
        private List<SeriesModel> _seriesCollection;
        private double _width;
        private double _height;
        private ChartPosition _position;
        private bool _isSelected;

        /// <summary>
        /// Gets or sets the unique identifier for the chart.
        /// </summary>
        public Guid Id
        {
            get => _id;
            set
            {
                if (_id != value)
                {
                    _id = value;
                    OnPropertyChanged(nameof(Id));
                }
            }
        }

        /// <summary>
        /// Gets or sets the title of the chart.
        /// </summary>
        public string Title
        {
            get => _title;
            set
            {
                if (_title != value)
                {
                    _title = value;
                    OnPropertyChanged(nameof(Title));
                }
            }
        }

        /// <summary>
        /// Gets or sets the type of the chart.
        /// </summary>
        public ChartTypeEnum ChartType
        {
            get => _chartType;
            set
            {
                if (_chartType != value)
                {
                    _chartType = value;
                    OnPropertyChanged(nameof(ChartType));
                }
            }
        }

        /// <summary>
        /// Gets or sets the data range for the chart.
        /// </summary>
        public string DataRange
        {
            get => _dataRange;
            set
            {
                if (_dataRange != value)
                {
                    _dataRange = value;
                    OnPropertyChanged(nameof(DataRange));
                }
            }
        }

        /// <summary>
        /// Gets or sets the title of the X-axis.
        /// </summary>
        public string XAxisTitle
        {
            get => _xAxisTitle;
            set
            {
                if (_xAxisTitle != value)
                {
                    _xAxisTitle = value;
                    OnPropertyChanged(nameof(XAxisTitle));
                }
            }
        }

        /// <summary>
        /// Gets or sets the title of the Y-axis.
        /// </summary>
        public string YAxisTitle
        {
            get => _yAxisTitle;
            set
            {
                if (_yAxisTitle != value)
                {
                    _yAxisTitle = value;
                    OnPropertyChanged(nameof(YAxisTitle));
                }
            }
        }

        /// <summary>
        /// Gets or sets the collection of series in the chart.
        /// </summary>
        public List<SeriesModel> SeriesCollection
        {
            get => _seriesCollection;
            set
            {
                if (_seriesCollection != value)
                {
                    _seriesCollection = value;
                    OnPropertyChanged(nameof(SeriesCollection));
                }
            }
        }

        /// <summary>
        /// Gets or sets the width of the chart.
        /// </summary>
        public double Width
        {
            get => _width;
            set
            {
                if (_width != value)
                {
                    _width = value;
                    OnPropertyChanged(nameof(Width));
                }
            }
        }

        /// <summary>
        /// Gets or sets the height of the chart.
        /// </summary>
        public double Height
        {
            get => _height;
            set
            {
                if (_height != value)
                {
                    _height = value;
                    OnPropertyChanged(nameof(Height));
                }
            }
        }

        /// <summary>
        /// Gets or sets the position of the chart.
        /// </summary>
        public ChartPosition Position
        {
            get => _position;
            set
            {
                if (_position != value)
                {
                    _position = value;
                    OnPropertyChanged(nameof(Position));
                }
            }
        }

        /// <summary>
        /// Gets or sets whether the chart is currently selected.
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
        /// Event raised when a property value changes.
        /// </summary>
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Raises the PropertyChanged event with the given property name.
        /// </summary>
        /// <param name="propertyName">The name of the property that changed.</param>
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        /// <summary>
        /// Updates the chart data based on the current DataRange.
        /// </summary>
        public void UpdateChartData()
        {
            // TODO: Implement the logic to retrieve data from the specified DataRange
            // Update the SeriesCollection based on the retrieved data
            // For example:
            // 1. Parse the DataRange to get the cell references
            // 2. Retrieve the data from the corresponding cells in the worksheet
            // 3. Update the SeriesCollection with the new data
            // 4. Raise PropertyChanged event for SeriesCollection

            OnPropertyChanged(nameof(SeriesCollection));
        }

        /// <summary>
        /// Adds a new series to the chart.
        /// </summary>
        /// <param name="series">The series to add to the chart.</param>
        public void AddSeries(SeriesModel series)
        {
            if (series != null)
            {
                SeriesCollection.Add(series);
                OnPropertyChanged(nameof(SeriesCollection));
            }
        }

        /// <summary>
        /// Removes a series from the chart.
        /// </summary>
        /// <param name="series">The series to remove from the chart.</param>
        public void RemoveSeries(SeriesModel series)
        {
            if (series != null && SeriesCollection.Remove(series))
            {
                OnPropertyChanged(nameof(SeriesCollection));
            }
        }
    }

    /// <summary>
    /// Represents the position of a chart within a worksheet.
    /// </summary>
    public struct ChartPosition
    {
        public double Left { get; set; }
        public double Top { get; set; }
    }

    /// <summary>
    /// Represents a series of data in a chart.
    /// </summary>
    public class SeriesModel : INotifyPropertyChanged
    {
        private string _name;
        private List<double> _values;

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

        public List<double> Values
        {
            get => _values;
            set
            {
                if (_values != value)
                {
                    _values = value;
                    OnPropertyChanged(nameof(Values));
                }
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    /// <summary>
    /// Enum representing different types of charts available in Excel.
    /// </summary>
    public enum ChartTypeEnum
    {
        Bar,
        Column,
        Line,
        Pie,
        Scatter,
        Area,
        Doughnut,
        Radar
    }
}