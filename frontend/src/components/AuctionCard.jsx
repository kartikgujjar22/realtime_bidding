// import React from 'react';
// import { Link } from 'react-router-dom';

// // Accepts an 'item' prop. 
// // Expected shape: { _id, title, currentBid, endTime, imageUrl, description }
// const AuctionCard = ({ item }) => {
//   return (
//     <div className="bg-white border-4 border-retro-blue shadow-hard-sm hover:shadow-hard hover:-translate-y-1 transition-all duration-200 group flex flex-col h-full">
      
//       {/* Image Container with "Loading" effect */}
//       <div className="relative border-b-4 border-retro-blue h-56 overflow-hidden bg-gray-200">
        
//         {/* Live Badge */}
//         <div className="absolute top-2 right-2 bg-retro-red text-white px-2 py-1 text-xs font-bold border-2 border-white z-10 animate-pulse font-mono">
//           ● LIVE
//         </div>

//         {/* Overlay Grid (CRT Effect) */}
//         <div className="absolute inset-0 bg-transparent bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

//         <img 
//           src={item.imageUrl || "https://placehold.co/400x300?text=NO_IMAGE"} 
//           alt={item.title} 
//           className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
//         />
//       </div>
      
//       {/* Card Body */}
//       <div className="p-4 flex flex-col flex-grow font-retro">
//         <h3 className="font-display text-2xl truncate text-retro-blue uppercase tracking-wide">
//           {item.title}
//         </h3>
        
//         {/* Description Snippet */}
//         <p className="text-sm text-gray-600 mb-4 line-clamp-2 font-bold leading-tight mt-1">
//           {item.description || "No description data available for this unit."}
//         </p>

//         <div className="mt-auto space-y-3">
//           {/* Stats Grid */}
//           <div className="flex justify-between items-center font-mono border-y-2 border-gray-200 py-2">
//             <div className="flex flex-col">
//               <span className="text-xs text-gray-500 uppercase">Current Bid</span>
//               <span className="text-retro-blue text-xl font-bold">${item.currentBid}</span>
//             </div>
//             <div className="flex flex-col items-end">
//               <span className="text-xs text-gray-500 uppercase">Ends In</span>
//               <span className="bg-black text-retro-orange px-2 py-0.5 text-sm rounded-none">
//                 {/* You can add a countdown formatter here later */}
//                 {new Date(item.endTime).toLocaleDateString()}
//               </span>
//             </div>
//           </div>

//           {/* Action Button */}
//           <Link 
//             to={`/auction/${item._id}`} 
//             className="block w-full text-center bg-retro-cream border-2 border-retro-blue py-2 font-display text-xl text-retro-blue hover:bg-retro-blue hover:text-retro-cream transition-colors uppercase"
//           >
//             Place_Bid &gt;&gt;
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuctionCard;