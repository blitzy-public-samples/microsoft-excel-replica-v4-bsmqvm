import { jest } from '@jest/globals';
import { TestHelpers } from '../utils/test-helpers';
import { MockDataGenerator } from '../utils/mock-data-generator';

describe('ExternalDataSourceTests', () => {
  let testHelpers: TestHelpers;
  let mockDataGenerator: MockDataGenerator;

  beforeEach(() => {
    testHelpers = new TestHelpers();
    mockDataGenerator = new MockDataGenerator();
  });

  test('should connect to external SQL database', async () => {
    // Mock external SQL database connection
    const mockSqlConnection = jest.fn().mockResolvedValue({ connected: true });
    jest.spyOn(testHelpers, 'createMockSqlConnection').mockImplementation(mockSqlConnection);

    // Attempt to connect to the mock database
    const connection = await testHelpers.createMockSqlConnection();

    // Assert that the connection is successful
    expect(connection.connected).toBe(true);
    expect(mockSqlConnection).toHaveBeenCalled();
  });

  test('should retrieve data from REST API', async () => {
    // Mock REST API endpoint
    const mockApiData = mockDataGenerator.generateMockApiData();
    const mockApiCall = jest.fn().mockResolvedValue(mockApiData);
    jest.spyOn(testHelpers, 'mockApiCall').mockImplementation(mockApiCall);

    // Send a request to the mock API
    const result = await testHelpers.mockApiCall('/api/data');

    // Assert that the data is retrieved correctly
    expect(result).toEqual(mockApiData);
    expect(mockApiCall).toHaveBeenCalledWith('/api/data');
  });

  test('should import data from CSV file', async () => {
    // Create a mock CSV file
    const mockCsvData = mockDataGenerator.generateMockCsvData();
    const mockCsvImport = jest.fn().mockResolvedValue(mockCsvData);
    jest.spyOn(testHelpers, 'importMockCsvFile').mockImplementation(mockCsvImport);

    // Import the mock CSV file
    const importedData = await testHelpers.importMockCsvFile('mock_data.csv');

    // Assert that the data is imported correctly
    expect(importedData).toEqual(mockCsvData);
    expect(mockCsvImport).toHaveBeenCalledWith('mock_data.csv');
  });

  test('should handle large datasets efficiently', async () => {
    // Generate a large mock dataset
    const largeDataset = mockDataGenerator.generateLargeDataset(1000000); // 1 million rows
    const mockLargeDataImport = jest.fn().mockResolvedValue(largeDataset);
    jest.spyOn(testHelpers, 'importLargeDataset').mockImplementation(mockLargeDataImport);

    // Measure the time taken for import
    const startTime = Date.now();
    const importedData = await testHelpers.importLargeDataset(largeDataset);
    const endTime = Date.now();
    const importTime = endTime - startTime;

    // Assert that the import time is within acceptable limits (e.g., less than 5 seconds)
    expect(importTime).toBeLessThan(5000);
    expect(importedData).toEqual(largeDataset);
    expect(mockLargeDataImport).toHaveBeenCalledWith(largeDataset);
  });

  test('should validate data types from external sources', async () => {
    // Create mock data with various data types
    const mockTypedData = mockDataGenerator.generateMockTypedData();
    const mockDataTypeValidation = jest.fn().mockResolvedValue(true);
    jest.spyOn(testHelpers, 'validateDataTypes').mockImplementation(mockDataTypeValidation);

    // Import the mock data
    const isValid = await testHelpers.validateDataTypes(mockTypedData);

    // Assert that each data type is correctly identified and handled
    expect(isValid).toBe(true);
    expect(mockDataTypeValidation).toHaveBeenCalledWith(mockTypedData);
  });
});