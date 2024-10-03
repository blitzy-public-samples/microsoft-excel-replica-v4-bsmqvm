#include <gtest/gtest.h>
#include <vector>
#include <string>
#include "../Filtering/DataFilter.h"
#include "../DataAnalysisEngine.h"

// Test fixture for DataFilter tests
class DataFilterTest : public ::testing::Test {
protected:
    DataFilter dataFilter;
    DataAnalysisEngine dataAnalysisEngine;

    void SetUp() override {
        // Common setup for all tests
    }

    void TearDown() override {
        // Common cleanup for all tests
    }
};

TEST_F(DataFilterTest, FilterNumericData) {
    // Initialize test data with numeric values
    std::vector<double> testData = {1.0, 2.5, 3.0, 4.5, 5.0, 6.5, 7.0, 8.5, 9.0, 10.5};

    // Apply numeric filtering conditions (e.g., greater than, less than)
    auto greaterThanFive = dataFilter.filterNumeric(testData, [](double value) { return value > 5.0; });
    auto lessThanSeven = dataFilter.filterNumeric(testData, [](double value) { return value < 7.0; });

    // Verify filtered results using ASSERT macros
    ASSERT_EQ(greaterThanFive.size(), 5);
    ASSERT_EQ(lessThanSeven.size(), 6);

    ASSERT_DOUBLE_EQ(greaterThanFive[0], 6.5);
    ASSERT_DOUBLE_EQ(greaterThanFive[4], 10.5);

    ASSERT_DOUBLE_EQ(lessThanSeven[0], 1.0);
    ASSERT_DOUBLE_EQ(lessThanSeven[5], 6.5);
}

TEST_F(DataFilterTest, FilterStringData) {
    // Initialize test data with string values
    std::vector<std::string> testData = {"apple", "banana", "cherry", "date", "elderberry", "fig", "grape"};

    // Apply string filtering conditions (e.g., contains, starts with)
    auto containsA = dataFilter.filterString(testData, [](const std::string& value) { return value.find('a') != std::string::npos; });
    auto startsWithB = dataFilter.filterString(testData, [](const std::string& value) { return value[0] == 'b'; });

    // Verify filtered results using ASSERT macros
    ASSERT_EQ(containsA.size(), 3);
    ASSERT_EQ(startsWithB.size(), 1);

    ASSERT_EQ(containsA[0], "apple");
    ASSERT_EQ(containsA[1], "banana");
    ASSERT_EQ(containsA[2], "grape");

    ASSERT_EQ(startsWithB[0], "banana");
}

TEST_F(DataFilterTest, FilterCustom) {
    // Initialize test data
    std::vector<int> testData = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // Define custom predicate function
    auto isEven = [](int value) { return value % 2 == 0; };

    // Apply custom filtering
    auto evenNumbers = dataFilter.filterCustom(testData, isEven);

    // Verify filtered results using ASSERT macros
    ASSERT_EQ(evenNumbers.size(), 5);
    ASSERT_EQ(evenNumbers[0], 2);
    ASSERT_EQ(evenNumbers[1], 4);
    ASSERT_EQ(evenNumbers[2], 6);
    ASSERT_EQ(evenNumbers[3], 8);
    ASSERT_EQ(evenNumbers[4], 10);
}

TEST_F(DataFilterTest, FilterEmptyData) {
    // Initialize empty test data
    std::vector<int> emptyData;

    // Apply filtering on empty dataset
    auto filteredData = dataFilter.filterNumeric(emptyData, [](int value) { return value > 0; });

    // Verify handling of empty data using ASSERT macros
    ASSERT_TRUE(filteredData.empty());
}

TEST_F(DataFilterTest, FilterLargeDataset) {
    // Generate large test dataset
    const int dataSize = 1000000;
    std::vector<int> largeData(dataSize);
    for (int i = 0; i < dataSize; ++i) {
        largeData[i] = i;
    }

    // Measure execution time of filtering operation
    auto start = std::chrono::high_resolution_clock::now();

    // Apply filtering on large dataset
    auto filteredData = dataFilter.filterNumeric(largeData, [](int value) { return value % 2 == 0; });

    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);

    // Verify performance meets requirements using ASSERT macros
    ASSERT_EQ(filteredData.size(), dataSize / 2);
    ASSERT_LT(duration.count(), 1000); // Assuming the operation should complete within 1 second
}

// Additional tests can be added here to cover more scenarios and edge cases

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}