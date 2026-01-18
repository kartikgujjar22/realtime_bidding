import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const navigate = useNavigate();
  
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Fetch Wallet Data (Balance + History)
  const fetchWalletData = async () => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // 1. Get User Balance
      const userRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();
      setBalance(userData.wallet_balance);

      // 2. Get Transaction History
      const historyRes = await fetch(`${API_URL}/wallet/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const historyData = await historyRes.json();
      setTransactions(historyData);

    } catch (err) {
      console.error("Wallet Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [navigate, API_URL]);

  // Handle Deposit
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setProcessing(true);
    const token = Cookies.get('token');

    try {
      const res = await fetch(`${API_URL}/wallet/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      const data = await res.json();

      if (res.ok) {
        alert("TRANSACTION SUCCESSFUL: FUNDS ADDED");
        setAmount('');
        // Refresh data to show new balance & history entry
        fetchWalletData(); 
      } else {
        alert("ERROR: " + data.message);
      }
    } catch (err) {
      alert("SYSTEM FAILURE: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-retro-cream flex items-center justify-center font-display text-2xl animate-pulse">
      ACCESSING_SECURE_VAULT...
    </div>
  );

  return (
    <div className="min-h-screen bg-retro-cream p-4 md:p-8 font-retro">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b-4 border-black pb-4 flex items-end justify-between">
            <h1 className="font-display text-4xl md:text-6xl text-retro-blue">
                DIGITAL_VAULT
            </h1>
            <button 
                onClick={() => navigate('/dashboard')}
                className="font-mono text-gray-500 hover:text-black hover:underline uppercase"
            >
                &lt; Back_to_Command
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* 1. Balance Card */}
            <div className="bg-black text-white p-6 shadow-hard border-4 border-gray-800 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-gray-800 font-display text-9xl select-none opacity-50">
                    $
                </div>
                <h2 className="font-mono text-gray-400 text-sm uppercase mb-2">Total Available Balance</h2>
                <div className="font-mono text-5xl md:text-6xl font-bold text-green-400 mb-4 relative z-10">
                    ${parseFloat(balance).toFixed(2)}
                </div>
                <div className="font-mono text-xs text-gray-500">
                    STATUS: SECURE // ENCRYPTED
                </div>
            </div>

            {/* 2. Deposit Form */}
            <div className="bg-white border-4 border-black p-6 shadow-hard">
                <h2 className="font-display text-2xl uppercase mb-4 bg-retro-orange inline-block px-2 border-2 border-black">
                    Add_Funds
                </h2>
                <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                        <label className="block font-mono text-xs font-bold mb-2 uppercase">Amount to Deposit</label>
                        <div className="flex">
                            <span className="bg-gray-200 border-2 border-black border-r-0 px-4 py-2 font-mono flex items-center">$</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border-2 border-black p-2 font-mono outline-none focus:bg-retro-cream"
                                placeholder="0.00"
                                min="1"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-retro-blue text-white font-display text-xl py-3 border-2 border-black hover:bg-black transition-colors uppercase disabled:bg-gray-400"
                    >
                        {processing ? 'PROCESSING...' : 'INITIATE_TRANSFER'}
                    </button>
                </form>
            </div>
        </div>

        {/* 3. Transaction History Ledger */}
        <div className="bg-white border-4 border-black p-6 shadow-hard">
            <h2 className="font-display text-2xl uppercase mb-6 flex items-center gap-2">
                Transaction_Ledger
                <span className="text-xs font-mono bg-black text-white px-2 py-1 rounded-none">
                    {transactions.length} RECORDS
                </span>
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full font-mono text-sm text-left">
                    <thead className="bg-gray-100 border-b-4 border-black">
                        <tr>
                            <th className="p-3 border-r-2 border-black">DATE/TIME</th>
                            <th className="p-3 border-r-2 border-black">TYPE</th>
                            <th className="p-3 border-r-2 border-black">DESCRIPTION</th>
                            <th className="p-3 text-right">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-200">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                                    -- NO TRANSACTIONS RECORDED --
                                </td>
                            </tr>
                        ) : (
                            transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-retro-cream transition-colors">
                                    <td className="p-3 border-r-2 border-dashed border-gray-300">
                                        {new Date(txn.created_at).toLocaleDateString()} <br/>
                                        <span className="text-xs text-gray-500">{new Date(txn.created_at).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="p-3 border-r-2 border-dashed border-gray-300 font-bold">
                                        {txn.type}
                                    </td>
                                    <td className="p-3 border-r-2 border-dashed border-gray-300">
                                        {txn.description || '-'}
                                        {txn.auction_id && <span className="text-retro-blue block text-xs">REF: ITEM #{txn.auction_id}</span>}
                                    </td>
                                    <td className={`p-3 text-right font-bold text-lg ${
                                        txn.type === 'DEPOSIT' || txn.type === 'BID_REFUND' 
                                            ? 'text-green-600' 
                                            : 'text-red-600'
                                    }`}>
                                        {txn.type === 'DEPOSIT' || txn.type === 'BID_REFUND' ? '+' : '-'}${parseFloat(txn.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Wallet;