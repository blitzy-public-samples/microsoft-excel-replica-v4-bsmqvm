#ifndef PARALLEL_CALCULATION_H
#define PARALLEL_CALCULATION_H

#include <memory>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <vector>
#include <queue>
#include <atomic>
#include "../Interfaces/ICalculationChain.h"
#include "../Optimization/CalculationOptimizer.h"
#include "../../core-engine/DataStructures/Cell.h"
#include "../../core-engine/DataStructures/Worksheet.h"

namespace ExcelCalculationEngine {

class ParallelCalculation {
public:
    // Constructor
    ParallelCalculation();

    // Destructor
    ~ParallelCalculation();

    // Initialize the parallel calculation system
    void Initialize(size_t threadCount);

    // Perform parallel calculation of all cells in a worksheet
    void CalculateWorksheet(const Worksheet& worksheet);

    // Perform parallel calculation of cells within a specified range
    void CalculateRange(const CellRange& range);

    // Shut down the parallel calculation system
    void Shutdown();

private:
    // The main function executed by each worker thread
    void WorkerThread();

    // Distribute calculation tasks among worker threads
    void DistributeTasks(const std::vector<Cell>& cells);

    // Member variables
    std::shared_ptr<ICalculationChain> m_calculationChain;
    std::unique_ptr<CalculationOptimizer> m_optimizer;
    std::vector<std::thread> m_threads;
    std::queue<Cell> m_taskQueue;
    std::mutex m_mutex;
    std::condition_variable m_conditionVariable;
    std::atomic<bool> m_isRunning;
};

} // namespace ExcelCalculationEngine

#endif // PARALLEL_CALCULATION_H