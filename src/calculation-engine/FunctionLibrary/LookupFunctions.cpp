#include "LookupFunctions.h"
#include "../ErrorHandling/CalculationErrors.h"
#include "../../core-engine/DataStructures/Range.h"
#include "../../core-engine/DataStructures/Cell.h"
#include <algorithm>
#include <cmath>
#include <stdexcept>

namespace ExcelCalculationEngine {
namespace FunctionLibrary {

LookupFunctions::LookupFunctions() {}

std::variant<double, std::string, bool> LookupFunctions::ExecuteFunction(const std::string& functionName, const std::vector<std::variant<double, std::string, bool>>& arguments) {
    if (functionName == "VLOOKUP") {
        return VLOOKUP(arguments);
    } else if (functionName == "HLOOKUP") {
        return HLOOKUP(arguments);
    } else if (functionName == "INDEX") {
        return INDEX(arguments);
    } else if (functionName == "MATCH") {
        return MATCH(arguments);
    } else {
        throw CalculationError(ErrorType::UnsupportedFunction, "Unsupported lookup function: " + functionName);
    }
}

bool LookupFunctions::IsFunctionSupported(const std::string& functionName) {
    static const std::unordered_set<std::string> supportedFunctions = {
        "VLOOKUP", "HLOOKUP", "INDEX", "MATCH"
    };
    return supportedFunctions.find(functionName) != supportedFunctions.end();
}

std::variant<double, std::string, bool> LookupFunctions::VLOOKUP(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    // Validate input arguments
    if (arguments.size() < 3 || arguments.size() > 4) {
        throw CalculationError(ErrorType::InvalidArgumentCount, "VLOOKUP requires 3 or 4 arguments");
    }

    // Extract arguments
    auto lookupValue = arguments[0];
    auto tableArray = std::get<Range>(arguments[1]);
    int colIndex = static_cast<int>(std::get<double>(arguments[2]));
    bool rangeLookup = arguments.size() == 4 ? std::get<bool>(arguments[3]) : true;

    // Validate column index
    if (colIndex < 1 || colIndex > tableArray.GetColumnCount()) {
        throw CalculationError(ErrorType::InvalidArgument, "Column index out of range");
    }

    // Perform lookup
    int rowIndex = -1;
    if (rangeLookup) {
        rowIndex = BinarySearch(tableArray.GetColumn(0), lookupValue);
    } else {
        rowIndex = ExactMatch(tableArray.GetColumn(0), lookupValue);
    }

    if (rowIndex == -1) {
        throw CalculationError(ErrorType::ValueNotFound, "Lookup value not found");
    }

    // Return the corresponding value from the specified column
    return tableArray.GetCell(rowIndex, colIndex - 1).GetValue();
}

std::variant<double, std::string, bool> LookupFunctions::HLOOKUP(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    // Validate input arguments
    if (arguments.size() < 3 || arguments.size() > 4) {
        throw CalculationError(ErrorType::InvalidArgumentCount, "HLOOKUP requires 3 or 4 arguments");
    }

    // Extract arguments
    auto lookupValue = arguments[0];
    auto tableArray = std::get<Range>(arguments[1]);
    int rowIndex = static_cast<int>(std::get<double>(arguments[2]));
    bool rangeLookup = arguments.size() == 4 ? std::get<bool>(arguments[3]) : true;

    // Validate row index
    if (rowIndex < 1 || rowIndex > tableArray.GetRowCount()) {
        throw CalculationError(ErrorType::InvalidArgument, "Row index out of range");
    }

    // Perform lookup
    int colIndex = -1;
    if (rangeLookup) {
        colIndex = BinarySearch(tableArray.GetRow(0), lookupValue);
    } else {
        colIndex = ExactMatch(tableArray.GetRow(0), lookupValue);
    }

    if (colIndex == -1) {
        throw CalculationError(ErrorType::ValueNotFound, "Lookup value not found");
    }

    // Return the corresponding value from the specified row
    return tableArray.GetCell(rowIndex - 1, colIndex).GetValue();
}

std::variant<double, std::string, bool> LookupFunctions::INDEX(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    // Validate input arguments
    if (arguments.size() < 2 || arguments.size() > 3) {
        throw CalculationError(ErrorType::InvalidArgumentCount, "INDEX requires 2 or 3 arguments");
    }

    // Extract arguments
    auto array = std::get<Range>(arguments[0]);
    int rowNum = static_cast<int>(std::get<double>(arguments[1]));
    int colNum = arguments.size() == 3 ? static_cast<int>(std::get<double>(arguments[2])) : 1;

    // Validate row and column numbers
    if (rowNum < 1 || rowNum > array.GetRowCount() || colNum < 1 || colNum > array.GetColumnCount()) {
        throw CalculationError(ErrorType::InvalidArgument, "Row or column number out of range");
    }

    // Return the value at the specified position
    return array.GetCell(rowNum - 1, colNum - 1).GetValue();
}

std::variant<double, std::string, bool> LookupFunctions::MATCH(const std::vector<std::variant<double, std::string, bool>>& arguments) {
    // Validate input arguments
    if (arguments.size() < 2 || arguments.size() > 3) {
        throw CalculationError(ErrorType::InvalidArgumentCount, "MATCH requires 2 or 3 arguments");
    }

    // Extract arguments
    auto lookupValue = arguments[0];
    auto lookupArray = std::get<Range>(arguments[1]);
    int matchType = arguments.size() == 3 ? static_cast<int>(std::get<double>(arguments[2])) : 1;

    // Perform match based on match type
    int result = -1;
    switch (matchType) {
        case 1:  // Exact match or next smallest value
            result = BinarySearch(lookupArray.GetColumn(0), lookupValue);
            break;
        case 0:  // Exact match
            result = ExactMatch(lookupArray.GetColumn(0), lookupValue);
            break;
        case -1: // Exact match or next largest value
            result = ReverseBinarySearch(lookupArray.GetColumn(0), lookupValue);
            break;
        default:
            throw CalculationError(ErrorType::InvalidArgument, "Invalid match type");
    }

    if (result == -1) {
        throw CalculationError(ErrorType::ValueNotFound, "Match value not found");
    }

    // Return the relative position of the matched item
    return static_cast<double>(result + 1);
}

int LookupFunctions::BinarySearch(const std::vector<Cell>& array, const std::variant<double, std::string, bool>& value) {
    int low = 0;
    int high = array.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (CompareVariants(array[mid].GetValue(), value) == 0) {
            return mid;
        } else if (CompareVariants(array[mid].GetValue(), value) < 0) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return high;  // Return the index of the next smallest value
}

int LookupFunctions::ReverseBinarySearch(const std::vector<Cell>& array, const std::variant<double, std::string, bool>& value) {
    int low = 0;
    int high = array.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (CompareVariants(array[mid].GetValue(), value) == 0) {
            return mid;
        } else if (CompareVariants(array[mid].GetValue(), value) > 0) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return low;  // Return the index of the next largest value
}

int LookupFunctions::ExactMatch(const std::vector<Cell>& array, const std::variant<double, std::string, bool>& value) {
    for (size_t i = 0; i < array.size(); ++i) {
        if (CompareVariants(array[i].GetValue(), value) == 0) {
            return static_cast<int>(i);
        }
    }
    return -1;  // No match found
}

int LookupFunctions::CompareVariants(const std::variant<double, std::string, bool>& a, const std::variant<double, std::string, bool>& b) {
    if (a.index() != b.index()) {
        throw CalculationError(ErrorType::TypeMismatch, "Cannot compare values of different types");
    }

    if (std::holds_alternative<double>(a)) {
        double diff = std::get<double>(a) - std::get<double>(b);
        return (std::abs(diff) < 1e-10) ? 0 : (diff < 0 ? -1 : 1);
    } else if (std::holds_alternative<std::string>(a)) {
        return std::get<std::string>(a).compare(std::get<std::string>(b));
    } else {  // bool
        return std::get<bool>(a) == std::get<bool>(b) ? 0 : (std::get<bool>(a) ? 1 : -1);
    }
}

} // namespace FunctionLibrary
} // namespace ExcelCalculationEngine