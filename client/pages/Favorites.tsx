import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingCart, HeartOff, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const { favorites, toggleFavorite, addToCart, removeAllFavorites } = useApp();

  const handleAddAll = () => {
    favorites.forEach(item => addToCart(item));
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6"
        >
          <HeartOff size={40} className="text-brand-red opacity-50" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
        <p className="text-gray-500 mb-8">Swipe right on food you love to save it here.</p>
        <Link to="/" className="px-8 py-3 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/30">
          Start Swiping
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[95%] md:max-w-2xl mx-auto pb-20 px-2"
    >
      <div className="flex justify-between items-end mb-6">
        <div>
            <h1 className="text-3xl font-bold">Your Favorites</h1>
            <p className="text-sm text-gray-500 mt-1">{favorites.length} items saved</p>
        </div>
        <button 
            onClick={removeAllFavorites}
            className="text-xs text-red-500 font-bold uppercase tracking-wide hover:underline"
        >
            Clear All
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode='popLayout'>
          {favorites.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -100) {
                    toggleFavorite(item);
                }
              }}
              whileDrag={{ scale: 1.02, zIndex: 10 }}
              className="group bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 relative overflow-visible"
            >
              <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center text-white z-0 opacity-0 group-active:opacity-100 transition-opacity">
                <Trash2 />
              </div>

              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden z-10">
                 <img src={item.imageUrl || item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 z-10 bg-white min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-800 line-clamp-1 flex-1 min-w-0 pr-2">{item.name}</h3>
                    <span className="font-bold text-brand-orange flex-shrink-0">${item.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{item.restaurant}</p>
                
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md flex-shrink-0">{item.rating} ★</span>
                    <div className="flex gap-2 flex-shrink-0">
                        <button 
                            onClick={() => toggleFavorite(item)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove from favorites"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button 
                            onClick={() => addToCart(item)}
                            className="flex items-center gap-1 bg-brand-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-black transition-colors whitespace-nowrap"
                        >
                            <Plus size={14} />
                            Add
                        </button>
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-24 md:bottom-8 left-0 right-0 px-4 flex justify-center z-40 pointer-events-none"
      >
        <button 
            onClick={handleAddAll}
            className="pointer-events-auto bg-gradient-to-r from-brand-orange to-brand-red text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-red/30 flex items-center gap-2 hover:scale-105 transition-transform"
        >
            <ShoppingCart size={20} />
            Add All to Cart
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Favorites;