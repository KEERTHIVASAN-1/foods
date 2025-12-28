import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Star, MapPin, Clock, Search, Filter, X, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem, Restaurant } from '../types';
import { api } from '../utils/api';
import { transformItem } from '../utils/transformers';
import { ensureUniqueItemImages, getFoodImage } from '../utils/imageMapper';

type FilterType = 'all' | 'veg' | 'nonveg';
type SortType = 'default' | 'price-low' | 'price-high' | 'rating-high';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites, cart, user } = useApp();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('default');
  const [reviewItem, setReviewItem] = useState<FoodItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [itemReviews, setItemReviews] = useState<Record<string, any[]>>({});

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
      // Ensure unique images for all items - NO COMPROMISE, ALL MUST BE UNIQUE
      const itemsWithUniqueImages = ensureUniqueItemImages(transformedItems);
      
      // Final verification: ensure no duplicates
      const imageUrls = itemsWithUniqueImages.map(item => item.imageUrl || item.image);
      const uniqueImageUrls = new Set(imageUrls);
      if (imageUrls.length !== uniqueImageUrls.size) {
        console.warn('Duplicate images detected, forcing uniqueness...');
        // Force unique images for any duplicates
        const seenImages = new Map<string, number>();
        const finalItems = itemsWithUniqueImages.map((item, index) => {
          const currentImage = item.imageUrl || item.image;
          const count = seenImages.get(currentImage) || 0;
          seenImages.set(currentImage, count + 1);
          
          if (count > 0) {
            // This is a duplicate, make it unique
            const baseUrl = currentImage.split('&t=')[0].split('&unique=')[0].split('&')[0];
            const uniqueImage = `${baseUrl}&unique=${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
            return { ...item, imageUrl: uniqueImage, image: uniqueImage };
          }
          return item;
        });
        setItems(finalItems);
      } else {
        setItems(itemsWithUniqueImages);
      }
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

  const loadItemReviews = async (itemId: string) => {
    try {
      const reviews = await api.getItemReviews(itemId);
      setItemReviews(prev => ({ ...prev, [itemId]: reviews }));
    } catch (error) {
      console.error('Error loading item reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewItem || !reviewComment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.createReview({
        itemId: reviewItem._id || reviewItem.id,
        restaurantId: restaurant?._id || restaurant?.id,
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      // Reload reviews for this item
      await loadItemReviews(reviewItem._id || reviewItem.id!);
      
      // Close modal
      setReviewItem(null);
      setReviewComment('');
      setReviewRating(5);
      alert('Review submitted successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Veg/Non-Veg filter
    if (filterType === 'veg') {
      filtered = filtered.filter(item => item.isVeg === true);
    } else if (filterType === 'nonveg') {
      filtered = filtered.filter(item => item.isVeg === false);
    }

    // Sort
    const sorted = [...filtered];
    if (sortType === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortType === 'rating-high') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return sorted;
  }, [items, searchTerm, filterType, sortType]);

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
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm md:text-base">{restaurant.rating?.toFixed(1) || '4.5'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm">{restaurant.address || restaurant.cuisine}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm">{restaurant.deliveryTime || '30-40 min'}</span>
            </div>
            {restaurant.offers && (
              <span className="bg-yellow-400 text-gray-900 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-bold">
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
        <div className="mb-6 px-2 md:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search menu items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all text-gray-900 font-medium shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Filter size={16} className="text-gray-500 md:w-[18px] md:h-[18px]" />
              <span className="text-xs md:text-sm font-semibold text-gray-700">Filters:</span>
            </div>
            
            {/* Veg/Non-Veg Filter */}
            <div className="flex gap-1 md:gap-2 bg-gray-100 rounded-lg p-0.5 md:p-1">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                  filterType === 'all'
                    ? 'bg-white text-brand-orange shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('veg')}
                className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                  filterType === 'veg'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🥬 Veg
              </button>
              <button
                onClick={() => setFilterType('nonveg')}
                className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                  filterType === 'nonveg'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🍗 Non-Veg
              </button>
            </div>

            {/* Sort Filter */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="px-2.5 md:px-4 py-1.5 md:py-2 bg-white border-2 border-gray-200 rounded-lg text-xs md:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all shadow-sm flex-1 md:flex-none min-w-[140px]"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Rating: High to Low</option>
            </select>
          </div>
        </div>
        
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>{searchTerm || filterType !== 'all' ? 'No items match your filters' : 'No items available'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 md:gap-4">
            {filteredAndSortedItems.map((item, index) => (
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

                <div className="p-3 md:p-4 pb-4 md:pb-5">
                  <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex flex-col">
                      <span className="text-xl md:text-2xl font-bold text-brand-red">
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

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={isInCart(item)}
                      className={`flex-1 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                        isInCart(item)
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-brand-orange hover:bg-brand-red text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {isInCart(item) ? (
                        <span className="flex items-center justify-center gap-1.5 md:gap-2">
                          <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">In Cart</span>
                          <span className="sm:hidden">Cart</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5 md:gap-2">
                          <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Add to Cart</span>
                          <span className="sm:hidden">Cart</span>
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setReviewItem(item);
                        loadItemReviews(item._id || item.id!);
                      }}
                      className="px-3 py-2.5 md:px-4 md:py-3 rounded-lg font-semibold transition-all duration-200 bg-amber-800 hover:bg-amber-700 text-white shrink-0"
                      title="Write a review"
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setReviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 md:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Review {reviewItem.name}</h3>
                <button
                  onClick={() => setReviewItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
              </div>

              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1.5 md:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 md:w-8 md:h-8 transition-colors ${
                          star <= reviewRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || !reviewComment.trim()}
                className="w-full py-3 bg-brand-orange hover:bg-brand-red text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>

              {/* Existing Reviews */}
              {itemReviews[reviewItem._id || reviewItem.id!] && itemReviews[reviewItem._id || reviewItem.id!].length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Other Reviews</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {itemReviews[reviewItem._id || reviewItem.id!].map((review: any) => (
                      <div key={review._id || review.id} className="border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">{review.userName || 'Anonymous'}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantDetail;


