import { WorkbookService } from '../../../services/workbookService';
import { Workbook } from '../../../models/workbook';
import { validateWorkbookData } from '../../../utils/validation';
import mongoose from 'mongoose';

jest.mock('../../../models/workbook');
jest.mock('../../../utils/validation');

describe('WorkbookService', () => {
  let workbookService: WorkbookService;
  let mockWorkbook: any;
  let mockUser: any;

  beforeEach(() => {
    jest.clearAllMocks();
    workbookService = new WorkbookService();
    mockWorkbook = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Test Workbook',
      ownerId: new mongoose.Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUser = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Test User',
      email: 'test@example.com',
    };
  });

  describe('createWorkbook', () => {
    it('should create a new workbook successfully', async () => {
      const workbookData = {
        name: 'New Workbook',
        ownerId: mockUser._id,
      };

      (validateWorkbookData as jest.Mock).mockReturnValue(true);
      (Workbook.create as jest.Mock).mockResolvedValue(mockWorkbook);

      const result = await workbookService.createWorkbook(workbookData);

      expect(validateWorkbookData).toHaveBeenCalledWith(workbookData);
      expect(Workbook.create).toHaveBeenCalledWith(workbookData);
      expect(result).toEqual(mockWorkbook);
    });

    it('should throw an error if workbook data is invalid', async () => {
      const invalidWorkbookData = {
        name: '',
        ownerId: mockUser._id,
      };

      (validateWorkbookData as jest.Mock).mockReturnValue(false);

      await expect(workbookService.createWorkbook(invalidWorkbookData)).rejects.toThrow('Invalid workbook data');
    });
  });

  describe('getWorkbook', () => {
    it('should retrieve a workbook by id', async () => {
      (Workbook.findById as jest.Mock).mockResolvedValue(mockWorkbook);

      const result = await workbookService.getWorkbook(mockWorkbook._id);

      expect(Workbook.findById).toHaveBeenCalledWith(mockWorkbook._id);
      expect(result).toEqual(mockWorkbook);
    });

    it('should throw an error if workbook is not found', async () => {
      (Workbook.findById as jest.Mock).mockResolvedValue(null);

      await expect(workbookService.getWorkbook(mockWorkbook._id)).rejects.toThrow('Workbook not found');
    });
  });

  describe('updateWorkbook', () => {
    it('should update a workbook successfully', async () => {
      const updateData = { name: 'Updated Workbook Name' };
      const updatedWorkbook = { ...mockWorkbook, ...updateData };

      (validateWorkbookData as jest.Mock).mockReturnValue(true);
      (Workbook.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedWorkbook);

      const result = await workbookService.updateWorkbook(mockWorkbook._id, updateData);

      expect(validateWorkbookData).toHaveBeenCalledWith(updateData);
      expect(Workbook.findByIdAndUpdate).toHaveBeenCalledWith(mockWorkbook._id, updateData, { new: true });
      expect(result).toEqual(updatedWorkbook);
    });

    it('should throw an error if update data is invalid', async () => {
      const invalidUpdateData = { name: '' };

      (validateWorkbookData as jest.Mock).mockReturnValue(false);

      await expect(workbookService.updateWorkbook(mockWorkbook._id, invalidUpdateData)).rejects.toThrow('Invalid workbook data');
    });
  });

  describe('deleteWorkbook', () => {
    it('should delete a workbook successfully', async () => {
      (Workbook.findByIdAndDelete as jest.Mock).mockResolvedValue(mockWorkbook);

      const result = await workbookService.deleteWorkbook(mockWorkbook._id);

      expect(Workbook.findByIdAndDelete).toHaveBeenCalledWith(mockWorkbook._id);
      expect(result).toEqual(mockWorkbook);
    });

    it('should throw an error if workbook is not found', async () => {
      (Workbook.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(workbookService.deleteWorkbook(mockWorkbook._id)).rejects.toThrow('Workbook not found');
    });
  });

  describe('shareWorkbook', () => {
    it('should share a workbook with another user', async () => {
      const sharedUserId = new mongoose.Types.ObjectId();
      const updatedWorkbook = { ...mockWorkbook, sharedWith: [sharedUserId] };

      (Workbook.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedWorkbook);

      const result = await workbookService.shareWorkbook(mockWorkbook._id, sharedUserId);

      expect(Workbook.findByIdAndUpdate).toHaveBeenCalledWith(
        mockWorkbook._id,
        { $addToSet: { sharedWith: sharedUserId } },
        { new: true }
      );
      expect(result).toEqual(updatedWorkbook);
    });

    it('should throw an error if workbook is not found', async () => {
      const sharedUserId = new mongoose.Types.ObjectId();

      (Workbook.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(workbookService.shareWorkbook(mockWorkbook._id, sharedUserId)).rejects.toThrow('Workbook not found');
    });
  });
});