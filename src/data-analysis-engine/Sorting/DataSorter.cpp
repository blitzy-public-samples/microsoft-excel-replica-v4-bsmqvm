#include "DataSorter.h"
#include "../Utils/DataAnalysisUtils.h"
#include <algorithm>
#include <stdexcept>
#include <functional>
#include <ctime>

namespace DataAnalysisEngine {
namespace Sorting {

void DataSorter::SortNumericData(std::vector<double>& data, bool ascending) {
    // Check if the input vector is empty
    if (data.empty()) {
        return;
    }

    // Use std::sort with a lambda function as comparator
    std::sort(data.begin(), data.end(), [ascending](double a, double b) {
        return ascending ? a < b : a > b;
    });
}

void DataSorter::SortStringData(std::vector<std::string>& data, bool ascending) {
    // Check if the input vector is empty
    if (data.empty()) {
        return;
    }

    // Use std::sort with a lambda function as comparator
    // Consider case-insensitive comparison using DataAnalysisUtils
    std::sort(data.begin(), data.end(), [ascending](const std::string& a, const std::string& b) {
        return ascending ? 
            DataAnalysisUtils::CaseInsensitiveCompare(a, b) :
            DataAnalysisUtils::CaseInsensitiveCompare(b, a);
    });
}

void DataSorter::SortDateData(std::vector<std::time_t>& data, bool ascending) {
    // Check if the input vector is empty
    if (data.empty()) {
        return;
    }

    // Use std::sort with a lambda function as comparator
    std::sort(data.begin(), data.end(), [ascending](std::time_t a, std::time_t b) {
        return ascending ? a < b : a > b;
    });
}

template <typename T>
void DataSorter::CustomSort(std::vector<T>& data, bool ascending, std::function<bool(const T&, const T&)> comparator) {
    // Check if the input vector is empty
    if (data.empty()) {
        return;
    }

    // Use std::sort with the provided comparator function
    // If ascending is false, invert the comparison result
    std::sort(data.begin(), data.end(), [&comparator, ascending](const T& a, const T& b) {
        return ascending ? comparator(a, b) : comparator(b, a);
    });
}

// Explicit template instantiations for common types
template void DataSorter::CustomSort<int>(std::vector<int>&, bool, std::function<bool(const int&, const int&)>);
template void DataSorter::CustomSort<double>(std::vector<double>&, bool, std::function<bool(const double&, const double&)>);
template void DataSorter::CustomSort<std::string>(std::vector<std::string>&, bool, std::function<bool(const std::string&, const std::string&)>);
template void DataSorter::CustomSort<std::time_t>(std::vector<std::time_t>&, bool, std::function<bool(const std::time_t&, const std::time_t&)>);

} // namespace Sorting
} // namespace DataAnalysisEngine