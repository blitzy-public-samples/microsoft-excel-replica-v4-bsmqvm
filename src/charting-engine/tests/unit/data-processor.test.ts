import { processData, aggregateData, normalizeData, transformData } from '../core/data-processor';
import { ChartType } from '../types/chart-types';
import { ChartOptions } from '../types/chart-options';

describe('processData', () => {
  test('should process data for bar chart', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 },
    ];
    const options: ChartOptions = { type: ChartType.Bar };
    const result = processData(data, options);
    expect(result).toBeDefined();
    expect(result.length).toBe(3);
    expect(result[0]).toHaveProperty('category');
    expect(result[0]).toHaveProperty('value');
  });

  test('should process data for line chart', () => {
    const data = [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 15 },
    ];
    const options: ChartOptions = { type: ChartType.Line };
    const result = processData(data, options);
    expect(result).toBeDefined();
    expect(result.length).toBe(3);
    expect(result[0]).toHaveProperty('x');
    expect(result[0]).toHaveProperty('y');
  });
});

describe('aggregateData', () => {
  test('should aggregate data using sum', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'A', value: 20 },
      { category: 'B', value: 15 },
    ];
    const result = aggregateData(data, 'category', 'value', 'sum');
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result[0]).toEqual({ category: 'A', value: 30 });
    expect(result[1]).toEqual({ category: 'B', value: 15 });
  });

  test('should aggregate data using average', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'A', value: 20 },
      { category: 'B', value: 15 },
    ];
    const result = aggregateData(data, 'category', 'value', 'average');
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result[0]).toEqual({ category: 'A', value: 15 });
    expect(result[1]).toEqual({ category: 'B', value: 15 });
  });
});

describe('normalizeData', () => {
  test('should normalize numerical data', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 30 },
    ];
    const result = normalizeData(data, 'value');
    expect(result).toBeDefined();
    expect(result.length).toBe(3);
    expect(result[0].normalizedValue).toBeCloseTo(0.33, 2);
    expect(result[1].normalizedValue).toBeCloseTo(0.67, 2);
    expect(result[2].normalizedValue).toBeCloseTo(1, 2);
  });
});

describe('transformData', () => {
  test('should transform data for pie chart', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 30 },
    ];
    const options: ChartOptions = { type: ChartType.Pie };
    const result = transformData(data, options);
    expect(result).toBeDefined();
    expect(result.length).toBe(3);
    expect(result[0]).toHaveProperty('percentage');
    expect(result[0].percentage).toBeCloseTo(16.67, 2);
    expect(result[1].percentage).toBeCloseTo(33.33, 2);
    expect(result[2].percentage).toBeCloseTo(50, 2);
  });

  test('should transform data for scatter plot', () => {
    const data = [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 15 },
    ];
    const options: ChartOptions = { type: ChartType.Scatter };
    const result = transformData(data, options);
    expect(result).toBeDefined();
    expect(result.length).toBe(3);
    expect(result[0]).toHaveProperty('x');
    expect(result[0]).toHaveProperty('y');
    expect(result).toEqual(data); // Scatter plot data should remain unchanged
  });
});