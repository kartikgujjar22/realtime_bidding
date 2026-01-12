import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  // Fetch Auction Data
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await fetch(`${API_URL}/auctions/${id}`);
        if (!response.ok) throw new Error('Auction not found');
        const data = await response.json();
        setAuction(data);
        // Pre-fill bid amount with next valid bid
        setBidAmount(data.current_price + data.bid_increment);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id, API_URL]);

  // Placeholder Bid Handler
  const handlePlaceBid = (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    
    if (!token) {
      alert("ACCESS_DENIED: Please login to place a bid.");
      return;
    }
    
    alert(`COMMAND_QUEUED: Bid of $${bidAmount} for Item #${id}. (Logic coming soon)`);
  };

  if (loading) return (
    <div className="min-h-screen bg-retro-cream flex items-center justify-center font-display text-2xl text-retro-blue animate-pulse">
      LOADING_TERMINAL...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-retro-cream flex items-center justify-center">
        <div className="border-4 border-red-600 bg-white p-8 shadow-hard">
            <h1 className="font-mono text-red-600 text-xl">ERROR_404: ASSET_NOT_FOUND</h1>
            <button onClick={() => navigate('/auctions')} className="mt-4 underline font-mono">Return to Database</button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-retro-cream p-4 md:p-8 font-retro">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation / Breadcrumb */}
        <button 
            onClick={() => navigate(-1)}
            className="mb-6 font-mono text-gray-500 hover:text-black hover:underline uppercase"
        >
            &lt; Back_to_Feed
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Visuals */}
            <div className="space-y-4">
                <div className="border-4 border-black p-2 bg-white shadow-hard relative">
                    {/* Decorative bits */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-black"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 bg-black"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-black"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-black"></div>

                    <img 
                        src={auction.image_url} 
                        alt={auction.title}
                        className="w-full h-auto object-cover border-2 border-black grayscale hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="mt-2 flex justify-between font-mono text-xs">
                        <span>RES: HIGH_DEF</span>
                        <span>SRC: SECURE_BUCKET</span>
                    </div>
                </div>

                {/* Additional Info Box */}
                <div className="bg-retro-blue text-white p-4 border-2 border-black">
                    <h3 className="font-display text-xl mb-2">SELLER_MANIFEST</h3>
                    <p className="font-mono text-sm">SELLER ID: #{auction.seller_id}</p>
                    <p className="font-mono text-sm">VERIFIED: TRUE</p>
                    <p className="font-mono text-sm">RATING: ★★★★★</p>
                </div>
            </div>

            {/* RIGHT COLUMN: Data & Actions */}
            <div className="flex flex-col gap-6">
                
                {/* Header */}
                <div>
                    <div className="inline-block bg-black text-white px-2 py-1 font-mono text-xs mb-2">
                        ITEM_ID: {String(auction.id).padStart(6, '0')}
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl text-retro-blue leading-none mb-4">
                        {auction.title}
                    </h1>
                    <div className="h-1 w-20 bg-retro-red mb-4"></div>
                    <p className="font-mono text-gray-700 leading-relaxed border-l-4 border-gray-300 pl-4">
                        {auction.description}
                    </p>
                </div>

                {/* Live Stats Board */}
                <div className="bg-white border-4 border-black p-6 shadow-hard grid grid-cols-2 gap-6">
                    <div>
                        <span className="block font-bold text-gray-500 text-xs uppercase mb-1">Current Highest Bid</span>
                        <span className="block font-mono text-4xl font-bold text-retro-blue">
                            ${auction.current_price}
                        </span>
                    </div>
                    <div className="text-right">
                         <span className="block font-bold text-gray-500 text-xs uppercase mb-1">Auction Ends In</span>
                        <span className="block font-mono text-2xl font-bold text-retro-red animate-pulse">
                            {new Date(auction.end_time).toLocaleDateString()}
                        </span>
                        <span className="block font-mono text-sm">
                            {new Date(auction.end_time).toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                {/* Bidding Terminal (Form) */}
                <div className="mt-auto bg-gray-100 border-4 border-black border-dashed p-6">
                    <h3 className="font-display text-2xl uppercase mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
                        Terminal_Access
                    </h3>
                    
                    <form onSubmit={handlePlaceBid} className="space-y-4">
                        <div>
                            <label className="block font-mono text-sm font-bold mb-2">
                                ENTER BID AMOUNT (MIN: ${auction.current_price + auction.bid_increment})
                            </label>
                            <div className="flex">
                                <span className="bg-black text-white font-mono text-xl p-3 flex items-center">$</span>
                                <input 
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    min={auction.current_price + auction.bid_increment}
                                    className="flex-1 border-4 border-l-0 border-black p-3 font-mono text-xl focus:bg-retro-cream outline-none"
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit"
                            className="w-full bg-retro-red text-white font-display text-2xl py-4 border-4 border-black shadow-hard hover:translate-y-1 hover:shadow-none hover:bg-retro-orange transition-all uppercase"
                        >
                            Confirm_Bid_Entry
                        </button>
                    </form>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;