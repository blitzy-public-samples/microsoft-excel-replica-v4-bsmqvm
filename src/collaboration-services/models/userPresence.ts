import mongoose from 'mongoose';
import { IUser } from '../../shared/interfaces/IUser';

// Interface extending IUser with presence-specific properties
export interface IUserPresence extends IUser {
  status: string;
  lastActivity: Date;
  currentCell: string;
  deviceType: string;
  colorCode: string;
}

// Document interface for Mongoose
export interface UserPresenceDocument extends mongoose.Document, IUserPresence {}

// Define the UserPresence schema
const UserPresenceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  workbookId: { type: String, required: true },
  status: { type: String, required: true },
  lastActivity: { type: Date, required: true },
  currentCell: { type: String, required: true },
  deviceType: { type: String, required: true },
  colorCode: { type: String, required: true },
});

// Create and export the UserPresence model
export const createUserPresenceModel = (connection: mongoose.Connection): mongoose.Model<UserPresenceDocument> => {
  return connection.model<UserPresenceDocument>('UserPresence', UserPresenceSchema);
};

// Export the schema for use in other parts of the application if needed
export { UserPresenceSchema };