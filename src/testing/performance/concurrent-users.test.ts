import { jest } from '@jest/globals';
import { testHelpers, mockDataGenerator, setupTestEnvironment } from '../utils/test-helpers';
import supertest from 'supertest';
import { WebSocket } from 'websocket';

interface PerformanceMetrics {
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  successRate: number;
  throughput: number;
}

interface UserAction {
  type: 'cellEdit' | 'formulaUpdate' | 'apiRequest';
  payload: any;
}

class ConcurrentUserTests {
  private app: any;
  private api: supertest.SuperTest<supertest.Test>;

  constructor() {
    this.setupTestEnvironment();
  }

  private async setupTestEnvironment() {
    const { app } = await setupTestEnvironment();
    this.app = app;
    this.api = supertest(app);
  }

  private async simulateConcurrentUsers(numUsers: number, actions: UserAction[]): Promise<PerformanceMetrics> {
    const userPromises = Array.from({ length: numUsers }, () => this.simulateUserActions(actions));
    const results = await Promise.all(userPromises);

    const totalResponseTime = results.reduce((sum, result) => sum + result.totalResponseTime, 0);
    const successfulRequests = results.filter(result => result.success).length;

    return {
      averageResponseTime: totalResponseTime / (numUsers * actions.length),
      maxResponseTime: Math.max(...results.map(r => r.maxResponseTime)),
      minResponseTime: Math.min(...results.map(r => r.minResponseTime)),
      successRate: (successfulRequests / (numUsers * actions.length)) * 100,
      throughput: (numUsers * actions.length) / (totalResponseTime / 1000)
    };
  }

  private async simulateUserActions(actions: UserAction[]): Promise<{ totalResponseTime: number; maxResponseTime: number; minResponseTime: number; success: boolean }> {
    let totalResponseTime = 0;
    let maxResponseTime = 0;
    let minResponseTime = Infinity;
    let success = true;

    for (const action of actions) {
      const startTime = Date.now();
      try {
        await this.performAction(action);
        const responseTime = Date.now() - startTime;
        totalResponseTime += responseTime;
        maxResponseTime = Math.max(maxResponseTime, responseTime);
        minResponseTime = Math.min(minResponseTime, responseTime);
      } catch (error) {
        success = false;
        console.error(`Error performing action: ${error}`);
      }
    }

    return { totalResponseTime, maxResponseTime, minResponseTime, success };
  }

  private async performAction(action: UserAction): Promise<void> {
    switch (action.type) {
      case 'cellEdit':
        await this.api.post('/api/cells').send(action.payload);
        break;
      case 'formulaUpdate':
        await this.api.put('/api/formulas').send(action.payload);
        break;
      case 'apiRequest':
        await this.api.get(action.payload.endpoint);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async measureResponseTime(action: () => Promise<any>): Promise<number> {
    const startTime = Date.now();
    await action();
    return Date.now() - startTime;
  }

  public async testConcurrentCellEditing(): Promise<void> {
    const numUsers = 100;
    const mockWorkbook = await mockDataGenerator.generateMockWorkbook();
    const actions: UserAction[] = Array.from({ length: 10 }, () => ({
      type: 'cellEdit',
      payload: mockDataGenerator.generateMockCellEdit(mockWorkbook.id)
    }));

    const metrics = await this.simulateConcurrentUsers(numUsers, actions);

    expect(metrics.successRate).toBeGreaterThan(99);
    expect(metrics.averageResponseTime).toBeLessThan(200);
    expect(metrics.throughput).toBeGreaterThan(100);
  }

  public async testConcurrentFormulaCalculations(): Promise<void> {
    const numUsers = 50;
    const mockWorkbook = await mockDataGenerator.generateMockWorkbook();
    const actions: UserAction[] = Array.from({ length: 5 }, () => ({
      type: 'formulaUpdate',
      payload: mockDataGenerator.generateMockFormulaUpdate(mockWorkbook.id)
    }));

    const metrics = await this.simulateConcurrentUsers(numUsers, actions);

    expect(metrics.successRate).toBeGreaterThan(99);
    expect(metrics.averageResponseTime).toBeLessThan(300);
    expect(metrics.throughput).toBeGreaterThan(50);
  }

  public async testRealTimeUpdates(): Promise<void> {
    const numClients = 20;
    const clients: WebSocket[] = [];

    for (let i = 0; i < numClients; i++) {
      const client = new WebSocket('ws://localhost:8080');
      clients.push(client);
    }

    await Promise.all(clients.map(client => new Promise(resolve => client.on('open', resolve))));

    const updateMessage = JSON.stringify({ type: 'cellUpdate', cellId: 'A1', value: '42' });
    clients[0].send(updateMessage);

    const updatePromises = clients.slice(1).map(client => new Promise(resolve => {
      client.on('message', (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === 'cellUpdate' && data.cellId === 'A1' && data.value === '42') {
          resolve(true);
        }
      });
    }));

    const results = await Promise.race([
      Promise.all(updatePromises),
      new Promise(resolve => setTimeout(() => resolve(false), 5000))
    ]);

    expect(results).toBe(true);

    clients.forEach(client => client.close());
  }

  public async testScalabilityWithIncreasingUsers(): Promise<void> {
    const userScenarios = [10, 100, 1000];
    const actions: UserAction[] = [
      { type: 'cellEdit', payload: mockDataGenerator.generateMockCellEdit('workbook1') },
      { type: 'formulaUpdate', payload: mockDataGenerator.generateMockFormulaUpdate('workbook1') },
      { type: 'apiRequest', payload: { endpoint: '/api/workbooks/workbook1' } }
    ];

    for (const numUsers of userScenarios) {
      const metrics = await this.simulateConcurrentUsers(numUsers, actions);

      console.log(`Performance metrics for ${numUsers} users:`);
      console.log(JSON.stringify(metrics, null, 2));

      expect(metrics.successRate).toBeGreaterThan(95);
      expect(metrics.averageResponseTime).toBeLessThan(1000);
      expect(metrics.throughput).toBeGreaterThan(numUsers / 10);
    }
  }

  public async testAPIPerformanceUnderLoad(): Promise<void> {
    const numUsers = 500;
    const endpoints = [
      '/api/workbooks',
      '/api/worksheets',
      '/api/cells',
      '/api/formulas',
      '/api/charts'
    ];

    const actions: UserAction[] = endpoints.map(endpoint => ({
      type: 'apiRequest',
      payload: { endpoint }
    }));

    const metrics = await this.simulateConcurrentUsers(numUsers, actions);

    expect(metrics.successRate).toBeGreaterThan(99);
    expect(metrics.averageResponseTime).toBeLessThan(500);
    expect(metrics.throughput).toBeGreaterThan(200);

    endpoints.forEach(async (endpoint) => {
      const responseTime = await this.measureResponseTime(() => this.api.get(endpoint));
      expect(responseTime).toBeLessThan(1000);
    });
  }
}

describe('Concurrent User Performance Tests', () => {
  let concurrentUserTests: ConcurrentUserTests;

  beforeAll(async () => {
    concurrentUserTests = new ConcurrentUserTests();
  });

  it('should handle concurrent cell editing', async () => {
    await concurrentUserTests.testConcurrentCellEditing();
  });

  it('should handle concurrent formula calculations', async () => {
    await concurrentUserTests.testConcurrentFormulaCalculations();
  });

  it('should propagate real-time updates to multiple clients', async () => {
    await concurrentUserTests.testRealTimeUpdates();
  });

  it('should maintain performance with increasing number of users', async () => {
    await concurrentUserTests.testScalabilityWithIncreasingUsers();
  });

  it('should handle API requests under heavy load', async () => {
    await concurrentUserTests.testAPIPerformanceUnderLoad();
  });
});