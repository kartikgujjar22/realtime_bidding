import React from 'react';
import { Link } from 'react-router-dom';

const AuctionCard = ({ auction }) => {
  const { id, title, currentPrice, imageURL, endDate } = auction;

  const getRemainingTime = () => {
    const now = new Date();
    const end = new Date(endDate.seconds * 1000);
    const diff = end - now;

    if (diff <= 0) {
      return 'Auction ended';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m left`;
  };

  return (
    <Link to={`/auction/${id}`} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img src={imageURL} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Current Bid:</p>
          <p className="text-xl font-bold text-blue-600">${currentPrice.toFixed(2)}</p>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          {getRemainingTime()}
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;