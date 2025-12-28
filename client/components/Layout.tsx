import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Flame, Heart, ShoppingBag, User as UserIcon, ChefHat } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { cart, favorites, user } = useApp();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(mainRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [location.pathname]);

  const navItems = [
    { icon: <Flame size={24} />, label: 'Swipe', path: '/', roles: ['user'] },
    { icon: <Home size={24} />, label: 'Feed', path: '/feed', roles: ['user', 'admin'] },
    { icon: <Heart size={24} />, label: 'Favs', path: '/favorites', roles: ['user'] },
    { icon: <ChefHat size={24} />, label: 'Dashboard', path: '/owner', roles: ['owner'] },
    { icon: <ChefHat size={24} />, label: 'Admin', path: '/admin', roles: ['admin'] },
  ].filter(item => !item.roles || (user && item.roles.includes(user.role || 'user')));

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark overflow-hidden relative">
      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-100 shadow-sm">
        <Link to={user?.role === 'admin' ? '/admin' : '/feed'} className="flex items-center gap-2 cursor-pointer">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white font-bold">FS</div>
           <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-red">FoodSwipe</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`relative flex items-center gap-2 font-medium transition-colors hover:text-brand-red ${location.pathname === item.path ? 'text-brand-red' : 'text-gray-500'}`}>
              {item.icon}
              <span>{item.label}</span>
              {item.path === '/favorites' && favorites.length > 0 && (
                 <span className="absolute -top-2 -right-3 bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                   {favorites.length}
                 </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md hover:bg-gray-300 transition-colors cursor-pointer">
             <UserIcon size={20} className="text-gray-500" />
          </Link>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center px-4 py-3 bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-100 shadow-sm">
        <Link to={user?.role === 'admin' ? '/admin' : '/feed'} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white font-bold text-xs">FS</div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-red">FoodSwipe</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md hover:bg-gray-300 transition-colors">
            <UserIcon size={18} className="text-gray-500" />
          </Link>
        </div>
      </header>

      <main ref={mainRef} className="flex-1 relative z-10 pt-14 md:pt-24 pb-20 md:pb-8 px-2 md:px-4 lg:px-8 max-w-[100%] mx-auto w-full">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 pb-safe shadow-lg">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`relative flex flex-col items-center gap-1 transition-colors py-1 ${location.pathname === item.path ? 'text-brand-red' : 'text-gray-400'}`}>
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 22 })}
              <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
              {item.path === '/favorites' && favorites.length > 0 && (
                 <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                   {favorites.length}
                 </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="hidden md:block bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to={user?.role === 'admin' ? '/admin' : '/feed'} className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white font-bold">FS</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-red">FoodSwipe</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link to="/feed" className="hover:text-brand-red transition-colors">Restaurants</Link>
              <Link to="/favorites" className="hover:text-brand-red transition-colors">Favorites</Link>
              <Link to="/cart" className="hover:text-brand-red transition-colors">Cart</Link>
              <Link to="/profile" className="hover:text-brand-red transition-colors">Profile</Link>
            </div>
            <p className="text-xs text-gray-500">© 2024 FoodSwipe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;