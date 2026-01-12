import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t-8 border-retro-blue mt-auto font-retro">
      <div className="max-w-7xl mx-auto p-8 md:p-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b-2 border-dashed border-gray-700 pb-12 mb-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h2 className="font-display text-4xl text-retro-orange">BID_WARS</h2>
            <p className="font-mono text-sm text-gray-400 leading-relaxed">
              // DECENTRALIZED AUCTION PROTOCOL<br/>
              // EST. 2026<br/>
              // SECURE_CONNECTION_ESTABLISHED
            </p>
            <div className="flex items-center gap-2 mt-4">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-mono text-xs text-green-500">SYSTEM_ONLINE</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-retro-blue uppercase">Directory</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <Link to="/auctions" className="hover:text-retro-orange hover:translate-x-2 transition-transform block">
                  LIVE_AUCTIONS
                </Link>
              </li>
              <li>
                <Link to="/create-auction" className="hover:text-retro-orange hover:translate-x-2 transition-transform block">
                  INITIATE_SALE
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-retro-orange hover:translate-x-2 transition-transform block">
                  USER_LOGIN
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-retro-orange hover:translate-x-2 transition-transform block">
                  NEW_ACCOUNT
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter (Fake Terminal) */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-retro-red uppercase">Updates</h3>
            <div className="bg-gray-900 border-2 border-gray-700 p-4 font-mono text-xs">
              <p className="text-green-400 mb-2">$ subscribe --email user@net</p>
              <input 
                type="email" 
                placeholder="ENTER_EMAIL_ADDRESS..." 
                className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none focus:border-retro-orange py-1"
              />
              <button className="mt-4 bg-white text-black px-4 py-2 font-bold uppercase hover:bg-retro-orange hover:text-white transition-colors w-full">
                [ EXECUTE ]
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center font-mono text-xs text-gray-500">
            <p>© 2026 BID_WARS INC. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">TERMS_OF_SERVICE</a>
                <span className="text-gray-700">|</span>
                <a href="#" className="hover:text-white">PRIVACY_PROTOCOL</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;