import mongoose from 'mongoose';
import { RedisClient } from 'redis';
import { ErrorHandlingUtils } from '../../shared/utils/ErrorHandlingUtils';

interface IUserPresence {
    userId: string;
    workbookId: string;
    lastActive: Date;
    status: 'online' | 'away' | 'offline';
    currentCell?: string;
}

interface UserPresenceDocument extends mongoose.Document, IUserPresence {}

const userPresenceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    workbookId: { type: String, required: true },
    lastActive: { type: Date, required: true },
    status: { type: String, enum: ['online', 'away', 'offline'], required: true },
    currentCell: { type: String },
});

const createUserPresenceModel = (connection: mongoose.Connection) => 
    connection.model<UserPresenceDocument>('UserPresence', userPresenceSchema);

export class PresenceService {
    private userPresenceModel: mongoose.Model<UserPresenceDocument>;
    private redisClient: RedisClient;

    constructor(connection: mongoose.Connection, redisClient: RedisClient) {
        this.userPresenceModel = createUserPresenceModel(connection);
        this.redisClient = redisClient;
    }

    async updateUserPresence(presenceData: IUserPresence): Promise<UserPresenceDocument> {
        try {
            const updatedPresence = await this.userPresenceModel.findOneAndUpdate(
                { userId: presenceData.userId, workbookId: presenceData.workbookId },
                presenceData,
                { new: true, upsert: true }
            );
            await this.updateRedisPresence(presenceData);
            return updatedPresence;
        } catch (error) {
            ErrorHandlingUtils.handleError('Error updating user presence', error);
            throw error;
        }
    }

    async getUserPresence(userId: string, workbookId: string): Promise<IUserPresence | null> {
        try {
            return await this.userPresenceModel.findOne({ userId, workbookId }).lean();
        } catch (error) {
            ErrorHandlingUtils.handleError('Error getting user presence', error);
            throw error;
        }
    }

    async getWorkbookPresence(workbookId: string): Promise<IUserPresence[]> {
        try {
            return await this.userPresenceModel.find({ workbookId }).lean();
        } catch (error) {
            ErrorHandlingUtils.handleError('Error getting workbook presence', error);
            throw error;
        }
    }

    async removeUserPresence(userId: string, workbookId: string): Promise<void> {
        try {
            await this.userPresenceModel.deleteOne({ userId, workbookId });
            await this.removeRedisPresence(userId, workbookId);
        } catch (error) {
            ErrorHandlingUtils.handleError('Error removing user presence', error);
            throw error;
        }
    }

    private async updateRedisPresence(presenceData: IUserPresence): Promise<void> {
        try {
            const key = `presence:${presenceData.workbookId}`;
            await new Promise<void>((resolve, reject) => {
                this.redisClient.hset(key, presenceData.userId, JSON.stringify(presenceData), (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            await new Promise<void>((resolve, reject) => {
                this.redisClient.expire(key, 3600, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        } catch (error) {
            ErrorHandlingUtils.handleError('Error updating Redis presence', error);
            throw error;
        }
    }

    private async removeRedisPresence(userId: string, workbookId: string): Promise<void> {
        try {
            const key = `presence:${workbookId}`;
            await new Promise<void>((resolve, reject) => {
                this.redisClient.hdel(key, userId, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        } catch (error) {
            ErrorHandlingUtils.handleError('Error removing Redis presence', error);
            throw error;
        }
    }
}

export default PresenceService;