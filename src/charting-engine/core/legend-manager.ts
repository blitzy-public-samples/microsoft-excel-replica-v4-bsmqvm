import { ChartType } from '../types/chart-types';
import { LegendOptions } from '../types/chart-options';
import { getContrastColor } from '../utils/color-utils';
import { formatText } from '../utils/formatting-utils';
import { defaultTheme } from '../themes/default-theme';
import { ChartBase } from './chart-base';
import * as d3 from 'd3-selection';

/**
 * LegendManager class
 * 
 * This class is responsible for managing the legend of a chart. It handles the creation,
 * updating, and removal of legend items, as well as positioning and styling of the legend.
 */
export class LegendManager extends ChartBase {
    private legendContainer: d3.Selection<SVGGElement, unknown, null, undefined>;
    private legendItems: d3.Selection<SVGGElement, unknown, null, undefined>;

    constructor(private options: LegendOptions) {
        super();
    }

    /**
     * Creates the legend based on the provided data and chart type.
     * 
     * @param data - The data used to generate the legend items
     * @param chartType - The type of chart for which the legend is being created
     */
    public createLegend(data: any[], chartType: ChartType): void {
        this.legendContainer = d3.select(this.options.container)
            .append('g')
            .attr('class', 'legend-container');

        this.generateLegendItems(data, chartType);
        this.applyInitialStyling();
        this.positionLegend();
        this.addInteractivity();
    }

    /**
     * Updates the existing legend with new data.
     * 
     * @param data - The new data to update the legend items
     */
    public updateLegend(data: any[]): void {
        this.updateLegendItems(data);
        this.updateStyling();
        this.positionLegend();
    }

    /**
     * Removes the legend from the chart.
     */
    public removeLegend(): void {
        if (this.legendContainer) {
            this.legendContainer.remove();
        }
    }

    /**
     * Positions the legend according to the specified options.
     */
    private positionLegend(): void {
        const { position, offsetX, offsetY } = this.options;
        const containerBounds = (this.options.container as SVGElement).getBoundingClientRect();

        let x = 0;
        let y = 0;

        switch (position) {
            case 'top':
                x = containerBounds.width / 2;
                y = offsetY || 0;
                break;
            case 'bottom':
                x = containerBounds.width / 2;
                y = containerBounds.height - (offsetY || 0);
                break;
            case 'left':
                x = offsetX || 0;
                y = containerBounds.height / 2;
                break;
            case 'right':
                x = containerBounds.width - (offsetX || 0);
                y = containerBounds.height / 2;
                break;
        }

        this.legendContainer
            .attr('transform', `translate(${x}, ${y})`)
            .transition()
            .duration(500)
            .attr('opacity', 1);
    }

    /**
     * Applies styling to the legend based on the theme and options.
     */
    private styleLegend(): void {
        const { fontFamily, fontSize, fontColor } = this.options.style || defaultTheme.legend;

        this.legendContainer
            .attr('font-family', fontFamily)
            .attr('font-size', fontSize)
            .attr('fill', fontColor);

        this.legendItems
            .select('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('rx', 2)
            .attr('ry', 2);

        this.legendItems
            .select('text')
            .attr('x', 20)
            .attr('y', 9)
            .attr('alignment-baseline', 'middle');
    }

    private generateLegendItems(data: any[], chartType: ChartType): void {
        const legendData = this.getLegendData(data, chartType);

        this.legendItems = this.legendContainer
            .selectAll('.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        this.legendItems
            .append('rect')
            .attr('fill', d => d.color);

        this.legendItems
            .append('text')
            .text(d => formatText(d.label, this.options.labelFormatter));
    }

    private getLegendData(data: any[], chartType: ChartType): { label: string, color: string }[] {
        // Implementation depends on the chart type and data structure
        // This is a simplified version
        return data.map((item, index) => ({
            label: item.name || `Series ${index + 1}`,
            color: item.color || defaultTheme.colors[index % defaultTheme.colors.length]
        }));
    }

    private updateLegendItems(data: any[]): void {
        const legendData = this.getLegendData(data, this.options.chartType);

        const updatedItems = this.legendItems
            .data(legendData);

        updatedItems.exit().remove();

        const enterItems = updatedItems.enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        enterItems.append('rect');
        enterItems.append('text');

        this.legendItems = updatedItems.merge(enterItems);

        this.legendItems.select('rect')
            .attr('fill', d => d.color);

        this.legendItems.select('text')
            .text(d => formatText(d.label, this.options.labelFormatter));
    }

    private applyInitialStyling(): void {
        this.styleLegend();
        this.legendContainer.attr('opacity', 0);
    }

    private updateStyling(): void {
        this.styleLegend();
    }

    private addInteractivity(): void {
        if (this.options.interactive) {
            this.legendItems
                .on('mouseover', this.handleMouseOver.bind(this))
                .on('mouseout', this.handleMouseOut.bind(this))
                .on('click', this.handleClick.bind(this));
        }
    }

    private handleMouseOver(event: MouseEvent, d: any): void {
        const item = d3.select(event.currentTarget);
        item.select('rect').attr('opacity', 0.8);
        item.select('text').attr('font-weight', 'bold');
        
        if (this.options.onHover) {
            this.options.onHover(d, event);
        }
    }

    private handleMouseOut(event: MouseEvent, d: any): void {
        const item = d3.select(event.currentTarget);
        item.select('rect').attr('opacity', 1);
        item.select('text').attr('font-weight', 'normal');
        
        if (this.options.onLeave) {
            this.options.onLeave(d, event);
        }
    }

    private handleClick(event: MouseEvent, d: any): void {
        if (this.options.onClick) {
            this.options.onClick(d, event);
        }
    }
}