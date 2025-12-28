import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../utils/api';
import { getRestaurantImage } from '../utils/imageMapper';

const FoodFeed: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const restaurantsData = await api.getRestaurants();
      // Update restaurant images to look like real restaurant/hotel images
      const restaurantsWithImages = restaurantsData.map((restaurant: Restaurant) => ({
        ...restaurant,
        image: restaurant.image || getRestaurantImage(restaurant.cuisine || 'restaurant')
      }));
      setRestaurants(restaurantsWithImages);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 md:p-3">
        <div className="w-full max-w-[100%] mx-auto px-1 md:px-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-3 pb-24">
      <div className="w-full max-w-[100%] mx-auto px-1 md:px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-2 md:px-0"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Restaurants</h1>
          <p className="text-gray-600 text-sm md:text-base">Discover your favorite food places</p>
        </motion.div>

        {restaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No restaurants available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant._id || restaurant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => navigate(`/restaurant/${restaurant._id || restaurant.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-brand-orange/30 group"
              >
                {/* Restaurant Image */}
                <div className="relative aspect-[4/3] md:aspect-square overflow-hidden bg-gray-200">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {restaurant.offers && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      {restaurant.offers}
                    </div>
                  )}
                  {restaurant.rating && (
                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {restaurant.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Restaurant Info */}
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 line-clamp-1 group-hover:text-brand-orange transition-colors">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <span className="line-clamp-1">{restaurant.cuisine || 'Restaurant'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{restaurant.deliveryTime || '30 min'}</span>
                    </div>
                    {restaurant.address && (
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodFeed;
