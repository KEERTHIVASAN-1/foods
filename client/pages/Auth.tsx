import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ThreeBackground from '../components/ThreeBackground';
import { ArrowRight, Lock, Mail, User, ChefHat, Shield, Building2, MapPin, Clock, FileText } from 'lucide-react';

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
  const [restaurantOpeningHours, setRestaurantOpeningHours] = useState('10:00 AM - 10:00 PM');
  const [restaurantDeliveryTime, setRestaurantDeliveryTime] = useState('30-40 min');

  // Admin signup fields
  const [adminCode, setAdminCode] = useState('');

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
    setRestaurantOpeningHours('10:00 AM - 10:00 PM');
    setRestaurantDeliveryTime('30-40 min');
    setAdminCode('');
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
          if (!restaurantName || !restaurantAddress || !restaurantCuisine || !restaurantDescription) {
            setError('Please fill all restaurant details');
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
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
          };
        } else if (selectedRole === 'admin') {
          // Admin registration requires special code (you can implement this in backend)
          if (adminCode !== 'ADMIN2025') {
            setError('Invalid admin code');
            setLoading(false);
            return;
          }
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-50">
      <ThreeBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative z-10 border border-white/50"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-red mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-red/30">
            <span className="text-3xl text-white font-bold">FS</span>
          </div>
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
            className="mb-6"
          >
            <label className="block text-sm font-bold text-gray-900 mb-3">Select Account Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['user', 'owner', 'admin'] as UserRole[]).map((role) => (
                <motion.button
                  key={role}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedRole(role);
                    resetForm();
                  }}
                  className={`p-4 rounded-xl border-2 border-gray-200 hover:border-${roleConfig[role].color.split('-')[1]}-500 transition-all text-center ${selectedRole === role ? `border-${roleConfig[role].color.split('-')[1]}-500 ${roleConfig[role].color} text-white` : 'bg-white text-gray-700'}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {roleConfig[role].icon}
                    <span className="font-bold">{roleConfig[role].label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === 'signup' || selectedRole) && (
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-orange transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-orange transition-all text-gray-900 font-medium"
              />
            </div>
          )}

          {mode === 'signup' && selectedRole === 'user' && (
            <>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-orange transition-colors" size={20} />
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-orange transition-all text-gray-900 font-medium"
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-orange transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Delivery Address"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-orange transition-all text-gray-900 font-medium"
                />
              </div>
            </>
          )}

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
            </div>
          )}

          {mode === 'signup' && selectedRole === 'admin' && (
            <div className="space-y-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-purple-600" size={20} />
                <h3 className="font-bold text-gray-900">Admin Registration</h3>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Admin Code *"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-600 transition-all text-gray-900 font-medium"
                />
                <p className="text-xs text-gray-600 mt-1 ml-1">Enter the admin access code to register as an administrator</p>
              </div>
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-orange transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-orange transition-all text-gray-900 font-medium"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-orange transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-orange transition-all text-gray-900 font-medium"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || (mode === 'signup' && !selectedRole)}
            className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-orange/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : `Create ${selectedRole ? roleConfig[selectedRole].label : ''} Account`)}
            {!loading && <ArrowRight size={20} />}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setSelectedRole(null);
                resetForm();
              }}
              className="text-brand-red font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
