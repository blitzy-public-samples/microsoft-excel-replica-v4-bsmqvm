import { expect } from 'jest';
import { ChartingEngine, ChartBase, BarChart, LineChart, PieChart, ScatterChart, SVGRenderer, CanvasRenderer } from '../../charting-engine';
import { testHelpers, mockDataGenerator } from '../utils';

describe('Charting Engine', () => {
  let chartingEngine: ChartingEngine;

  beforeEach(() => {
    chartingEngine = new ChartingEngine();
  });

  describe('Chart Creation', () => {
    it('should create a bar chart', () => {
      const data = mockDataGenerator.generateBarChartData();
      const chart = chartingEngine.createChart('bar', data);
      expect(chart).toBeInstanceOf(BarChart);
      expect(chart).toBeInstanceOf(ChartBase);
    });

    it('should create a line chart', () => {
      const data = mockDataGenerator.generateLineChartData();
      const chart = chartingEngine.createChart('line', data);
      expect(chart).toBeInstanceOf(LineChart);
      expect(chart).toBeInstanceOf(ChartBase);
    });

    it('should create a pie chart', () => {
      const data = mockDataGenerator.generatePieChartData();
      const chart = chartingEngine.createChart('pie', data);
      expect(chart).toBeInstanceOf(PieChart);
      expect(chart).toBeInstanceOf(ChartBase);
    });

    it('should create a scatter chart', () => {
      const data = mockDataGenerator.generateScatterChartData();
      const chart = chartingEngine.createChart('scatter', data);
      expect(chart).toBeInstanceOf(ScatterChart);
      expect(chart).toBeInstanceOf(ChartBase);
    });

    it('should throw an error for unsupported chart type', () => {
      const data = mockDataGenerator.generateGenericData();
      expect(() => chartingEngine.createChart('unsupported', data)).toThrow();
    });
  });

  describe('Chart Customization', () => {
    let barChart: BarChart;

    beforeEach(() => {
      const data = mockDataGenerator.generateBarChartData();
      barChart = chartingEngine.createChart('bar', data) as BarChart;
    });

    it('should set chart title', () => {
      const title = 'Test Bar Chart';
      barChart.setTitle(title);
      expect(barChart.getTitle()).toBe(title);
    });

    it('should set chart colors', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF'];
      barChart.setColors(colors);
      expect(barChart.getColors()).toEqual(colors);
    });

    it('should set chart size', () => {
      const width = 800;
      const height = 600;
      barChart.setSize(width, height);
      expect(barChart.getWidth()).toBe(width);
      expect(barChart.getHeight()).toBe(height);
    });

    it('should set chart legend', () => {
      const legend = { position: 'right', title: 'Legend' };
      barChart.setLegend(legend);
      expect(barChart.getLegend()).toEqual(legend);
    });
  });

  describe('Chart Rendering', () => {
    it('should render chart as SVG', () => {
      const data = mockDataGenerator.generateBarChartData();
      const chart = chartingEngine.createChart('bar', data);
      const svgRenderer = new SVGRenderer();
      const svg = chart.render(svgRenderer);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    });

    it('should render chart as Canvas', () => {
      const data = mockDataGenerator.generateLineChartData();
      const chart = chartingEngine.createChart('line', data);
      const canvasRenderer = new CanvasRenderer();
      const canvas = chart.render(canvasRenderer);
      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    });
  });

  describe('Data Visualization', () => {
    it('should correctly visualize bar chart data', () => {
      const data = mockDataGenerator.generateBarChartData();
      const chart = chartingEngine.createChart('bar', data) as BarChart;
      const renderedData = chart.getRenderedData();
      expect(renderedData.length).toBe(data.length);
      expect(renderedData[0].height).toBeGreaterThan(0);
    });

    it('should correctly visualize pie chart data', () => {
      const data = mockDataGenerator.generatePieChartData();
      const chart = chartingEngine.createChart('pie', data) as PieChart;
      const renderedData = chart.getRenderedData();
      expect(renderedData.length).toBe(data.length);
      expect(renderedData.reduce((sum, slice) => sum + slice.angle, 0)).toBeCloseTo(360);
    });
  });

  describe('Chart Interactivity', () => {
    it('should handle mouse hover events', () => {
      const data = mockDataGenerator.generateBarChartData();
      const chart = chartingEngine.createChart('bar', data);
      const mockHoverHandler = jest.fn();
      chart.onHover(mockHoverHandler);
      
      chart.triggerHover({ x: 100, y: 100 });
      expect(mockHoverHandler).toHaveBeenCalled();
    });

    it('should handle click events', () => {
      const data = mockDataGenerator.generatePieChartData();
      const chart = chartingEngine.createChart('pie', data);
      const mockClickHandler = jest.fn();
      chart.onClick(mockClickHandler);
      
      chart.triggerClick({ x: 150, y: 150 });
      expect(mockClickHandler).toHaveBeenCalled();
    });
  });

  describe('Chart Export', () => {
    it('should export chart as PNG', async () => {
      const data = mockDataGenerator.generateBarChartData();
      const chart = chartingEngine.createChart('bar', data);
      const pngBlob = await chart.exportToPNG();
      expect(pngBlob).toBeInstanceOf(Blob);
      expect(pngBlob.type).toBe('image/png');
    });

    it('should export chart as SVG', () => {
      const data = mockDataGenerator.generateLineChartData();
      const chart = chartingEngine.createChart('line', data);
      const svgString = chart.exportToSVG();
      expect(typeof svgString).toBe('string');
      expect(svgString).toContain('<svg');
      expect(svgString).toContain('</svg>');
    });
  });
});