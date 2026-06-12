import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav class="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" class="flex items-center gap-2 group">
            <div class="p-2 rounded-lg bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 transition-all duration-200">
              <Link2 size={22} class="rotate-45" />
            </div>
            <span class="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
              LinkPulse
            </span>
          </Link>

          {/* Navigation Links & Actions */}
          <div class="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/"
                  class={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                    isActive('/') 
                      ? 'text-brand-400' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  <span class="hidden sm:inline">Dashboard</span>
                </Link>

                {/* Profile Display */}
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                  <div class="p-1 rounded-full bg-slate-800 text-slate-300">
                    <User size={14} />
                  </div>
                  <span class="text-xs font-medium text-slate-300 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  class="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span class="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div class="flex items-center gap-4">
                <Link
                  to="/login"
                  class={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/login') ? 'text-brand-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  class="bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
