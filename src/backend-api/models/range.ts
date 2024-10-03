import mongoose, { Schema, Document } from 'mongoose';
import { ICell } from './cell';
import { IWorksheet } from './worksheet';

export interface IRange extends Document {
  worksheet: IWorksheet['_id'];
  startCell: {
    row: number;
    column: number;
  };
  endCell: {
    row: number;
    column: number;
  };
  cells: ICell['_id'][];
  name?: string;
  formula?: string;
  format?: object;
  isLocked: boolean;
}

const RangeSchema: Schema = new Schema({
  worksheet: {
    type: Schema.Types.ObjectId,
    ref: 'Worksheet',
    required: true
  },
  startCell: {
    row: { type: Number, required: true },
    column: { type: Number, required: true }
  },
  endCell: {
    row: { type: Number, required: true },
    column: { type: Number, required: true }
  },
  cells: [{
    type: Schema.Types.ObjectId,
    ref: 'Cell'
  }],
  name: { type: String },
  formula: { type: String },
  format: { type: Object },
  isLocked: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Pre-save middleware
RangeSchema.pre('save', async function(next) {
  // Perform additional operations or validations before saving a range document
  // For example, update related documents or ensure data integrity
  try {
    // Validate that the start cell comes before the end cell
    if (this.startCell.row > this.endCell.row || this.startCell.column > this.endCell.column) {
      throw new Error('Invalid range: start cell must come before end cell');
    }

    // Ensure that the cells array contains only unique cell IDs
    this.cells = [...new Set(this.cells)];

    // Additional operations can be added here

    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for getting the range address (e.g., "A1:B5")
RangeSchema.virtual('address').get(function() {
  const colToLetter = (col: number) => String.fromCharCode(65 + col);
  return `${colToLetter(this.startCell.column)}${this.startCell.row + 1}:${colToLetter(this.endCell.column)}${this.endCell.row + 1}`;
});

// Method to check if a cell is within the range
RangeSchema.methods.containsCell = function(row: number, column: number): boolean {
  return row >= this.startCell.row && row <= this.endCell.row &&
         column >= this.startCell.column && column <= this.endCell.column;
};

// Static method to find ranges by worksheet
RangeSchema.statics.findByWorksheet = function(worksheetId: string) {
  return this.find({ worksheet: worksheetId });
};

export const Range = mongoose.model<IRange>('Range', RangeSchema);