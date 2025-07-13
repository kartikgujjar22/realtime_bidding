import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      {/* Top Bar: Logo, Search, User */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <span className="hidden sm:inline">Realtime Bidding</span>
          <span className="inline sm:hidden">RTB</span>
        </Link>

        {/* Search Bar (visible on md and larger screens) */}
        <div className="hidden md:flex flex-grow max-w-md mx-4 relative">
          <input
            type="text"
            placeholder="Search auctions..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        {/* Right-side User Menu (visible on md and larger screens) */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                Welcome, {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <div className="flex items-center space-x-2">
                <img
                  src={currentUser?.photoURL || `https://placehold.co/40x40/cccccc/333333?text=${currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}`}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-purple-400 dark:border-purple-600"
                />
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Navigation Links */}
      <div className="container mx-auto px-4 py-2">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 text-gray-700 dark:text-gray-200 font-medium">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">Home</Link>
          <Link to="/auctions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">Auctions</Link>
          {currentUser && (
            <>
              <Link to="/create-auction" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">Create Auction</Link>
              <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">Dashboard</Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col space-y-2 py-2 text-gray-700 dark:text-gray-200 font-medium">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Home</Link>
            <Link to="/auctions" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Auctions</Link>
            
            {currentUser ? (
              <>
                <Link to="/create-auction" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Create Auction</Link>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Dashboard</Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <span className="block px-3 py-2 text-gray-500 dark:text-gray-400">Hello, {currentUser.displayName || currentUser.email}</span>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
