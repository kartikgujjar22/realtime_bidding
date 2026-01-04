import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  // 1. Configurable URL from Env
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setStatus({ loading: false, error: '', success: 'Welcome to the club!' });
      navigate('/login');
      
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="min-h-screen bg-retro-cream flex items-center justify-center p-4 pattern-grid-lg">
      
      {/* Main Card Container */}
      <div className="w-full max-w-md bg-white border-4 border-retro-blue shadow-hard relative">
        
        {/* Retro Header Bar */}
        <div className="bg-retro-blue p-3 flex justify-between items-center border-b-4 border-retro-blue">
          <h2 className="text-retro-cream font-display text-3xl tracking-wide">
            NEW_USER_.EXE
          </h2>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-retro-cream border-2 border-black"></div>
            <div className="w-4 h-4 bg-retro-red border-2 border-black"></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 font-retro">
          
          {/* Error / Success Display (Looks like a terminal output) */}
          {status.error && (
            <div className="bg-retro-red text-white p-3 mb-6 border-2 border-retro-blue font-bold text-center">
              ⚠ ERROR: {status.error}
            </div>
          )}
          {status.success && (
            <div className="bg-green-600 text-white p-3 mb-6 border-2 border-retro-blue font-bold text-center animate-pulse">
              ★ SUCCESS: {status.success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Input */}
            <div>
              <label className="block text-retro-blue text-lg font-bold mb-2 uppercase">
                Username:
              </label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                className="w-full bg-retro-cream border-4 border-retro-blue p-3 text-retro-blue placeholder-retro-blue/50 focus:outline-none focus:bg-white focus:shadow-hard-sm transition-all"
                placeholder="ENTER_CODENAME"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-retro-blue text-lg font-bold mb-2 uppercase">
                Email Address:
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full bg-retro-cream border-4 border-retro-blue p-3 text-retro-blue placeholder-retro-blue/50 focus:outline-none focus:bg-white focus:shadow-hard-sm transition-all"
                placeholder="USER@NETSCAPE.COM"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-retro-blue text-lg font-bold mb-2 uppercase">
                Secret Key:
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full bg-retro-cream border-4 border-retro-blue p-3 text-retro-blue placeholder-retro-blue/50 focus:outline-none focus:bg-white focus:shadow-hard-sm transition-all"
                placeholder="********"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status.loading}
              className="w-full bg-retro-red text-white font-display text-2xl py-3 border-4 border-retro-blue shadow-hard hover:translate-y-1 hover:shadow-none hover:bg-retro-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.loading ? 'PROCESSING...' : 'INITIALIZE_ACCOUNT >'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-retro-blue font-bold text-sm">
            ALREADY A MEMBER? <a href="/login" className="underline decoration-retro-red decoration-4 hover:text-retro-red">LOGIN_HERE</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;