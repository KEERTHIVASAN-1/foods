import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  restaurantId?: mongoose.Types.ObjectId;
  itemId?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  userName: string;
  userImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  userName: { type: String, required: true },
  userImage: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IReview>('Review', ReviewSchema);


