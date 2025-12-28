import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import SwipePage from './pages/Swipe';
import FoodFeed from './pages/FoodFeed';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Admin from './pages/Admin';
import OwnerDashboard from './pages/OwnerDashboard';
import Profile from './pages/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authLoading } = useApp();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Only redirect if auth check is complete and no user
  if (!user) return <Navigate to="/auth" />;
  
  // Redirect owners away from user-only routes
  if (user.role === 'owner') {
    const path = location.pathname;
    if (path === '/' || path === '/feed' || path === '/favorites' || path === '/cart') {
      return <Navigate to="/owner" replace />;
    }
  }
  
  // Redirect admin from root to admin page (restaurant management)
  if (user.role === 'admin') {
    const path = location.pathname;
    if (path === '/') {
      return <Navigate to="/admin" replace />;
    }
  }
  
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<ProtectedRoute><SwipePage /></ProtectedRoute>} />
      <Route path="/feed" element={<ProtectedRoute><FoodFeed /></ProtectedRoute>} />
      <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetail /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/owner" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="relative min-h-screen bg-gray-50 text-gray-900 font-sans">
           {/* ThreeBackground only on non-auth pages to avoid WebGL conflicts */}
           <AppRoutes />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;