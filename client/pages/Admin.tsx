import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, Check, X, Search, Image as ImageIcon, Store } from 'lucide-react';
import { FoodItem } from '../types';
import AdminRestaurants from './AdminRestaurants';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { foods, addFood, updateFood, deleteFood, user, restaurants } = useApp();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [activeTab, setActiveTab] = useState<'items' | 'restaurants'>('items');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.role === 'owner') {
      navigate('/#/owner');
    }
  }, [user, navigate]);

  const initialFormState: Partial<FoodItem> = {
    name: '',
    restaurant: '',
    price: 0,
    image: '',
    imageUrl: '',
    description: '',
    rating: 4.5,
    isVeg: true,
    available: true,
    tags: [],
    calories: 0,
    preparationTime: '15 min'
  };
  const [formData, setFormData] = useState<Partial<FoodItem>>(initialFormState);

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData(item);
    setView('form');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteFood(id);
      } catch (error: any) {
        alert(error.message || 'Failed to delete item');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const itemData = {
          ...editingItem,
          ...formData,
          imageUrl: formData.imageUrl || formData.image,
          restaurantId: user?.restaurantId || restaurants.find(r => r.name === formData.restaurant)?._id
        };
        await updateFood(itemData as FoodItem);
      } else {
        const newItem: FoodItem = {
          id: Date.now().toString(),
          tags: formData.tags || ['New'],
          imageUrl: formData.imageUrl || formData.image || '',
          restaurantId: user?.restaurantId || restaurants.find(r => r.name === formData.restaurant)?._id,
          ...formData
        } as FoodItem;
        await addFood(newItem);
      }
      setView('list');
      setEditingItem(null);
      setFormData(initialFormState);
    } catch (error: any) {
      alert(error.message || 'Failed to save item');
    }
  };

  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Redirect owners to owner dashboard
  if (user?.role === 'owner') {
    window.location.href = '/#/owner';
    return null;
  }

  // Show restaurant management for admin, item management for admin
  if (user?.role === 'admin' && activeTab === 'restaurants') {
    return <AdminRestaurants />;
  }

  return (
    <div className="pb-20 max-w-[95%] md:max-w-6xl mx-auto px-2 md:px-4">
      {user?.role === 'admin' && (
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'restaurants'
                ? 'text-brand-orange border-b-2 border-brand-orange'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Store size={18} />
            Restaurants
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 font-bold transition-colors ${
              activeTab === 'items'
                ? 'text-brand-orange border-b-2 border-brand-orange'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Items
          </button>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'owner' ? 'Owner Dashboard' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-600">Manage your menu items</p>
        </div>
        {view === 'list' && (
            <button 
                onClick={() => { setEditingItem(null); setFormData(initialFormState); setView('form'); }}
                className="bg-brand-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:bg-black transition-colors"
            >
                <Plus size={18} />
                Add Item
            </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
            <motion.div 
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 shadow-sm"
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-500 text-sm">
                        <div className="col-span-4">Product</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Veg/Non</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                        {filteredFoods.map((item) => (
                            <div key={item.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-gray-50 transition-colors group">
                                <div className="col-span-4 flex items-center gap-3 mb-3 md:mb-0">
                                    <img src={item.imageUrl || item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="font-bold text-gray-800 truncate">{item.name}</div>
                                        <div className="text-xs text-gray-500 truncate">{item.restaurant}</div>
                                    </div>
                                </div>
                                
                                <div className="col-span-2 flex justify-between md:block mb-1 md:mb-0">
                                    <span className="md:hidden text-gray-500 text-sm">Price:</span>
                                    <span className="font-medium">${item.price}</span>
                                </div>

                                <div className="col-span-2 flex justify-between md:block mb-1 md:mb-0">
                                     <span className="md:hidden text-gray-500 text-sm">Status:</span>
                                     <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.available ? 'Active' : 'Sold Out'}
                                     </span>
                                </div>

                                <div className="col-span-2 flex justify-between md:block mb-3 md:mb-0">
                                    <span className="md:hidden text-gray-500 text-sm">Type:</span>
                                    <span className={`text-xs font-bold ${item.isVeg ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                                    </span>
                                </div>

                                <div className="col-span-2 flex justify-end gap-2">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id || item._id!)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        ) : (
            <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'New Item'}</h2>
                    <button onClick={() => setView('list')} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Item Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-orange text-gray-900 font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Restaurant</label>
                            {user?.role === 'owner' ? (
                                <input 
                                    type="text" 
                                    value={restaurants.find(r => r._id === user.restaurantId)?.name || ''} 
                                    disabled
                                    className="w-full p-3 bg-gray-100 rounded-xl border border-gray-200 text-gray-600 cursor-not-allowed" 
                                />
                            ) : (
                                <input 
                                    required 
                                    type="text" 
                                    value={formData.restaurant} 
                                    onChange={e => setFormData({...formData, restaurant: e.target.value})} 
                                    className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange text-gray-900 font-medium" 
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Price ($)</label>
                            <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Rating</label>
                            <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Food Image URL <span className="text-red-500">*</span></label>
                        <p className="text-xs text-gray-700 mb-2 font-medium">Paste Unsplash image URL only (e.g., https://images.unsplash.com/...)</p>
                        <div className="flex gap-4">
                            <input 
                                type="url" 
                                required
                                value={formData.image || formData.imageUrl || ''} 
                                onChange={e => {
                                    const url = e.target.value;
                                    setFormData({
                                        ...formData, 
                                        image: url,
                                        imageUrl: url
                                    });
                                }} 
                                className="flex-1 p-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-gray-900 font-medium" 
                                placeholder="https://images.unsplash.com/photo-..." 
                            />
                            <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                {(formData.image || formData.imageUrl) ? (
                                    <img src={formData.image || formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }} />
                                ) : (
                                    <ImageIcon size={24} className="text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Description</label>
                        <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-orange resize-none" />
                    </div>

                    <div className="flex gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.isVeg} onChange={e => setFormData({...formData, isVeg: e.target.checked})} className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange" />
                            <span className="font-medium text-gray-700">Vegetarian</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.available} onChange={e => setFormData({...formData, available: e.target.checked})} className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange" />
                            <span className="font-medium text-gray-700">Available</span>
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setView('list')} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <Check size={20} /> Save Item
                        </button>
                    </div>
                </form>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;