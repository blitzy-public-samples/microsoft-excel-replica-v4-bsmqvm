import { createMockWorkbook, createMockWorksheet, createMockCell, renderWithProviders, mockAPICall, setupTestEnvironment } from '../utils/test-helpers';
import { MockDataGenerator } from '../utils/mock-data-generator';
import { Workbook, Worksheet, Cell } from '../../shared/interfaces';
import { api } from '../../frontend-web/src/services/api';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Frontend-Backend Integration Tests', () => {
  test('Workbook Creation', async () => {
    const mockWorkbook: Workbook = createMockWorkbook();
    server.use(
      rest.post('/api/workbooks', (req, res, ctx) => {
        return res(ctx.json(mockWorkbook));
      })
    );

    const { result } = renderWithProviders(() => api.createWorkbook());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockWorkbook);
  });

  test('Worksheet Manipulation', async () => {
    const mockWorkbook: Workbook = createMockWorkbook();
    const newWorksheet: Worksheet = createMockWorksheet();

    server.use(
      rest.get('/api/workbooks/:id', (req, res, ctx) => {
        return res(ctx.json(mockWorkbook));
      }),
      rest.post('/api/workbooks/:id/worksheets', (req, res, ctx) => {
        return res(ctx.json(newWorksheet));
      }),
      rest.put('/api/workbooks/:id/worksheets/:sheetId', (req, res, ctx) => {
        return res(ctx.json({ ...newWorksheet, name: 'Updated Sheet' }));
      }),
      rest.delete('/api/workbooks/:id/worksheets/:sheetId', (req, res, ctx) => {
        return res(ctx.status(204));
      })
    );

    const { result, rerender } = renderWithProviders(() => ({
      workbook: api.getWorkbook(mockWorkbook.id),
      addWorksheet: api.addWorksheet(mockWorkbook.id, newWorksheet),
      updateWorksheet: api.updateWorksheet(mockWorkbook.id, newWorksheet.id, { name: 'Updated Sheet' }),
      deleteWorksheet: api.deleteWorksheet(mockWorkbook.id, newWorksheet.id),
    }));

    await waitFor(() => {
      expect(result.current.workbook.isSuccess).toBe(true);
    });

    rerender();

    await waitFor(() => {
      expect(result.current.addWorksheet.isSuccess).toBe(true);
    });

    rerender();

    await waitFor(() => {
      expect(result.current.updateWorksheet.isSuccess).toBe(true);
    });

    rerender();

    await waitFor(() => {
      expect(result.current.deleteWorksheet.isSuccess).toBe(true);
    });

    expect(result.current.workbook.data).toEqual(mockWorkbook);
    expect(result.current.addWorksheet.data).toEqual(newWorksheet);
    expect(result.current.updateWorksheet.data).toEqual({ ...newWorksheet, name: 'Updated Sheet' });
    expect(result.current.deleteWorksheet.data).toBeUndefined();
  });

  test('Cell Operations', async () => {
    const mockWorksheet: Worksheet = createMockWorksheet();
    const mockCell: Cell = createMockCell();

    server.use(
      rest.get('/api/worksheets/:id/cells/:cellId', (req, res, ctx) => {
        return res(ctx.json(mockCell));
      }),
      rest.put('/api/worksheets/:id/cells/:cellId', (req, res, ctx) => {
        return res(ctx.json({ ...mockCell, value: 'New Value' }));
      })
    );

    const { result, rerender } = renderWithProviders(() => ({
      getCell: api.getCell(mockWorksheet.id, mockCell.id),
      updateCell: api.updateCell(mockWorksheet.id, mockCell.id, { value: 'New Value' }),
    }));

    await waitFor(() => {
      expect(result.current.getCell.isSuccess).toBe(true);
    });

    rerender();

    await waitFor(() => {
      expect(result.current.updateCell.isSuccess).toBe(true);
    });

    expect(result.current.getCell.data).toEqual(mockCell);
    expect(result.current.updateCell.data).toEqual({ ...mockCell, value: 'New Value' });
  });

  test('Formula Calculation', async () => {
    const mockWorksheet: Worksheet = createMockWorksheet();
    const formulaCell: Cell = createMockCell({ value: '=SUM(A1:A3)', formula: '=SUM(A1:A3)' });
    const dependentCells: Cell[] = [
      createMockCell({ id: 'A1', value: '1' }),
      createMockCell({ id: 'A2', value: '2' }),
      createMockCell({ id: 'A3', value: '3' }),
    ];

    server.use(
      rest.get('/api/worksheets/:id/cells/:cellId', (req, res, ctx) => {
        const cellId = req.params.cellId as string;
        if (cellId === formulaCell.id) {
          return res(ctx.json(formulaCell));
        }
        const cell = dependentCells.find(c => c.id === cellId);
        return res(ctx.json(cell));
      }),
      rest.post('/api/worksheets/:id/calculate', (req, res, ctx) => {
        return res(ctx.json({ ...formulaCell, value: '6', calculatedValue: 6 }));
      })
    );

    const { result, rerender } = renderWithProviders(() => ({
      getFormulaCell: api.getCell(mockWorksheet.id, formulaCell.id),
      getDependentCells: Promise.all(dependentCells.map(cell => api.getCell(mockWorksheet.id, cell.id))),
      calculateFormula: api.calculateFormula(mockWorksheet.id, formulaCell.id),
    }));

    await waitFor(() => {
      expect(result.current.getFormulaCell.isSuccess).toBe(true);
      expect(result.current.getDependentCells.isSuccess).toBe(true);
    });

    rerender();

    await waitFor(() => {
      expect(result.current.calculateFormula.isSuccess).toBe(true);
    });

    expect(result.current.getFormulaCell.data).toEqual(formulaCell);
    expect(result.current.getDependentCells.data).toEqual(dependentCells);
    expect(result.current.calculateFormula.data).toEqual({ ...formulaCell, value: '6', calculatedValue: 6 });
  });

  test('Data Persistence', async () => {
    const mockWorkbook: Workbook = createMockWorkbook();

    server.use(
      rest.post('/api/workbooks/:id/save', (req, res, ctx) => {
        return res(ctx.json({ message: 'Workbook saved successfully' }));
      }),
      rest.get('/api/workbooks/:id', (req, res, ctx) => {
        return res(ctx.json(mockWorkbook));
      })
    );

    const { result, rerender } = renderWithProviders(() => ({
      saveWorkbook: api.saveWorkbook(mockWorkbook.id),
      loadWorkbook: api.getWorkbook(mockWorkbook.id),
    }));

    await waitFor(() => {
      expect(result.current.saveWorkbook.isSuccess).toBe(true);
    });

    rerender();

    await waitFor(() => {
      expect(result.current.loadWorkbook.isSuccess).toBe(true);
    });

    expect(result.current.saveWorkbook.data).toEqual({ message: 'Workbook saved successfully' });
    expect(result.current.loadWorkbook.data).toEqual(mockWorkbook);
  });

  test('Collaborative Editing', async () => {
    const mockWorkbook: Workbook = createMockWorkbook();
    const mockCell: Cell = createMockCell();
    const mockUser1 = { id: 'user1', name: 'User 1' };
    const mockUser2 = { id: 'user2', name: 'User 2' };

    const mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
    };

    server.use(
      rest.post('/api/workbooks/:id/collaborate', (req, res, ctx) => {
        return res(ctx.json({ socketUrl: 'wss://mock-socket-url' }));
      }),
      rest.put('/api/worksheets/:id/cells/:cellId', (req, res, ctx) => {
        return res(ctx.json({ ...mockCell, value: 'Updated by User 1' }));
      })
    );

    jest.mock('socket.io-client', () => {
      return jest.fn(() => mockSocket);
    });

    const { result, rerender } = renderWithProviders(() => ({
      startCollaboration: api.startCollaboration(mockWorkbook.id),
      updateCell: api.updateCell(mockWorkbook.worksheets[0].id, mockCell.id, { value: 'Updated by User 1' }),
    }));

    await waitFor(() => {
      expect(result.current.startCollaboration.isSuccess).toBe(true);
    });

    // Simulate real-time updates
    mockSocket.on.mock.calls[0][1]({ user: mockUser2, cell: { ...mockCell, value: 'Updated by User 2' } });

    rerender();

    await waitFor(() => {
      expect(result.current.updateCell.isSuccess).toBe(true);
    });

    expect(result.current.startCollaboration.data).toEqual({ socketUrl: 'wss://mock-socket-url' });
    expect(result.current.updateCell.data).toEqual({ ...mockCell, value: 'Updated by User 1' });
    expect(mockSocket.emit).toHaveBeenCalledWith('cell_updated', { user: mockUser1, cell: { ...mockCell, value: 'Updated by User 1' } });
  });

  test('Cross-Platform Consistency', async () => {
    const mockWorkbook: Workbook = createMockWorkbook();
    const mockCell: Cell = createMockCell();

    const platforms = ['web', 'desktop', 'mobile'];

    for (const platform of platforms) {
      server.use(
        rest.get(`/api/${platform}/workbooks/:id`, (req, res, ctx) => {
          return res(ctx.json(mockWorkbook));
        }),
        rest.put(`/api/${platform}/worksheets/:id/cells/:cellId`, (req, res, ctx) => {
          return res(ctx.json({ ...mockCell, value: `Updated on ${platform}` }));
        })
      );
    }

    const results = await Promise.all(platforms.map(async (platform) => {
      const { result } = renderWithProviders(() => ({
        getWorkbook: api.getWorkbook(mockWorkbook.id, platform),
        updateCell: api.updateCell(mockWorkbook.worksheets[0].id, mockCell.id, { value: `Updated on ${platform}` }, platform),
      }));

      await waitFor(() => {
        expect(result.current.getWorkbook.isSuccess).toBe(true);
        expect(result.current.updateCell.isSuccess).toBe(true);
      });

      return result.current;
    }));

    results.forEach((result, index) => {
      expect(result.getWorkbook.data).toEqual(mockWorkbook);
      expect(result.updateCell.data).toEqual({ ...mockCell, value: `Updated on ${platforms[index]}` });
    });

    // Verify data consistency across platforms
    const uniqueWorkbooks = new Set(results.map(r => JSON.stringify(r.getWorkbook.data)));
    expect(uniqueWorkbooks.size).toBe(1);
  });
});