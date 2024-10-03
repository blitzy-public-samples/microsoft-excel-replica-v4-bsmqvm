#ifndef PIVOT_TABLE_GENERATOR_H
#define PIVOT_TABLE_GENERATOR_H

#include "../Interfaces/IDataAnalysisEngine.h"
#include "../Utils/DataAnalysisUtils.h"
#include <vector>
#include <string>
#include <map>

namespace Microsoft::Excel::DataAnalysis {

class PivotTableGenerator {
public:
    PivotTableGenerator();
    ~PivotTableGenerator();

    // Generates a pivot table based on the current configuration
    std::vector<std::vector<std::string>> GeneratePivotTable();

    // Sets the source data for the pivot table
    void SetSourceData(const std::vector<std::vector<std::string>>& data);

    // Adds a field to be used as a row label
    void AddRowField(int fieldIndex);

    // Adds a field to be used as a column label
    void AddColumnField(int fieldIndex);

    // Adds a field to be used as a value, with a specified aggregation function
    void AddValueField(int fieldIndex, const std::string& aggregationFunction);

    // Clears the current pivot table configuration
    void ClearConfiguration();

private:
    std::vector<std::vector<std::string>> m_sourceData;
    std::vector<int> m_rowFields;
    std::vector<int> m_columnFields;
    std::vector<int> m_valueFields;
    std::map<int, std::string> m_aggregationFunctions;

    // Helper methods
    void ValidateConfiguration() const;
    std::vector<std::vector<std::string>> ProcessData() const;
    std::string AggregateValues(const std::vector<std::string>& values, const std::string& function) const;
};

} // namespace Microsoft::Excel::DataAnalysis

#endif // PIVOT_TABLE_GENERATOR_H