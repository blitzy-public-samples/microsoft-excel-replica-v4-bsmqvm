#ifndef DATA_MODEL_MANAGER_H
#define DATA_MODEL_MANAGER_H

#include <vector>
#include <string>
#include <map>
#include "../Interfaces/IDataAnalysisEngine.h"
#include "../Utils/DataAnalysisUtils.h"

namespace Microsoft::Excel::DataAnalysisEngine {

/**
 * @class DataModelManager
 * @brief Manages the data model for the Data Analysis Engine component of Microsoft Excel.
 * 
 * This class is responsible for managing the data model within the Data Analysis Engine,
 * providing methods for data manipulation and analysis. It addresses the requirements
 * of efficient data management, complex calculations, and high performance for large datasets.
 */
class DataModelManager {
public:
    /**
     * @brief Default constructor for the DataModelManager class.
     */
    DataModelManager();

    /**
     * @brief Loads data into the data model.
     * @param data The data to be loaded into the model.
     * @param columnNames The names of the columns in the data.
     */
    void LoadData(const std::vector<std::vector<std::string>>& data, const std::vector<std::string>& columnNames);

    /**
     * @brief Retrieves the current data model.
     * @return A const reference to the current data model.
     */
    const std::vector<std::vector<std::string>>& GetData() const;

    /**
     * @brief Retrieves the column names of the data model.
     * @return A const reference to the vector of column names.
     */
    const std::vector<std::string>& GetColumnNames() const;

    /**
     * @brief Adds a new column to the data model.
     * @param columnName The name of the new column.
     * @param columnData The data for the new column.
     */
    void AddColumn(const std::string& columnName, const std::vector<std::string>& columnData);

    /**
     * @brief Removes a column from the data model.
     * @param columnName The name of the column to be removed.
     */
    void RemoveColumn(const std::string& columnName);

    /**
     * @brief Retrieves the index of a column by its name.
     * @param columnName The name of the column.
     * @return The index of the column, or -1 if not found.
     */
    int GetColumnIndex(const std::string& columnName) const;

    /**
     * @brief Retrieves the data of a specific column.
     * @param columnName The name of the column.
     * @return A vector containing the column data.
     */
    std::vector<std::string> GetColumnData(const std::string& columnName) const;

    /**
     * @brief Updates the value of a specific cell in the data model.
     * @param row The row index of the cell.
     * @param col The column index of the cell.
     * @param value The new value for the cell.
     */
    void UpdateCell(int row, int col, const std::string& value);

private:
    std::vector<std::vector<std::string>> m_dataModel; ///< The main data storage for the model.
    std::vector<std::string> m_columnNames; ///< The names of the columns in the data model.

    /**
     * @brief Validates the input data before loading it into the model.
     * @param data The data to be validated.
     * @param columnNames The column names to be validated.
     * @return True if the data is valid, false otherwise.
     */
    bool ValidateInputData(const std::vector<std::vector<std::string>>& data, const std::vector<std::string>& columnNames) const;

    /**
     * @brief Ensures that the data model maintains its integrity after operations.
     */
    void EnsureDataIntegrity();
};

} // namespace Microsoft::Excel::DataAnalysisEngine

#endif // DATA_MODEL_MANAGER_H