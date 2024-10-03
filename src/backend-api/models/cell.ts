import mongoose, { Schema, Document } from 'mongoose';
import { IWorksheet } from './worksheet';

export interface ICell extends Document {
  value: any;
  formula: string;
  format: object;
  dataType: string;
  worksheet: IWorksheet['_id'];
  row: number;
  column: number;
  isLocked: boolean;
  comment: string;
  hyperlink: string;
  validation: object;
}

const CellSchema: Schema = new Schema({
  value: { type: Schema.Types.Mixed, required: true },
  formula: { type: String, default: '' },
  format: { type: Object, default: {} },
  dataType: { type: String, required: true },
  worksheet: { type: Schema.Types.ObjectId, ref: 'Worksheet', required: true },
  row: { type: Number, required: true },
  column: { type: Number, required: true },
  isLocked: { type: Boolean, default: false },
  comment: { type: String, default: '' },
  hyperlink: { type: String, default: '' },
  validation: { type: Object, default: {} }
}, { timestamps: true });

// Pre-save middleware
CellSchema.pre('save', function(next) {
  // Perform additional operations or validations before saving a cell document
  // For example, you could update related documents or ensure data integrity
  // Call the next function to proceed with the save operation
  next();
});

// Static method to find cells by worksheet
CellSchema.statics.findByWorksheet = function(worksheetId: string) {
  return this.find({ worksheet: worksheetId });
};

// Instance method to update cell value
CellSchema.methods.updateValue = function(newValue: any) {
  this.value = newValue;
  return this.save();
};

export const Cell = mongoose.model<ICell>('Cell', CellSchema);