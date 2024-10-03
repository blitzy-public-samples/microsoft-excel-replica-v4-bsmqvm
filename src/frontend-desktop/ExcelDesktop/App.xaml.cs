using System;
using System.Windows;
using System.Windows.Threading;
using Microsoft.AppCenter;
using Microsoft.AppCenter.Analytics;
using Microsoft.AppCenter.Crashes;
using ExcelDesktop.Services;

namespace ExcelDesktop
{
    /// <summary>
    /// The main application class that extends the WPF Application class.
    /// </summary>
    public partial class App : Application
    {
        /// <summary>
        /// Gets the current instance of the App class.
        /// </summary>
        public static new App Current => (App)Application.Current;

        private AuthenticationService _authService;
        private CoreEngineService _coreEngineService;
        private LoggingService _loggingService;

        /// <summary>
        /// Overrides the default startup behavior to initialize services and set up global exception handling.
        /// </summary>
        /// <param name="e">Startup event arguments</param>
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            InitializeServices();
            SetupExceptionHandling();

            // Create and show the main window
            MainWindow = new MainWindow();
            MainWindow.Show();
        }

        /// <summary>
        /// Initializes all the core services required for the application to function.
        /// </summary>
        private void InitializeServices()
        {
            // Initialize AuthenticationService
            _authService = new AuthenticationService();

            // Initialize CoreEngineService
            _coreEngineService = new CoreEngineService();

            // Initialize LoggingService
            _loggingService = new LoggingService();

            // Initialize AppCenter for telemetry
            AppCenter.Start("your-app-center-secret-here",
                   typeof(Analytics), typeof(Crashes));
        }

        /// <summary>
        /// Sets up global exception handling for unhandled exceptions in the application.
        /// </summary>
        private void SetupExceptionHandling()
        {
            // Subscribe to DispatcherUnhandledException event
            DispatcherUnhandledException += OnDispatcherUnhandledException;

            // Set up AppDomain.CurrentDomain.UnhandledException handler
            AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
            {
                Exception ex = (Exception)args.ExceptionObject;
                HandleUnhandledException(ex, "AppDomain.CurrentDomain.UnhandledException");
            };
        }

        /// <summary>
        /// Handles unhandled exceptions that occur on the UI thread.
        /// </summary>
        /// <param name="sender">The source of the unhandled exception</param>
        /// <param name="e">Exception event arguments</param>
        private void OnDispatcherUnhandledException(object sender, DispatcherUnhandledExceptionEventArgs e)
        {
            HandleUnhandledException(e.Exception, "DispatcherUnhandledException");
            e.Handled = true;
        }

        /// <summary>
        /// Handles unhandled exceptions by logging, reporting, and showing a user-friendly message.
        /// </summary>
        /// <param name="ex">The exception that occurred</param>
        /// <param name="source">The source of the exception</param>
        private void HandleUnhandledException(Exception ex, string source)
        {
            // Log the exception using LoggingService
            _loggingService.LogError($"Unhandled exception in {source}: {ex}");

            // Report the crash to AppCenter
            Crashes.TrackError(ex);

            // Show user-friendly error message
            MessageBox.Show($"An unexpected error occurred. The application will now close. Error details have been logged.\n\nError: {ex.Message}",
                            "Unexpected Error", MessageBoxButton.OK, MessageBoxImage.Error);

            // Shutdown the application
            Current.Shutdown();
        }

        /// <summary>
        /// Overrides the default exit behavior to perform cleanup operations.
        /// </summary>
        /// <param name="e">Exit event arguments</param>
        protected override void OnExit(ExitEventArgs e)
        {
            // Perform cleanup operations
            _authService?.Dispose();
            _coreEngineService?.Dispose();
            _loggingService?.Dispose();

            base.OnExit(e);
        }
    }
}