import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

const REVIEWS_DATA = [
  { 
    id: 'rev6a', 
    userName: 'Arun K', 
    rating: 4.5, 
    comment: 'Amazing taste and quick delivery', 
    date: '5 days ago',
    likes: 12
  },
  { 
    id: 'rev6b', 
    userName: 'Meena S', 
    rating: 4.0, 
    comment: 'Excellent biryani, will order again', 
    date: '1 week ago',
    likes: 8
  }
];

const Reviews: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto pb-24 pt-6 px-4"
    >
      <div className="flex items-end justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
            <p className="text-gray-500 mt-1">What our customers say</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
            <span className="text-xl font-bold text-green-700">4.7</span>
            <div className="flex flex-col leading-none">
                <div className="flex">
                    {[1,2,3,4,5].map(i => (
                        <Star key={i} size={10} className="fill-green-700 text-green-700" />
                    ))}
                </div>
                <span className="text-[10px] text-green-800 font-medium">1.2k+ ratings</span>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        {REVIEWS_DATA.map((review, index) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white font-bold shadow-md shadow-brand-red/20">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{review.userName}</h4>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </div>
              <div className="bg-green-100 px-2 py-1 rounded-lg flex items-center gap-1">
                <span className="text-sm font-bold text-green-700">{review.rating}</span>
                <Star size={12} className="fill-green-700 text-green-700" />
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-4 pl-13">
              "{review.comment}"
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-orange transition-colors">
                    <ThumbsUp size={14} />
                    Helpful ({review.likes})
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-orange transition-colors">
                    <MessageSquare size={14} />
                    Reply
                </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Reviews;
