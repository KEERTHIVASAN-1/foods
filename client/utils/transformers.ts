import { FoodItem, Restaurant } from '../types';

export function transformItem(item: any, restaurantName?: string): FoodItem {
  const restaurantId = typeof item.restaurantId === 'object' 
    ? item.restaurantId._id || item.restaurantId.id
    : item.restaurantId;
  
  const restaurant = restaurantName || 
    (typeof item.restaurantId === 'object' ? item.restaurantId.name : null) || 
    item.restaurant || 
    '';

  return {
    id: item._id || item.id,
    _id: item._id,
    name: item.name,
    restaurant,
    restaurantId,
    price: item.price,
    rating: item.rating || 0,
    image: item.imageUrl || item.image,
    imageUrl: item.imageUrl || item.image,
    description: item.description,
    tags: item.tags || [],
    isVeg: item.isVeg ?? true,
    calories: item.calories || 0,
    preparationTime: item.preparationTime,
    available: item.available ?? true,
    orderCount: item.orderCount || 0
  };
}

export function transformRestaurant(restaurant: any): Restaurant {
  return {
    id: restaurant._id || restaurant.id,
    _id: restaurant._id,
    name: restaurant.name,
    image: restaurant.image,
    rating: restaurant.rating || 0,
    deliveryTime: restaurant.deliveryTime,
    offers: restaurant.offers || '',
    description: restaurant.description,
    address: restaurant.address,
    openingHours: restaurant.openingHours,
    cuisine: restaurant.cuisine,
    status: restaurant.status,
    ownerId: typeof restaurant.ownerId === 'object' 
      ? restaurant.ownerId._id || restaurant.ownerId.id
      : restaurant.ownerId,
    reviews: restaurant.reviews
  };
}
