import { ChartBase } from '../../core/chart-base';
import { TooltipManager } from '../../interactivity/tooltip-manager';
import { ZoomPanManager } from '../../interactivity/zoom-pan-manager';
import { A11yManager } from '../../accessibility/a11y-manager';
import { BarChart } from '../../charts/bar-chart';
import { LineChart } from '../../charts/line-chart';
import { PieChart } from '../../charts/pie-chart';
import { setupTestEnvironment } from '../../../testing/utils/test-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

describe('Chart Interactivity E2E Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const testChartInteractivity = async (
    ChartType: typeof ChartBase,
    chartData: any[],
    interactionType: string
  ) => {
    const chart = new ChartType(container, chartData);
    await chart.render();

    switch (interactionType) {
      case 'hover':
        await userEvent.hover(container.querySelector('.chart-element'));
        break;
      case 'click':
        await userEvent.click(container.querySelector('.chart-element'));
        break;
      case 'touch':
        fireEvent.touchStart(container.querySelector('.chart-element'));
        fireEvent.touchEnd(container.querySelector('.chart-element'));
        break;
      case 'zoom':
        fireEvent.wheel(container, { deltaY: -100 });
        break;
      case 'pan':
        fireEvent.mouseDown(container);
        fireEvent.mouseMove(container, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(container);
        break;
      case 'keyboard':
        container.querySelector('.chart-element').focus();
        await userEvent.keyboard('{enter}');
        break;
    }

    return chart;
  };

  test('Bar Chart - Hover Interaction', async () => {
    const barData = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 },
    ];

    const chart = await testChartInteractivity(BarChart, barData, 'hover');

    await waitFor(() => {
      expect(container.querySelector('.tooltip')).toBeInTheDocument();
    });

    const tooltipContent = container.querySelector('.tooltip').textContent;
    expect(tooltipContent).toContain('Category:');
    expect(tooltipContent).toContain('Value:');

    const a11yManager = (chart as any).a11yManager as A11yManager;
    expect(a11yManager.getAriaLabel()).toContain('Bar chart');
  });

  test('Line Chart - Click Interaction', async () => {
    const lineData = [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
      { x: 2, y: 15 },
    ];

    const chart = await testChartInteractivity(LineChart, lineData, 'click');

    await waitFor(() => {
      expect(container.querySelector('.data-point.selected')).toBeInTheDocument();
    });

    const selectedPoint = container.querySelector('.data-point.selected');
    expect(selectedPoint).toHaveAttribute('aria-selected', 'true');

    const a11yManager = (chart as any).a11yManager as A11yManager;
    expect(a11yManager.getAriaLabel()).toContain('Line chart');
  });

  test('Pie Chart - Touch Interaction', async () => {
    const pieData = [
      { label: 'A', value: 30 },
      { label: 'B', value: 40 },
      { label: 'C', value: 30 },
    ];

    const chart = await testChartInteractivity(PieChart, pieData, 'touch');

    await waitFor(() => {
      expect(container.querySelector('.pie-slice.selected')).toBeInTheDocument();
    });

    const selectedSlice = container.querySelector('.pie-slice.selected');
    expect(selectedSlice).toHaveAttribute('aria-selected', 'true');

    const a11yManager = (chart as any).a11yManager as A11yManager;
    expect(a11yManager.getAriaLabel()).toContain('Pie chart');
  });

  test('Zoom and Pan Interaction', async () => {
    const lineData = [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
      { x: 2, y: 15 },
      { x: 3, y: 25 },
      { x: 4, y: 30 },
    ];

    const chart = await testChartInteractivity(LineChart, lineData, 'zoom');
    const zoomPanManager = (chart as any).zoomPanManager as ZoomPanManager;

    await waitFor(() => {
      expect(zoomPanManager.getZoomLevel()).toBeGreaterThan(1);
    });

    await testChartInteractivity(LineChart, lineData, 'pan');

    await waitFor(() => {
      const { x, y } = zoomPanManager.getPanOffset();
      expect(x).not.toBe(0);
      expect(y).not.toBe(0);
    });
  });

  test('Keyboard Navigation', async () => {
    const barData = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 },
    ];

    const chart = await testChartInteractivity(BarChart, barData, 'keyboard');

    await waitFor(() => {
      expect(container.querySelector('.chart-element:focus')).toBeInTheDocument();
    });

    const focusedElement = container.querySelector('.chart-element:focus');
    expect(focusedElement).toHaveAttribute('aria-selected', 'true');

    const a11yManager = (chart as any).a11yManager as A11yManager;
    expect(a11yManager.getAriaLabel()).toContain('Bar chart');
  });

  test('Cross-platform Consistency', async () => {
    const setupEnvironment = (platform: string) => {
      setupTestEnvironment(platform);
    };

    const pieData = [
      { label: 'A', value: 30 },
      { label: 'B', value: 40 },
      { label: 'C', value: 30 },
    ];

    const platforms = ['desktop', 'web', 'mobile'];
    const results = [];

    for (const platform of platforms) {
      setupEnvironment(platform);
      const chart = await testChartInteractivity(PieChart, pieData, 'click');
      results.push({
        platform,
        selectedSlice: container.querySelector('.pie-slice.selected'),
        tooltip: container.querySelector('.tooltip'),
        a11yLabel: (chart as any).a11yManager.getAriaLabel(),
      });
    }

    results.forEach((result) => {
      expect(result.selectedSlice).toBeInTheDocument();
      expect(result.tooltip).toBeInTheDocument();
      expect(result.a11yLabel).toContain('Pie chart');
    });

    const [desktop, web, mobile] = results;
    expect(desktop.selectedSlice).toEqual(web.selectedSlice);
    expect(web.selectedSlice).toEqual(mobile.selectedSlice);
  });

  test('Performance Benchmark', async () => {
    const largeDataSet = Array.from({ length: 10000 }, (_, i) => ({
      x: i,
      y: Math.random() * 100,
    }));

    const startTime = performance.now();
    const chart = await testChartInteractivity(LineChart, largeDataSet, 'hover');
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    console.log(`Render time for 10,000 data points: ${renderTime}ms`);

    expect(renderTime).toBeLessThan(1000); // Adjust this threshold based on your performance requirements

    const tooltipManager = (chart as any).tooltipManager as TooltipManager;
    const tooltipShowTime = await new Promise<number>(async (resolve) => {
      const start = performance.now();
      await userEvent.hover(container.querySelector('.chart-element'));
      await waitFor(() => {
        expect(container.querySelector('.tooltip')).toBeInTheDocument();
      });
      const end = performance.now();
      resolve(end - start);
    });

    console.log(`Tooltip show time: ${tooltipShowTime}ms`);
    expect(tooltipShowTime).toBeLessThan(100); // Adjust this threshold based on your performance requirements
  });
});