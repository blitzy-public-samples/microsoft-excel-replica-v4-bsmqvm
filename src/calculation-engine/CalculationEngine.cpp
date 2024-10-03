#include "CalculationEngine.h"
#include "ErrorHandling/CalculationErrors.h"
#include <algorithm>
#include <thread>

const int MAX_ITERATION_COUNT = 1000;

CalculationEngine::CalculationEngine(
    std::shared_ptr<IFormulaParser> parser,
    std::shared_ptr<IFunctionLibrary> functionLibrary,
    std::shared_ptr<ICalculationChain> calculationChain)
    : m_formulaParser(std::move(parser)),
      m_functionLibrary(std::move(functionLibrary)),
      m_calculationChain(std::move(calculationChain)),
      m_cache(std::make_unique<FormulaCache>()),
      m_arrayFormulaHandler(std::make_unique<ArrayFormulaHandler>()),
      m_dynamicArrayHandler(std::make_unique<DynamicArrayHandler>()),
      m_calculationOptimizer(std::make_unique<CalculationOptimizer>()),
      m_parallelCalculation(std::make_unique<ParallelCalculation>()) {
}

std::variant<double, std::string, bool> CalculationEngine::Calculate(const std::string& formula, const CellReference& cellRef) {
    try {
        // Check cache first
        if (auto cachedResult = m_cache->Get(formula, cellRef)) {
            return *cachedResult;
        }

        // Parse the formula
        auto parsedFormula = m_formulaParser->Parse(formula);

        // Check if it's an array formula
        if (m_arrayFormulaHandler->IsArrayFormula(parsedFormula)) {
            return m_arrayFormulaHandler->EvaluateArrayFormula(parsedFormula, cellRef, *this);
        }

        // Check if it's a dynamic array formula
        if (m_dynamicArrayHandler->IsDynamicArrayFormula(parsedFormula)) {
            return m_dynamicArrayHandler->EvaluateDynamicArrayFormula(parsedFormula, cellRef, *this);
        }

        // Calculate the result
        auto result = CalculateInternal(parsedFormula, cellRef);

        // Cache the result
        m_cache->Set(formula, cellRef, result);

        return result;
    } catch (const CalculationError& e) {
        // Handle calculation errors
        return e.what();
    } catch (const std::exception& e) {
        // Handle other exceptions
        return std::string("Error: ") + e.what();
    }
}

void CalculationEngine::UpdateCell(const CellReference& cellRef, const std::variant<double, std::string, bool>& value) {
    // Update the cell value
    // (Assuming there's a method to update the cell value in the underlying data structure)
    UpdateCellValue(cellRef, value);

    // Invalidate cache for this cell and its dependents
    m_cache->Invalidate(cellRef);

    // Trigger recalculation of dependent cells
    auto dependentCells = m_calculationChain->GetDependentCells(cellRef);
    for (const auto& depCell : dependentCells) {
        Calculate(GetCellFormula(depCell), depCell);
    }
}

void CalculationEngine::HandleCircularReference(const std::vector<CellReference>& circularCells) {
    // Implement iterative calculation for circular references
    std::vector<std::variant<double, std::string, bool>> previousValues;
    std::vector<std::variant<double, std::string, bool>> currentValues;

    // Initialize previous values
    for (const auto& cell : circularCells) {
        previousValues.push_back(GetCellValue(cell));
    }

    for (int iteration = 0; iteration < MAX_ITERATION_COUNT; ++iteration) {
        currentValues.clear();

        // Calculate new values
        for (const auto& cell : circularCells) {
            currentValues.push_back(Calculate(GetCellFormula(cell), cell));
        }

        // Check for convergence
        if (ValuesConverged(previousValues, currentValues)) {
            // Update cell values and return
            for (size_t i = 0; i < circularCells.size(); ++i) {
                UpdateCellValue(circularCells[i], currentValues[i]);
            }
            return;
        }

        previousValues = currentValues;
    }

    // If we reach here, we've hit the maximum iteration count without convergence
    throw CalculationError("Circular reference did not converge after " + std::to_string(MAX_ITERATION_COUNT) + " iterations");
}

void CalculationEngine::OptimizeCalculation() {
    m_calculationOptimizer->Optimize(m_calculationChain);
}

std::variant<double, std::string, bool> CalculationEngine::CalculateInternal(const ParsedFormula& formula, const CellReference& cellRef) {
    // Implement the core calculation logic here
    // This is a simplified example and should be expanded based on the actual formula structure
    switch (formula.type) {
        case FormulaType::Literal:
            return formula.value;
        case FormulaType::CellReference:
            return GetCellValue(formula.cellRef);
        case FormulaType::Function:
            return EvaluateFunction(formula.functionName, formula.arguments, cellRef);
        case FormulaType::Operator:
            return EvaluateOperator(formula.operatorType, formula.leftOperand, formula.rightOperand, cellRef);
        default:
            throw CalculationError("Unknown formula type");
    }
}

std::variant<double, std::string, bool> CalculationEngine::EvaluateFunction(
    const std::string& functionName,
    const std::vector<ParsedFormula>& arguments,
    const CellReference& cellRef) {
    // Evaluate function arguments
    std::vector<std::variant<double, std::string, bool>> evaluatedArgs;
    for (const auto& arg : arguments) {
        evaluatedArgs.push_back(CalculateInternal(arg, cellRef));
    }

    // Call the function from the function library
    return m_functionLibrary->ExecuteFunction(functionName, evaluatedArgs);
}

std::variant<double, std::string, bool> CalculationEngine::EvaluateOperator(
    OperatorType op,
    const ParsedFormula& left,
    const ParsedFormula& right,
    const CellReference& cellRef) {
    auto leftValue = CalculateInternal(left, cellRef);
    auto rightValue = CalculateInternal(right, cellRef);

    // Implement operator evaluation logic here
    // This is a simplified example and should be expanded to handle all operator types and data types
    if (std::holds_alternative<double>(leftValue) && std::holds_alternative<double>(rightValue)) {
        double l = std::get<double>(leftValue);
        double r = std::get<double>(rightValue);
        switch (op) {
            case OperatorType::Add: return l + r;
            case OperatorType::Subtract: return l - r;
            case OperatorType::Multiply: return l * r;
            case OperatorType::Divide:
                if (r == 0) throw CalculationError("Division by zero");
                return l / r;
            // Add other operators as needed
            default: throw CalculationError("Unsupported operator");
        }
    }
    // Add handling for other data type combinations and operators

    throw CalculationError("Invalid operand types for operator");
}

// Helper functions (these should be implemented elsewhere, e.g., in a CellManager class)
void CalculationEngine::UpdateCellValue(const CellReference& cellRef, const std::variant<double, std::string, bool>& value) {
    // Implementation to update the cell value in the underlying data structure
}

std::variant<double, std::string, bool> CalculationEngine::GetCellValue(const CellReference& cellRef) {
    // Implementation to get the cell value from the underlying data structure
    return 0.0; // Placeholder
}

std::string CalculationEngine::GetCellFormula(const CellReference& cellRef) {
    // Implementation to get the cell formula from the underlying data structure
    return ""; // Placeholder
}

bool CalculationEngine::ValuesConverged(
    const std::vector<std::variant<double, std::string, bool>>& prev,
    const std::vector<std::variant<double, std::string, bool>>& current) {
    // Implement convergence check logic
    // This is a simple example and may need to be more sophisticated in practice
    if (prev.size() != current.size()) return false;

    for (size_t i = 0; i < prev.size(); ++i) {
        if (prev[i].index() != current[i].index()) return false;
        if (std::holds_alternative<double>(prev[i])) {
            if (std::abs(std::get<double>(prev[i]) - std::get<double>(current[i])) > 1e-6) return false;
        } else if (prev[i] != current[i]) {
            return false;
        }
    }
    return true;
}