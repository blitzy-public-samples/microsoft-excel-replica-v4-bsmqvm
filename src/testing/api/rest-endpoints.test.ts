import supertest from 'supertest';
import { app } from '../../backend-api/app';
import { testHelpers } from '../utils/test-helpers';
import { mockDataGenerator } from '../utils/mock-data-generator';

const request = supertest(app);

describe('REST API Endpoints', () => {
  let authToken: string;

  beforeAll(async () => {
    // Set up test environment
    await testHelpers.setupTestEnvironment();
    authToken = await testHelpers.getAuthToken();
  });

  afterAll(async () => {
    // Clean up test environment
    await testHelpers.cleanupTestEnvironment();
  });

  const testEndpoint = async (method: string, url: string, expectedStatus: number, requestBody?: any) => {
    const req = request[method.toLowerCase()](url)
      .set('Authorization', `Bearer ${authToken}`);

    if (requestBody) {
      req.send(requestBody);
    }

    const response = await req;
    expect(response.status).toBe(expectedStatus);

    if (expectedStatus === 200) {
      expect(response.body).not.toBeNull();
    }

    return response;
  };

  describe('Workbook Endpoints', () => {
    let workbookId: string;

    test('GET /api/workbooks - Retrieve all workbooks', async () => {
      await testEndpoint('GET', '/api/workbooks', 200);
    });

    test('POST /api/workbooks - Create a new workbook', async () => {
      const newWorkbook = mockDataGenerator.generateWorkbook();
      const response = await testEndpoint('POST', '/api/workbooks', 201, newWorkbook);
      workbookId = response.body.id;
    });

    test('GET /api/workbooks/:id - Retrieve a specific workbook', async () => {
      await testEndpoint('GET', `/api/workbooks/${workbookId}`, 200);
    });

    test('PUT /api/workbooks/:id - Update an existing workbook', async () => {
      const updatedWorkbook = mockDataGenerator.generateWorkbook();
      await testEndpoint('PUT', `/api/workbooks/${workbookId}`, 200, updatedWorkbook);
    });

    test('DELETE /api/workbooks/:id - Delete a workbook', async () => {
      await testEndpoint('DELETE', `/api/workbooks/${workbookId}`, 204);
    });
  });

  describe('Worksheet Endpoints', () => {
    let workbookId: string;
    let worksheetId: string;

    beforeAll(async () => {
      const newWorkbook = mockDataGenerator.generateWorkbook();
      const response = await testEndpoint('POST', '/api/workbooks', 201, newWorkbook);
      workbookId = response.body.id;
    });

    test('GET /api/workbooks/:id/worksheets - Retrieve all worksheets for a workbook', async () => {
      await testEndpoint('GET', `/api/workbooks/${workbookId}/worksheets`, 200);
    });

    test('POST /api/workbooks/:id/worksheets - Create a new worksheet', async () => {
      const newWorksheet = mockDataGenerator.generateWorksheet();
      const response = await testEndpoint('POST', `/api/workbooks/${workbookId}/worksheets`, 201, newWorksheet);
      worksheetId = response.body.id;
    });

    test('GET /api/workbooks/:id/worksheets/:sheetId - Retrieve a specific worksheet', async () => {
      await testEndpoint('GET', `/api/workbooks/${workbookId}/worksheets/${worksheetId}`, 200);
    });

    test('PUT /api/workbooks/:id/worksheets/:sheetId - Update an existing worksheet', async () => {
      const updatedWorksheet = mockDataGenerator.generateWorksheet();
      await testEndpoint('PUT', `/api/workbooks/${workbookId}/worksheets/${worksheetId}`, 200, updatedWorksheet);
    });

    test('DELETE /api/workbooks/:id/worksheets/:sheetId - Delete a worksheet', async () => {
      await testEndpoint('DELETE', `/api/workbooks/${workbookId}/worksheets/${worksheetId}`, 204);
    });
  });

  describe('Cell Endpoints', () => {
    let workbookId: string;
    let worksheetId: string;
    const cellRef = 'A1';

    beforeAll(async () => {
      const newWorkbook = mockDataGenerator.generateWorkbook();
      const workbookResponse = await testEndpoint('POST', '/api/workbooks', 201, newWorkbook);
      workbookId = workbookResponse.body.id;

      const newWorksheet = mockDataGenerator.generateWorksheet();
      const worksheetResponse = await testEndpoint('POST', `/api/workbooks/${workbookId}/worksheets`, 201, newWorksheet);
      worksheetId = worksheetResponse.body.id;
    });

    test('GET /api/workbooks/:id/worksheets/:sheetId/cells/:cellRef - Retrieve a specific cell', async () => {
      await testEndpoint('GET', `/api/workbooks/${workbookId}/worksheets/${worksheetId}/cells/${cellRef}`, 200);
    });

    test("PUT /api/workbooks/:id/worksheets/:sheetId/cells/:cellRef - Update a cell's value or formula", async () => {
      const updatedCell = mockDataGenerator.generateCell();
      await testEndpoint('PUT', `/api/workbooks/${workbookId}/worksheets/${worksheetId}/cells/${cellRef}`, 200, updatedCell);
    });
  });

  describe('Range Endpoints', () => {
    let workbookId: string;
    let worksheetId: string;
    const rangeRef = 'A1:B2';

    beforeAll(async () => {
      const newWorkbook = mockDataGenerator.generateWorkbook();
      const workbookResponse = await testEndpoint('POST', '/api/workbooks', 201, newWorkbook);
      workbookId = workbookResponse.body.id;

      const newWorksheet = mockDataGenerator.generateWorksheet();
      const worksheetResponse = await testEndpoint('POST', `/api/workbooks/${workbookId}/worksheets`, 201, newWorksheet);
      worksheetId = worksheetResponse.body.id;
    });

    test('GET /api/workbooks/:id/worksheets/:sheetId/ranges/:rangeRef - Retrieve a range of cells', async () => {
      await testEndpoint('GET', `/api/workbooks/${workbookId}/worksheets/${worksheetId}/ranges/${rangeRef}`, 200);
    });

    test('PUT /api/workbooks/:id/worksheets/:sheetId/ranges/:rangeRef - Update a range of cells', async () => {
      const updatedRange = mockDataGenerator.generateRange();
      await testEndpoint('PUT', `/api/workbooks/${workbookId}/worksheets/${worksheetId}/ranges/${rangeRef}`, 200, updatedRange);
    });
  });

  describe('Chart Endpoints', () => {
    let workbookId: string;
    let chartId: string;

    beforeAll(async () => {
      const newWorkbook = mockDataGenerator.generateWorkbook();
      const response = await testEndpoint('POST', '/api/workbooks', 201, newWorkbook);
      workbookId = response.body.id;
    });

    test('GET /api/workbooks/:id/charts - Retrieve all charts for a workbook', async () => {
      await testEndpoint('GET', `/api/workbooks/${workbookId}/charts`, 200);
    });

    test('POST /api/workbooks/:id/charts - Create a new chart', async () => {
      const newChart = mockDataGenerator.generateChart();
      const response = await testEndpoint('POST', `/api/workbooks/${workbookId}/charts`, 201, newChart);
      chartId = response.body.id;
    });

    test('GET /api/workbooks/:id/charts/:chartId - Retrieve a specific chart', async () => {
      await testEndpoint('GET', `/api/workbooks/${workbookId}/charts/${chartId}`, 200);
    });

    test('PUT /api/workbooks/:id/charts/:chartId - Update an existing chart', async () => {
      const updatedChart = mockDataGenerator.generateChart();
      await testEndpoint('PUT', `/api/workbooks/${workbookId}/charts/${chartId}`, 200, updatedChart);
    });

    test('DELETE /api/workbooks/:id/charts/:chartId - Delete a chart', async () => {
      await testEndpoint('DELETE', `/api/workbooks/${workbookId}/charts/${chartId}`, 204);
    });
  });

  describe('Comment Endpoints', () => {
    let workbookId: string;
    let commentId: string;

    beforeAll(async () => {
      const newWorkbook = mockDataGenerator.generateWorkbook();
      const response = await testEndpoint('POST', '/api/workbooks', 201, newWorkbook);
      workbookId = response.body.id;
    });

    test('GET /api/workbooks/:id/comments - Retrieve all comments for a workbook', async () => {
      await testEndpoint('GET', `/api/workbooks/${workbookId}/comments`, 200);
    });

    test('POST /api/workbooks/:id/comments - Create a new comment', async () => {
      const newComment = mockDataGenerator.generateComment();
      const response = await testEndpoint('POST', `/api/workbooks/${workbookId}/comments`, 201, newComment);
      commentId = response.body.id;
    });

    test('GET /api/workbooks/:id/comments/:commentId - Retrieve a specific comment', async () => {
      await testEndpoint('GET', `/api/workbooks/${workbookId}/comments/${commentId}`, 200);
    });

    test('PUT /api/workbooks/:id/comments/:commentId - Update an existing comment', async () => {
      const updatedComment = mockDataGenerator.generateComment();
      await testEndpoint('PUT', `/api/workbooks/${workbookId}/comments/${commentId}`, 200, updatedComment);
    });

    test('DELETE /api/workbooks/:id/comments/:commentId - Delete a comment', async () => {
      await testEndpoint('DELETE', `/api/workbooks/${workbookId}/comments/${commentId}`, 204);
    });
  });

  describe('Error Handling Tests', () => {
    test('Invalid workbook ID', async () => {
      await testEndpoint('GET', '/api/workbooks/invalid-id', 404);
    });

    test('Invalid worksheet ID', async () => {
      const workbookId = 'valid-workbook-id';
      await testEndpoint('GET', `/api/workbooks/${workbookId}/worksheets/invalid-id`, 404);
    });

    test('Invalid cell reference', async () => {
      const workbookId = 'valid-workbook-id';
      const worksheetId = 'valid-worksheet-id';
      await testEndpoint('GET', `/api/workbooks/${workbookId}/worksheets/${worksheetId}/cells/INVALID`, 400);
    });

    test('Invalid range reference', async () => {
      const workbookId = 'valid-workbook-id';
      const worksheetId = 'valid-worksheet-id';
      await testEndpoint('GET', `/api/workbooks/${workbookId}/worksheets/${worksheetId}/ranges/INVALID`, 400);
    });

    test('Invalid chart ID', async () => {
      const workbookId = 'valid-workbook-id';
      await testEndpoint('GET', `/api/workbooks/${workbookId}/charts/invalid-id`, 404);
    });

    test('Invalid comment ID', async () => {
      const workbookId = 'valid-workbook-id';
      await testEndpoint('GET', `/api/workbooks/${workbookId}/comments/invalid-id`, 404);
    });

    test('Unauthorized access attempt', async () => {
      const response = await request.get('/api/workbooks').set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });

    test('Rate limiting responses', async () => {
      for (let i = 0; i < 100; i++) {
        await request.get('/api/workbooks').set('Authorization', `Bearer ${authToken}`);
      }
      const response = await request.get('/api/workbooks').set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(429);
    });
  });

  describe('Performance Tests', () => {
    test('Response time for retrieving large workbooks', async () => {
      const start = Date.now();
      await testEndpoint('GET', '/api/workbooks/large-workbook-id', 200);
      const end = Date.now();
      const responseTime = end - start;
      expect(responseTime).toBeLessThan(1000); // Assuming a 1-second threshold
    });

    test('Response time for updating multiple cells simultaneously', async () => {
      const workbookId = 'performance-test-workbook';
      const worksheetId = 'performance-test-worksheet';
      const rangeRef = 'A1:Z100';
      const updatedRange = mockDataGenerator.generateLargeRange();

      const start = Date.now();
      await testEndpoint('PUT', `/api/workbooks/${workbookId}/worksheets/${worksheetId}/ranges/${rangeRef}`, 200, updatedRange);
      const end = Date.now();
      const responseTime = end - start;
      expect(responseTime).toBeLessThan(2000); // Assuming a 2-second threshold
    });

    test('Concurrent request handling', async () => {
      const concurrentRequests = 50;
      const promises = [];

      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(testEndpoint('GET', '/api/workbooks', 200));
      }

      const results = await Promise.all(promises);
      results.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Security Tests', () => {
    test('Authentication token validation', async () => {
      const response = await request.get('/api/workbooks').set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });

    test('Authorization checks for different user roles', async () => {
      const viewerToken = await testHelpers.getAuthToken('viewer');
      const editorToken = await testHelpers.getAuthToken('editor');
      const adminToken = await testHelpers.getAuthToken('admin');

      const workbookId = 'test-workbook-id';

      // Viewer should be able to read but not modify
      await request.get(`/api/workbooks/${workbookId}`).set('Authorization', `Bearer ${viewerToken}`).expect(200);
      await request.put(`/api/workbooks/${workbookId}`).set('Authorization', `Bearer ${viewerToken}`).expect(403);

      // Editor should be able to read and modify
      await request.get(`/api/workbooks/${workbookId}`).set('Authorization', `Bearer ${editorToken}`).expect(200);
      await request.put(`/api/workbooks/${workbookId}`).set('Authorization', `Bearer ${editorToken}`).expect(200);

      // Admin should have full access
      await request.get(`/api/workbooks/${workbookId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      await request.put(`/api/workbooks/${workbookId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      await request.delete(`/api/workbooks/${workbookId}`).set('Authorization', `Bearer ${adminToken}`).expect(204);
    });

    test('Input sanitization and validation', async () => {
      const maliciousInput = {
        name: '<script>alert("XSS")</script>',
        formula: '=MALICIOUS_FORMULA()'
      };

      const response = await testEndpoint('POST', '/api/workbooks', 400, maliciousInput);
      expect(response.body.error).toContain('Invalid input');
    });

    test('CORS policy enforcement', async () => {
      const response = await request.get('/api/workbooks')
        .set('Origin', 'https://malicious-site.com')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});