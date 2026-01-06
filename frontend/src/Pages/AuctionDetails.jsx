// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { auctionService } from '../services/auctionService';
// import { useAuth } from '../lib/AuthContext';

// const AuctionDetails = () => {
//   const { id } = useParams();
//   const { currentUser } = useAuth();
//   const [auction, setAuction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [bidAmount, setBidAmount] = useState('');

//   useEffect(() => {
//     const fetchAuction = async () => {
//       try {
//         const data = await auctionService.getAuctionById(id);
//         setAuction(data);
//         setBidAmount(data.currentPrice + data.minimumBidIncrement);
//       } catch (err) {
//         setError('Failed to fetch auction details.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAuction();
//   }, [id]);

//   const handleBidSubmit = (e) => {
//     e.preventDefault();
//     // TODO: Implement bid submission logic
//     console.log(`Bid for ${bidAmount} on auction ${id} by user ${currentUser.uid}`);
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-64">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center mt-8">{error}</div>;
//   }

//   if (!auction) {
//     return <div className="text-center mt-8">Auction not found.</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div>
//           <img src={auction.imageURL} alt={auction.title} className="w-full rounded-lg shadow-lg" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
//           <p className="text-gray-600 mb-4">{auction.description}</p>
//           <div className="mb-4">
//             <p className="text-gray-700">Current Bid:</p>
//             <p className="text-4xl font-bold text-blue-600">${auction.currentPrice.toFixed(2)}</p>
//           </div>
//           <div className="mb-4">
//             <p className="text-gray-700">Minimum Bid Increment:</p>
//             <p className="text-lg font-semibold">${auction.minimumBidIncrement.toFixed(2)}</p>
//           </div>
//           <div className="mb-4">
//             <p className="text-gray-700">Auction Ends:</p>
//             <p className="text-lg font-semibold">{new Date(auction.endDate.seconds * 1000).toLocaleString()}</p>
//           </div>
//           {currentUser && (
//             <form onSubmit={handleBidSubmit} className="mt-8">
//               <div className="flex items-center">
//                 <input
//                   type="number"
//                   value={bidAmount}
//                   onChange={(e) => setBidAmount(e.target.value)}
//                   min={auction.currentPrice + auction.minimumBidIncrement}
//                   step={auction.minimumBidIncrement}
//                   className="w-full px-4 py-2 border rounded-l-lg"
//                   required
//                 />
//                 <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700">
//                   Place Bid
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuctionDetails;