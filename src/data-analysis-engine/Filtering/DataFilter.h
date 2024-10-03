#ifndef DATA_FILTER_H
#define DATA_FILTER_H

#include <vector>
#include <string>
#include <functional>

// Forward declarations
class IDataAnalysisEngine;
class DataAnalysisUtils;

class DataFilter {
public:
    DataFilter() = default;
    ~DataFilter() = default;

    // Filters numerical data based on a threshold value
    std::vector<double> FilterNumericData(const std::vector<double>& data, double threshold, bool greaterThan);

    // Filters string data based on a pattern
    std::vector<std::string> FilterStringData(const std::vector<std::string>& data, const std::string& pattern, bool caseSensitive);

    // Applies a custom filter to the data using a provided predicate function
    template<typename T>
    std::vector<T> FilterCustom(const std::vector<T>& data, std::function<bool(const T&)> predicate);

private:
    // Helper functions
    bool CompareNumeric(double value, double threshold, bool greaterThan);
    bool CompareString(const std::string& value, const std::string& pattern, bool caseSensitive);
};

// Template function implementation
template<typename T>
std::vector<T> DataFilter::FilterCustom(const std::vector<T>& data, std::function<bool(const T&)> predicate) {
    std::vector<T> result;
    for (const auto& item : data) {
        if (predicate(item)) {
            result.push_back(item);
        }
    }
    return result;
}

#endif // DATA_FILTER_H