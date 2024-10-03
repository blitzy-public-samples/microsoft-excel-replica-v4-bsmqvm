import mongoose, { Schema, Document } from 'mongoose';
import { IWorkbook } from './workbook';
import { ICell } from './cell';

export interface IWorksheet extends Document {
  name: string;
  workbook: mongoose.Schema.Types.ObjectId | IWorkbook;
  cells: Array<{
    row: number;
    col: number;
    value: any;
    formula: string;
  }>;
  rowCount: number;
  columnCount: number;
  hidden: boolean;
  frozenPane: {
    rows: number;
    columns: number;
  };
  activeCell: {
    row: number;
    col: number;
  };
  mergedCells: mongoose.Schema.Types.ObjectId[];
  conditionalFormats: Array<{
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const WorksheetSchema: Schema = new Schema({
  name: { type: String, required: true },
  workbook: { type: Schema.Types.ObjectId, ref: 'Workbook', required: true },
  cells: [{
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    value: { type: Schema.Types.Mixed },
    formula: { type: String }
  }],
  rowCount: { type: Number, default: 1000 },
  columnCount: { type: Number, default: 26 },
  hidden: { type: Boolean, default: false },
  frozenPane: {
    rows: { type: Number, default: 0 },
    columns: { type: Number, default: 0 }
  },
  activeCell: {
    row: { type: Number, default: 0 },
    col: { type: Number, default: 0 }
  },
  mergedCells: [{ type: Schema.Types.ObjectId, ref: 'Cell' }],
  conditionalFormats: [{
    startRow: { type: Number, required: true },
    startCol: { type: Number, required: true },
    endRow: { type: Number, required: true },
    endCol: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save middleware
WorksheetSchema.pre('save', function(next) {
  const worksheet = this as IWorksheet;
  
  // Update the 'updatedAt' timestamp
  worksheet.updatedAt = new Date();

  // Perform operations like recalculating dependent cells
  // This is a placeholder and should be implemented based on the actual requirements
  // recalculateDependentCells(worksheet);

  // Trigger notifications for collaborative editing
  // This is a placeholder and should be implemented based on the actual requirements
  // triggerCollaborationNotifications(worksheet);

  next();
});

export const Worksheet = mongoose.model<IWorksheet>('Worksheet', WorksheetSchema);