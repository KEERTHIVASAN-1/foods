import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { User, Mail, MapPin, Phone, Building2, LogOut, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState((user as any)?.phone || '');
  const [editedAddress, setEditedAddress] = useState((user as any)?.address || '');

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
    // For now, just update local state
    console.log('Profile update:', { editedName, editedPhone, editedAddress });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-3xl font-bold text-gray-900 border-b-2 border-brand-orange focus:outline-none mb-2"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : user.role === 'owner'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {user.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-brand-orange text-white rounded-lg font-medium hover:bg-brand-red transition-colors"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-brand-orange text-white rounded-lg font-medium hover:bg-brand-red transition-colors flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-orange/10 rounded-full">
              <Mail className="text-brand-orange" size={20} />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          {(user.role === 'user') && (
            <>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-orange/10 rounded-full">
                  <Phone className="text-brand-orange" size={20} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-900">{user?.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-orange/10 rounded-full">
                  <MapPin className="text-brand-orange" size={20} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      placeholder="Enter address"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-900">{user?.address || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {user.role === 'owner' && user?.restaurantId && (
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500">Restaurant ID</label>
                <p className="mt-1 text-lg text-gray-900">{user?.restaurantId}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Actions</h2>
        
        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;

