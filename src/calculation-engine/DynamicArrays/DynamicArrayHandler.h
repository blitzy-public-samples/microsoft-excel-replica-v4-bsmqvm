#ifndef DYNAMIC_ARRAY_HANDLER_H
#define DYNAMIC_ARRAY_HANDLER_H

#include <memory>
#include <string>
#include <vector>
#include <variant>

// Forward declarations
class IFormulaParser;
class CalculationChain;
class Cell;
class Range;

class DynamicArrayHandler {
public:
    DynamicArrayHandler(std::shared_ptr<IFormulaParser> formulaParser, std::shared_ptr<CalculationChain> calculationChain);

    std::vector<std::vector<std::variant<double, std::string, bool>>> EvaluateDynamicArray(const std::string& formula, const Cell& originCell);
    void ApplyDynamicArrayResult(const Cell& originCell, const std::vector<std::vector<std::variant<double, std::string, bool>>>& result);
    void UpdateDynamicArrayDependencies(const Cell& originCell, const Range& dependencyRange);
    void HandleSpillError(const Cell& originCell);

private:
    std::shared_ptr<IFormulaParser> formulaParser_;
    std::shared_ptr<CalculationChain> calculationChain_;
};

#endif // DYNAMIC_ARRAY_HANDLER_H