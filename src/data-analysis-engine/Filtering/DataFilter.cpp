#include "DataFilter.h"
#include "../Utils/DataAnalysisUtils.h"
#include <algorithm>
#include <regex>
#include <stdexcept>

namespace DataAnalysisEngine {
namespace Filtering {

std::vector<double> DataFilter::FilterNumericData(const std::vector<double>& data, double threshold, bool greaterThan) {
    // Validate input parameters
    if (data.empty()) {
        throw std::invalid_argument("Input data vector is empty");
    }

    // Create a result vector to store filtered data
    std::vector<double> result;

    // Use std::copy_if with a lambda function to filter the data
    std::copy_if(data.begin(), data.end(), std::back_inserter(result),
        [threshold, greaterThan](double value) {
            return greaterThan ? value > threshold : value <= threshold;
        });

    return result;
}

std::vector<std::string> DataFilter::FilterStringData(const std::vector<std::string>& data, const std::string& pattern, bool caseSensitive) {
    // Validate input parameters
    if (data.empty()) {
        throw std::invalid_argument("Input data vector is empty");
    }
    if (pattern.empty()) {
        throw std::invalid_argument("Pattern string is empty");
    }

    // Create a std::regex object with the given pattern and case sensitivity
    std::regex regexPattern(pattern, caseSensitive ? std::regex::normal : std::regex::icase);

    // Create a result vector to store filtered data
    std::vector<std::string> result;

    // Use std::copy_if with std::regex_match to filter the data
    std::copy_if(data.begin(), data.end(), std::back_inserter(result),
        [&regexPattern](const std::string& value) {
            return std::regex_match(value, regexPattern);
        });

    return result;
}

template<typename T>
std::vector<T> DataFilter::FilterCustom(const std::vector<T>& data, std::function<bool(const T&)> predicate) {
    // Validate input parameters
    if (data.empty()) {
        throw std::invalid_argument("Input data vector is empty");
    }
    if (!predicate) {
        throw std::invalid_argument("Invalid predicate function");
    }

    // Create a result vector to store filtered data
    std::vector<T> result;

    // Use std::copy_if with the provided predicate function to filter the data
    std::copy_if(data.begin(), data.end(), std::back_inserter(result, predicate);

    return result;
}

// Explicit template instantiations for common types
template std::vector<int> DataFilter::FilterCustom(const std::vector<int>&, std::function<bool(const int&)>);
template std::vector<double> DataFilter::FilterCustom(const std::vector<double>&, std::function<bool(const double&)>);
template std::vector<std::string> DataFilter::FilterCustom(const std::vector<std::string>&, std::function<bool(const std::string&)>);

} // namespace Filtering
} // namespace DataAnalysisEngine