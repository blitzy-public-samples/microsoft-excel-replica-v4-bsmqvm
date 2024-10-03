import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Comment document
export interface IComment extends Document {
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  cell: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  resolved: boolean;
  replies: mongoose.Schema.Types.ObjectId[];
}

// Comment schema definition
const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cell: { type: mongoose.Schema.Types.ObjectId, ref: 'Cell', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
});

// Pre-save middleware
CommentSchema.pre('save', function(next) {
  // Update the updatedAt field
  this.updatedAt = new Date();

  // Perform additional operations or validations before saving
  // For example, you could update related documents or ensure data integrity here

  next();
});

// Create and export the Comment model
export const Comment = mongoose.model<IComment>('Comment', CommentSchema);