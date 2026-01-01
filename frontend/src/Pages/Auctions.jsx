import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auctionService } from '../services/auctionService';
import AuctionCard from '../components/AuctionCard';

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await auctionService.getAllAuctions();
        setAuctions(data);
      } catch (err) {
        setError('Failed to fetch auctions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Live Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {auctions.map(auction => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default Auctions;