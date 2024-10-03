import { ChartTypes } from '../types/chart-types';
import { AxisOptions } from '../types/chart-options';
import { calculateAxisRange } from '../utils/math-utils';
import { formatAxisLabel } from '../utils/formatting-utils';
import { ThemeManager } from '../themes/theme-manager';

/**
 * AxisManager class
 * Responsible for managing and rendering chart axes in the Microsoft Excel charting engine.
 */
export class AxisManager {
    private axisType: string;
    private scale: string;
    private range: { min: number; max: number };
    private ticks: number[];
    private labels: string[];

    /**
     * Initializes a new instance of the AxisManager class.
     * @param options - The axis configuration options
     */
    constructor(options: AxisOptions) {
        this.axisType = options.type || 'linear';
        this.scale = options.scale || 'linear';
        this.range = { min: 0, max: 0 };
        this.ticks = [];
        this.labels = [];

        this.setRange(options.min || 0, options.max || 100);
        this.calculateTicks();
        this.formatLabels();
    }

    /**
     * Sets the data range for the axis.
     * @param min - The minimum value of the axis range
     * @param max - The maximum value of the axis range
     */
    public setRange(min: number, max: number): void {
        this.range = calculateAxisRange(min, max);
        this.calculateTicks();
        this.formatLabels();
    }

    /**
     * Calculates the tick values for the axis based on the current range and scale.
     */
    private calculateTicks(): void {
        const tickCount = 5; // Default number of ticks
        const range = this.range.max - this.range.min;
        const tickInterval = range / (tickCount - 1);

        this.ticks = [];
        for (let i = 0; i < tickCount; i++) {
            let tickValue = this.range.min + i * tickInterval;
            if (this.scale === 'logarithmic') {
                tickValue = Math.pow(10, tickValue);
            }
            this.ticks.push(tickValue);
        }
    }

    /**
     * Formats the labels for each tick value.
     */
    private formatLabels(): void {
        this.labels = this.ticks.map(tick => formatAxisLabel(tick, this.axisType));
    }

    /**
     * Renders the axis on the chart canvas.
     * @param ctx - The canvas rendering context
     * @param chartArea - The chart area dimensions
     */
    public render(ctx: CanvasRenderingContext2D, chartArea: { x: number; y: number; width: number; height: number }): void {
        const theme = ThemeManager.getCurrentTheme();
        
        // Apply theme-based styling
        ctx.strokeStyle = theme.axisColor;
        ctx.fillStyle = theme.axisLabelColor;
        ctx.font = theme.axisLabelFont;

        // Draw the main axis line
        ctx.beginPath();
        ctx.moveTo(chartArea.x, chartArea.y + chartArea.height);
        ctx.lineTo(chartArea.x + chartArea.width, chartArea.y + chartArea.height);
        ctx.stroke();

        // Draw ticks and labels
        this.ticks.forEach((tick, index) => {
            const x = chartArea.x + (index / (this.ticks.length - 1)) * chartArea.width;
            const y = chartArea.y + chartArea.height;

            // Draw tick
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 5);
            ctx.stroke();

            // Draw label
            ctx.fillText(this.labels[index], x, y + 20);
        });

        // Draw axis title
        ctx.fillText(this.axisType === 'x' ? 'X-Axis' : 'Y-Axis', chartArea.x + chartArea.width / 2, chartArea.y + chartArea.height + 40);

        // Draw grid lines (if enabled)
        if (theme.showGridLines) {
            ctx.strokeStyle = theme.gridLineColor;
            this.ticks.forEach((tick, index) => {
                const x = chartArea.x + (index / (this.ticks.length - 1)) * chartArea.width;
                ctx.beginPath();
                ctx.moveTo(x, chartArea.y);
                ctx.lineTo(x, chartArea.y + chartArea.height);
                ctx.stroke();
            });
        }
    }
}