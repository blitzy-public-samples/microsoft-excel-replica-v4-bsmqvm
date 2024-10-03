import mongoose, { Document, Schema, Model } from 'mongoose';
import { UserPresence } from './userPresence';
import { VersionHistory } from './versionHistory';

// Define the interface for the CollaborationSession document
export interface CollaborationSessionDocument extends Document {
  workbookId: string;
  participants: UserPresence[];
  activeUsers: number;
  lastModified: Date;
  versionHistory: VersionHistory[];
  status: string;
  settings: { [key: string]: any };
}

// Define the CollaborationSession schema
const CollaborationSessionSchema: Schema = new Schema({
  workbookId: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'UserPresence' }],
  activeUsers: { type: Number, default: 0 },
  lastModified: { type: Date, default: Date.now },
  versionHistory: [{ type: Schema.Types.ObjectId, ref: 'VersionHistory' }],
  status: { type: String, required: true },
  settings: { type: Schema.Types.Mixed, default: {} }
});

// Create and export the Mongoose model for CollaborationSession
export const CollaborationSessionModel: Model<CollaborationSessionDocument> = mongoose.model<CollaborationSessionDocument>('CollaborationSession', CollaborationSessionSchema);

// Function to create a CollaborationSession model with a specific connection
export function createCollaborationSessionModel(connection: mongoose.Connection): Model<CollaborationSessionDocument> {
  return connection.model<CollaborationSessionDocument>('CollaborationSession', CollaborationSessionSchema);
}