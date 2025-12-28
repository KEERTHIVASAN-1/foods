import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'owner' | 'admin';
  restaurantId?: mongoose.Types.ObjectId;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', default: null },
  phone: { type: String, trim: true },
  address: { type: String, trim: true }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);

