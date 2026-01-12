import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Auctions = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Auctions
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch(`${API_URL}/auctions`);
        if (!response.ok) throw new Error('Failed to fetch auctions');
        const data = await response.json();
        setAuctions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  // Retro Date Formatter
  const formatTimeLeft = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    if (total <= 0) return "EXPIRED";
    const hours = Math.floor((total / (1000 * 60 * 60)));
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return `${hours}H : ${minutes}M`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-cream flex items-center justify-center">
        <div className="text-4xl font-display text-retro-blue animate-pulse">
          LOADING_ASSETS...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-retro-cream flex items-center justify-center">
        <div className="border-4 border-red-600 p-8 bg-white shadow-hard">
            <h2 className="text-2xl font-mono text-red-600">SYSTEM_ERROR: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-cream p-4 md:p-8 font-retro">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 border-b-4 border-black pb-4 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
                <h1 className="font-display text-5xl md:text-7xl text-retro-blue mb-2">
                    LIVE_FEED
                </h1>
                <p className="font-mono text-gray-600 uppercase tracking-widest">
                    // Current_Listings_Database
                </p>
            </div>
            
            <Link 
                to="/create-auction" 
                className="bg-retro-red text-white font-display text-xl px-8 py-3 border-4 border-black shadow-hard hover:translate-y-1 hover:shadow-none hover:bg-retro-orange transition-all uppercase"
            >
                + New_Entry
            </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} formatTimeLeft={formatTimeLeft} />
            ))}
        </div>

        {auctions.length === 0 && (
            <div className="text-center py-20 border-4 border-dashed border-gray-400">
                <h2 className="font-display text-3xl text-gray-400">NO_DATA_FOUND</h2>
            </div>
        )}
      </div>
    </div>
  );
};

// Extracted Card Component for cleanness
const AuctionCard = ({ auction, formatTimeLeft }) => {
    return (
        <div className="group bg-white border-4 border-black p-4 relative shadow-hard hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
            
            {/* Corner Decor */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>
            <div className="absolute top-2 left-2 w-2 h-2 bg-black rounded-full"></div>

            {/* Image Container */}
            <div className="relative h-64 mb-4 border-2 border-black overflow-hidden bg-gray-100">
                <img 
                    src={auction.image_url} 
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
                />
                
                {/* Status Badge */}
                <div className="absolute top-0 right-0 bg-retro-blue text-white font-mono text-xs px-2 py-1 border-b-2 border-l-2 border-black">
                    ID: #{String(auction.id).padStart(4, '0')}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <h2 className="font-display text-2xl leading-none text-black truncate pr-2">
                        {auction.title}
                    </h2>
                </div>

                <p className="font-mono text-sm text-gray-600 line-clamp-2 h-10">
                    {auction.description}
                </p>

                {/* Data Grid */}
                <div className="bg-gray-50 border-2 border-black p-3 grid grid-cols-2 gap-4">
                    <div>
                        <span className="block font-bold text-retro-blue text-[10px] uppercase">Current Bid</span>
                        <span className="font-mono text-xl font-bold">${auction.current_price}</span>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-retro-red text-[10px] uppercase">Time Left</span>
                        <span className="font-mono text-xl font-bold animate-pulse">
                            {formatTimeLeft(auction.end_time)}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <Link 
                    to={`/auctions/${auction.id}`}
                    className="block w-full bg-black text-white text-center font-display text-xl py-3 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors uppercase mt-4"
                >
                     Access_Terminal
                </Link>
            </div>
        </div>
    );
};

export default Auctions;