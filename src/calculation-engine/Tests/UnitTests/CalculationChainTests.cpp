#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include <memory>
#include <vector>
#include "../../CalculationChain/CalculationChain.h"
#include "../../Interfaces/ICalculationChain.h"
#include "../../../core-engine/DataStructures/Cell.h"
#include "../../ErrorHandling/CalculationErrors.h"

using namespace testing;
using namespace std;

class CalculationChainTest : public Test {
protected:
    unique_ptr<CalculationChain> calculationChain;
    vector<shared_ptr<Cell>> mockCells;

    void SetUp() override {
        calculationChain = make_unique<CalculationChain>();
        // Create mock cells for testing
        for (int i = 0; i < 5; ++i) {
            mockCells.push_back(make_shared<Cell>());
        }
    }

    void TearDown() override {
        mockCells.clear();
        calculationChain.reset();
    }
};

TEST_F(CalculationChainTest, TestAddCell) {
    auto cell = make_shared<Cell>();
    EXPECT_NO_THROW(calculationChain->AddCell(cell));
    // Verify cell is added to the calculation chain
    // This would require exposing some internal state or a method to check if a cell is in the chain
    // For now, we'll just check that the operation doesn't throw an exception
}

TEST_F(CalculationChainTest, TestRemoveCell) {
    auto cell = make_shared<Cell>();
    calculationChain->AddCell(cell);
    EXPECT_NO_THROW(calculationChain->RemoveCell(cell));
    // Verify cell is removed from the calculation chain
    // Similar to AddCell, this would require exposing some internal state
}

TEST_F(CalculationChainTest, TestUpdateDependencies) {
    auto cellA = make_shared<Cell>();
    auto cellB = make_shared<Cell>();
    auto cellC = make_shared<Cell>();

    calculationChain->AddCell(cellA);
    calculationChain->AddCell(cellB);
    calculationChain->AddCell(cellC);

    vector<shared_ptr<Cell>> dependencies = {cellB, cellC};
    EXPECT_NO_THROW(calculationChain->UpdateDependencies(cellA, dependencies));
    // Verify dependencies are correctly updated
    // This would require a method to retrieve dependencies for a cell
}

TEST_F(CalculationChainTest, TestGetCalculationOrder) {
    for (const auto& cell : mockCells) {
        calculationChain->AddCell(cell);
    }

    // Set up some dependencies
    calculationChain->UpdateDependencies(mockCells[0], {mockCells[1], mockCells[2]});
    calculationChain->UpdateDependencies(mockCells[1], {mockCells[3]});
    calculationChain->UpdateDependencies(mockCells[2], {mockCells[4]});

    auto order = calculationChain->GetCalculationOrder();
    EXPECT_EQ(order.size(), mockCells.size());
    // Verify the order is correct based on dependencies
    // The exact order may vary, but we can check some constraints
    auto it0 = find(order.begin(), order.end(), mockCells[0]);
    auto it1 = find(order.begin(), order.end(), mockCells[1]);
    auto it2 = find(order.begin(), order.end(), mockCells[2]);
    auto it3 = find(order.begin(), order.end(), mockCells[3]);
    auto it4 = find(order.begin(), order.end(), mockCells[4]);

    EXPECT_TRUE(it0 > it1 && it0 > it2);
    EXPECT_TRUE(it1 > it3);
    EXPECT_TRUE(it2 > it4);
}

TEST_F(CalculationChainTest, TestInvalidateCell) {
    for (const auto& cell : mockCells) {
        calculationChain->AddCell(cell);
    }

    calculationChain->UpdateDependencies(mockCells[0], {mockCells[1], mockCells[2]});
    EXPECT_NO_THROW(calculationChain->InvalidateCell(mockCells[1]));
    // Verify that the cell and its dependents are marked for recalculation
    // This would require a method to check the invalidation status of cells
}

TEST_F(CalculationChainTest, TestRecalculateChain) {
    for (const auto& cell : mockCells) {
        calculationChain->AddCell(cell);
    }

    calculationChain->UpdateDependencies(mockCells[0], {mockCells[1], mockCells[2]});
    calculationChain->InvalidateCell(mockCells[1]);

    EXPECT_NO_THROW(calculationChain->RecalculateChain());
    // Verify that all invalidated cells and their dependents are recalculated
    // This would require a method to check the calculation status of cells
}

TEST_F(CalculationChainTest, TestCircularDependency) {
    auto cellA = make_shared<Cell>();
    auto cellB = make_shared<Cell>();
    auto cellC = make_shared<Cell>();

    calculationChain->AddCell(cellA);
    calculationChain->AddCell(cellB);
    calculationChain->AddCell(cellC);

    calculationChain->UpdateDependencies(cellA, {cellB});
    calculationChain->UpdateDependencies(cellB, {cellC});
    
    EXPECT_THROW(calculationChain->UpdateDependencies(cellC, {cellA}), CalculationError);
    // Verify that circular dependency is detected and handled appropriately
}

TEST_F(CalculationChainTest, TestLargeDataset) {
    const int LARGE_DATASET_SIZE = 10000;
    vector<shared_ptr<Cell>> largeCellSet;

    for (int i = 0; i < LARGE_DATASET_SIZE; ++i) {
        auto cell = make_shared<Cell>();
        largeCellSet.push_back(cell);
        calculationChain->AddCell(cell);
    }

    // Create a complex dependency structure
    for (int i = 0; i < LARGE_DATASET_SIZE - 1; ++i) {
        calculationChain->UpdateDependencies(largeCellSet[i], {largeCellSet[i+1]});
    }

    auto start = chrono::high_resolution_clock::now();
    calculationChain->InvalidateCell(largeCellSet[0]);
    calculationChain->RecalculateChain();
    auto end = chrono::high_resolution_clock::now();

    auto duration = chrono::duration_cast<chrono::milliseconds>(end - start);
    cout << "Large dataset recalculation took " << duration.count() << " milliseconds" << endl;

    // Assert that the operation completes within a reasonable time frame
    // The exact time will depend on the hardware, but we can set a generous upper limit
    EXPECT_LT(duration.count(), 5000); // Assuming it should take less than 5 seconds
}

// Additional tests can be added here to cover more scenarios and edge cases