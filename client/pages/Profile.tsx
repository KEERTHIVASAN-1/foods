import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { User, Mail, MapPin, Phone, Building2, LogOut, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const Profile: React.FC = () => {
  const { user, logout, refreshUser } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState((user as any)?.phone || '');
  const [editedAddress, setEditedAddress] = useState((user as any)?.address || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      setEditedPhone((user as any)?.phone || '');
      setEditedAddress((user as any)?.address || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.updateProfile({
        name: editedName,
        phone: editedPhone || '',
        address: editedAddress || ''
      });
      // Refresh user data in context
      await refreshUser();
      setIsEditing(false);
      setSaving(false);
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
      setSaving(false);
    }
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
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-2xl sm:text-3xl font-bold text-gray-900 border-b-2 border-brand-orange focus:outline-none mb-2 w-full"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">{user.name}</h1>
              )}
              <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base flex-wrap">
                <Mail size={14} className="flex-shrink-0" />
                <span className="break-all">{user.email}</span>
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
          <div className="flex gap-2 w-full sm:w-auto">
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
                  disabled={saving}
                  className="px-4 py-2 bg-brand-orange text-white rounded-lg font-medium hover:bg-brand-red transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
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
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Profile Information</h2>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-brand-orange/10 rounded-full flex-shrink-0">
              <Mail className="text-brand-orange" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-sm font-medium text-gray-500">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full mt-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm sm:text-base"
                />
              ) : (
                <p className="mt-1 text-base sm:text-lg text-gray-900 break-all">{user.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          {(user.role === 'user') && (
            <>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-brand-orange/10 rounded-full flex-shrink-0">
                  <Phone className="text-brand-orange" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="w-full mt-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm sm:text-base"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="mt-1 text-base sm:text-lg text-gray-900 break-words">{(user as any)?.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-brand-orange/10 rounded-full flex-shrink-0">
                  <MapPin className="text-brand-orange" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      className="w-full mt-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm sm:text-base"
                      placeholder="Enter address"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-base sm:text-lg text-gray-900 break-words">{(user as any)?.address || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {user.role === 'owner' && user?.restaurantId && (
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
                <Building2 className="text-blue-600" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-gray-500">Restaurant ID</label>
                <p className="mt-1 text-base sm:text-lg text-gray-900 break-all">{user?.restaurantId}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
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

