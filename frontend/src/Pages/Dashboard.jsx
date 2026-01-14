import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [myAuctions, setMyAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' or 'bids'

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // 1. Fetch User Profile (for Wallet Balance & ID)
        // Assuming you have this route based on your authController
        const userRes = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!userRes.ok) throw new Error("Failed to load profile");
        const userData = await userRes.json();
        setUser(userData);

        // 2. Fetch All Auctions (and filter for My Listings)
        // In a real app, you'd want a specific endpoint like /auctions/my-auctions
        const auctionsRes = await fetch(`${API_URL}/auctions`);
        const auctionsData = await auctionsRes.json();
        
        // Filter: Show only auctions where seller_id matches logged-in user
        const userListings = auctionsData.filter(item => item.seller_id === userData.id);
        setMyAuctions(userListings);

      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, API_URL]);

  // Mock Data for "My Bids" since we don't have that endpoint yet
  const myBids = [
    { id: 99, title: "Retro Walkman", amount: 45.00, status: "WINNING" },
    { id: 100, title: "Vintage Lamp", amount: 120.00, status: "OUTBID" }
  ];

  if (loading) return (
    <div className="min-h-screen bg-retro-cream flex items-center justify-center font-display text-2xl animate-pulse">
      LOADING_COMMAND_CENTER...
    </div>
  );

  return (
    <div className="min-h-screen bg-retro-cream p-4 md:p-8 font-retro">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end border-b-4 border-black pb-4">
            <div>
                <h1 className="font-display text-4xl md:text-6xl text-retro-blue">
                    COMMAND_CENTER
                </h1>
                <p className="font-mono text-gray-600 uppercase tracking-widest">
                    // User_ID: {user?.id || 'UNKNOWN'}
                </p>
            </div>
            <button 
                onClick={() => {
                    Cookies.remove('token');
                    navigate('/login');
                }}
                className="mt-4 md:mt-0 bg-black text-white px-6 py-2 font-mono uppercase hover:bg-red-600 transition-colors"
            >
                [ Terminate_Session ]
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: User Stats Card */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white border-4 border-black p-6 shadow-hard relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-2 opacity-10 font-display text-9xl pointer-events-none">
                        $
                    </div>

                    <h2 className="font-display text-2xl uppercase mb-6 bg-retro-orange inline-block px-2 border-2 border-black">
                        Financial_Status
                    </h2>

                    <div className="mb-6">
                        <span className="block font-mono text-xs text-gray-500 uppercase">Wallet Balance</span>
                        <span className="block font-mono text-4xl md:text-5xl font-bold text-retro-blue">
                            ${user?.wallet_balance || '0.00'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-black text-white py-3 font-mono text-sm uppercase hover:bg-gray-800">
                            + Add_Funds
                        </button>
                        <button className="border-2 border-black py-3 font-mono text-sm uppercase hover:bg-gray-100">
                            > History
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-retro-blue text-white border-4 border-black p-6 shadow-hard">
                    <h2 className="font-display text-2xl uppercase mb-4">
                        Quick_Actions
                    </h2>
                    <ul className="space-y-3 font-mono text-sm">
                        <li>
                            <Link to="/create-auction" className="flex items-center gap-2 hover:text-retro-orange transition-colors">
                                <span className="text-retro-orange">></span> INITIATE_NEW_AUCTION
                            </Link>
                        </li>
                        <li>
                            <Link to="/auctions" className="flex items-center gap-2 hover:text-retro-orange transition-colors">
                                <span className="text-retro-orange">></span> BROWSE_MARKETPLACE
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="flex items-center gap-2 hover:text-retro-orange transition-colors">
                                <span className="text-retro-orange">></span> EDIT_PROFILE_DATA
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* RIGHT COLUMN: Tabbed Content */}
            <div className="lg:col-span-2">
                
                {/* Tabs */}
                <div className="flex border-b-4 border-black mb-6">
                    <button 
                        onClick={() => setActiveTab('listings')}
                        className={`px-6 py-3 font-display text-xl uppercase border-r-4 border-black transition-colors ${
                            activeTab === 'listings' ? 'bg-retro-red text-white' : 'bg-transparent hover:bg-gray-200'
                        }`}
                    >
                        My_Listings ({myAuctions.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('bids')}
                        className={`px-6 py-3 font-display text-xl uppercase border-r-4 border-black transition-colors ${
                            activeTab === 'bids' ? 'bg-retro-red text-white' : 'bg-transparent hover:bg-gray-200'
                        }`}
                    >
                        Active_Bids ({myBids.length})
                    </button>
                </div>

                {/* Content Area */}
                <div className="space-y-4">
                    
                    {/* MY LISTINGS TAB */}
                    {activeTab === 'listings' && (
                        <>
                            {myAuctions.length === 0 ? (
                                <div className="border-2 border-dashed border-gray-400 p-8 text-center font-mono text-gray-500">
                                    NO_ACTIVE_ASSETS_FOUND
                                </div>
                            ) : (
                                myAuctions.map((auction) => (
                                    <div key={auction.id} className="bg-white border-4 border-black p-4 flex gap-4 items-center shadow-sm hover:shadow-hard transition-all">
                                        <div className="w-20 h-20 border-2 border-black bg-gray-100 flex-shrink-0">
                                            <img src={auction.image_url} alt="" className="w-full h-full object-cover grayscale" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-display text-xl uppercase">{auction.title}</h3>
                                            <div className="flex gap-4 font-mono text-xs text-gray-600 mt-1">
                                                <span>PRICE: ${auction.current_price}</span>
                                                <span>ENDS: {new Date(auction.end_time).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <Link 
                                            to={`/auctions/${auction.id}`}
                                            className="bg-black text-white px-4 py-2 font-mono text-xs uppercase hover:bg-retro-blue"
                                        >
                                            Manage
                                        </Link>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {/* MY BIDS TAB (Mock Data) */}
                    {activeTab === 'bids' && (
                        <>
                            {myBids.map((bid) => (
                                <div key={bid.id} className="bg-white border-4 border-black p-4 flex gap-4 items-center opacity-75">
                                    <div className="w-20 h-20 border-2 border-black bg-gray-100 flex items-center justify-center font-display text-2xl text-gray-300">
                                        ?
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-display text-xl uppercase">{bid.title}</h3>
                                        <div className="flex gap-4 font-mono text-xs text-gray-600 mt-1">
                                            <span>MY BID: ${bid.amount}</span>
                                            <span className={bid.status === 'WINNING' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                                STATUS: {bid.status}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="border-2 border-black px-4 py-2 font-mono text-xs uppercase hover:bg-gray-100">
                                        View
                                    </button>
                                </div>
                            ))}
                        </>
                    )}

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;