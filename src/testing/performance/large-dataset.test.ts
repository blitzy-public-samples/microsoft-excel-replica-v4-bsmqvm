import { testHelpers } from '../utils/test-helpers';
import { mockDataGenerator } from '../utils/mock-data-generator';
import { setupTestEnvironment } from '../setup';
import { jest } from '@jest/globals';

describe('Large Dataset Performance Tests', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  const measureOperationTime = async <T>(operation: () => Promise<T>): Promise<[T, number]> => {
    const startTime = performance.now();
    const result = await operation();
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    return [result, executionTime];
  };

  const testLargeDatasetPerformance = async (rowCount: number, columnCount: number) => {
    // Generate a large dataset
    const largeDataset = mockDataGenerator.generateLargeDataset(rowCount, columnCount);

    // Test loading performance
    const [, loadTime] = await measureOperationTime(async () => {
      await testHelpers.loadDataset(largeDataset);
    });
    expect(loadTime).toBeLessThan(5000); // Assuming 5 seconds is an acceptable load time

    // Test scrolling performance
    const [, scrollTime] = await measureOperationTime(async () => {
      await testHelpers.simulateScrolling();
    });
    expect(scrollTime).toBeLessThan(1000); // Assuming 1 second is an acceptable scroll time

    // Test filtering performance
    const [, filterTime] = await measureOperationTime(async () => {
      await testHelpers.applyFilter(largeDataset);
    });
    expect(filterTime).toBeLessThan(2000); // Assuming 2 seconds is an acceptable filter time

    // Test sorting performance
    const [, sortTime] = await measureOperationTime(async () => {
      await testHelpers.applySorting(largeDataset);
    });
    expect(sortTime).toBeLessThan(3000); // Assuming 3 seconds is an acceptable sort time

    // Test calculation performance
    const [, calculationTime] = await measureOperationTime(async () => {
      await testHelpers.performComplexCalculation(largeDataset);
    });
    expect(calculationTime).toBeLessThan(5000); // Assuming 5 seconds is an acceptable calculation time

    // Test charting performance
    const [, chartTime] = await measureOperationTime(async () => {
      await testHelpers.generateChart(largeDataset);
    });
    expect(chartTime).toBeLessThan(4000); // Assuming 4 seconds is an acceptable chart generation time

    // Test saving performance
    const [, saveTime] = await measureOperationTime(async () => {
      await testHelpers.saveWorkbook(largeDataset);
    });
    expect(saveTime).toBeLessThan(10000); // Assuming 10 seconds is an acceptable save time
  };

  test('Performance with 100,000 rows and 100 columns', async () => {
    await testLargeDatasetPerformance(100000, 100);
  });

  test('Performance with 1,000,000 rows and 50 columns', async () => {
    await testLargeDatasetPerformance(1000000, 50);
  });

  test('Performance with 10,000 rows and 1,000 columns', async () => {
    await testLargeDatasetPerformance(10000, 1000);
  });
});