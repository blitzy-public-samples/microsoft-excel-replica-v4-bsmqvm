#ifndef ICHARTING_ENGINE_H
#define ICHARTING_ENGINE_H

#include <memory>
#include <string>

// Forward declarations
class IChart;
class ChartStyle;

enum class ChartType {
    Bar,
    Line,
    Pie,
    Scatter,
    // Add other chart types as needed
};

enum class RenderTarget {
    Screen,
    Printer,
    File,
    // Add other render targets as needed
};

/**
 * @class IChartingEngine
 * @brief Interface for the Charting Engine, defining core charting operations.
 * 
 * This abstract class provides the contract for creating, manipulating, and rendering
 * various types of charts within the Excel application.
 */
class IChartingEngine {
public:
    /**
     * @brief Virtual destructor for proper cleanup of derived classes.
     */
    virtual ~IChartingEngine() = default;

    /**
     * @brief Creates a new chart of the specified type using the given data range.
     * 
     * @param type The type of chart to create.
     * @param dataRange A string representing the data range for the chart.
     * @return std::unique_ptr<IChart> A unique pointer to the created chart.
     */
    virtual std::unique_ptr<IChart> CreateChart(ChartType type, const std::string& dataRange) = 0;

    /**
     * @brief Updates the data of an existing chart.
     * 
     * @param chart Pointer to the chart to be updated.
     * @param newDataRange A string representing the new data range for the chart.
     */
    virtual void UpdateChartData(IChart* chart, const std::string& newDataRange) = 0;

    /**
     * @brief Applies a specific style to an existing chart.
     * 
     * @param chart Pointer to the chart to which the style will be applied.
     * @param style The style to be applied to the chart.
     */
    virtual void ApplyChartStyle(IChart* chart, const ChartStyle& style) = 0;

    /**
     * @brief Renders a chart to a specified target (e.g., screen, printer, file).
     * 
     * @param chart Pointer to the chart to be rendered.
     * @param target The target to which the chart should be rendered.
     */
    virtual void RenderChart(const IChart* chart, RenderTarget target) = 0;
};

#endif // ICHARTING_ENGINE_H