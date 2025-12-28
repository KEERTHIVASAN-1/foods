import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Info, Star, Phone, Mail } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto pb-24 pt-6 px-4"
    >
      {/* Hero Section */}
      <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl mb-8">
        <img 
          src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" 
          alt="Spice Route Kitchen" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Spice Route Kitchen</h1>
          <div className="flex items-center gap-2 text-white/90 font-medium">
            <MapPin size={18} className="text-brand-orange" />
            <span>T. Nagar, Chennai</span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-brand-orange shrink-0">
            <Info size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Our Story</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              South Indian, Chinese, Arabian – Known for hygienic preparation, fast service, and rich regional flavors.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-brand-red shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Opening Hours</h3>
            <p className="text-sm text-gray-600">Mon - Sun</p>
            <p className="font-bold text-gray-800">12:00 PM - 11:00 PM</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-black text-brand-orange mb-1">4.7</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Rating</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-black text-brand-red mb-1">35m</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Delivery</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-black text-green-600 mb-1">100%</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hygienic</div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Contact Us</h3>
        <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
                <Phone size={20} className="text-brand-orange" />
                <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
                <Mail size={20} className="text-brand-orange" />
                <span>contact@spiceroute.com</span>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
