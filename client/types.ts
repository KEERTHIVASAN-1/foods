export interface FoodItem {
  id: string;
  _id?: string;
  name: string;
  restaurant: string;
  restaurantId?: string;
  price: number;
  rating: number;
  image: string;
  imageUrl?: string;
  description: string;
  tags: string[];
  isVeg: boolean;
  calories: number;
  preparationTime: string;
  available?: boolean;
  orderCount?: number;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: 'user' | 'owner' | 'admin';
  restaurantId?: string;
  phone?: string;
  address?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userImage?: string;
}

export interface Restaurant {
  id?: string;
  _id?: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  offers: string;
  description?: string;
  address?: string;
  openingHours?: string;
  cuisine?: string;
  status?: 'pending' | 'approved' | 'rejected';
  ownerId?: string;
  reviews?: Review[];
}