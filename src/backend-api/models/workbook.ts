import mongoose, { Schema, Document } from 'mongoose';

// Assuming the structure of Worksheet and User models
interface IWorksheet extends Document {
  // Add worksheet properties here
}

interface IUser extends Document {
  // Add user properties here
}

export interface IWorkbook extends Document {
  name: string;
  owner: IUser['_id'];
  worksheets: IWorksheet['_id'][];
  sharedWith: Array<{
    user: IUser['_id'];
    permission: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isPublic: boolean;
  tags: string[];
  settings: Record<string, any>;
}

const WorkbookSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  worksheets: [{ type: Schema.Types.ObjectId, ref: 'Worksheet' }],
  sharedWith: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    permission: { type: String, enum: ['read', 'write', 'admin'], default: 'read' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
  isPublic: { type: Boolean, default: false },
  tags: [{ type: String }],
  settings: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

// Pre-save middleware
WorkbookSchema.pre('save', function(next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

// Add any additional methods or statics here

const Workbook = mongoose.model<IWorkbook>('Workbook', WorkbookSchema);

export default Workbook;