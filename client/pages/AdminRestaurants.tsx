import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { transformRestaurant } from '../utils/transformers';
import { Restaurant } from '../types';
import { Check, X, Trash2, Eye, Package } from 'lucide-react';
import { FoodItem } from '../types';
import { transformItem } from '../utils/transformers';

interface RestaurantDetailModalProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({ restaurant, onClose }) => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [deleteItemConfirm, setDeleteItemConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, [restaurant]);

  const loadItems = async () => {
    try {
      setLoadingItems(true);
      const itemsData = await api.getRestaurantItems(restaurant._id || restaurant.id!);
      const transformedItems = itemsData.map((item: any) => transformItem(item, restaurant.name));
      setItems(transformedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await api.deleteItem(itemId);
      await loadItems();
      setDeleteItemConfirm(null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete item');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-500">Cuisine</div>
              <div className="font-medium">{restaurant.cuisine}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Rating</div>
              <div className="font-medium">⭐ {restaurant.rating?.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Delivery Time</div>
              <div className="font-medium">{restaurant.deliveryTime}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Opening Hours</div>
              <div className="font-medium">{restaurant.openingHours}</div>
            </div>
          </div>
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Address</div>
            <div className="font-medium">{restaurant.address}</div>
          </div>
          {restaurant.offers && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
              <div className="text-sm text-orange-600 font-bold">Special Offer</div>
              <div className="text-orange-700">{restaurant.offers}</div>
            </div>
          )}

          {/* Items List */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} />
              Menu Items ({items.length})
            </h3>
            {loadingItems ? (
              <div className="text-center py-8 text-gray-500">Loading items...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No items yet</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.imageUrl || item.image}
                        alt={item.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setDeleteItemConfirm(item._id || item.id!)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Item Confirmation */}
      <AnimatePresence>
        {deleteItemConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setDeleteItemConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Item</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteItemConfirm(null)}
                  className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteItem(deleteItemConfirm)}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AdminRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await api.getAllRestaurants();
      setRestaurants(data.map(transformRestaurant));
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.updateRestaurantStatus(id, status);
      await loadRestaurants();
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteRestaurant(id);
      await loadRestaurants();
      setDeleteConfirm(null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete restaurant');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      approved: 'bg-green-100 text-green-700 border-green-300',
      rejected: 'bg-red-100 text-red-700 border-red-300'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-[95%] md:max-w-6xl mx-auto px-2 md:px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Management</h1>
        <p className="text-gray-600">Approve, reject, or delete restaurants</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm">
          <div className="col-span-3">Restaurant</div>
          <div className="col-span-2">Cuisine</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Rating</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-100">
          <AnimatePresence>
            {restaurants.map((restaurant) => (
              <motion.div
                key={restaurant._id || restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 flex items-center gap-3 mb-3 md:mb-0">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 truncate">{restaurant.name}</div>
                    <div className="text-xs text-gray-500 truncate">{restaurant.address}</div>
                  </div>
                </div>

                <div className="col-span-2 flex justify-between md:block mb-1 md:mb-0">
                  <span className="md:hidden text-gray-500 text-sm font-medium">Cuisine:</span>
                  <span className="font-medium text-gray-700">{restaurant.cuisine || 'Mixed'}</span>
                </div>

                <div className="col-span-2 flex justify-between md:block mb-1 md:mb-0">
                  <span className="md:hidden text-gray-500 text-sm font-medium">Status:</span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusBadge(
                      restaurant.status || 'pending'
                    )}`}
                  >
                    {restaurant.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>

                <div className="col-span-2 flex justify-between md:block mb-3 md:mb-0">
                  <span className="md:hidden text-gray-500 text-sm font-medium">Rating:</span>
                  <span className="font-medium text-gray-700">⭐ {restaurant.rating?.toFixed(1) || '0.0'}</span>
                </div>

                <div className="col-span-3 flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium flex items-center gap-1.5"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  {restaurant.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(restaurant._id || restaurant.id!, 'approved')}
                      className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium flex items-center gap-1.5"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                  )}
                  {restaurant.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(restaurant._id || restaurant.id!, 'rejected')}
                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium flex items-center gap-1.5"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteConfirm(restaurant._id || restaurant.id!)}
                    className="px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm font-medium flex items-center gap-1.5"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Restaurant</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this restaurant? All items will be deleted too. This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRestaurants;
