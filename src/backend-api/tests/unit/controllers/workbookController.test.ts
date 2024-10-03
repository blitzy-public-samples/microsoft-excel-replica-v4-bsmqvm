import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WorkbookController } from '../../../controllers/workbookController';
import { WorkbookService } from '../../../services/workbookService';
import { ApiResponse } from '../../../utils/apiResponse';

jest.mock('../../../services/workbookService');
jest.mock('../../../utils/apiResponse');

describe('WorkbookController', () => {
  let workbookController: WorkbookController;
  let mockWorkbookService: jest.Mocked<WorkbookService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockWorkbookService = {
      createWorkbook: jest.fn(),
      getWorkbook: jest.fn(),
      updateWorkbook: jest.fn(),
      deleteWorkbook: jest.fn(),
      listWorkbooks: jest.fn(),
      shareWorkbook: jest.fn(),
    } as jest.Mocked<WorkbookService>;

    workbookController = new WorkbookController(mockWorkbookService);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('createWorkbook', () => {
    it('should create a workbook and return 201 status', async () => {
      const mockWorkbookData = { name: 'Test Workbook', ownerId: 'user123' };
      const mockCreatedWorkbook = { id: 'wb123', ...mockWorkbookData };

      mockRequest.body = mockWorkbookData;
      mockWorkbookService.createWorkbook.mockResolvedValue(mockCreatedWorkbook);

      await workbookController.createWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockWorkbookService.createWorkbook).toHaveBeenCalledWith(mockWorkbookData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(ApiResponse.success).toHaveBeenCalledWith(mockResponse, StatusCodes.CREATED, 'Workbook created successfully', mockCreatedWorkbook);
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Creation failed');
      mockWorkbookService.createWorkbook.mockRejectedValue(error);

      await workbookController.createWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getWorkbook', () => {
    it('should get a workbook and return 200 status', async () => {
      const mockWorkbookId = 'wb123';
      const mockWorkbook = { id: mockWorkbookId, name: 'Test Workbook' };

      mockRequest.params = { id: mockWorkbookId };
      mockWorkbookService.getWorkbook.mockResolvedValue(mockWorkbook);

      await workbookController.getWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockWorkbookService.getWorkbook).toHaveBeenCalledWith(mockWorkbookId);
      expect(ApiResponse.success).toHaveBeenCalledWith(mockResponse, StatusCodes.OK, 'Workbook retrieved successfully', mockWorkbook);
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Workbook not found');
      mockWorkbookService.getWorkbook.mockRejectedValue(error);

      await workbookController.getWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateWorkbook', () => {
    it('should update a workbook and return 200 status', async () => {
      const mockWorkbookId = 'wb123';
      const mockUpdateData = { name: 'Updated Workbook' };
      const mockUpdatedWorkbook = { id: mockWorkbookId, ...mockUpdateData };

      mockRequest.params = { id: mockWorkbookId };
      mockRequest.body = mockUpdateData;
      mockWorkbookService.updateWorkbook.mockResolvedValue(mockUpdatedWorkbook);

      await workbookController.updateWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockWorkbookService.updateWorkbook).toHaveBeenCalledWith(mockWorkbookId, mockUpdateData);
      expect(ApiResponse.success).toHaveBeenCalledWith(mockResponse, StatusCodes.OK, 'Workbook updated successfully', mockUpdatedWorkbook);
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Update failed');
      mockWorkbookService.updateWorkbook.mockRejectedValue(error);

      await workbookController.updateWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteWorkbook', () => {
    it('should delete a workbook and return 204 status', async () => {
      const mockWorkbookId = 'wb123';

      mockRequest.params = { id: mockWorkbookId };
      mockWorkbookService.deleteWorkbook.mockResolvedValue(undefined);

      await workbookController.deleteWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockWorkbookService.deleteWorkbook).toHaveBeenCalledWith(mockWorkbookId);
      expect(ApiResponse.success).toHaveBeenCalledWith(mockResponse, StatusCodes.NO_CONTENT, 'Workbook deleted successfully');
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Deletion failed');
      mockWorkbookService.deleteWorkbook.mockRejectedValue(error);

      await workbookController.deleteWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('listWorkbooks', () => {
    it('should list workbooks and return 200 status', async () => {
      const mockWorkbooks = [
        { id: 'wb123', name: 'Workbook 1' },
        { id: 'wb456', name: 'Workbook 2' },
      ];

      mockWorkbookService.listWorkbooks.mockResolvedValue(mockWorkbooks);

      await workbookController.listWorkbooks(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockWorkbookService.listWorkbooks).toHaveBeenCalled();
      expect(ApiResponse.success).toHaveBeenCalledWith(mockResponse, StatusCodes.OK, 'Workbooks retrieved successfully', mockWorkbooks);
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Listing failed');
      mockWorkbookService.listWorkbooks.mockRejectedValue(error);

      await workbookController.listWorkbooks(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('shareWorkbook', () => {
    it('should share a workbook and return 200 status', async () => {
      const mockWorkbookId = 'wb123';
      const mockShareData = { userId: 'user456', permission: 'read' };
      const mockSharedWorkbook = { id: mockWorkbookId, sharedWith: [mockShareData] };

      mockRequest.params = { id: mockWorkbookId };
      mockRequest.body = mockShareData;
      mockWorkbookService.shareWorkbook.mockResolvedValue(mockSharedWorkbook);

      await workbookController.shareWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockWorkbookService.shareWorkbook).toHaveBeenCalledWith(mockWorkbookId, mockShareData);
      expect(ApiResponse.success).toHaveBeenCalledWith(mockResponse, StatusCodes.OK, 'Workbook shared successfully', mockSharedWorkbook);
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Sharing failed');
      mockWorkbookService.shareWorkbook.mockRejectedValue(error);

      await workbookController.shareWorkbook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});