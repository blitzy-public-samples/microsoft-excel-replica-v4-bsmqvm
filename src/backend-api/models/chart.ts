import mongoose, { Schema, Document } from 'mongoose';

// Interface representing a Chart document in MongoDB
export interface IChart extends Document {
  title: string;
  type: string;
  data: object;
  options: object;
  workbookId: mongoose.Schema.Types.ObjectId;
  worksheetId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition for the Chart model
const ChartSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: Object, required: true },
  options: { type: Object, required: true },
  workbookId: { type: Schema.Types.ObjectId, ref: 'Workbook', required: true },
  worksheetId: { type: Schema.Types.ObjectId, ref: 'Worksheet', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create and export the Chart model
export const Chart = mongoose.model<IChart>('Chart', ChartSchema);

// Export the ChartSchema for potential use in other models
export { ChartSchema };