#include "DateTimeFunctions.h"
#include "../ErrorHandling/CalculationErrors.h"
#include <chrono>
#include <ctime>
#include <iomanip>
#include <sstream>

namespace ExcelCalculationEngine {

// Helper function to convert Excel serial date to std::tm
std::tm ExcelSerialToTm(double serialDate) {
    // Excel's date system starts from 1900-01-01, which is 2 (1900 is incorrectly considered a leap year in Excel)
    const int daysOffset = 2;
    std::time_t time = (serialDate - daysOffset) * 24 * 60 * 60;
    std::tm tm = *std::localtime(&time);
    tm.tm_year += 1900;
    tm.tm_mon += 1;
    return tm;
}

// Helper function to convert std::tm to Excel serial date
double TmToExcelSerial(const std::tm& tm) {
    std::tm baseDate = {0};
    baseDate.tm_year = 0; // 1900
    baseDate.tm_mon = 0;  // January
    baseDate.tm_mday = 1; // 1st

    std::time_t baseTime = std::mktime(&baseDate);
    std::time_t targetTime = std::mktime(const_cast<std::tm*>(&tm));

    return std::difftime(targetTime, baseTime) / (24 * 60 * 60) + 2; // Add 2 for Excel's date system
}

DateTimeFunctions::DateTimeFunctions() {}

std::variant<double, std::string, bool> DateTimeFunctions::NOW(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (!arguments.empty()) {
        return CalculationError::InvalidArgument;
    }

    auto now = std::chrono::system_clock::now();
    auto nowTm = std::chrono::system_clock::to_time_t(now);
    std::tm localTm = *std::localtime(&nowTm);

    return TmToExcelSerial(localTm);
}

std::variant<double, std::string, bool> DateTimeFunctions::TODAY(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (!arguments.empty()) {
        return CalculationError::InvalidArgument;
    }

    auto now = std::chrono::system_clock::now();
    auto nowTm = std::chrono::system_clock::to_time_t(now);
    std::tm localTm = *std::localtime(&nowTm);
    localTm.tm_hour = 0;
    localTm.tm_min = 0;
    localTm.tm_sec = 0;

    return TmToExcelSerial(localTm);
}

std::variant<double, std::string, bool> DateTimeFunctions::DATE(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() != 3) {
        return CalculationError::InvalidArgument;
    }

    int year, month, day;
    try {
        year = static_cast<int>(std::get<double>(arguments[0]));
        month = static_cast<int>(std::get<double>(arguments[1]));
        day = static_cast<int>(std::get<double>(arguments[2]));
    } catch (const std::bad_variant_access&) {
        return CalculationError::InvalidArgument;
    }

    if (year < 0 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
        return CalculationError::InvalidArgument;
    }

    std::tm tm = {0};
    tm.tm_year = year - 1900;
    tm.tm_mon = month - 1;
    tm.tm_mday = day;

    return TmToExcelSerial(tm);
}

std::variant<double, std::string, bool> DateTimeFunctions::DATEVALUE(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() != 1) {
        return CalculationError::InvalidArgument;
    }

    std::string dateString;
    try {
        dateString = std::get<std::string>(arguments[0]);
    } catch (const std::bad_variant_access&) {
        return CalculationError::InvalidArgument;
    }

    std::tm tm = {0};
    std::istringstream ss(dateString);
    ss >> std::get_time(&tm, "%Y-%m-%d");
    if (ss.fail()) {
        return CalculationError::InvalidArgument;
    }

    return TmToExcelSerial(tm);
}

std::variant<double, std::string, bool> DateTimeFunctions::YEAR(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() != 1) {
        return CalculationError::InvalidArgument;
    }

    double serialDate;
    try {
        serialDate = std::get<double>(arguments[0]);
    } catch (const std::bad_variant_access&) {
        return CalculationError::InvalidArgument;
    }

    std::tm tm = ExcelSerialToTm(serialDate);
    return static_cast<double>(tm.tm_year);
}

std::variant<double, std::string, bool> DateTimeFunctions::MONTH(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() != 1) {
        return CalculationError::InvalidArgument;
    }

    double serialDate;
    try {
        serialDate = std::get<double>(arguments[0]);
    } catch (const std::bad_variant_access&) {
        return CalculationError::InvalidArgument;
    }

    std::tm tm = ExcelSerialToTm(serialDate);
    return static_cast<double>(tm.tm_mon);
}

std::variant<double, std::string, bool> DateTimeFunctions::DAY(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (arguments.size() != 1) {
        return CalculationError::InvalidArgument;
    }

    double serialDate;
    try {
        serialDate = std::get<double>(arguments[0]);
    } catch (const std::bad_variant_access&) {
        return CalculationError::InvalidArgument;
    }

    std::tm tm = ExcelSerialToTm(serialDate);
    return static_cast<double>(tm.tm_mday);
}

std::variant<double, std::string, bool> DateTimeFunctions::ExecuteFunction(const std::string& functionName, const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (functionName == "NOW") {
        return NOW(arguments);
    } else if (functionName == "TODAY") {
        return TODAY(arguments);
    } else if (functionName == "DATE") {
        return DATE(arguments);
    } else if (functionName == "DATEVALUE") {
        return DATEVALUE(arguments);
    } else if (functionName == "YEAR") {
        return YEAR(arguments);
    } else if (functionName == "MONTH") {
        return MONTH(arguments);
    } else if (functionName == "DAY") {
        return DAY(arguments);
    }

    return CalculationError::UnsupportedFunction;
}

bool DateTimeFunctions::IsFunctionSupported(const std::string& functionName) {
    static const std::unordered_set<std::string> supportedFunctions = {
        "NOW", "TODAY", "DATE", "DATEVALUE", "YEAR", "MONTH", "DAY"
    };

    return supportedFunctions.find(functionName) != supportedFunctions.end();
}

} // namespace ExcelCalculationEngine