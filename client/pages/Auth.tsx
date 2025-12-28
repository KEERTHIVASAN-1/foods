import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import LiveWallpaperBackground from '../components/LiveWallpaperBackground';
import { ArrowRight, Lock, Mail, User, ChefHat, Shield, Building2, MapPin, Clock, FileText, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';

type UserRole = 'user' | 'owner' | 'admin';
type AuthMode = 'login' | 'signup';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // User signup fields
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');

  // Restaurant Owner signup fields
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [restaurantCuisine, setRestaurantCuisine] = useState('');
  const [restaurantDescription, setRestaurantDescription] = useState('');
  const [restaurantCoverImage, setRestaurantCoverImage] = useState('');
  const [restaurantOpeningHours, setRestaurantOpeningHours] = useState('10:00 AM - 10:00 PM');
  const [restaurantDeliveryTime, setRestaurantDeliveryTime] = useState('30-40 min');

  // Admin signup fields - removed (no longer needed)

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setUserPhone('');
    setUserAddress('');
    setRestaurantName('');
    setRestaurantAddress('');
    setRestaurantCuisine('');
    setRestaurantDescription('');
    setRestaurantCoverImage('');
    setRestaurantOpeningHours('10:00 AM - 10:00 PM');
    setRestaurantDeliveryTime('30-40 min');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        // Redirect will be handled after login completes
        // We'll use a small delay to ensure user state is updated
        setTimeout(() => {
          // This will be handled by the login function or useEffect
        }, 100);
        navigate('/'); // Default, ProtectedRoute will redirect
      } else {
        // Signup
        if (!selectedRole) {
          setError('Please select a role');
          setLoading(false);
          return;
        }

        const registerData: any = {
          name,
          email,
          password,
          role: selectedRole
        };

        if (selectedRole === 'user') {
          registerData.phone = userPhone;
          registerData.address = userAddress;
        } else if (selectedRole === 'owner') {
          if (!restaurantName || !restaurantAddress || !restaurantCuisine || !restaurantDescription || !restaurantCoverImage) {
            setError('Please fill all restaurant details including cover image');
            setLoading(false);
            return;
          }
          registerData.restaurantName = restaurantName;
          registerData.restaurantDetails = {
            description: restaurantDescription,
            address: restaurantAddress,
            cuisine: restaurantCuisine,
            deliveryTime: restaurantDeliveryTime,
            openingHours: restaurantOpeningHours,
            image: restaurantCoverImage // Use user-provided cover image
          };
        } else if (selectedRole === 'admin') {
          // Admin registration - no code required
        }

        await register(registerData);
        // Redirect will be handled after registration completes
        navigate('/'); // Default, ProtectedRoute will redirect
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    user: { icon: <User size={24} />, label: 'User', color: 'bg-blue-500' },
    owner: { icon: <ChefHat size={24} />, label: 'Restaurant Owner', color: 'bg-orange-500' },
    admin: { icon: <Shield size={24} />, label: 'Admin', color: 'bg-purple-500' }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4">
      <LiveWallpaperBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl relative z-10 border border-white/30"
      >
        <div className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-red mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-red/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="text-3xl text-white font-bold">FS</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join FoodSwipe'}
          </h1>
          <p className="text-gray-600 text-sm">
            {mode === 'login' 
              ? 'Sign in to continue your food journey' 
              : 'Create your account to get started'
            }
          </p>
        </div>

        {mode === 'signup' && !selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <label className="block text-sm font-bold text-gray-900 mb-3">Select Account Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['user', 'owner', 'admin'] as UserRole[]).map((role, index) => (
                <motion.button
                  key={role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedRole(role);
                    resetForm();
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-center relative overflow-hidden group ${
                    selectedRole === role 
                      ? `${roleConfig[role].color} text-white border-transparent shadow-lg` 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Ripple effect on click */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 2, opacity: [1, 0] }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <motion.div
                      animate={selectedRole === role ? { rotate: [0, -10, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {roleConfig[role].icon}
                    </motion.div>
                    <span className="font-bold">{roleConfig[role].label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <XCircle size={20} className="text-red-500 flex-shrink-0" />
              </motion.div>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {(mode === 'signup' || selectedRole) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <motion.div
                  animate={name ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-orange transition-colors z-10" size={20} />
                </motion.div>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all text-gray-900 font-medium"
                />
                {name && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-4 top-3.5"
                  >
                    <CheckCircle size={20} className="text-green-500" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {mode === 'signup' && selectedRole === 'user' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <motion.div 
                  className="relative group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-orange transition-colors z-10" size={20} />
                  <input 
                    type="tel" 
                    placeholder="Phone Number"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all text-gray-900 font-medium"
                  />
                </motion.div>
                <motion.div 
                  className="relative group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MapPin className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-orange transition-colors z-10" size={20} />
                  <input 
                    type="text" 
                    placeholder="Delivery Address"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all text-gray-900 font-medium"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {mode === 'signup' && selectedRole === 'owner' && (
            <div className="space-y-4 p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="text-orange-600" size={20} />
                <h3 className="font-bold text-gray-900">Restaurant Information</h3>
              </div>
              <div className="relative group">
                <Building2 className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Restaurant Name *"
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-600 transition-all text-gray-900 font-medium"
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Restaurant Address *"
                  required
                  value={restaurantAddress}
                  onChange={(e) => setRestaurantAddress(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-600 transition-all text-gray-900 font-medium"
                />
              </div>
              <div className="relative group">
                <ChefHat className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Cuisine Type (e.g., Italian, Indian, Chinese) *"
                  required
                  value={restaurantCuisine}
                  onChange={(e) => setRestaurantCuisine(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-600 transition-all text-gray-900 font-medium"
                />
              </div>
              <div className="relative group">
                <FileText className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                <textarea
                  placeholder="Restaurant Description *"
                  required
                  value={restaurantDescription}
                  onChange={(e) => setRestaurantDescription(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-600 transition-all text-gray-900 font-medium resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Clock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Opening Hours"
                    value={restaurantOpeningHours}
                    onChange={(e) => setRestaurantOpeningHours(e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-600 transition-all text-gray-900 font-medium"
                  />
                </div>
                <div className="relative group">
                  <Clock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Delivery Time"
                    value={restaurantDeliveryTime}
                    onChange={(e) => setRestaurantDeliveryTime(e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-600 transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>
              <div className="relative group">
                <ImageIcon className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                <input 
                  type="url" 
                  placeholder="Restaurant Cover Image URL * (Unsplash URL)"
                  required
                  value={restaurantCoverImage}
                  onChange={(e) => setRestaurantCoverImage(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-600 transition-all text-gray-900 font-medium"
                />
                <p className="text-xs text-gray-600 mt-1 ml-1">Paste a restaurant/hotel interior or exterior image URL from Unsplash</p>
                {restaurantCoverImage && (
                  <div className="mt-2 w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={restaurantCoverImage} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === 'signup' && selectedRole === 'admin' && (
            <div className="space-y-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-purple-600" size={20} />
                <h3 className="font-bold text-gray-900">Admin Registration</h3>
              </div>
              <p className="text-sm text-gray-600">You are registering as an administrator.</p>
            </div>
          )}
          
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors z-10 pointer-events-none" size={20} />
            <input 
              type="email" 
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all text-gray-900 font-medium"
            />
            {email && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <CheckCircle size={20} className="text-green-500" />
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="relative group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors z-10 pointer-events-none" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all text-gray-900 font-medium"
            />
            {password && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {password.length >= 6 ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <motion.div
                    animate={{ x: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <XCircle size={20} className="text-red-400" />
                  </motion.div>
                )}
              </motion.div>
            )}
            {password && password.length < 6 && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-1 ml-1"
              >
                Password must be at least 6 characters
              </motion.p>
            )}
          </motion.div>

          <motion.button
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 10px 30px rgba(249, 115, 22, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || (mode === 'signup' && !selectedRole)}
            className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-orange/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {/* Loading spinner */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
            
            <motion.span
              className="relative z-10 flex items-center gap-2"
              animate={loading ? { opacity: 0 } : { opacity: 1 }}
            >
              {mode === 'login' ? 'Sign In' : `Create ${selectedRole ? roleConfig[selectedRole].label : ''} Account`}
              {!loading && (
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              )}
            </motion.span>
          </motion.button>
        </form>

        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 text-sm">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <motion.button 
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setSelectedRole(null);
                resetForm();
              }}
              className="text-brand-red font-bold relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{mode === 'login' ? 'Sign Up' : 'Sign In'}</span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
