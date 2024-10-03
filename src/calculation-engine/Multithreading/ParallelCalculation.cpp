#include "ParallelCalculation.h"
#include "src/calculation-engine/Interfaces/ICalculationChain.h"
#include "src/calculation-engine/Optimization/CalculationOptimizer.h"
#include "src/core-engine/DataStructures/Cell.h"
#include "src/core-engine/DataStructures/Worksheet.h"

#include <thread>
#include <mutex>
#include <condition_variable>
#include <vector>
#include <queue>
#include <atomic>

class ParallelCalculation {
private:
    std::vector<std::thread> m_threads;
    std::queue<Cell*> m_taskQueue;
    std::mutex m_queueMutex;
    std::condition_variable m_condition;
    std::atomic<bool> m_isRunning;
    size_t m_threadCount;
    ICalculationChain* m_calculationChain;
    CalculationOptimizer* m_optimizer;

public:
    void Initialize(size_t threadCount) {
        m_threadCount = threadCount;
        m_isRunning = true;

        // Create and initialize worker threads
        for (size_t i = 0; i < m_threadCount; ++i) {
            m_threads.emplace_back(&ParallelCalculation::WorkerThread, this);
        }

        // Set up calculation chain and optimizer
        m_calculationChain = new ICalculationChain(); // Assuming default constructor
        m_optimizer = new CalculationOptimizer(); // Assuming default constructor
    }

    void CalculateWorksheet(const Worksheet& worksheet) {
        // Distribute cells from worksheet to task queue
        std::vector<Cell*> cells = worksheet.GetAllCells();
        DistributeTasks(cells);

        // Trigger worker threads to start processing
        m_condition.notify_all();

        // Wait for all calculations to complete
        WaitForCompletion();
    }

    void CalculateRange(const CellRange& range) {
        // Extract cells from the specified range
        std::vector<Cell*> cells = range.GetCells();

        // Distribute cells to task queue
        DistributeTasks(cells);

        // Trigger worker threads to start processing
        m_condition.notify_all();

        // Wait for range calculations to complete
        WaitForCompletion();
    }

    void Shutdown() {
        // Signal all threads to stop
        m_isRunning = false;
        m_condition.notify_all();

        // Wait for all threads to finish their current tasks
        for (auto& thread : m_threads) {
            if (thread.joinable()) {
                thread.join();
            }
        }

        // Clean up resources
        delete m_calculationChain;
        delete m_optimizer;
    }

private:
    void WorkerThread() {
        while (m_isRunning) {
            Cell* cell = nullptr;
            {
                std::unique_lock<std::mutex> lock(m_queueMutex);
                m_condition.wait(lock, [this] { return !m_taskQueue.empty() || !m_isRunning; });
                if (!m_isRunning) break;
                cell = m_taskQueue.front();
                m_taskQueue.pop();
            }

            if (cell) {
                // Calculate the cell value
                CalculateCell(cell);
            }
        }
    }

    void DistributeTasks(const std::vector<Cell*>& cells) {
        // Use the calculation optimizer to determine optimal task order
        std::vector<Cell*> optimizedCells = m_optimizer->OptimizeCellOrder(cells);

        // Add cells to the task queue
        std::unique_lock<std::mutex> lock(m_queueMutex);
        for (Cell* cell : optimizedCells) {
            m_taskQueue.push(cell);
        }
    }

    void CalculateCell(Cell* cell) {
        // Implement cell calculation logic here
        // This should use the calculation chain to resolve dependencies
        m_calculationChain->CalculateCell(cell);
    }

    void WaitForCompletion() {
        // Wait until the task queue is empty
        std::unique_lock<std::mutex> lock(m_queueMutex);
        m_condition.wait(lock, [this] { return m_taskQueue.empty(); });
    }
};

// Implement the global functions
void Initialize(size_t threadCount) {
    ParallelCalculation& instance = GetInstance();
    instance.Initialize(threadCount);
}

void CalculateWorksheet(const Worksheet& worksheet) {
    ParallelCalculation& instance = GetInstance();
    instance.CalculateWorksheet(worksheet);
}

void CalculateRange(const CellRange& range) {
    ParallelCalculation& instance = GetInstance();
    instance.CalculateRange(range);
}

void Shutdown() {
    ParallelCalculation& instance = GetInstance();
    instance.Shutdown();
}

// Singleton instance getter
ParallelCalculation& GetInstance() {
    static ParallelCalculation instance;
    return instance;
}