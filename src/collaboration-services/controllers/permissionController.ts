import { Request, Response } from 'express';
import { PermissionService } from '../services/permissionService';
import { UserRoleEnum } from '../../shared/enums/UserRoleEnum';
import { apiResponse } from '../../shared/utils/apiResponse';

export class PermissionController {
  private permissionService: PermissionService;

  constructor(permissionService: PermissionService) {
    this.permissionService = permissionService;
  }

  public grantPermission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId, userId, role } = req.body;

      if (!sessionId || !userId || !role) {
        apiResponse(res, 400, 'Missing required parameters');
        return;
      }

      if (!Object.values(UserRoleEnum).includes(role)) {
        apiResponse(res, 400, 'Invalid role');
        return;
      }

      await this.permissionService.grantPermission(sessionId, userId, role);
      apiResponse(res, 200, 'Permission granted successfully');
    } catch (error) {
      console.error('Error in grantPermission:', error);
      apiResponse(res, 500, 'Internal server error');
    }
  };

  public revokePermission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId, userId } = req.body;

      if (!sessionId || !userId) {
        apiResponse(res, 400, 'Missing required parameters');
        return;
      }

      await this.permissionService.revokePermission(sessionId, userId);
      apiResponse(res, 200, 'Permission revoked successfully');
    } catch (error) {
      console.error('Error in revokePermission:', error);
      apiResponse(res, 500, 'Internal server error');
    }
  };

  public checkPermission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId, userId, requiredRole } = req.body;

      if (!sessionId || !userId || !requiredRole) {
        apiResponse(res, 400, 'Missing required parameters');
        return;
      }

      if (!Object.values(UserRoleEnum).includes(requiredRole)) {
        apiResponse(res, 400, 'Invalid required role');
        return;
      }

      const hasPermission = await this.permissionService.checkPermission(sessionId, userId, requiredRole);
      apiResponse(res, 200, { hasPermission });
    } catch (error) {
      console.error('Error in checkPermission:', error);
      apiResponse(res, 500, 'Internal server error');
    }
  };

  public getSessionPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        apiResponse(res, 400, 'Missing sessionId parameter');
        return;
      }

      const permissions = await this.permissionService.getSessionPermissions(sessionId);
      apiResponse(res, 200, permissions);
    } catch (error) {
      console.error('Error in getSessionPermissions:', error);
      apiResponse(res, 500, 'Internal server error');
    }
  };

  public updatePermission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId, userId, newRole } = req.body;

      if (!sessionId || !userId || !newRole) {
        apiResponse(res, 400, 'Missing required parameters');
        return;
      }

      if (!Object.values(UserRoleEnum).includes(newRole)) {
        apiResponse(res, 400, 'Invalid new role');
        return;
      }

      await this.permissionService.updatePermission(sessionId, userId, newRole);
      apiResponse(res, 200, 'Permission updated successfully');
    } catch (error) {
      console.error('Error in updatePermission:', error);
      apiResponse(res, 500, 'Internal server error');
    }
  };
}