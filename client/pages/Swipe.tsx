import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo, useSpring } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { X, Heart, Info, ShoppingCart } from 'lucide-react';
import { FoodItem } from '../types';
import AmbientBackground from '../components/AmbientBackground';
import RestaurantInfo from '../components/RestaurantInfo';
import { api } from '../utils/api';

interface SwipeCardProps {
  item: FoodItem;
  isTop: boolean;
  indexFromTop: number;
  onSwipe: (dir: 'left' | 'right') => void;
  onShowInfo: (item: FoodItem) => void;
}

const SwipeCard: React.FC<SwipeCardProps> = memo(({ item, isTop, indexFromTop, onSwipe, onShowInfo }) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // Use spring for smoother animations on mobile
  const springConfig = { stiffness: 300, damping: 30 };
  const xSpring = useSpring(x, springConfig);
  
  const rotate = useTransform(xSpring, [-200, 200], [-25, 25]);
  const opacity = useTransform(xSpring, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(xSpring, [20, 150], [0, 1]);
  const nopeOpacity = useTransform(xSpring, [-150, -20], [1, 0]);

  // Memoize stack position calculations
  const stackPosition = useMemo(() => {
    if (isTop) {
      return { scale: 1, y: 0, opacity: 1, zIndex: 100 };
    }
    const scale = Math.max(1 - indexFromTop * 0.05, 0.85);
    const yOffset = indexFromTop * 15;
    const zIndex = 100 - indexFromTop;
    const targetOpacity = indexFromTop > 3 ? 0 : 1;
    return { scale, y: yOffset, opacity: targetOpacity, zIndex };
  }, [isTop, indexFromTop]);

  React.useEffect(() => {
    if (isTop) {
      x.set(0);
      controls.start({ 
        x: 0, 
        opacity: 1, 
        scale: 1, 
        rotate: 0, 
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    } else {
      controls.start({ 
        ...stackPosition,
        rotate: 0,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.2 }
      });
    }
  }, [isTop, stackPosition, controls, x]);

  const handleDragEnd = useCallback(async (event: any, info: PanInfo) => {
    const threshold = 50;
    const swipeDistance = window.innerWidth + 200;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 500) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      await controls.start({ 
        x: direction === 'right' ? swipeDistance : -swipeDistance, 
        opacity: 0,
        transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.3 }
      });
      onSwipe(direction);
    } else {
      controls.start({ 
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    }
  }, [controls, onSwipe]);

  const handleShowInfoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onShowInfo(item);
  }, [item, onShowInfo]);

  return (
    <motion.div
      style={{ 
        x: xSpring, 
        rotate, 
        zIndex: stackPosition.zIndex,
        pointerEvents: isTop ? 'auto' : 'none',
        willChange: isTop ? 'transform' : 'auto' // GPU acceleration hint
      }}
      drag="x"
      dragConstraints={isTop ? undefined : { left: 0, right: 0, top: 0, bottom: 0 }} 
      dragElastic={isTop ? 0.5 : 0}
      dragMomentum={false} // Disable momentum for better mobile performance
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      className="absolute top-0 w-full max-w-md lg:max-w-lg h-[65vh] md:h-[650px] lg:h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 cursor-grab active:cursor-grabbing select-none origin-top"
    >
      <div className="relative h-3/5 w-full">
         <img 
           src={item.imageUrl || item.image} 
           alt={item.name} 
           className="w-full h-full object-cover pointer-events-none"
           loading={isTop ? "eager" : "lazy"}
           decoding="async"
           style={{ willChange: 'opacity' }}
           onError={(e) => {
             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
           }}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
         
         <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20">
            {item.restaurant}
         </div>

         <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 right-8 border-4 border-green-500 rounded-lg p-2 px-4 transform rotate-12">
            <span className="text-4xl font-black text-green-500 uppercase tracking-widest">LIKE</span>
         </motion.div>
         <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 left-8 border-4 border-red-500 rounded-lg p-2 px-4 transform -rotate-12">
             <span className="text-4xl font-black text-red-500 uppercase tracking-widest">NOPE</span>
         </motion.div>
      </div>

      <div className="p-6 flex flex-col justify-between h-2/5">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{item.name}</h2>
            <div className="bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-lg font-bold text-lg">
              ${item.price.toFixed(2)}
            </div>
          </div>
          <div className="flex gap-2 mb-4">
             {item.tags.map(tag => (
               <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium">{tag}</span>
             ))}
          </div>
          <p className="text-gray-700 text-sm line-clamp-3 font-medium">{item.description}</p>
        </div>
        
        <button 
           onClick={handleShowInfoClick}
           className="flex items-center justify-center gap-2 mt-2 text-sm font-bold text-brand-red hover:text-white hover:bg-brand-red transition-transform w-full p-3 rounded-xl bg-brand-red/5 border border-brand-red/10 active:scale-95 shadow-sm touch-manipulation"
         >
            <Info size={16} />
            <span>View Details & Reviews</span>
         </button>
      </div>
    </motion.div>
  );
});

SwipeCard.displayName = 'SwipeCard';

const SwipePage: React.FC = () => {
  const { swipeStack, handleSwipe, addToCart, restaurants } = useApp();
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  
  const handleShowInfo = useCallback(async (item: FoodItem) => {
    if (item.restaurantId) {
      try {
        const restaurant = await api.getRestaurant(item.restaurantId);
        setSelectedRestaurant(restaurant);
      } catch (error) {
        console.error('Error loading restaurant:', error);
        // Fallback to finding by name
        const restaurant = restaurants.find(r => r.name === item.restaurant);
        if (restaurant) setSelectedRestaurant(restaurant);
      }
    } else {
      const restaurant = restaurants.find(r => r.name === item.restaurant);
      if (restaurant) setSelectedRestaurant(restaurant);
    }
  }, [restaurants]);

  if (!swipeStack.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full relative overflow-hidden">
        <AmbientBackground />
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <span className="text-4xl">🍔</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-700">Hungry for more?</h2>
            <p className="text-gray-500 mb-6">We're finding more delicious options...</p>
        </div>
      </div>
    );
  }

  const activeIndex = swipeStack.length - 1;

  return (
    <>
        <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden pt-4"
        >
        <AmbientBackground />
        
        <div className="relative w-full max-w-[95%] md:max-w-md lg:max-w-lg h-[65vh] md:h-[650px] lg:h-[700px] flex justify-center z-10 mx-auto px-2">
            {swipeStack.slice(Math.max(0, activeIndex - 2), activeIndex + 1).map((item, relativeIndex) => {
            const sliceStart = Math.max(0, activeIndex - 2);
            const actualIndex = sliceStart + relativeIndex;
            const isTop = actualIndex === activeIndex;
            const indexFromTop = activeIndex - actualIndex;
            return (
                <SwipeCard 
                key={item.id} 
                item={item} 
                isTop={isTop} 
                indexFromTop={indexFromTop}
                onSwipe={(dir) => handleSwipe(dir, item)} 
                onShowInfo={handleShowInfo}
                />
            );
            })}
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8 z-20 pb-4">
            <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => swipeStack[activeIndex] && handleSwipe('left', swipeStack[activeIndex])}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-brand-red shadow-xl flex items-center justify-center transition-transform active:scale-90 border-2 border-brand-red/20 hover:border-brand-red touch-manipulation"
            >
            <X size={28} strokeWidth={3} className="md:w-8 md:h-8" />
            </motion.button>
            
            <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => swipeStack[activeIndex] && addToCart(swipeStack[activeIndex])}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-yellow text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-transform active:scale-90 touch-manipulation"
            >
            <ShoppingCart size={20} fill="currentColor" className="md:w-6 md:h-6" />
            </motion.button>

            <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => swipeStack[activeIndex] && handleSwipe('right', swipeStack[activeIndex])}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-brand-orange to-brand-red text-white shadow-xl shadow-brand-red/30 flex items-center justify-center hover:shadow-2xl transition-transform active:scale-90 touch-manipulation"
            >
            <Heart size={28} fill="currentColor" className="md:w-8 md:h-8" />
            </motion.button>
        </div>
        </motion.div>

        {selectedRestaurant && (
            <RestaurantInfo 
                restaurant={selectedRestaurant} 
                isOpen={!!selectedRestaurant} 
                onClose={() => setSelectedRestaurant(null)} 
            />
        )}
    </>
  );
};

export default SwipePage;