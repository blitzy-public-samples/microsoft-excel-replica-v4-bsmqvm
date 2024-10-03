#include "PivotTableGenerator.h"
#include "../Utils/DataAnalysisUtils.h"
#include <algorithm>
#include <unordered_map>
#include <stdexcept>
#include <thread>
#include <future>

PivotTableGenerator::PivotTableGenerator() : m_sourceData(), m_rowFields(), m_columnFields(), m_valueFields(), m_aggregationFunctions() {}

void PivotTableGenerator::SetSourceData(const std::vector<std::vector<std::string>>& data) {
    // Validate input data
    if (data.empty() || data[0].empty()) {
        throw std::invalid_argument("Source data cannot be empty");
    }

    m_sourceData = data;
    ClearConfiguration();
}

void PivotTableGenerator::AddRowField(int fieldIndex) {
    ValidateFieldIndex(fieldIndex);
    m_rowFields.push_back(fieldIndex);
}

void PivotTableGenerator::AddColumnField(int fieldIndex) {
    ValidateFieldIndex(fieldIndex);
    m_columnFields.push_back(fieldIndex);
}

void PivotTableGenerator::AddValueField(int fieldIndex, const std::string& aggregationFunction) {
    ValidateFieldIndex(fieldIndex);
    ValidateAggregationFunction(aggregationFunction);
    m_valueFields.push_back(fieldIndex);
    m_aggregationFunctions[fieldIndex] = aggregationFunction;
}

void PivotTableGenerator::ClearConfiguration() {
    m_rowFields.clear();
    m_columnFields.clear();
    m_valueFields.clear();
    m_aggregationFunctions.clear();
}

std::vector<std::vector<std::string>> PivotTableGenerator::GeneratePivotTable() {
    ValidateConfiguration();

    // Group data based on row and column fields
    auto groupedData = GroupData();

    // Apply aggregation functions to value fields
    auto aggregatedData = AggregateData(groupedData);

    // Generate the pivot table structure
    return FormatPivotTable(aggregatedData);
}

void PivotTableGenerator::ValidateFieldIndex(int fieldIndex) const {
    if (fieldIndex < 0 || fieldIndex >= static_cast<int>(m_sourceData[0].size())) {
        throw std::out_of_range("Invalid field index");
    }
}

void PivotTableGenerator::ValidateAggregationFunction(const std::string& aggregationFunction) const {
    static const std::unordered_set<std::string> validFunctions = {"SUM", "AVG", "COUNT", "MIN", "MAX"};
    if (validFunctions.find(aggregationFunction) == validFunctions.end()) {
        throw std::invalid_argument("Invalid aggregation function");
    }
}

void PivotTableGenerator::ValidateConfiguration() const {
    if (m_rowFields.empty() && m_columnFields.empty()) {
        throw std::runtime_error("At least one row or column field must be specified");
    }
    if (m_valueFields.empty()) {
        throw std::runtime_error("At least one value field must be specified");
    }
}

std::unordered_map<std::vector<std::string>, std::vector<std::vector<std::string>>, DataAnalysisUtils::VectorHash> PivotTableGenerator::GroupData() const {
    std::unordered_map<std::vector<std::string>, std::vector<std::vector<std::string>>, DataAnalysisUtils::VectorHash> groupedData;

    for (size_t i = 1; i < m_sourceData.size(); ++i) {
        std::vector<std::string> key;
        for (int field : m_rowFields) {
            key.push_back(m_sourceData[i][field]);
        }
        for (int field : m_columnFields) {
            key.push_back(m_sourceData[i][field]);
        }
        groupedData[key].push_back(m_sourceData[i]);
    }

    return groupedData;
}

std::unordered_map<std::vector<std::string>, std::vector<double>, DataAnalysisUtils::VectorHash> PivotTableGenerator::AggregateData(
    const std::unordered_map<std::vector<std::string>, std::vector<std::vector<std::string>>, DataAnalysisUtils::VectorHash>& groupedData) const {
    std::unordered_map<std::vector<std::string>, std::vector<double>, DataAnalysisUtils::VectorHash> aggregatedData;

    // Use parallel processing for large datasets
    const size_t dataSize = groupedData.size();
    const size_t numThreads = std::thread::hardware_concurrency();
    const size_t batchSize = (dataSize + numThreads - 1) / numThreads;

    std::vector<std::future<void>> futures;

    auto it = groupedData.begin();
    for (size_t i = 0; i < numThreads && it != groupedData.end(); ++i) {
        futures.push_back(std::async(std::launch::async, [this, &groupedData, &aggregatedData, &it, batchSize]() {
            for (size_t j = 0; j < batchSize && it != groupedData.end(); ++j, ++it) {
                const auto& key = it->first;
                const auto& group = it->second;
                std::vector<double> aggregatedValues;

                for (int valueField : m_valueFields) {
                    const auto& aggregationFunction = m_aggregationFunctions.at(valueField);
                    double result = ApplyAggregationFunction(group, valueField, aggregationFunction);
                    aggregatedValues.push_back(result);
                }

                aggregatedData[key] = aggregatedValues;
            }
        }));
    }

    for (auto& future : futures) {
        future.wait();
    }

    return aggregatedData;
}

double PivotTableGenerator::ApplyAggregationFunction(const std::vector<std::vector<std::string>>& group, int fieldIndex, const std::string& function) const {
    std::vector<double> values;
    for (const auto& row : group) {
        values.push_back(std::stod(row[fieldIndex]));
    }

    if (function == "SUM") {
        return DataAnalysisUtils::Sum(values);
    } else if (function == "AVG") {
        return DataAnalysisUtils::Average(values);
    } else if (function == "COUNT") {
        return static_cast<double>(values.size());
    } else if (function == "MIN") {
        return DataAnalysisUtils::Min(values);
    } else if (function == "MAX") {
        return DataAnalysisUtils::Max(values);
    }

    throw std::runtime_error("Unsupported aggregation function");
}

std::vector<std::vector<std::string>> PivotTableGenerator::FormatPivotTable(
    const std::unordered_map<std::vector<std::string>, std::vector<double>, DataAnalysisUtils::VectorHash>& aggregatedData) const {
    std::vector<std::vector<std::string>> pivotTable;

    // Generate header row
    std::vector<std::string> header;
    for (int field : m_rowFields) {
        header.push_back(m_sourceData[0][field]);
    }
    for (int field : m_columnFields) {
        header.push_back(m_sourceData[0][field]);
    }
    for (int field : m_valueFields) {
        header.push_back(m_sourceData[0][field] + " (" + m_aggregationFunctions.at(field) + ")");
    }
    pivotTable.push_back(header);

    // Generate data rows
    for (const auto& entry : aggregatedData) {
        std::vector<std::string> row;
        row.insert(row.end(), entry.first.begin(), entry.first.end());
        for (double value : entry.second) {
            row.push_back(DataAnalysisUtils::FormatNumber(value));
        }
        pivotTable.push_back(row);
    }

    return pivotTable;
}