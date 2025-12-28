import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Clock, Info, MessageSquare } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantInfoProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({ restaurant, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[60vh] bg-white rounded-t-3xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header Image */}
            <div className="relative h-48 shrink-0">
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"
              >
                <X size={20} />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold mb-1">{restaurant.name}</h2>
                <div className="flex items-center gap-2 text-sm opacity-90">
                   <Star size={16} className="fill-brand-yellow text-brand-yellow" />
                   <span className="font-bold">{restaurant.rating}</span>
                   <span>•</span>
                   <span>{restaurant.deliveryTime}</span>
                   <span>•</span>
                   <span className="bg-brand-red px-2 py-0.5 rounded text-xs font-bold">{restaurant.offers}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Info size={18} className="text-brand-red" />
                        About {restaurant.name}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                        {restaurant.description || 'No description available.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <MapPin size={18} className="text-brand-red" />
                            Location
                            </h3>
                            <p className="text-gray-600 text-sm">
                            {restaurant.address || 'Address not available'}
                            </p>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Clock size={18} className="text-brand-red" />
                            Hours
                            </h3>
                            <p className="text-gray-600 text-sm">
                            {restaurant.openingHours || 'Hours not available'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RestaurantInfo;
