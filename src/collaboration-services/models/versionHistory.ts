import mongoose from 'mongoose';
import { IUser } from '../../shared/interfaces/IUser';

// Placeholder interface for IUser (since it's not available)
interface IUser {
  id: string;
  name: string;
  email: string;
}

// Interface representing the structure of a version history entry
export interface IVersionHistory {
  versionNumber: number;
  timestamp: Date;
  author: IUser;
  changes: object;
  comment: string;
}

// Mongoose schema for VersionHistory
const VersionHistorySchema = new mongoose.Schema<IVersionHistory>({
  workbookId: { type: String, required: true },
  versionNumber: { type: Number, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  author: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  changes: { type: Object, required: true },
  comment: { type: String, required: true }
});

// Type representing a VersionHistory document
export type VersionHistoryDocument = mongoose.Document & IVersionHistory;

// Function to create and return a Mongoose model for the VersionHistory schema
export function createVersionHistoryModel(connection: mongoose.Connection): mongoose.Model<VersionHistoryDocument> {
  return connection.model<VersionHistoryDocument>('VersionHistory', VersionHistorySchema);
}

// Export the VersionHistorySchema for use in other parts of the application if needed
export { VersionHistorySchema };