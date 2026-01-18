import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import
import Navbar from './components/Navbar';
import Footer from "./components/Footer.jsx";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import CreateAuction from './Pages/CreateAuction';
// import TestFirebase from './Pages/TestFirebase';
import Auctions from './Pages/Auctions.jsx';
import AuctionDetails from './Pages/AuctionDetails.jsx';
import Wallet from "./Pages/Wallet.jsx";
import './App.css';

function App() {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-auction" element={<CreateAuction />} />
          {/* <Route path="/test-firebase" element={<TestFirebase />} /> */}
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/auctions/:id" element={<AuctionDetails />} />
          <Route path="*" element={<div className="text-center mt-8">Page not found.</div>} />
          <Route path="/wallet" element={<Wallet/>} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;