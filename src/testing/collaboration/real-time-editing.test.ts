import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { act } from '@testing-library/react';
import MockWebSocket from 'jest-websocket-mock';
import { setupTestEnvironment } from '../setup';
import { createMockWorkbook, createMockWorksheet, createMockCell } from '../utils/test-helpers';
import { generateMockUserData } from '../utils/mock-data-generator';
import { CollaborationService } from '../../collaboration-services/services/collaborationService';
import { useExcelState } from '../../frontend-web/src/hooks/useExcelState';

interface TestUser {
  id: string;
  name: string;
  excelState: ReturnType<typeof useExcelState>;
}

interface CollaborationTestContext {
  users: TestUser[];
  collaborationService: CollaborationService;
  mockWebSocket: MockWebSocket;
}

const setupCollaborationTest = async (userCount: number): Promise<CollaborationTestContext> => {
  const mockWorkbook = createMockWorkbook();
  const mockWorksheet = createMockWorksheet(mockWorkbook);
  const users: TestUser[] = [];

  for (let i = 0; i < userCount; i++) {
    const userData = generateMockUserData();
    const excelState = useExcelState();
    users.push({
      id: userData.id,
      name: userData.name,
      excelState,
    });
  }

  const mockWebSocket = new MockWebSocket('ws://localhost:1234');
  const collaborationService = new CollaborationService(mockWebSocket);

  await setupTestEnvironment();

  return {
    users,
    collaborationService,
    mockWebSocket,
  };
};

const simulateUserEdit = async (user: TestUser, cellAddress: string, newValue: string): Promise<void> => {
  await act(async () => {
    user.excelState.updateCell(cellAddress, newValue);
    await user.excelState.syncChanges();
  });
};

const verifyCollaborationState = (users: TestUser[], expectedState: any): void => {
  users.forEach((user) => {
    expect(user.excelState.getCurrentState()).toEqual(expectedState);
  });
};

describe('Real-time Editing Collaboration Tests', () => {
  let testContext: CollaborationTestContext;

  beforeEach(async () => {
    testContext = await setupCollaborationTest(3);
  });

  afterEach(() => {
    testContext.mockWebSocket.close();
  });

  it('should synchronize changes across all users when one user edits a cell', async () => {
    const { users } = testContext;
    const [user1, user2, user3] = users;

    await simulateUserEdit(user1, 'A1', 'Hello, World!');

    const expectedState = {
      workbook: expect.any(Object),
      activeSheet: expect.any(Object),
      cells: expect.objectContaining({
        A1: expect.objectContaining({ value: 'Hello, World!' }),
      }),
    };

    verifyCollaborationState(users, expectedState);
  });

  it('should handle concurrent edits from multiple users', async () => {
    const { users } = testContext;
    const [user1, user2, user3] = users;

    await Promise.all([
      simulateUserEdit(user1, 'A1', 'User 1 Edit'),
      simulateUserEdit(user2, 'B1', 'User 2 Edit'),
      simulateUserEdit(user3, 'C1', 'User 3 Edit'),
    ]);

    const expectedState = {
      workbook: expect.any(Object),
      activeSheet: expect.any(Object),
      cells: expect.objectContaining({
        A1: expect.objectContaining({ value: 'User 1 Edit' }),
        B1: expect.objectContaining({ value: 'User 2 Edit' }),
        C1: expect.objectContaining({ value: 'User 3 Edit' }),
      }),
    };

    verifyCollaborationState(users, expectedState);
  });

  it('should resolve conflicts when multiple users edit the same cell', async () => {
    const { users, collaborationService } = testContext;
    const [user1, user2] = users;

    // Simulate a conflict resolution strategy
    collaborationService.setConflictResolutionStrategy((conflictingEdits) => {
      // For this test, we'll use a "last write wins" strategy
      return conflictingEdits[conflictingEdits.length - 1];
    });

    await simulateUserEdit(user1, 'A1', 'User 1 Edit');
    await simulateUserEdit(user2, 'A1', 'User 2 Edit');

    const expectedState = {
      workbook: expect.any(Object),
      activeSheet: expect.any(Object),
      cells: expect.objectContaining({
        A1: expect.objectContaining({ value: 'User 2 Edit' }),
      }),
    };

    verifyCollaborationState(users, expectedState);
  });

  it('should maintain consistency when a user rejoins the collaboration session', async () => {
    const { users, collaborationService } = testContext;
    const [user1, user2, user3] = users;

    await simulateUserEdit(user1, 'A1', 'Collaborative Edit');

    // Simulate user3 disconnecting and reconnecting
    await act(async () => {
      await collaborationService.disconnectUser(user3.id);
      await collaborationService.reconnectUser(user3.id);
    });

    const expectedState = {
      workbook: expect.any(Object),
      activeSheet: expect.any(Object),
      cells: expect.objectContaining({
        A1: expect.objectContaining({ value: 'Collaborative Edit' }),
      }),
    };

    verifyCollaborationState(users, expectedState);
  });
});