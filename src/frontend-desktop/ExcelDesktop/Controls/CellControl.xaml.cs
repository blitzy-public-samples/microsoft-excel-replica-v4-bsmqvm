using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.ComponentModel;
using ExcelDesktop.Models;
using ExcelDesktop.ViewModels;
using ExcelDesktop.Helpers;

namespace ExcelDesktop.Controls
{
    /// <summary>
    /// Interaction logic for CellControl.xaml
    /// </summary>
    public partial class CellControl : UserControl
    {
        #region Properties

        public CellModel Cell
        {
            get { return (CellModel)GetValue(CellProperty); }
            set { SetValue(CellProperty, value); }
        }

        public static readonly DependencyProperty CellProperty =
            DependencyProperty.Register("Cell", typeof(CellModel), typeof(CellControl), new PropertyMetadata(null, OnCellChanged));

        public WorksheetViewModel ViewModel
        {
            get { return (WorksheetViewModel)GetValue(ViewModelProperty); }
            set { SetValue(ViewModelProperty, value); }
        }

        public static readonly DependencyProperty ViewModelProperty =
            DependencyProperty.Register("ViewModel", typeof(WorksheetViewModel), typeof(CellControl), new PropertyMetadata(null));

        #endregion

        public CellControl()
        {
            InitializeComponent();
            this.DataContext = this;
        }

        #region Event Handlers

        private static void OnCellChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            var control = (CellControl)d;
            if (e.OldValue != null)
            {
                ((CellModel)e.OldValue).PropertyChanged -= control.OnCellPropertyChanged;
            }
            if (e.NewValue != null)
            {
                ((CellModel)e.NewValue).PropertyChanged += control.OnCellPropertyChanged;
            }
            control.UpdateCellDisplay();
        }

        private void OnCellPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            UpdateCellDisplay();
        }

        private void OnCellClick(object sender, MouseButtonEventArgs e)
        {
            this.Focus();
            ViewModel.SelectedCell = Cell;
            e.Handled = true;
        }

        private void OnCellDoubleClick(object sender, MouseButtonEventArgs e)
        {
            EnterEditMode();
            e.Handled = true;
        }

        #endregion

        #region Private Methods

        private void UpdateCellDisplay()
        {
            if (Cell == null) return;

            // Update the cell's content
            CellContent.Text = Cell.FormattedValue;

            // Apply formatting using CellFormatting helper
            CellFormatting.ApplyFormatting(this, Cell);

            // Update visual state (selected, error, etc.)
            UpdateVisualState();
        }

        private void UpdateVisualState()
        {
            // Set the visual state based on cell properties
            if (Cell.HasError)
            {
                VisualStateManager.GoToState(this, "Error", true);
            }
            else if (ViewModel.SelectedCell == Cell)
            {
                VisualStateManager.GoToState(this, "Selected", true);
            }
            else
            {
                VisualStateManager.GoToState(this, "Normal", true);
            }
        }

        private void EnterEditMode()
        {
            CellEditBox.Text = Cell.Value;
            CellEditBox.Visibility = Visibility.Visible;
            CellContent.Visibility = Visibility.Collapsed;
            CellEditBox.Focus();
            CellEditBox.SelectAll();
        }

        private void ExitEditMode(bool applyChanges)
        {
            if (applyChanges)
            {
                Cell.Value = CellEditBox.Text;
                ViewModel.UpdateCell(Cell);
            }

            CellEditBox.Visibility = Visibility.Collapsed;
            CellContent.Visibility = Visibility.Visible;
            UpdateCellDisplay();
        }

        #endregion

        #region UI Event Handlers

        private void CellEditBox_LostFocus(object sender, RoutedEventArgs e)
        {
            ExitEditMode(true);
        }

        private void CellEditBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                ExitEditMode(true);
                e.Handled = true;
            }
            else if (e.Key == Key.Escape)
            {
                ExitEditMode(false);
                e.Handled = true;
            }
        }

        #endregion
    }
}