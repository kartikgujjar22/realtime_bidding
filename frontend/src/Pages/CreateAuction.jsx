import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CreateAuction = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingBid: '',
    endTime: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get token from local storage
    const token = Cookies.get('token');
    if (!token) {
      alert("You must be logged in to create an auction.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/auctions`, { // Adjust route as needed
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create auction');
      
      navigate('/auctions'); // Redirect to listing page
      
    } catch (err) {
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-cream p-4 md:p-8 font-retro">
      <div className="max-w-3xl mx-auto">
        
        {/* Page Title */}
        <div className="mb-8 border-b-4 border-retro-blue pb-2 flex items-end justify-between">
            <h1 className="font-display text-4xl md:text-6xl text-retro-blue">
                INITIATE_AUCTION
            </h1>
            <span className="hidden md:block font-mono text-retro-red animate-pulse">
                REC_MODE ●
            </span>
        </div>

        {/* Main Form Container */}
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-hard relative">
          
          {/* Decorative Corner Screws */}
          <div className="absolute top-2 left-2 w-3 h-3 border border-black rounded-full flex items-center justify-center"><div className="w-1.5 h-px bg-black rotate-45"></div></div>
          <div className="absolute top-2 right-2 w-3 h-3 border border-black rounded-full flex items-center justify-center"><div className="w-1.5 h-px bg-black rotate-45"></div></div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Item Details Section */}
            <div className="space-y-4">
                <h3 className="bg-retro-blue text-white inline-block px-2 font-display text-xl uppercase">
                    // Asset_Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block font-bold text-retro-blue mb-2 uppercase text-sm">Item Title</label>
                        <input 
                            type="text" 
                            name="title"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-black p-3 font-mono focus:bg-retro-cream focus:ring-0 focus:border-retro-orange transition-colors"
                            placeholder="e.g. VINTAGE NINTENDO 64"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block font-bold text-retro-blue mb-2 uppercase text-sm">Description</label>
                        <textarea 
                            name="description"
                            rows="4"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-black p-3 font-mono focus:bg-retro-cream focus:border-retro-orange transition-colors"
                            placeholder="Describe condition, year, and specifications..."
                            required
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* 2. Financials Section */}
            <div className="space-y-4">
                <h3 className="bg-retro-blue text-white inline-block px-2 font-display text-xl uppercase">
                    // Financial_Parameters
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-bold text-retro-blue mb-2 uppercase text-sm">Starting Bid ($)</label>
                        <input 
                            type="number" 
                            name="startingBid"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-black p-3 font-mono focus:bg-retro-cream focus:border-retro-orange"
                            placeholder="0.00"
                            min="1"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block font-bold text-retro-blue mb-2 uppercase text-sm">Auction End Date</label>
                        <input 
                            type="datetime-local" 
                            name="endTime"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-black p-3 font-mono focus:bg-retro-cream focus:border-retro-orange"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* 3. Visuals Section */}
            <div className="space-y-4">
                <h3 className="bg-retro-blue text-white inline-block px-2 font-display text-xl uppercase">
                    // Visual_Data
                </h3>
                <div>
                    <label className="block font-bold text-retro-blue mb-2 uppercase text-sm">Image URL</label>
                    <div className="flex gap-2">
                        <span className="bg-gray-200 border-2 border-black px-3 py-3 font-mono text-gray-500">HTTP://</span>
                        <input 
                            type="text" 
                            name="imageUrl"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-black p-3 font-mono focus:bg-retro-cream focus:border-retro-orange"
                            placeholder="path-to-image.jpg"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-mono">* Direct link to image required.</p>
                </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-6 border-t-2 border-dashed border-gray-400 flex flex-col md:flex-row gap-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-retro-red text-white font-display text-2xl py-4 border-2 border-black shadow-hard hover:translate-y-1 hover:shadow-none hover:bg-retro-orange transition-all uppercase"
                >
                    {loading ? 'Processing...' : 'Upload_Asset'}
                </button>
                <button 
                    type="button"
                    onClick={() => navigate(-1)} 
                    className="flex-1 bg-transparent text-retro-blue font-display text-2xl py-4 border-2 border-retro-blue hover:bg-retro-blue hover:text-white transition-all uppercase"
                >
                    Cancel
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;