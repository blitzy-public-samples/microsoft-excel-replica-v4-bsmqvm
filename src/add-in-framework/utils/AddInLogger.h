#ifndef ADD_IN_LOGGER_H
#define ADD_IN_LOGGER_H

#include <string>
#include <fstream>

// Forward declaration of ErrorHandler
class ErrorHandler;

/**
 * @brief Enumeration for log levels
 */
enum class LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR,
    CRITICAL
};

/**
 * @brief AddInLogger class provides logging functionality for Excel add-ins
 * 
 * This class allows add-ins to log messages, errors, and other information
 * for debugging and monitoring purposes.
 */
class AddInLogger {
public:
    /**
     * @brief Constructs an AddInLogger object and opens the log file
     * @param logFilePath The path to the log file
     */
    explicit AddInLogger(const std::string& logFilePath);

    /**
     * @brief Destructor that closes the log file and performs cleanup
     */
    ~AddInLogger();

    /**
     * @brief Logs a message with the specified log level
     * @param level The log level of the message
     * @param message The message to be logged
     */
    void Log(LogLevel level, const std::string& message);

    /**
     * @brief Sets the current log level for filtering messages
     * @param level The log level to set
     */
    void SetLogLevel(LogLevel level);

    /**
     * @brief Returns the current log level
     * @return The current log level
     */
    LogLevel GetLogLevel() const;

private:
    std::ofstream m_logFile;
    LogLevel m_logLevel;

    /**
     * @brief Converts a LogLevel to its string representation
     * @param level The LogLevel to convert
     * @return String representation of the LogLevel
     */
    static std::string LogLevelToString(LogLevel level);

    /**
     * @brief Gets the current timestamp as a string
     * @return Current timestamp as a string
     */
    static std::string GetTimestamp();
};

#endif // ADD_IN_LOGGER_H