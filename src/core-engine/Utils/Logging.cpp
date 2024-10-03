#include "Logging.h"
#include "ErrorHandling.h"
#include <iostream>
#include <fstream>
#include <chrono>
#include <mutex>
#include <sstream>
#include <iomanip>

namespace CoreEngine {
namespace Utils {

// Global mutex for thread-safe logging
std::mutex logMutex;

// Global log level
LogLevel LOG_LEVEL = LogLevel::INFO;

// Helper function to convert LogLevel to string
std::string logLevelToString(LogLevel level) {
    switch (level) {
        case LogLevel::DEBUG: return "DEBUG";
        case LogLevel::INFO: return "INFO";
        case LogLevel::WARNING: return "WARNING";
        case LogLevel::ERROR: return "ERROR";
        default: return "UNKNOWN";
    }
}

// Helper function to generate timestamp
std::string generateTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto time = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&time), "%Y-%m-%d %H:%M:%S");
    return ss.str();
}

void Log(LogLevel level, const std::string& message) {
    if (level >= LOG_LEVEL) {
        std::lock_guard<std::mutex> lock(logMutex);
        
        std::string timestamp = generateTimestamp();
        std::string logLevelStr = logLevelToString(level);
        
        std::stringstream logStream;
        logStream << "[" << timestamp << "] [" << logLevelStr << "] " << message;
        
        // Write to log file
        std::ofstream logFile("excel_core_engine.log", std::ios::app);
        if (logFile.is_open()) {
            logFile << logStream.str() << std::endl;
            logFile.close();
        } else {
            std::cerr << "Failed to open log file." << std::endl;
        }
        
        // Also print to console for immediate visibility
        std::cout << logStream.str() << std::endl;
        
        // If log level is ERROR, integrate with ErrorHandling
        if (level == LogLevel::ERROR) {
            ErrorHandling::ReportError("Logging", message);
        }
    }
}

void SetLogLevel(LogLevel level) {
    std::lock_guard<std::mutex> lock(logMutex);
    LOG_LEVEL = level;
    Log(LogLevel::INFO, "Log level set to: " + logLevelToString(level));
}

void LogPerformanceMetric(const std::string& metricName, double value) {
    std::stringstream ss;
    ss << "Performance Metric - " << metricName << ": " << value;
    Log(LogLevel::INFO, ss.str());
}

Logger::Logger(const std::string& logFilePath) : logFile(logFilePath, std::ios::app), currentLogLevel(LogLevel::INFO) {
    if (!logFile.is_open()) {
        throw std::runtime_error("Failed to open log file: " + logFilePath);
    }
    Log(LogLevel::INFO, "Logger initialized with file: " + logFilePath);
}

void Logger::LogMessage(LogLevel level, const std::string& message) {
    if (level >= currentLogLevel) {
        std::lock_guard<std::mutex> lock(logMutex);
        
        std::string timestamp = generateTimestamp();
        std::string logLevelStr = logLevelToString(level);
        
        std::stringstream logStream;
        logStream << "[" << timestamp << "] [" << logLevelStr << "] " << message;
        
        logFile << logStream.str() << std::endl;
        logFile.flush();
        
        // Also print to console for immediate visibility
        std::cout << logStream.str() << std::endl;
    }
}

} // namespace Utils
} // namespace CoreEngine