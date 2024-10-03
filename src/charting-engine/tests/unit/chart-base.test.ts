import { ChartBase } from '../../core/chart-base';
import { ChartType } from '../../types/chart-types';
import { ChartOptions } from '../../types/chart-options';
import { DataProcessor } from '../../core/data-processor';
import { AxisManager } from '../../core/axis-manager';
import { LegendManager } from '../../core/legend-manager';
import { SVGRenderer } from '../../renderers/svg-renderer';
import { CanvasRenderer } from '../../renderers/canvas-renderer';

// Mock implementation of ChartBase for testing abstract methods
class MockChartBase extends ChartBase {
  render(): void {
    // Mock implementation
  }

  drawChart(): void {
    // Mock implementation
  }
}

describe('ChartBase', () => {
  let mockChartBase: MockChartBase;
  let mockDataProcessor: jest.Mocked<DataProcessor>;
  let mockAxisManager: jest.Mocked<AxisManager>;
  let mockLegendManager: jest.Mocked<LegendManager>;
  let mockSVGRenderer: jest.Mocked<SVGRenderer>;
  let mockCanvasRenderer: jest.Mocked<CanvasRenderer>;

  beforeEach(() => {
    mockDataProcessor = {
      process: jest.fn(),
    } as unknown as jest.Mocked<DataProcessor>;

    mockAxisManager = {
      updateAxes: jest.fn(),
    } as unknown as jest.Mocked<AxisManager>;

    mockLegendManager = {
      updateLegend: jest.fn(),
    } as unknown as jest.Mocked<LegendManager>;

    mockSVGRenderer = {
      render: jest.fn(),
      clear: jest.fn(),
      toDataURL: jest.fn(),
    } as unknown as jest.Mocked<SVGRenderer>;

    mockCanvasRenderer = {
      render: jest.fn(),
      clear: jest.fn(),
      toDataURL: jest.fn(),
    } as unknown as jest.Mocked<CanvasRenderer>;

    mockChartBase = new MockChartBase({
      type: ChartType.Bar,
      data: [],
      options: {},
    });

    mockChartBase['dataProcessor'] = mockDataProcessor;
    mockChartBase['axisManager'] = mockAxisManager;
    mockChartBase['legendManager'] = mockLegendManager;
    mockChartBase['renderer'] = mockSVGRenderer;
  });

  test('initialization with default options', () => {
    expect(mockChartBase.type).toBe(ChartType.Bar);
    expect(mockChartBase.data).toEqual([]);
    expect(mockChartBase.options).toEqual(expect.objectContaining({
      width: 600,
      height: 400,
      margin: { top: 20, right: 20, bottom: 30, left: 40 },
    }));
  });

  test('setData method triggers data processing', () => {
    const testData = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
    mockChartBase.setData(testData);

    expect(mockDataProcessor.process).toHaveBeenCalledWith(testData);
    expect(mockChartBase.data).toEqual(testData);
  });

  test('updateOptions method updates options and triggers re-render', () => {
    const spy = jest.spyOn(mockChartBase, 'render');
    const newOptions: Partial<ChartOptions> = { width: 800, height: 600 };

    mockChartBase.updateOptions(newOptions);

    expect(mockChartBase.options.width).toBe(800);
    expect(mockChartBase.options.height).toBe(600);
    expect(spy).toHaveBeenCalled();
  });

  test('resize method updates dimensions and triggers re-render', () => {
    const spy = jest.spyOn(mockChartBase, 'render');
    mockChartBase.resize(1000, 800);

    expect(mockChartBase.options.width).toBe(1000);
    expect(mockChartBase.options.height).toBe(800);
    expect(spy).toHaveBeenCalled();
  });

  test('toImage method returns a valid data URL', () => {
    const mockDataURL = 'data:image/png;base64,mockImageData';
    mockSVGRenderer.toDataURL.mockReturnValue(mockDataURL);

    const result = mockChartBase.toImage('png');

    expect(mockSVGRenderer.toDataURL).toHaveBeenCalledWith('png');
    expect(result).toBe(mockDataURL);
  });

  test('initializeComponents method creates necessary components', () => {
    mockChartBase['initializeComponents']();

    expect(mockChartBase['dataProcessor']).toBeInstanceOf(DataProcessor);
    expect(mockChartBase['axisManager']).toBeInstanceOf(AxisManager);
    expect(mockChartBase['legendManager']).toBeInstanceOf(LegendManager);
    expect(mockChartBase['renderer']).toBeInstanceOf(SVGRenderer);
  });

  test('switchRenderer method changes renderer type', () => {
    mockChartBase.switchRenderer('canvas');
    expect(mockChartBase['renderer']).toBeInstanceOf(CanvasRenderer);

    mockChartBase.switchRenderer('svg');
    expect(mockChartBase['renderer']).toBeInstanceOf(SVGRenderer);
  });

  test('updateChart method calls necessary update functions', () => {
    const renderSpy = jest.spyOn(mockChartBase, 'render');
    mockChartBase.updateChart();

    expect(mockDataProcessor.process).toHaveBeenCalled();
    expect(mockAxisManager.updateAxes).toHaveBeenCalled();
    expect(mockLegendManager.updateLegend).toHaveBeenCalled();
    expect(renderSpy).toHaveBeenCalled();
  });
});