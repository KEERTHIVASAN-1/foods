import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { FoodItem, CartItem, User, Restaurant } from '../types';
import { api } from '../utils/api';
import { transformItem } from '../utils/transformers';
import { getRestaurantImage, resetRestaurantImages } from '../utils/imageMapper';

interface AppContextType {
  user: User | null;
  restaurants: Restaurant[];
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  foods: FoodItem[];
  restaurantsLoading: boolean;
  foodsLoading: boolean;
  authLoading: boolean;
  addFood: (item: FoodItem) => Promise<void>;
  updateFood: (item: FoodItem) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  setCart: (cart: CartItem[]) => void;
  favorites: FoodItem[];
  toggleFavorite: (item: FoodItem) => void;
  removeAllFavorites: () => void;
  swipeStack: FoodItem[];
  handleSwipe: (direction: 'left' | 'right', item: FoodItem) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'foodswipe_cart';
const FAVORITES_STORAGE_KEY = 'foodswipe_favorites';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FoodItem[]>([]);
  const [swipeStack, setSwipeStack] = useState<FoodItem[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, user]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, user]);

  const loadData = useCallback(async () => {
    try {
      setRestaurantsLoading(true);
      setFoodsLoading(true);
      
      // Reset used images for fresh uniqueness check
      resetRestaurantImages();
      
      const [restaurantsData, itemsData] = await Promise.all([
        api.getRestaurants(),
        api.getItems()
      ]);

      // Ensure unique restaurant cover images - NO COMPROMISE, ALL MUST BE UNIQUE
      const usedImages = new Set<string>();
      const restaurantsWithUniqueImages = restaurantsData.map((restaurant: any, index: number) => {
        let image = restaurant.image || '';
        
        // Always check if the existing image is already used
        if (!image || usedImages.has(image)) {
          // Get a unique image based on cuisine, excluding all already used images
          image = getRestaurantImage(restaurant.cuisine || 'restaurant', Array.from(usedImages));
          
          // Double-check: if still duplicate (shouldn't happen but just in case), force uniqueness
          if (usedImages.has(image)) {
            const baseUrl = image.split('&t=')[0].split('&unique=')[0].split('&')[0];
            image = `${baseUrl}&unique=${Date.now()}-${restaurant._id || restaurant.id || index}-${Math.random().toString(36).substr(2, 9)}`;
          }
        }
        
        // Mark this image as used
        usedImages.add(image);
        return { ...restaurant, image };
      });
      
      // Final verification: check for any remaining duplicates and fix them
      const finalImageMap = new Map<string, number>();
      const finalRestaurants = restaurantsWithUniqueImages.map((restaurant: any, index: number) => {
        const currentImage = restaurant.image;
        const count = finalImageMap.get(currentImage) || 0;
        finalImageMap.set(currentImage, count + 1);
        
        // If this is a duplicate (count > 0 means we've seen it before)
        if (count > 0) {
          const baseUrl = currentImage.split('&t=')[0].split('&unique=')[0].split('&')[0];
          const uniqueImage = `${baseUrl}&unique=${Date.now()}-${restaurant._id || restaurant.id || index}-forced-${Math.random().toString(36).substr(2, 9)}`;
          return { ...restaurant, image: uniqueImage };
        }
        return restaurant;
      });

      const restaurantMap = new Map(finalRestaurants.map((r: any) => [r._id, r.name]));
      
      const transformedItems = itemsData.map((item: any) => 
        transformItem(item, restaurantMap.get(item.restaurantId?._id || item.restaurantId))
      );

      setRestaurants(finalRestaurants);
      setFoods(transformedItems);

      // Load swipe items
      const swipeItems = await api.getSwipeItems();
      const transformedSwipeItems = swipeItems.map((item: any) =>
        transformItem(item, restaurantMap.get(item.restaurantId?._id || item.restaurantId))
      );
      // Ensure images are loaded properly with fallback
      const swipeItemsWithImages = transformedSwipeItems.map((item: any) => ({
        ...item,
        imageUrl: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        image: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
      }));
      setSwipeStack(swipeItemsWithImages);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setRestaurantsLoading(false);
      setFoodsLoading(false);
    }
  }, []);

  // Check for existing session
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser({ 
            id: userData._id, 
            _id: userData._id, 
            name: userData.name, 
            email: userData.email, 
            role: userData.role,
            restaurantId: userData.restaurantId?.toString(),
            phone: userData.phone,
            address: userData.address
          });
          
          // Load cart and favorites from localStorage
          try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            
            if (savedCart) {
              const parsedCart = JSON.parse(savedCart);
              setCart(parsedCart);
            }
            
            if (savedFavorites) {
              const parsedFavorites = JSON.parse(savedFavorites);
              setFavorites(parsedFavorites);
            }
          } catch (error) {
            console.error('Error loading cart/favorites from localStorage:', error);
          }
          
          await loadData();
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
          localStorage.removeItem(CART_STORAGE_KEY);
          localStorage.removeItem(FAVORITES_STORAGE_KEY);
          setUser(null);
          setCart([]);
          setFavorites([]);
        }
      } else {
        // No token, clear cart and favorites
        setCart([]);
        setFavorites([]);
      }
      setAuthLoading(false);
    };
    
    checkAuth();
  }, [loadData]);

  const refreshData = async () => {
    await loadData();
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getMe();
      setUser({ 
        id: userData._id, 
        _id: userData._id, 
        name: userData.name, 
        email: userData.email, 
        role: userData.role,
        restaurantId: userData.restaurantId?.toString(),
        phone: userData.phone,
        address: userData.address
      });
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    localStorage.setItem('token', response.token);
    setUser({ 
      id: response.user.id, 
      _id: response.user.id, 
      name: response.user.name, 
      email: response.user.email, 
      role: response.user.role,
      restaurantId: response.user.restaurantId,
      phone: response.user.phone,
      address: response.user.address
    });
    
    // Load cart and favorites from localStorage after login
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading cart/favorites from localStorage:', error);
    }
    
    await loadData();
  };

  const register = async (data: any) => {
    const response = await api.register(data);
    localStorage.setItem('token', response.token);
    setUser({ 
      id: response.user.id || response.user._id, 
      _id: response.user._id || response.user.id, 
      name: response.user.name, 
      email: response.user.email, 
      role: response.user.role,
      restaurantId: response.user.restaurantId
    });
    
    // Load cart and favorites from localStorage after registration (usually empty for new users)
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading cart/favorites from localStorage:', error);
    }
    
    await loadData();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    setUser(null);
    setCart([]);
    setFavorites([]);
    setSwipeStack([]);
  };

  const addFood = async (item: FoodItem) => {
    try {
      const newItem = await api.createItem({
        name: item.name,
        restaurantId: item.restaurantId,
        price: item.price,
        imageUrl: item.imageUrl || item.image,
        description: item.description,
        rating: item.rating,
        tags: item.tags,
        isVeg: item.isVeg,
        calories: item.calories,
        preparationTime: item.preparationTime,
        available: item.available ?? true
      });
      const transformed = transformItem(newItem, restaurants.find(r => r._id === newItem.restaurantId)?.name);
      setFoods(prev => [...prev, transformed]);
      setSwipeStack(prev => [...prev, transformed]);
    } catch (error) {
      console.error('Error adding food:', error);
      throw error;
    }
  };

  const updateFood = async (item: FoodItem) => {
    try {
      const updated = await api.updateItem(item.id || item._id!, {
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl || item.image,
        description: item.description,
        rating: item.rating,
        tags: item.tags,
        isVeg: item.isVeg,
        calories: item.calories,
        preparationTime: item.preparationTime,
        available: item.available
      });
      const transformed = transformItem(updated, restaurants.find(r => r._id === updated.restaurantId)?.name);
      setFoods(prev => prev.map(f => f.id === item.id ? transformed : f));
      setSwipeStack(prev => prev.map(f => f.id === item.id ? transformed : f));
    } catch (error) {
      console.error('Error updating food:', error);
      throw error;
    }
  };

  const deleteFood = async (id: string) => {
    try {
      await api.deleteItem(id);
      setFoods(prev => prev.filter(f => f.id !== id && f._id !== id));
      setCart(prev => prev.filter(f => f.id !== id && f._id !== id));
      setFavorites(prev => prev.filter(f => f.id !== id && f._id !== id));
      setSwipeStack(prev => prev.filter(f => f.id !== id && f._id !== id));
    } catch (error) {
      console.error('Error deleting food:', error);
      throw error;
    }
  };

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id || i._id === item._id);
      if (existing) {
        return prev.map(i => (i.id === item.id || i._id === item._id) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId && i._id !== itemId));
  };

  const toggleFavorite = (item: FoodItem) => {
    setFavorites(prev => {
      const exists = prev.find(i => i.id === item.id || i._id === item._id);
      if (exists) return prev.filter(i => i.id !== item.id && i._id !== item._id);
      return [...prev, item];
    });
  };

  const removeAllFavorites = () => setFavorites([]);

  const handleSwipe = (direction: 'left' | 'right', item: FoodItem) => {
    if (direction === 'right') {
      setFavorites(prev => {
        if (!prev.find(i => i.id === item.id || i._id === item._id)) {
          return [...prev, item];
        }
        return prev;
      });
    }
    setSwipeStack(prev => prev.filter(i => i.id !== item.id && i._id !== item._id));
    
    // Reset stack if empty
    if (swipeStack.length <= 1 && foods.length > 0) {
      setTimeout(() => {
        const topItems = foods.slice(0, 20);
        setSwipeStack(topItems);
      }, 1000);
    }
  };

  return (
    <AppContext.Provider value={{
      user, restaurants, login, register, logout, refreshUser, foods, restaurantsLoading, foodsLoading, authLoading,
      addFood, updateFood, deleteFood, cart, addToCart, removeFromCart, setCart,
      favorites, toggleFavorite, removeAllFavorites, swipeStack, handleSwipe, refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
