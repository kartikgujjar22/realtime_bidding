import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../lib/AuthContext.jsx';
import { auctionService } from '../services/auctionService.js';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-auctions');
  const [myAuctions, setMyAuctions] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    totalBids: 0,
    wonAuctions: 0
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [currentUser, navigate]);

  const loadDashboardData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Load user's auctions
      const auctions = await auctionService.getAuctionsByUser(currentUser.uid);
      setMyAuctions(auctions);

      // Load user's bids
      const bids = await auctionService.getBidsForUser(currentUser.uid);
      setMyBids(bids);

      // Load won auctions (auctions where user is the highest bidder and auction has ended)
      const now = new Date();
      const wonAuctionsData = auctions.filter(auction => {
        if (!auction.endDate) return false;
        const endDate = auction.endDate.toDate ? auction.endDate.toDate() : new Date(auction.endDate);
        return endDate < now && auction.status === 'ended';
      });
      setWonAuctions(wonAuctionsData);

      // Calculate stats
      const activeAuctions = auctions.filter(auction => {
        if (!auction.endDate) return false;
        const endDate = auction.endDate.toDate ? auction.endDate.toDate() : new Date(auction.endDate);
        return endDate > now && auction.status === 'active';
      });

      setStats({
        totalAuctions: auctions.length,
        activeAuctions: activeAuctions.length,
        totalBids: bids.length,
        wonAuctions: wonAuctionsData.length
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndAuction = async (auctionId) => {
    try {
      await auctionService.updateAuctionStatus(auctionId, 'ended');
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error('Error ending auction:', error);
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await auctionService.deleteAuction(auctionId);
        loadDashboardData(); // Reload data
      } catch (error) {
        console.error('Error deleting auction:', error);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getAuctionStatus = (auction) => {
    if (auction.status === 'ended') return 'Ended';
    
    const now = new Date();
    if (!auction.endDate) return 'Active';
    
    const endDate = auction.endDate.toDate ? auction.endDate.toDate() : new Date(auction.endDate);
    if (endDate < now) return 'Expired';
    return 'Active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Ended': return 'text-blue-600 bg-blue-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!currentUser) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {currentUser.displayName || currentUser.email}!
        </h1>
        <p className="text-gray-600">Manage your auctions and track your bidding activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Auctions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAuctions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Auctions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAuctions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Won Auctions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.wonAuctions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('my-auctions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-auctions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Auctions
            </button>
            <button
              onClick={() => setActiveTab('my-bids')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-bids'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Bids
            </button>
            <button
              onClick={() => setActiveTab('won-auctions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'won-auctions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Won Auctions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* My Auctions Tab */}
          {activeTab === 'my-auctions' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Auctions</h2>
                <Link
                  to="/create-auction"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create New Auction
                </Link>
              </div>
              
              {myAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No auctions yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first auction.</p>
                  <div className="mt-6">
                    <Link
                      to="/create-auction"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Create Auction
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myAuctions.map((auction) => (
                    <div key={auction.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      {auction.imageURL && (
                        <img
                          src={auction.imageURL}
                          alt={auction.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{auction.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{auction.description}</p>
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(auction.currentBid)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getAuctionStatus(auction))}`}>
                            {getAuctionStatus(auction)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-4">
                          Ends: {formatDate(auction.endDate)}
                        </p>
                        
                        <div className="flex space-x-2">
                          <Link
                            to={`/auction/${auction.id}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-md hover:bg-blue-700 text-sm"
                          >
                            View
                          </Link>
                          {getAuctionStatus(auction) === 'Active' && (
                            <button
                              onClick={() => handleEndAuction(auction.id)}
                              className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 text-sm"
                            >
                              End
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAuction(auction.id)}
                            className="bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Bids Tab */}
          {activeTab === 'my-bids' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">My Bids</h2>
              
              {myBids.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bids yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Start bidding on auctions to see them here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBids.map((bid) => (
                    <div key={bid.id} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{bid.auctionTitle || 'Auction'}</h3>
                          <p className="text-sm text-gray-600">Bid: {formatPrice(bid.bidAmount)}</p>
                          <p className="text-xs text-gray-500">{formatDate(bid.bidTime)}</p>
                        </div>
                        <Link
                          to={`/auction/${bid.auctionId}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                        >
                          View Auction
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Won Auctions Tab */}
          {activeTab === 'won-auctions' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Won Auctions</h2>
              
              {wonAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No won auctions yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Win auctions to see them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wonAuctions.map((auction) => (
                    <div key={auction.id} className="bg-white border rounded-lg shadow-sm">
                      {auction.imageURL && (
                        <img
                          src={auction.imageURL}
                          alt={auction.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{auction.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{auction.description}</p>
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-bold text-green-600">
                            Won for {formatPrice(auction.currentBid)}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                            Won
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-4">
                          Ended: {formatDate(auction.endDate)}
                        </p>
                        
                        <Link
                          to={`/auction/${auction.id}`}
                          className="w-full bg-green-600 text-white text-center py-2 px-3 rounded-md hover:bg-green-700 text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
