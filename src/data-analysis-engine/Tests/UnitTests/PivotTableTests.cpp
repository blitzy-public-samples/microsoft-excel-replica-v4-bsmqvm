#include <gtest/gtest.h>
#include <vector>
#include <string>
#include "../PivotTables/PivotTableGenerator.h"
#include "../Utils/DataAnalysisUtils.h"

class PivotTableTests : public ::testing::Test {
protected:
    PivotTableGenerator pivotTableGenerator;
    std::vector<std::vector<std::string>> sampleData;

    void SetUp() override {
        // Set up sample data for tests
        sampleData = {
            {"Date", "Product", "Region", "Sales"},
            {"2023-01-01", "Widget A", "North", "100"},
            {"2023-01-01", "Widget B", "South", "150"},
            {"2023-01-02", "Widget A", "South", "120"},
            {"2023-01-02", "Widget B", "North", "80"},
            {"2023-01-03", "Widget A", "North", "90"},
        };
    }
};

TEST_F(PivotTableTests, SetupPivotTableGenerator) {
    EXPECT_NO_THROW(PivotTableGenerator());
    EXPECT_TRUE(pivotTableGenerator.GetConfiguration().empty());
}

TEST_F(PivotTableTests, SetSourceData) {
    EXPECT_NO_THROW(pivotTableGenerator.SetSourceData(sampleData));
    EXPECT_EQ(pivotTableGenerator.GetSourceData().size(), sampleData.size());
}

TEST_F(PivotTableTests, AddRowField) {
    pivotTableGenerator.SetSourceData(sampleData);
    EXPECT_NO_THROW(pivotTableGenerator.AddRowField(1)); // Product
    auto config = pivotTableGenerator.GetConfiguration();
    EXPECT_EQ(config.rowFields.size(), 1);
    EXPECT_EQ(config.rowFields[0], 1);
}

TEST_F(PivotTableTests, AddColumnField) {
    pivotTableGenerator.SetSourceData(sampleData);
    EXPECT_NO_THROW(pivotTableGenerator.AddColumnField(2)); // Region
    auto config = pivotTableGenerator.GetConfiguration();
    EXPECT_EQ(config.columnFields.size(), 1);
    EXPECT_EQ(config.columnFields[0], 2);
}

TEST_F(PivotTableTests, AddValueField) {
    pivotTableGenerator.SetSourceData(sampleData);
    EXPECT_NO_THROW(pivotTableGenerator.AddValueField(3, AggregationFunction::SUM)); // Sales
    auto config = pivotTableGenerator.GetConfiguration();
    EXPECT_EQ(config.valueFields.size(), 1);
    EXPECT_EQ(config.valueFields[0].fieldIndex, 3);
    EXPECT_EQ(config.valueFields[0].aggregation, AggregationFunction::SUM);
}

TEST_F(PivotTableTests, GeneratePivotTable) {
    pivotTableGenerator.SetSourceData(sampleData);
    pivotTableGenerator.AddRowField(1); // Product
    pivotTableGenerator.AddColumnField(2); // Region
    pivotTableGenerator.AddValueField(3, AggregationFunction::SUM); // Sales

    auto pivotTable = pivotTableGenerator.GeneratePivotTable();
    EXPECT_FALSE(pivotTable.empty());
    EXPECT_EQ(pivotTable.size(), 3); // Header + 2 products
    EXPECT_EQ(pivotTable[0].size(), 3); // Empty cell + 2 regions
}

TEST_F(PivotTableTests, ClearConfiguration) {
    pivotTableGenerator.SetSourceData(sampleData);
    pivotTableGenerator.AddRowField(1);
    pivotTableGenerator.AddColumnField(2);
    pivotTableGenerator.AddValueField(3, AggregationFunction::SUM);

    EXPECT_NO_THROW(pivotTableGenerator.ClearConfiguration());
    auto config = pivotTableGenerator.GetConfiguration();
    EXPECT_TRUE(config.rowFields.empty());
    EXPECT_TRUE(config.columnFields.empty());
    EXPECT_TRUE(config.valueFields.empty());
}

TEST_F(PivotTableTests, LargeDatasetPerformance) {
    // Generate a large dataset
    std::vector<std::vector<std::string>> largeData;
    largeData.push_back({"Date", "Product", "Region", "Sales"});
    for (int i = 0; i < 100000; ++i) {
        largeData.push_back({
            "2023-01-01",
            "Product" + std::to_string(i % 100),
            "Region" + std::to_string(i % 10),
            std::to_string(100 + (i % 1000))
        });
    }

    pivotTableGenerator.SetSourceData(largeData);
    pivotTableGenerator.AddRowField(1); // Product
    pivotTableGenerator.AddColumnField(2); // Region
    pivotTableGenerator.AddValueField(3, AggregationFunction::SUM); // Sales

    auto start = std::chrono::high_resolution_clock::now();
    auto pivotTable = pivotTableGenerator.GeneratePivotTable();
    auto end = std::chrono::high_resolution_clock::now();

    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    std::cout << "Large dataset pivot table generation took " << duration.count() << " ms" << std::endl;

    EXPECT_FALSE(pivotTable.empty());
    EXPECT_LE(duration.count(), 5000); // Expect generation to take less than 5 seconds
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}