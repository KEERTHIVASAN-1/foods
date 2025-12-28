import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Minus, Plus, Trash2, CreditCard, ShoppingBag, CheckCircle, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const Cart: React.FC = () => {
  const { cart, addToCart, removeFromCart, setCart, user } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      setCheckingOut(true);
      
      // Get restaurant ID from first item
      const restaurantId = cart[0].restaurantId;
      if (!restaurantId) {
        alert('Unable to determine restaurant. Please try again.');
        setCheckingOut(false);
        return;
      }

      // Prepare order data
      const orderData = {
        restaurantId,
        items: cart.map(item => ({
          itemId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        deliveryAddress: (user as any)?.address || 'Not specified'
      };

      // Create order in database
      await api.createOrder(orderData);

      // Clear cart after successful order creation
      setCart([]);
      
      // Show success animation
      setShowSuccess(true);
    } catch (error: any) {
      alert(error.message || 'Failed to place order. Please try again.');
      setCheckingOut(false);
    }
  };

  if (cart.length === 0 && !showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't made your choice yet.</p>
        <Link to="/" className="px-8 py-3 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/30">
          Start Swiping
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-[95%] md:max-w-2xl mx-auto px-2"
    >
      <h1 className="text-3xl font-bold mb-8">Your Order</h1>
      
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center p-3 md:p-4 border-b border-gray-50 last:border-0 gap-3"
            >
              <img src={item.imageUrl || item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-700 font-medium">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                <button className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600">
                  <Minus size={14} />
                </button>
                <span className="font-bold w-4 text-center">{item.quantity}</span>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-brand-orange"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 font-medium">Subtotal</span>
          <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 font-medium">Delivery Fee</span>
          <span className="font-bold text-green-600">Free</span>
        </div>
        <div className="border-t border-gray-200 my-4 pt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-brand-red">${total.toFixed(2)}</span>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={checkingOut || cart.length === 0}
          className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-red/30 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{checkingOut ? 'Placing Order...' : 'Checkout'}</span>
          <CreditCard size={20} />
        </button>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              {/* Success Icon Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 10, duration: 0.8 }}
                className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    rotate: [180, 0],
                    opacity: 1
                  }}
                  transition={{ 
                    delay: 0.6,
                    scale: { duration: 0.6, times: [0, 0.8, 1] },
                    rotate: { duration: 0.8 },
                    opacity: { duration: 0.4 }
                  }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500" fill="currentColor" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="text-3xl font-bold text-gray-900 mb-3"
              >
                Order Placed!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="text-gray-600 mb-8"
              >
                Your order has been successfully placed. We'll notify you when it's ready!
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                onClick={() => {
                  setShowSuccess(false);
                  navigate('/feed');
                }}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-red/30 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
              >
                <Home size={20} />
                <span>Back to Home</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cart;