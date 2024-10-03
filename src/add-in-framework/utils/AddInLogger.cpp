#include "AddInLogger.h"
#include <fstream>
#include <chrono>
#include <iomanip>
#include <mutex>

namespace ExcelAddIn {

std::mutex logMutex;

AddInLogger::AddInLogger(const std::string& logFilePath)
    : m_logFilePath(logFilePath), m_logLevel(LogLevel::INFO) {
    // Open the log file in append mode
    m_logFile.open(m_logFilePath, std::ios::app);
    if (!m_logFile.is_open()) {
        throw std::runtime_error("Failed to open log file: " + m_logFilePath);
    }
}

AddInLogger::~AddInLogger() {
    if (m_logFile.is_open()) {
        m_logFile.close();
    }
}

void AddInLogger::Log(LogLevel level, const std::string& message) {
    if (level >= m_logLevel) {
        std::lock_guard<std::mutex> lock(logMutex);
        
        auto now = std::chrono::system_clock::now();
        auto now_c = std::chrono::system_clock::to_time_t(now);
        auto now_ms = std::chrono::duration_cast<std::chrono::milliseconds>(
            now.time_since_epoch()) % 1000;

        m_logFile << std::put_time(std::localtime(&now_c), "%Y-%m-%d %H:%M:%S")
                  << '.' << std::setfill('0') << std::setw(3) << now_ms.count()
                  << " [" << LogLevelToString(level) << "] " << message << std::endl;
        
        m_logFile.flush();
    }
}

void AddInLogger::SetLogLevel(LogLevel level) {
    m_logLevel = level;
}

LogLevel AddInLogger::GetLogLevel() const {
    return m_logLevel;
}

std::string AddInLogger::LogLevelToString(LogLevel level) {
    switch (level) {
        case LogLevel::DEBUG:   return "DEBUG";
        case LogLevel::INFO:    return "INFO";
        case LogLevel::WARNING: return "WARNING";
        case LogLevel::ERROR:   return "ERROR";
        case LogLevel::FATAL:   return "FATAL";
        default:                return "UNKNOWN";
    }
}

} // namespace ExcelAddIn