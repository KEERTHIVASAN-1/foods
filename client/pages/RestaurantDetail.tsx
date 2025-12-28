import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Star, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem, Restaurant } from '../types';
import { api } from '../utils/api';
import { transformItem } from '../utils/transformers';
import { ensureUniqueItemImages, getFoodImage } from '../utils/imageMapper';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites, cart } = useApp();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRestaurantData(id);
    }
  }, [id]);

  const loadRestaurantData = async (restaurantId: string) => {
    try {
      setLoading(true);
      const [restaurantData, itemsData] = await Promise.all([
        api.getRestaurant(restaurantId),
        api.getRestaurantItems(restaurantId)
      ]);
      
      setRestaurant(restaurantData);
      const transformedItems = itemsData.map((item: any) => 
        transformItem(item, restaurantData.name)
      );
      // Ensure unique images for all items
      const itemsWithUniqueImages = ensureUniqueItemImages(transformedItems).map((item, index, array) => {
        // If image is still not unique or missing, get a relevant one
        if (!item.imageUrl || !item.image) {
          const existingImages = array.slice(0, index).map(i => i.imageUrl || i.image).filter(Boolean);
          const newImage = getFoodImage(item.name, existingImages);
          return { ...item, imageUrl: newImage, image: newImage };
        }
        return item;
      });
      setItems(itemsWithUniqueImages);
    } catch (error) {
      console.error('Error loading restaurant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (item: FoodItem) => {
    return favorites.some(f => f.id === item.id || f._id === item._id);
  };

  const isInCart = (item: FoodItem) => {
    return cart.some(c => c.id === item.id || c._id === item._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Restaurant not found</p>
          <button
            onClick={() => navigate('/feed')}
            className="text-brand-orange hover:text-brand-red font-semibold"
          >
            Go back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Restaurant Header with Image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/feed')}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{restaurant.rating?.toFixed(1) || '4.5'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">{restaurant.address || restaurant.cuisine}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-5 h-5" />
              <span className="text-sm">{restaurant.deliveryTime || '30-40 min'}</span>
            </div>
            {restaurant.offers && (
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                {restaurant.offers}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Description */}
      {restaurant.description && (
        <div className="bg-white border-b border-gray-200 p-4 md:p-6">
          <p className="text-gray-600 text-sm md:text-base">{restaurant.description}</p>
          {restaurant.openingHours && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{restaurant.openingHours}</span>
            </div>
          )}
        </div>
      )}

      {/* Menu Items */}
      <div className="p-2 md:p-3 lg:p-4 w-full max-w-[100%] mx-auto px-1 md:px-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2 md:px-0">Menu</h2>
        
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item._id || item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden bg-gray-200">
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <button
                    onClick={() => toggleFavorite(item)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
                      isFavorite(item)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite(item) ? 'fill-current' : ''}`}
                    />
                  </button>
                  {item.rating && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {item.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                <div className="p-4 pb-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-brand-red">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.calories && (
                        <span className="text-xs text-gray-500">{item.calories} cal</span>
                      )}
                    </div>
                    {item.preparationTime && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.preparationTime}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    disabled={isInCart(item)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 mb-1 ${
                      isInCart(item)
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-brand-orange hover:bg-brand-red text-white hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {isInCart(item) ? (
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        In Cart
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;


