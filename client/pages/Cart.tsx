import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Minus, Plus, Trash2, CreditCard, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useApp();

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
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

        <button className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-red/30 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
          <span>Checkout</span>
          <CreditCard size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default Cart;