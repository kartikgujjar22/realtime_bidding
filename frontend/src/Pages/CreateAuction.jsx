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
    bidIncrement: '', 
    endTime: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get('token');
    if (!token) {
      alert("You must be logged in to create an auction.");
      setLoading(false);
      return;
    }

    // 2. CONSTRUCT FORMDATA: Required for File Uploads
    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('description', formData.description);
    
    submissionData.append('starting_price', formData.startingBid); 
    
    submissionData.append('bid_increment', formData.bidIncrement);
    
    submissionData.append('end_time', formData.endTime);

    if (imageFile) {
      submissionData.append('image', imageFile);
    } else {
        alert("Please select an image file.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_URL}/auctions`, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
        body: submissionData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create auction');
      }
      
      console.log("Success:", data);
      navigate('/auctions');
      
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
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
                        <label className="block font-bold text-retro-blue mb-2 uppercase text-sm">Starting Bid (INR)</label>
                        <input 
                            type="number" 
                            name="startingBid"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-black p-3 font-mono focus:bg-retro-cream focus:border-retro-orange"
                            placeholder="0.00"
                            min="1"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-retro-blue mb-2 uppercase text-sm">Bid Increment (INR)</label>
                        <input 
                            type="number" 
                            name="bidIncrement"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-black p-3 font-mono focus:bg-retro-cream focus:border-retro-orange"
                            placeholder="Min. raise amount (e.g. 5.00)"
                            min="0.50"
                            step="0.01"
                            required
                        />
                    </div>
                    
                    <div className="col-span-2">
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
                    <label className="block font-bold text-retro-blue mb-2 uppercase text-sm">Upload Image</label>
                    <div className="flex gap-2">
                        {/* Changed to File Input */}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full bg-gray-50 border-2 border-black p-3 font-mono focus:bg-retro-cream focus:border-retro-orange file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-retro-orange file:text-white hover:file:bg-retro-blue"
                            required
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-mono">* Supported formats: JPG, PNG (Max 5MB)</p>
                </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-6 border-t-2 border-dashed border-gray-400 flex flex-col md:flex-row gap-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-retro-red text-white font-display text-2xl py-4 border-2 border-black shadow-hard hover:translate-y-1 hover:shadow-none hover:bg-retro-orange transition-all uppercase"
                >
                    {loading ? 'UPLOADING...' : 'Upload_Asset'}
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