#ifndef DATE_TIME_FUNCTIONS_H
#define DATE_TIME_FUNCTIONS_H

#include <string>
#include <vector>
#include <variant>
#include <chrono>

// Assuming the interface for IFunctionLibrary
class IFunctionLibrary {
public:
    virtual std::variant<double, std::string, bool> ExecuteFunction(const std::string& functionName, const std::vector<std::variant<double, std::string, bool>>& arguments) = 0;
    virtual bool IsFunctionSupported(const std::string& functionName) = 0;
    virtual ~IFunctionLibrary() = default;
};

// Assuming a simple error class for CalculationErrors
class CalculationError : public std::runtime_error {
public:
    explicit CalculationError(const std::string& message) : std::runtime_error(message) {}
};

class DateTimeFunctions : public IFunctionLibrary {
public:
    DateTimeFunctions();
    ~DateTimeFunctions() override = default;

    std::variant<double, std::string, bool> ExecuteFunction(const std::string& functionName, const std::vector<std::variant<double, std::string, bool>>& arguments) override;
    bool IsFunctionSupported(const std::string& functionName) override;

private:
    double DATE(int year, int month, int day);
    double TIME(int hour, int minute, int second);

    // Helper methods
    bool isValidDate(int year, int month, int day);
    bool isValidTime(int hour, int minute, int second);
    double convertToExcelDate(const std::chrono::system_clock::time_point& tp);
    double convertToExcelTime(int hour, int minute, int second);
};

#endif // DATE_TIME_FUNCTIONS_H