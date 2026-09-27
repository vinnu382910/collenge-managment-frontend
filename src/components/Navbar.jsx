import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Calendar, 
  Sparkles, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  BookmarkCheck, 
  LayoutDashboard 
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinkClass = ({ isActive }) => 
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive 
        ? 'text-indigo-600 bg-indigo-50 font-semibold' 
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  const mobileNavLinkClass = ({ isActive }) => 
    `block text-base font-medium px-4 py-2.5 rounded-lg transition-colors ${
      isActive 
        ? 'text-indigo-600 bg-indigo-50 font-semibold' 
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Event<span className="text-indigo-600">Hub</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-wide uppercase font-semibold text-slate-400">
                College Events
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
            <NavLink to="/ai-assistant" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI Assistant
              </span>
            </NavLink>

            {user && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/my-events" className={navLinkClass}>My Events</NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <span className="flex items-center gap-1 text-purple-700 font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      Admin
                    </span>
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Desktop User / Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {profile?.full_name ? profile.full_name[0] : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{profile?.full_name || 'My Profile'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
                >
                  Student Sign Up
                </Link>
                <Link
                  to="/login?portal=admin"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors ml-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Portal</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2 shadow-lg">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Home</NavLink>
          <NavLink to="/events" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Events</NavLink>
          <NavLink to="/ai-assistant" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Assistant
            </span>
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Dashboard</NavLink>
              <NavLink to="/my-events" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>My Events</NavLink>
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Profile</NavLink>
              {isAdmin && (
                <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                  <span className="flex items-center gap-2 text-purple-700 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </span>
                </NavLink>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{user.email}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-1.5 text-sm font-semibold text-red-600 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-semibold text-slate-700 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200"
              >
                Student Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-semibold text-white py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                Student Sign Up
              </Link>
              <Link
                to="/login?portal=admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-semibold text-purple-700 py-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Command Portal</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
