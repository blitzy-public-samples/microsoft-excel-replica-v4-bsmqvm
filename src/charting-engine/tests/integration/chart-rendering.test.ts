import { ChartBase } from '../../core/chart-base';
import { BarChart } from '../../charts/bar-chart';
import { LineChart } from '../../charts/line-chart';
import { PieChart } from '../../charts/pie-chart';
import { SVGRenderer } from '../../renderers/svg-renderer';
import { CanvasRenderer } from '../../renderers/canvas-renderer';
import { TestUtils } from '../../utils/test-utils';
import '@testing-library/jest-dom/extend-expect';

describe('Chart Rendering Integration Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const testChartRendering = async (ChartClass: typeof ChartBase, renderer: 'svg' | 'canvas') => {
    const chart = new ChartClass({
      data: TestUtils.generateMockData(),
      options: TestUtils.generateMockOptions(),
      container,
      renderer: renderer === 'svg' ? new SVGRenderer() : new CanvasRenderer(),
    });

    await chart.render();

    if (renderer === 'svg') {
      expect(container.querySelector('svg')).toBeInTheDocument();
    } else {
      expect(container.querySelector('canvas')).toBeInTheDocument();
    }

    // Test responsiveness
    TestUtils.resizeContainer(container);
    await chart.render();
    expect(chart.width).toBe(container.clientWidth);
    expect(chart.height).toBe(container.clientHeight);

    // Test accessibility
    const accessibilityElements = TestUtils.getAccessibilityElements(container);
    expect(accessibilityElements.length).toBeGreaterThan(0);

    // Test cross-platform rendering
    const differentPlatforms = ['desktop', 'mobile', 'tablet'];
    for (const platform of differentPlatforms) {
      TestUtils.emulateDevice(platform);
      await chart.render();
      expect(TestUtils.getRenderedElements(container).length).toBeGreaterThan(0);
    }

    // Test performance
    const renderTime = await TestUtils.measureRenderTime(chart);
    expect(renderTime).toBeLessThan(TestUtils.PERFORMANCE_THRESHOLD);
  };

  test('Bar Chart renders correctly with SVG', async () => {
    await testChartRendering(BarChart, 'svg');
  });

  test('Bar Chart renders correctly with Canvas', async () => {
    await testChartRendering(BarChart, 'canvas');
  });

  test('Line Chart renders correctly with SVG', async () => {
    await testChartRendering(LineChart, 'svg');
  });

  test('Line Chart renders correctly with Canvas', async () => {
    await testChartRendering(LineChart, 'canvas');
  });

  test('Pie Chart renders correctly with SVG', async () => {
    await testChartRendering(PieChart, 'svg');
  });

  test('Pie Chart renders correctly with Canvas', async () => {
    await testChartRendering(PieChart, 'canvas');
  });

  test('Charts handle large datasets efficiently', async () => {
    const largeDataset = TestUtils.generateLargeDataset();
    const chart = new BarChart({
      data: largeDataset,
      options: TestUtils.generateMockOptions(),
      container,
      renderer: new SVGRenderer(),
    });

    const renderTime = await TestUtils.measureRenderTime(chart);
    expect(renderTime).toBeLessThan(TestUtils.LARGE_DATASET_THRESHOLD);
  });

  test('Charts update correctly when data changes', async () => {
    const chart = new LineChart({
      data: TestUtils.generateMockData(),
      options: TestUtils.generateMockOptions(),
      container,
      renderer: new SVGRenderer(),
    });

    await chart.render();
    const initialElements = TestUtils.getRenderedElements(container);

    chart.updateData(TestUtils.generateMockData());
    await chart.render();
    const updatedElements = TestUtils.getRenderedElements(container);

    expect(updatedElements).not.toEqual(initialElements);
  });

  test('Charts handle errors gracefully', async () => {
    const invalidData = 'invalid data' as any;
    const chart = new PieChart({
      data: invalidData,
      options: TestUtils.generateMockOptions(),
      container,
      renderer: new SVGRenderer(),
    });

    await expect(chart.render()).rejects.toThrow();
    expect(container.querySelector('.error-message')).toBeInTheDocument();
  });
});