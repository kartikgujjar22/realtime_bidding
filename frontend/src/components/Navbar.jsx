import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation(); // Hook to detect page changes

  // Check login status whenever the route changes
  // Check login status whenever the route changes
  useEffect(() => {
    const token = Cookies.get('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser !==  undefined) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Corrupt user data found, clearing...", error);
        handleLogout();
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    // 1. Remove Token from Cookie
    Cookies.remove('token');
    
    // 2. Clear User Data from Storage
    localStorage.removeItem('user');
    
    // 3. Reset State & Redirect
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-retro-blue border-b-4 border-retro-orange sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-retro-red border-2 border-retro-cream shadow-hard-sm group-hover:translate-x-1 transition-transform"></div>
              <span className="font-display text-4xl text-retro-cream tracking-widest uppercase shadow-black drop-shadow-md">
                BID_WARS
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8 font-retro font-bold">
              <NavLink to="/auctions">Auctions</NavLink>
              <NavLink to="/about">About_Us</NavLink>

              {/* CONDITIONAL RENDERING STARTS HERE */}
              {user ? (
                <>
                  <NavLink to="/create-auction">Sell_Item</NavLink>
                  
                  {/* Logged In User Badge */}
                  <div className="flex items-center gap-4 ml-4 pl-4 border-l-4 border-retro-orange">
                    <span className="text-retro-cream uppercase text-sm">
                      OP: {user.username || 'USER'}
                    </span>
                    <button 
                      onClick={handleLogout}
                      className="bg-retro-red text-white px-4 py-1 border-2 border-retro-cream shadow-hard hover:translate-y-1 hover:shadow-none hover:bg-red-700 transition-all uppercase text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-retro-cream hover:text-retro-orange uppercase">
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-retro-orange text-retro-blue px-6 py-2 border-2 border-retro-cream shadow-hard hover:translate-y-1 hover:shadow-none transition-all uppercase"
                  >
                    Join_Now
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-retro-cream text-retro-blue p-2 border-2 border-retro-red shadow-hard-sm hover:bg-retro-orange focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-retro-blue border-t-4 border-retro-red">
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 font-retro">
            <MobileNavLink to="/auctions">Auctions</MobileNavLink>
            <MobileNavLink to="/about">About_Us</MobileNavLink>
            
            {user ? (
              <>
                <MobileNavLink to="/create-auction">Sell_Item</MobileNavLink>
                <div className="border-t-2 border-retro-orange my-2 pt-2">
                   <p className="text-retro-cream px-3 mb-2">USER: {user.username}</p>
                   <button onClick={handleLogout} className="w-full text-left text-retro-red hover:bg-retro-cream block px-3 py-2 text-xl font-bold border-l-4 border-transparent">
                     LOGOUT
                   </button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink to="/login">Login</MobileNavLink>
                <MobileNavLink to="/register">Join_Now</MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper Components
const NavLink = ({ to, children }) => (
  <Link to={to} className="text-retro-cream hover:text-retro-orange hover:underline decoration-4 underline-offset-4 transition-colors">
    {children}
  </Link>
);

const MobileNavLink = ({ to, children }) => (
  <Link to={to} className="text-retro-cream hover:bg-retro-red block px-3 py-2 text-xl font-bold border-l-4 border-transparent hover:border-retro-cream">
    {children}
  </Link>
);

export default Navbar;