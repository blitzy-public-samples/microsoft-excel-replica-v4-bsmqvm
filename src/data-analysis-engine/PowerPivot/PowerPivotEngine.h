#ifndef POWER_PIVOT_ENGINE_H
#define POWER_PIVOT_ENGINE_H

#include <vector>
#include <string>
#include <map>
#include <memory>
#include "../Interfaces/IDataAnalysisEngine.h"
#include "../DataModel/DataModelManager.h"
#include "../Utils/DataAnalysisUtils.h"

namespace Excel::DataAnalysis {

// Forward declaration
class DataModelManager;

/**
 * @class PowerPivotEngine
 * @brief This class implements advanced data modeling and analysis capabilities,
 *        extending the functionality of the core DataAnalysisEngine.
 */
class PowerPivotEngine : public IDataAnalysisEngine {
public:
    /**
     * @brief Default constructor for the PowerPivotEngine class.
     */
    PowerPivotEngine();

    /**
     * @brief Loads data into a new table in the PowerPivot data model.
     * @param data The data to be loaded into the table.
     * @param columnNames The names of the columns in the table.
     * @param tableName The name of the table to be created.
     */
    void LoadData(const std::vector<std::vector<std::string>>& data,
                  const std::vector<std::string>& columnNames,
                  const std::string& tableName);

    /**
     * @brief Creates a relationship between two tables in the data model.
     * @param sourceTable The name of the source table.
     * @param sourceColumn The name of the column in the source table.
     * @param targetTable The name of the target table.
     * @param targetColumn The name of the column in the target table.
     */
    void CreateRelationship(const std::string& sourceTable,
                            const std::string& sourceColumn,
                            const std::string& targetTable,
                            const std::string& targetColumn);

    /**
     * @brief Creates a calculated column in a table using a DAX formula.
     * @param tableName The name of the table where the column will be added.
     * @param columnName The name of the new calculated column.
     * @param formula The DAX formula to calculate the column values.
     */
    void CreateCalculatedColumn(const std::string& tableName,
                                const std::string& columnName,
                                const std::string& formula);

    /**
     * @brief Creates a measure using a DAX formula.
     * @param measureName The name of the new measure.
     * @param formula The DAX formula to calculate the measure.
     */
    void CreateMeasure(const std::string& measureName,
                       const std::string& formula);

    /**
     * @brief Generates a pivot table based on the specified fields and measures.
     * @param baseTable The name of the base table for the pivot table.
     * @param rowFields The fields to be used as row labels.
     * @param columnFields The fields to be used as column labels.
     * @param valueFields The fields or measures to be used as values.
     * @return A 2D vector representing the generated pivot table.
     */
    std::vector<std::vector<std::string>> GeneratePivotTable(
        const std::string& baseTable,
        const std::vector<std::string>& rowFields,
        const std::vector<std::string>& columnFields,
        const std::vector<std::string>& valueFields);

    /**
     * @brief Executes a custom DAX query on the data model.
     * @param daxQuery The DAX query to be executed.
     * @return A 2D vector containing the query results.
     */
    std::vector<std::vector<std::string>> ExecuteDAXQuery(const std::string& daxQuery);

private:
    std::unique_ptr<DataModelManager> m_dataModel;
    std::vector<Relationship> m_relationships;

    // Helper methods (to be implemented)
    void ValidateDataModel() const;
    void UpdateRelationships();
    void OptimizeDataModel();
};

} // namespace Excel::DataAnalysis

#endif // POWER_PIVOT_ENGINE_H