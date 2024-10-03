#include "DataModelManager.h"
#include "../Utils/DataAnalysisUtils.h"
#include <algorithm>
#include <stdexcept>

DataModelManager::DataModelManager() {}

void DataModelManager::LoadData(const std::vector<std::vector<std::string>>& data, const std::vector<std::string>& columnNames) {
    if (data.empty() || columnNames.empty()) {
        throw std::invalid_argument("Data or column names cannot be empty");
    }

    if (data[0].size() != columnNames.size()) {
        throw std::invalid_argument("Number of columns in data does not match the number of column names");
    }

    m_data = data;
    m_columnNames = columnNames;
}

const std::vector<std::vector<std::string>>& DataModelManager::GetData() const {
    return m_data;
}

const std::vector<std::string>& DataModelManager::GetColumnNames() const {
    return m_columnNames;
}

void DataModelManager::AddColumn(const std::string& columnName, const std::vector<std::string>& columnData) {
    if (columnData.size() != m_data.size()) {
        throw std::invalid_argument("Column data size does not match existing data size");
    }

    m_columnNames.push_back(columnName);
    for (size_t i = 0; i < m_data.size(); ++i) {
        m_data[i].push_back(columnData[i]);
    }
}

void DataModelManager::RemoveColumn(const std::string& columnName) {
    auto it = std::find(m_columnNames.begin(), m_columnNames.end(), columnName);
    if (it == m_columnNames.end()) {
        throw std::invalid_argument("Column not found");
    }

    int index = std::distance(m_columnNames.begin(), it);
    m_columnNames.erase(it);

    for (auto& row : m_data) {
        row.erase(row.begin() + index);
    }
}

int DataModelManager::GetColumnIndex(const std::string& columnName) const {
    auto it = std::find(m_columnNames.begin(), m_columnNames.end(), columnName);
    if (it == m_columnNames.end()) {
        return -1;
    }
    return std::distance(m_columnNames.begin(), it);
}

std::vector<std::string> DataModelManager::GetColumnData(const std::string& columnName) const {
    int index = GetColumnIndex(columnName);
    if (index == -1) {
        throw std::invalid_argument("Column not found");
    }

    std::vector<std::string> columnData;
    for (const auto& row : m_data) {
        columnData.push_back(row[index]);
    }
    return columnData;
}

void DataModelManager::UpdateCell(int row, int col, const std::string& value) {
    if (row < 0 || row >= static_cast<int>(m_data.size()) || col < 0 || col >= static_cast<int>(m_columnNames.size())) {
        throw std::out_of_range("Invalid row or column index");
    }

    m_data[row][col] = value;
}

// Additional helper functions

bool DataModelManager::IsNumericColumn(const std::string& columnName) const {
    std::vector<std::string> columnData = GetColumnData(columnName);
    return DataAnalysisUtils::IsNumericVector(columnData);
}

std::vector<double> DataModelManager::GetNumericColumnData(const std::string& columnName) const {
    std::vector<std::string> columnData = GetColumnData(columnName);
    if (!DataAnalysisUtils::IsNumericVector(columnData)) {
        throw std::invalid_argument("Column is not numeric");
    }
    return DataAnalysisUtils::ConvertToNumeric(columnData);
}

void DataModelManager::SortByColumn(const std::string& columnName, bool ascending) {
    int index = GetColumnIndex(columnName);
    if (index == -1) {
        throw std::invalid_argument("Column not found");
    }

    std::sort(m_data.begin(), m_data.end(),
        [index, ascending](const std::vector<std::string>& a, const std::vector<std::string>& b) {
            return ascending ? a[index] < b[index] : a[index] > b[index];
        });
}

std::vector<std::vector<std::string>> DataModelManager::FilterData(
    const std::string& columnName,
    const std::function<bool(const std::string&)>& predicate) const {
    int index = GetColumnIndex(columnName);
    if (index == -1) {
        throw std::invalid_argument("Column not found");
    }

    std::vector<std::vector<std::string>> filteredData;
    for (const auto& row : m_data) {
        if (predicate(row[index])) {
            filteredData.push_back(row);
        }
    }
    return filteredData;
}