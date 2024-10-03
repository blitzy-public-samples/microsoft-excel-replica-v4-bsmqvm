#ifndef CALCULATION_ENGINE_H
#define CALCULATION_ENGINE_H

#include <memory>
#include <string>
#include <variant>
#include <mutex>
#include "Interfaces/IFormulaParser.h"
#include "Interfaces/IFunctionLibrary.h"
#include "Interfaces/ICalculationChain.h"
#include "ErrorHandling/CalculationErrors.h"
#include "FormulaParser/FormulaParser.h"
#include "CalculationChain/CalculationChain.h"
#include "ArrayFormulas/ArrayFormulaHandler.h"
#include "DynamicArrays/DynamicArrayHandler.h"
#include "Optimization/CalculationOptimizer.h"
#include "Caching/FormulaCache.h"
#include "Multithreading/ParallelCalculation.h"

namespace Microsoft::Excel::CalculationEngine {

class CalculationEngine {
public:
    // Constructor
    CalculationEngine(std::shared_ptr<IFormulaParser> parser,
                      std::shared_ptr<IFunctionLibrary> library,
                      std::shared_ptr<ICalculationChain> chain);

    // Destructor
    ~CalculationEngine() = default;

    // Deleted copy constructor and assignment operator
    CalculationEngine(const CalculationEngine&) = delete;
    CalculationEngine& operator=(const CalculationEngine&) = delete;

    // Calculate the result of a given formula for a specific cell
    std::variant<double, std::string, bool> Calculate(const std::string& formula, const CellReference& cell);

    // Update a cell's value and trigger recalculation of dependent cells
    void UpdateCell(const CellReference& cell, const std::variant<double, std::string, bool>& value);

    // Recalculate all formulas in the workbook
    void RecalculateAll();

private:
    std::shared_ptr<IFormulaParser> m_formulaParser;
    std::shared_ptr<IFunctionLibrary> m_functionLibrary;
    std::shared_ptr<ICalculationChain> m_calculationChain;
    std::unique_ptr<ArrayFormulaHandler> m_arrayFormulaHandler;
    std::unique_ptr<DynamicArrayHandler> m_dynamicArrayHandler;
    std::unique_ptr<CalculationOptimizer> m_calculationOptimizer;
    std::unique_ptr<FormulaCache> m_formulaCache;
    std::unique_ptr<ParallelCalculation> m_parallelCalculation;
    std::mutex m_mutex;

    // Helper methods
    void InitializeComponents();
    void ValidateInputs(const std::string& formula, const CellReference& cell);
    void HandleCalculationErrors(const CalculationError& error);
    void OptimizeCalculation();
    void UpdateDependentCells(const CellReference& cell);
};

} // namespace Microsoft::Excel::CalculationEngine

#endif // CALCULATION_ENGINE_H