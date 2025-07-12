import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  startAfter,
  query as firestoreQuery
} from 'firebase/firestore';

const Home = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [endingSoonAuctions, setEndingSoonAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ending-soon');

  // Categories for filtering
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'art', label: 'Art & Collectibles' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'books', label: 'Books' },
    { value: 'sports', label: 'Sports Equipment' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadAuctions();
  }, [selectedCategory, sortBy]);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const now = new Date();

      // Build query based on filters
      let q = firestoreQuery(
        collection(db, 'auctions'),
        where('status', '==', 'active')
      );

      // Add category filter if selected
      if (selectedCategory) {
        q = firestoreQuery(q, where('category', '==', selectedCategory));
      }

      // Add sorting
      if (sortBy === 'ending-soon') {
        q = firestoreQuery(q, orderBy('endDate', 'asc'));
      } else if (sortBy === 'price-low') {
        q = firestoreQuery(q, orderBy('currentPrice', 'asc'));
      } else if (sortBy === 'price-high') {
        q = firestoreQuery(q, orderBy('currentPrice', 'desc'));
      } else if (sortBy === 'newest') {
        q = firestoreQuery(q, orderBy('createdAt', 'desc'));
      }

      // Limit results
      q = firestoreQuery(q, limit(20));

      const querySnapshot = await getDocs(q);
      const auctions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter auctions that haven't ended
      const activeAuctions = auctions.filter(auction => {
        const endDate = auction.endDate.toDate();
        return endDate > now;
      });

      // Separate auctions by type
      const endingSoon = activeAuctions
        .filter(auction => {
          const endDate = auction.endDate.toDate();
          const timeLeft = endDate - now;
          return timeLeft < 24 * 60 * 60 * 1000; // Less than 24 hours
        })
        .slice(0, 6);

      const recent = activeAuctions
        .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
        .slice(0, 6);

      const featured = activeAuctions
        .filter(auction => auction.currentPrice > 100) // Featured items over $100
        .slice(0, 6);

      setEndingSoonAuctions(endingSoon);
      setRecentAuctions(recent);
      setFeaturedAuctions(featured);

    } catch (error) {
      console.error('Error loading auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatTimeLeft = (endDate) => {
    const now = new Date();
    const end = endDate.toDate();
    const timeLeft = end - now;

    if (timeLeft <= 0) return 'Ended';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const getTimeLeftColor = (endDate) => {
    const now = new Date();
    const end = endDate.toDate();
    const timeLeft = end - now;

    if (timeLeft <= 0) return 'text-red-600';
    if (timeLeft < 60 * 60 * 1000) return 'text-red-600'; // Less than 1 hour
    if (timeLeft < 24 * 60 * 60 * 1000) return 'text-orange-600'; // Less than 24 hours
    return 'text-green-600';
  };

  const AuctionCard = ({ auction }) => (
    <Link 
      to={`/auction/${auction.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="relative">
        {auction.imageURL ? (
          <img
            src={auction.imageURL}
            alt={auction.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white shadow-sm ${getTimeLeftColor(auction.endDate)}`}>
            {formatTimeLeft(auction.endDate)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{auction.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{auction.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(auction.currentPrice)}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {auction.category || 'Uncategorized'}
          </span>
        </div>
        
        {auction.bids && auction.bids.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {auction.bids.length} bid{auction.bids.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Link>
  );

  const HeroSection = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Realtime Bidding
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100">
          Bid on amazing items in real-time. Every second counts!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/create-auction"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Auction
          </Link>
          <Link
            to="/dashboard"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  const SearchAndFilterSection = () => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ending-soon">Ending Soon</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <SearchAndFilterSection />

        {/* Ending Soon Section */}
        {endingSoonAuctions.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Ending Soon</h2>
              <Link to="/auctions?filter=ending-soon" className="text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {endingSoonAuctions.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Auctions */}
        {featuredAuctions.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Featured Auctions</h2>
              <Link to="/auctions?filter=featured" className="text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredAuctions.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Auctions */}
        {recentAuctions.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Auctions</h2>
              <Link to="/auctions?filter=recent" className="text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentAuctions.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {endingSoonAuctions.length === 0 && featuredAuctions.length === 0 && recentAuctions.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No auctions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedCategory 
                ? `No auctions found in ${categoryOptions.find(c => c.value === selectedCategory)?.label}`
                : 'Get started by creating the first auction.'
              }
            </p>
            {currentUser && (
              <div className="mt-6">
                <Link
                  to="/create-auction"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Auction
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        {currentUser && (
          <section className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Bidding?</h2>
            <p className="text-gray-600 mb-6">
              Create your own auction or start bidding on existing items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-auction"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Auction
              </Link>
              <Link
                to="/dashboard"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                My Dashboard
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
