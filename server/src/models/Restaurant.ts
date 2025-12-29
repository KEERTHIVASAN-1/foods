import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  image: string;
  description: string;
  address: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  offers: string;
  openingHours: string;
  ownerId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  deliveryTime: { type: String, required: true },
  offers: { type: String, default: '' },
  openingHours: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  location: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);






