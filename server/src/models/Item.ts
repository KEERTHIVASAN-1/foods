import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  restaurantId: mongoose.Types.ObjectId;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
  tags: string[];
  isVeg: boolean;
  calories: number;
  preparationTime: string;
  available: boolean;
  orderCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>({
  name: { type: String, required: true, trim: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  tags: [{ type: String }],
  isVeg: { type: Boolean, default: true },
  calories: { type: Number, default: 0 },
  preparationTime: { type: String, required: true },
  available: { type: Boolean, default: true },
  orderCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IItem>('Item', ItemSchema);


