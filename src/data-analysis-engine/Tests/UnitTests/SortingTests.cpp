#include <gtest/gtest.h>
#include <vector>
#include <string>
#include <chrono>
#include <random>
#include "../Sorting/DataSorter.h"
#include "../DataAnalysisEngine.h"

class SortingTests : public ::testing::Test {
protected:
    DataSorter dataSorter;
    DataAnalysisEngine dataAnalysisEngine;
};

// Test case for sorting numeric data in ascending order
TEST_F(SortingTests, SortNumericAscending) {
    std::vector<double> data = {5.5, 1.2, 3.7, 2.1, 4.8};
    std::vector<double> expected = {1.2, 2.1, 3.7, 4.8, 5.5};
    
    auto result = dataSorter.SortData(data, true);
    EXPECT_EQ(result, expected);
}

// Test case for sorting numeric data in descending order
TEST_F(SortingTests, SortNumericDescending) {
    std::vector<double> data = {5.5, 1.2, 3.7, 2.1, 4.8};
    std::vector<double> expected = {5.5, 4.8, 3.7, 2.1, 1.2};
    
    auto result = dataSorter.SortData(data, false);
    EXPECT_EQ(result, expected);
}

// Test case for sorting string data
TEST_F(SortingTests, SortStringData) {
    std::vector<std::string> data = {"banana", "apple", "cherry", "date", "elderberry"};
    std::vector<std::string> expected = {"apple", "banana", "cherry", "date", "elderberry"};
    
    auto result = dataSorter.SortData(data);
    EXPECT_EQ(result, expected);
}

// Test case for sorting date data
TEST_F(SortingTests, SortDateData) {
    std::vector<std::string> data = {"2023-05-15", "2022-12-31", "2023-01-01", "2022-06-30", "2023-03-15"};
    std::vector<std::string> expected = {"2022-06-30", "2022-12-31", "2023-01-01", "2023-03-15", "2023-05-15"};
    
    auto result = dataSorter.SortData(data);
    EXPECT_EQ(result, expected);
}

// Test case for sorting an empty vector
TEST_F(SortingTests, SortEmptyVector) {
    std::vector<int> data;
    std::vector<int> expected;
    
    auto result = dataSorter.SortData(data);
    EXPECT_EQ(result, expected);
}

// Test case for sorting a large dataset to verify performance
TEST_F(SortingTests, SortLargeDataset) {
    const int dataSize = 1000000;
    std::vector<int> data(dataSize);
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, 1000000);

    for (int i = 0; i < dataSize; ++i) {
        data[i] = dis(gen);
    }

    auto start = std::chrono::high_resolution_clock::now();
    auto result = dataSorter.SortData(data);
    auto end = std::chrono::high_resolution_clock::now();

    std::chrono::duration<double> elapsed = end - start;

    EXPECT_TRUE(std::is_sorted(result.begin(), result.end()));
    EXPECT_LE(elapsed.count(), 1.0); // Assuming sorting should take less than 1 second
}

// Test case for sorting a 2D vector (table) based on a specific column
TEST_F(SortingTests, Sort2DVector) {
    std::vector<std::vector<int>> data = {
        {3, 2, 1},
        {1, 3, 2},
        {2, 1, 3}
    };
    std::vector<std::vector<int>> expected = {
        {1, 3, 2},
        {2, 1, 3},
        {3, 2, 1}
    };

    auto result = dataSorter.SortByColumn(data, 0);
    EXPECT_EQ(result, expected);
}

// Test case for custom sorting using a user-defined comparator
TEST_F(SortingTests, CustomSort) {
    struct Person {
        std::string name;
        int age;
    };

    std::vector<Person> data = {
        {"Alice", 30},
        {"Bob", 25},
        {"Charlie", 35}
    };

    auto comparator = [](const Person& a, const Person& b) {
        return a.age < b.age;
    };

    auto result = dataSorter.CustomSort(data, comparator);

    EXPECT_EQ(result[0].name, "Bob");
    EXPECT_EQ(result[1].name, "Alice");
    EXPECT_EQ(result[2].name, "Charlie");
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}