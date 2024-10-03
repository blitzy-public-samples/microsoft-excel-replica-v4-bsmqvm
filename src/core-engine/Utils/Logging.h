#ifndef CORE_ENGINE_UTILS_LOGGING_H
#define CORE_ENGINE_UTILS_LOGGING_H

#include <string>
#include <chrono>
#include <fstream>
#include "ErrorHandling.h" // Assuming this file will be created later

namespace CoreEngine {
namespace Utils {

// Define log levels
enum class LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR
};

// Global log level variable
extern LogLevel LOG_LEVEL;

class Logger {
public:
    Logger(const std::string& logFilePath);
    ~Logger();

    void LogMessage(LogLevel level, const std::string& message);

private:
    LogLevel currentLogLevel;
    std::ofstream logFile;
};

// Function declarations
void Log(LogLevel level, const std::string& message);
void SetLogLevel(LogLevel level);
void LogPerformanceMetric(const std::string& metricName, double value);

// Helper function to convert LogLevel to string
std::string LogLevelToString(LogLevel level);

} // namespace Utils
} // namespace CoreEngine

#endif // CORE_ENGINE_UTILS_LOGGING_H