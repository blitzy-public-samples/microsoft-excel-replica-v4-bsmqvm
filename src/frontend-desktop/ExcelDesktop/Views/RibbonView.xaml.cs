using System.Windows;
using System.Windows.Controls;
using ExcelDesktop.ViewModels;
using ExcelDesktop.Helpers;
using ExcelDesktop.Services;

namespace ExcelDesktop.Views
{
    /// <summary>
    /// Interaction logic for RibbonView.xaml
    /// </summary>
    public partial class RibbonView : UserControl
    {
        private RibbonViewModel _viewModel;
        private CoreEngineService _coreEngineService;

        public RibbonView()
        {
            InitializeComponent();
            _coreEngineService = new CoreEngineService();
            _viewModel = new RibbonViewModel(_coreEngineService);
            DataContext = _viewModel;

            Loaded += OnLoaded;
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            // Perform any necessary initialization when the Ribbon is loaded
            _viewModel.InitializeRibbon();
        }

        private void OnRibbonTabSelected(object sender, SelectionChangedEventArgs e)
        {
            if (e.AddedItems.Count > 0 && e.AddedItems[0] is TabItem selectedTab)
            {
                _viewModel.HandleTabSelection(selectedTab.Header.ToString());
            }
        }

        private void ExecuteRibbonCommand(object sender, ExecutedRoutedEventArgs e)
        {
            if (e.Parameter is string commandName)
            {
                _viewModel.ExecuteCommand(commandName);
            }
        }

        // Add more event handlers and methods as needed for specific Ribbon functionality
    }
}