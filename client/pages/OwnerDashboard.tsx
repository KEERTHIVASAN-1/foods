import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, Check, X, Search, Image as ImageIcon, Package, Star, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { FoodItem, Restaurant } from '../types';
import { api } from '../utils/api';
import { transformItem } from '../utils/transformers';
import { ensureUniqueItemImages } from '../utils/imageMapper';

type View = 'dashboard' | 'items' | 'reviews';
type FormView = 'list' | 'form';

const OwnerDashboard: React.FC = () => {
  const { user } = useApp();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [view, setView] = useState<FormView>('list');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const initialFormState: Partial<FoodItem> = {
    name: '',
    price: 0,
    imageUrl: '',
    description: '',
    rating: 0,
    isVeg: true,
    available: true,
    tags: [],
    calories: 0,
    preparationTime: '15 min'
  };
  const [formData, setFormData] = useState<Partial<FoodItem>>(initialFormState);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeView === 'reviews' && restaurant && items.length > 0) {
      loadReviews();
    }
  }, [activeView, restaurant, items]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const restaurantData = await api.getOwnerRestaurant();
      setRestaurant(restaurantData);
      
      const itemsData = await api.getRestaurantItems(restaurantData._id);
      const transformedItems = itemsData.map((item: any) => transformItem(item, restaurantData.name));
      // Ensure ALL items have unique images - NO COMPROMISE
      const itemsWithUniqueImages = ensureUniqueItemImages(transformedItems);
      setItems(itemsWithUniqueImages);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!restaurant) return;
    try {
      const reviewsData = await api.getRestaurantReviews(restaurant._id || restaurant.id!);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleUpdateCoverImage = async (newImageUrl: string) => {
    if (!restaurant || !newImageUrl.trim()) return;
    
    // Basic URL validation
    try {
      new URL(newImageUrl.trim());
    } catch (e) {
      alert('Please enter a valid image URL');
      return;
    }

    try {
      const updatedRestaurant = await api.updateRestaurant(restaurant._id || restaurant.id!, {
        image: newImageUrl.trim()
      });
      
      // Immediately update the restaurant state with the new image URL
      setRestaurant(prevRestaurant => ({
        ...prevRestaurant!,
        image: newImageUrl.trim()
      }));
      
      // Reload dashboard data to ensure everything is in sync with server
      await loadDashboardData();
      
      alert('Cover image updated successfully!');
    } catch (error: any) {
      console.error('Error updating cover image:', error);
      alert(error.message || 'Failed to update cover image. Please try again.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateItem(editingItem._id || editingItem.id!, {
          ...formData,
          imageUrl: formData.imageUrl || formData.image
        });
      } else {
        await api.createItem({
          ...formData,
          imageUrl: formData.imageUrl || formData.image,
          tags: formData.tags || []
        });
      }
      await loadDashboardData();
      setView('list');
      setEditingItem(null);
      setFormData(initialFormState);
    } catch (error: any) {
      alert(error.message || 'Failed to save item');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteItem(id);
      await loadDashboardData();
      setDeleteConfirm(null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete item');
    }
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData(item);
    setView('form');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      approved: 'bg-green-100 text-green-700 border-green-300',
      rejected: 'bg-red-100 text-red-700 border-red-300'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const topSellingItems = [...items].sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0)).slice(0, 5);
  const averageRating = items.length > 0 
    ? (items.reduce((sum, item) => sum + (item.rating || 0), 0) / items.length).toFixed(1)
    : '0.0';
  const totalReviews = reviews.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No restaurant found. Please contact support.</p>
      </div>
    );
  }

  const filteredItems = items.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="pb-20 max-w-[95%] md:max-w-6xl mx-auto px-2 md:px-4">
      {/* Header with Restaurant Info */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusBadge(restaurant.status || 'pending')}`}>
                {restaurant.status?.toUpperCase() || 'PENDING'}
              </span>
              <span className="text-sm text-gray-600">{restaurant.cuisine}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 font-bold transition-colors ${
              activeView === 'dashboard'
                ? 'text-brand-orange border-b-2 border-brand-orange'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('items')}
            className={`px-4 py-2 font-bold transition-colors ${
              activeView === 'items'
                ? 'text-brand-orange border-b-2 border-brand-orange'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveView('reviews')}
            className={`px-4 py-2 font-bold transition-colors ${
              activeView === 'reviews'
                ? 'text-brand-orange border-b-2 border-brand-orange'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Restaurant Cover Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Restaurant Cover Image</h2>
              <button
                onClick={async () => {
                  const currentImage = restaurant.image || '';
                  const newImage = prompt('Enter new cover image URL:', currentImage);
                  if (newImage !== null && newImage.trim() && newImage.trim() !== currentImage) {
                    await handleUpdateCoverImage(newImage.trim());
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-red transition-colors"
              >
                <Edit2 size={18} />
                <span>Edit Cover Image</span>
              </button>
            </div>
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {!restaurant.image && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No cover image set</p>
                  </div>
                </div>
              )}
            </div>
            {restaurant.image && (
              <p className="text-xs text-gray-500 mt-2 break-all">{restaurant.image}</p>
            )}
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{items.length}</p>
                </div>
                <Package className="w-10 h-10 text-brand-orange opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
                </div>
                <Star className="w-10 h-10 text-yellow-500 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
                </div>
                <MessageSquare className="w-10 h-10 text-blue-500 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Top Selling</p>
                  <p className="text-3xl font-bold text-gray-900">{topSellingItems.length}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
              </div>
            </motion.div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Selling Items</h2>
            {topSellingItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {topSellingItems.map((item, index) => (
                  <motion.div
                    key={item.id || item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl || item.image}
                        alt={item.name}
                        className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base md:text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600">Orders: {item.orderCount || 0}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Items Management View */}
      {activeView === 'items' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {view === 'list' ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
                  <p className="text-gray-600 text-sm">Manage your restaurant menu</p>
                </div>
                {restaurant.status === 'approved' ? (
                  <button
                    onClick={() => { setEditingItem(null); setFormData(initialFormState); setView('form'); }}
                    className="bg-brand-orange text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={18} />
                    Add Item
                  </button>
                ) : (
                  <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                    Restaurant must be approved to add items
                  </div>
                )}
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                  <div className="col-span-4">Item</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Rating</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      {searchTerm ? 'No items found' : 'No items yet. Add your first item!'}
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <motion.div
                        key={item.id || item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-gray-50 transition-colors"
                      >
                        <div className="col-span-4 flex items-center gap-3 mb-3 md:mb-0">
                          <img
                            src={item.imageUrl || item.image}
                            alt={item.name}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-gray-900 truncate">{item.name}</div>
                            <div className="text-xs text-gray-500 truncate">{item.restaurant}</div>
                          </div>
                        </div>

                        <div className="col-span-2 flex justify-between md:block mb-1 md:mb-0">
                          <span className="md:hidden text-gray-500 text-sm">Price:</span>
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                        </div>

                        <div className="col-span-2 flex justify-between md:block mb-1 md:mb-0">
                          <span className="md:hidden text-gray-500 text-sm">Status:</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.available ? 'Available' : 'Sold Out'}
                          </span>
                        </div>

                        <div className="col-span-2 flex justify-between md:block mb-3 md:mb-0">
                          <span className="md:hidden text-gray-500 text-sm">Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{item.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="col-span-2 flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item._id || item.id!)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'New Item'}</h2>
                <button
                  onClick={() => { setView('list'); setEditingItem(null); setFormData(initialFormState); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Item Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Price ($) *</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full p-3 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Food Image URL (Unsplash) *</label>
                  <p className="text-xs text-gray-600 mb-2">Paste Unsplash image URL only</p>
                  <div className="flex gap-4">
                    <input
                      required
                      type="url"
                      value={formData.imageUrl || formData.image || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData({ ...formData, image: url, imageUrl: url });
                      }}
                      className="flex-1 p-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
                      {(formData.imageUrl || formData.image) ? (
                        <img
                          src={formData.imageUrl || formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon size={24} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-orange resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Preparation Time</label>
                    <input
                      type="text"
                      value={formData.preparationTime || '15 min'}
                      onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                      className="w-full p-3 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-orange"
                      placeholder="15 min"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Calories</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.calories || 0}
                      onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Rating (0-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating || 0}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                      className="w-full p-3 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-orange"
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVeg || false}
                      onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange"
                    />
                    <span className="font-medium text-gray-700">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.available !== false}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange"
                    />
                    <span className="font-medium text-gray-700">Available</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => { setView('list'); setEditingItem(null); setFormData(initialFormState); }}
                    className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Check size={20} /> Save Item
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Reviews View */}
      {activeView === 'reviews' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id || review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{review.userName || 'Anonymous'}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.itemId && (
                        <p className="text-sm text-gray-600">Item: {(review.itemId as any)?.name || review.itemId || 'N/A'}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Item</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
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

export default OwnerDashboard;

