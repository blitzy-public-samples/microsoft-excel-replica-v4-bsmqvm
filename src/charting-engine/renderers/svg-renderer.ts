import * as d3 from 'd3';
import { ChartTypes, IChartBase } from '../types/chart-types';
import { ChartOptions } from '../types/chart-options';
import { ColorUtils } from '../utils/color-utils';
import { MathUtils } from '../utils/math-utils';
import { AxisManager } from '../core/axis-manager';
import { LegendManager } from '../core/legend-manager';

export class SVGRenderer {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private margin: { top: number; right: number; bottom: number; left: number };
  private axisManager: AxisManager;
  private legendManager: LegendManager;

  constructor(private container: HTMLElement) {
    this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    this.width = this.container.clientWidth - this.margin.left - this.margin.right;
    this.height = this.container.clientHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.axisManager = new AxisManager(this.svg, this.width, this.height);
    this.legendManager = new LegendManager(this.svg, this.width, this.height);
  }

  public render(chart: ChartTypes): void {
    this.svg.selectAll('*').remove();
    
    switch (chart.type) {
      case 'bar':
        this.renderBarChart(chart);
        break;
      case 'line':
        this.renderLineChart(chart);
        break;
      case 'pie':
        this.renderPieChart(chart);
        break;
      case 'scatter':
        this.renderScatterChart(chart);
        break;
      case 'area':
        this.renderAreaChart(chart);
        break;
      case 'column':
        this.renderColumnChart(chart);
        break;
      case 'combo':
        this.renderComboChart(chart);
        break;
      default:
        console.error('Unsupported chart type');
    }
  }

  private renderBarChart(chart: IChartBase): void {
    const x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([this.height, 0]);

    x.domain(chart.data.map(d => d.label));
    y.domain([0, d3.max(chart.data, d => d.value) as number]);

    this.axisManager.renderXAxis(x);
    this.axisManager.renderYAxis(y);

    this.svg.selectAll('.bar')
      .data(chart.data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) as number)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => this.height - y(d.value))
      .attr('fill', (d, i) => ColorUtils.getColor(i));

    this.legendManager.renderLegend(chart.data);
  }

  private renderLineChart(chart: IChartBase): void {
    const x = d3.scalePoint()
      .range([0, this.width])
      .padding(0.5);

    const y = d3.scaleLinear()
      .range([this.height, 0]);

    x.domain(chart.data.map(d => d.label));
    y.domain([0, d3.max(chart.data, d => d.value) as number]);

    this.axisManager.renderXAxis(x);
    this.axisManager.renderYAxis(y);

    const line = d3.line<{ label: string; value: number }>()
      .x(d => x(d.label) as number)
      .y(d => y(d.value));

    this.svg.append('path')
      .datum(chart.data)
      .attr('fill', 'none')
      .attr('stroke', ColorUtils.getColor(0))
      .attr('stroke-width', 2)
      .attr('d', line);

    this.legendManager.renderLegend(chart.data);
  }

  private renderPieChart(chart: IChartBase): void {
    const radius = Math.min(this.width, this.height) / 2;

    const pie = d3.pie<{ label: string; value: number }>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = this.svg.selectAll('.arc')
      .data(pie(chart.data))
      .enter().append('g')
      .attr('class', 'arc')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => ColorUtils.getColor(i));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .text(d => d.data.label);

    this.legendManager.renderLegend(chart.data);
  }

  private renderScatterChart(chart: IChartBase): void {
    const x = d3.scaleLinear()
      .range([0, this.width]);

    const y = d3.scaleLinear()
      .range([this.height, 0]);

    x.domain([0, d3.max(chart.data, d => d.x) as number]);
    y.domain([0, d3.max(chart.data, d => d.y) as number]);

    this.axisManager.renderXAxis(x);
    this.axisManager.renderYAxis(y);

    this.svg.selectAll('.dot')
      .data(chart.data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 5)
      .attr('fill', (d, i) => ColorUtils.getColor(i));

    this.legendManager.renderLegend(chart.data);
  }

  private renderAreaChart(chart: IChartBase): void {
    const x = d3.scalePoint()
      .range([0, this.width])
      .padding(0.5);

    const y = d3.scaleLinear()
      .range([this.height, 0]);

    x.domain(chart.data.map(d => d.label));
    y.domain([0, d3.max(chart.data, d => d.value) as number]);

    this.axisManager.renderXAxis(x);
    this.axisManager.renderYAxis(y);

    const area = d3.area<{ label: string; value: number }>()
      .x(d => x(d.label) as number)
      .y0(this.height)
      .y1(d => y(d.value));

    this.svg.append('path')
      .datum(chart.data)
      .attr('fill', ColorUtils.getColor(0))
      .attr('d', area);

    this.legendManager.renderLegend(chart.data);
  }

  private renderColumnChart(chart: IChartBase): void {
    const x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([this.height, 0]);

    x.domain(chart.data.map(d => d.label));
    y.domain([0, d3.max(chart.data, d => d.value) as number]);

    this.axisManager.renderXAxis(x);
    this.axisManager.renderYAxis(y);

    this.svg.selectAll('.column')
      .data(chart.data)
      .enter().append('rect')
      .attr('class', 'column')
      .attr('x', d => x(d.label) as number)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => this.height - y(d.value))
      .attr('fill', (d, i) => ColorUtils.getColor(i));

    this.legendManager.renderLegend(chart.data);
  }

  private renderComboChart(chart: IChartBase): void {
    // Implement combo chart rendering logic here
    console.warn('Combo chart rendering not implemented yet');
  }
}