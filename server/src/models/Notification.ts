import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'order' | 'restaurant' | 'system';
  read: boolean;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'restaurant', 'system'], default: 'system' },
  read: { type: Boolean, default: false },
  relatedId: { type: Schema.Types.ObjectId }
}, {
  timestamps: true
});

export default mongoose.model<INotification>('Notification', NotificationSchema);





