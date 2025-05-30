import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, Search, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="font-bold text-xl">MUST LIBRARY</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <form onSubmit={handleSearch} className="relative w-64">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1.5 pl-3 pr-10 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-accent-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="hover:text-accent-200 transition-colors flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="hover:text-accent-200 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="hover:text-accent-200 transition-colors flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span>Admin Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-800 animate-fade-in">
          <div className="container-custom py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-3 pr-10 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-accent-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            <div className="space-y-2 pt-2 border-t border-primary-600">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/admin" 
                    className="block py-2 hover:bg-primary-700 rounded-md px-3 transition-colors"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="block w-full text-left py-2 hover:bg-primary-700 rounded-md px-3 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block py-2 hover:bg-primary-700 rounded-md px-3 transition-colors"
                  onClick={toggleMenu}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;