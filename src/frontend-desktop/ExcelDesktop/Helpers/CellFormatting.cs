using System;
using System.Windows.Media;
using System.Globalization;
using ExcelDesktop.Models;

namespace ExcelDesktop.Helpers
{
    /// <summary>
    /// This static class provides methods for formatting cells in the Excel desktop application.
    /// </summary>
    public static class CellFormatting
    {
        /// <summary>
        /// Applies the specified number format to the given value.
        /// </summary>
        /// <param name="value">The value to format.</param>
        /// <param name="format">The format string to apply.</param>
        /// <param name="culture">The culture to use for formatting. If null, the current culture is used.</param>
        /// <returns>Formatted value as a string.</returns>
        public static string ApplyNumberFormat(object value, string format, CultureInfo culture = null)
        {
            if (value == null || string.IsNullOrEmpty(format))
            {
                return value?.ToString() ?? string.Empty;
            }

            culture = culture ?? CultureInfo.CurrentCulture;

            if (value is IFormattable formattable)
            {
                return formattable.ToString(format, culture);
            }

            return string.Format(culture, $"{{0:{format}}}", value);
        }

        /// <summary>
        /// Applies conditional formatting to a cell based on a specified condition.
        /// </summary>
        /// <param name="cell">The cell to format.</param>
        /// <param name="condition">The condition to evaluate.</param>
        /// <param name="format">The format to apply if the condition is met.</param>
        public static void ApplyConditionalFormatting(CellModel cell, Func<object, bool> condition, CellFormat format)
        {
            if (cell == null || condition == null || format == null)
            {
                return;
            }

            if (condition(cell.Value))
            {
                cell.ConditionalFormat = format;
            }
            else
            {
                cell.ConditionalFormat = null;
            }
        }

        /// <summary>
        /// Returns the appropriate background brush for a cell based on its formatting.
        /// </summary>
        /// <param name="cell">The cell to get the background brush for.</param>
        /// <returns>The background brush for the cell.</returns>
        public static Brush GetCellBackgroundBrush(CellModel cell)
        {
            if (cell == null)
            {
                return Brushes.White;
            }

            if (cell.ConditionalFormat != null && cell.ConditionalFormat.BackgroundColor.HasValue)
            {
                return new SolidColorBrush(cell.ConditionalFormat.BackgroundColor.Value);
            }

            return new SolidColorBrush(cell.BackgroundColor);
        }

        /// <summary>
        /// Formats the cell value based on its data type and applied formatting.
        /// </summary>
        /// <param name="cell">The cell to format.</param>
        /// <returns>Formatted cell value as a string.</returns>
        public static string FormatCellValue(CellModel cell)
        {
            if (cell == null || cell.Value == null)
            {
                return string.Empty;
            }

            string format = cell.Format ?? GetDefaultFormat(cell.Value);
            CultureInfo culture = CultureInfo.CurrentCulture;

            if (cell.Value is DateTime dateTime)
            {
                return dateTime.ToString(format, culture);
            }
            else if (cell.Value is double number)
            {
                if (format.Contains("%"))
                {
                    return (number * 100).ToString(format, culture);
                }
                return number.ToString(format, culture);
            }
            else
            {
                return ApplyNumberFormat(cell.Value, format, culture);
            }
        }

        private static string GetDefaultFormat(object value)
        {
            switch (value)
            {
                case DateTime _:
                    return "d";
                case double _:
                    return "0.00";
                default:
                    return "G";
            }
        }
    }

    /// <summary>
    /// Represents the formatting options for a cell.
    /// </summary>
    public class CellFormat
    {
        public Color? BackgroundColor { get; set; }
        public Color? ForegroundColor { get; set; }
        public FontStyle? FontStyle { get; set; }
        public FontWeight? FontWeight { get; set; }
        public string NumberFormat { get; set; }
    }
}