using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Excel.Security.Monitoring;
using Microsoft.Excel.Security.Compliance;

namespace Microsoft.Excel.Security.Access
{
    /// <summary>
    /// AuditLogger class responsible for logging audit events in Microsoft Excel.
    /// </summary>
    public class AuditLogger
    {
        private readonly string LogFilePath;
        private static readonly object LogLock = new object();
        private readonly SecurityMonitoringService _securityMonitoringService;
        private readonly ComplianceService _complianceService;

        /// <summary>
        /// Singleton instance of the AuditLogger.
        /// </summary>
        public static AuditLogger Instance { get; } = new AuditLogger();

        private AuditLogger()
        {
            LogFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "AuditLogs", "audit.log");
            Directory.CreateDirectory(Path.GetDirectoryName(LogFilePath));
            _securityMonitoringService = new SecurityMonitoringService();
            _complianceService = new ComplianceService();
        }

        /// <summary>
        /// Logs an audit event asynchronously.
        /// </summary>
        /// <param name="eventType">Type of the event.</param>
        /// <param name="userId">ID of the user performing the action.</param>
        /// <param name="action">Description of the action performed.</param>
        /// <param name="details">Additional details about the event.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        public async Task LogEvent(string eventType, string userId, string action, string details)
        {
            var logEntry = FormatLogEntry(eventType, userId, action, details);

            try
            {
                await WriteLogEntryAsync(logEntry);
                await _securityMonitoringService.NotifyNewLogEntry(logEntry);
                await _complianceService.ProcessAuditLog(logEntry);
            }
            catch (Exception ex)
            {
                // Log the error to a separate error log file
                await LogError($"Error logging audit event: {ex.Message}");
            }
        }

        /// <summary>
        /// Retrieves audit logs within a specified date range.
        /// </summary>
        /// <param name="startDate">Start date of the log range.</param>
        /// <param name="endDate">End date of the log range.</param>
        /// <returns>A list of log entries within the specified date range.</returns>
        public List<string> GetLogs(DateTime startDate, DateTime endDate)
        {
            var filteredLogs = new List<string>();

            try
            {
                string[] allLogs = File.ReadAllLines(LogFilePath);

                foreach (var log in allLogs)
                {
                    var logDate = ExtractDateFromLog(log);
                    if (logDate >= startDate && logDate <= endDate)
                    {
                        filteredLogs.Add(log);
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error to a separate error log file
                LogError($"Error retrieving audit logs: {ex.Message}").Wait();
            }

            return filteredLogs;
        }

        private string FormatLogEntry(string eventType, string userId, string action, string details)
        {
            return $"{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss.fff}|{eventType}|{userId}|{action}|{details}";
        }

        private async Task WriteLogEntryAsync(string logEntry)
        {
            lock (LogLock)
            {
                using (StreamWriter sw = File.AppendText(LogFilePath))
                {
                    sw.WriteLine(logEntry);
                }
            }

            await Task.CompletedTask;
        }

        private async Task LogError(string errorMessage)
        {
            string errorLogPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "AuditLogs", "error.log");
            string errorEntry = $"{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss.fff}|ERROR|{errorMessage}";

            lock (LogLock)
            {
                using (StreamWriter sw = File.AppendText(errorLogPath))
                {
                    sw.WriteLine(errorEntry);
                }
            }

            await Task.CompletedTask;
        }

        private DateTime ExtractDateFromLog(string logEntry)
        {
            string[] parts = logEntry.Split('|');
            if (parts.Length > 0 && DateTime.TryParse(parts[0], out DateTime logDate))
            {
                return logDate;
            }
            return DateTime.MinValue;
        }
    }
}