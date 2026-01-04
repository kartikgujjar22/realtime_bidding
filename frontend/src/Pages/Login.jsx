import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const Login = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      Cookies.set('token', data.token, { expires: 7, secure: true, sameSite: 'strict' });

      if (data.user){
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      navigate('/'); // Redirect to Home
      
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-retro-cream flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-retro-blue/20"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-retro-blue/20"></div>

      {/* Main Login Window */}
      <div className="w-full max-w-md bg-white border-4 border-retro-blue shadow-hard z-10">
        
        {/* Window Header */}
        <div className="bg-retro-blue p-2 flex justify-between items-center cursor-move">
          <h2 className="text-white font-display text-xl tracking-wider">
            ACCESS_CONTROL_V1.0
          </h2>
          <button className="text-white hover:text-retro-red font-bold px-2">X</button>
        </div>

        <div className="p-8 font-retro">
          <div className="text-center mb-8">
             <div className="inline-block p-4 border-2 border-black rounded-full mb-4 bg-gray-100">
                🔐
             </div>
             <p className="text-retro-blue font-bold uppercase tracking-widest text-sm">
               Identity Verification Required
             </p>
          </div>

          {status.error && (
            <div className="bg-retro-red text-white p-2 mb-4 text-center border-2 border-black font-bold animate-pulse text-sm">
              [!] ACCESS DENIED: {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-retro-blue text-sm font-bold mb-1 uppercase">
                UserID (Email):
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-retro-blue p-2 text-retro-blue focus:outline-none focus:ring-2 focus:ring-retro-orange focus:border-transparent shadow-inner"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-retro-blue text-sm font-bold mb-1 uppercase">
                Passcode:
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-retro-blue p-2 text-retro-blue focus:outline-none focus:ring-2 focus:ring-retro-orange focus:border-transparent shadow-inner"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full bg-retro-blue text-white font-display text-xl py-3 border-2 border-black hover:bg-retro-orange hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            >
              {status.loading ? 'AUTHENTICATING...' : 'ENTER_SYSTEM'}
            </button>
          </form>

          <div className="mt-6 border-t-2 border-gray-200 pt-4 text-center text-xs font-mono text-gray-500">
            Forgot credentials? Contact <span className="underline">SysAdmin</span>.
            <br/>
            New user? <Link to="/register" className="text-retro-blue font-bold hover:bg-retro-orange hover:text-white px-1">REGISTER_HERE</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;