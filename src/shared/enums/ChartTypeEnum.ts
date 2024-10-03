/**
 * ChartTypeEnum defines the various chart types available in Microsoft Excel.
 * This enum is used to specify the type of chart when creating or manipulating charts.
 */
export enum ChartTypeEnum {
    /**
     * Represents a bar chart
     */
    BAR = 'bar',

    /**
     * Represents a column chart
     */
    COLUMN = 'column',

    /**
     * Represents a line chart
     */
    LINE = 'line',

    /**
     * Represents a pie chart
     */
    PIE = 'pie',

    /**
     * Represents a scatter chart
     */
    SCATTER = 'scatter',

    /**
     * Represents an area chart
     */
    AREA = 'area',

    /**
     * Represents a doughnut chart
     */
    DOUGHNUT = 'doughnut',

    /**
     * Represents a radar chart
     */
    RADAR = 'radar',

    /**
     * Represents a surface chart
     */
    SURFACE = 'surface',

    /**
     * Represents a combo chart (combination of multiple chart types)
     */
    COMBO = 'combo'
}

/**
 * This enum is used in conjunction with the IChart interface to define
 * the structure of chart objects that use the ChartTypeEnum.
 */

// TODO: Implement the IChart interface in a separate file (src/shared/interfaces/IChart.ts)
// when it becomes available. The IChart interface should define the structure
// for chart objects that utilize this ChartTypeEnum.