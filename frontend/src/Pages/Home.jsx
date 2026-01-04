import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Mock data for featured items (replace with API call later)
  const featuredItems = [
    { id: 1, title: "Sony Walkman 1985", price: "$45.00", time: "02:14:00", image: "https://placehold.co/400x300/BF1A1A/FFE08F?text=WALKMAN" },
    { id: 2, title: "Vintage Typewriter", price: "$120.00", time: "05:30:22", image: "https://placehold.co/400x300/060771/white?text=TYPEWRITER" },
    { id: 3, title: "Retro Jordans", price: "$210.00", time: "00:45:10", image: "https://placehold.co/400x300/FF6C0C/black?text=SNEAKERS" },
  ];

  return (
    <div className="min-h-screen bg-retro-cream font-retro text-retro-blue selection:bg-retro-orange selection:text-white">
      
      {/* 1. THE MARQUEE (The 90s Scrolling Ticker) */}
      <div className="bg-retro-blue text-retro-cream border-b-4 border-retro-orange overflow-hidden py-1">
        <div className="animate-marquee whitespace-nowrap font-display text-xl tracking-widest">
          +++ WELCOME TO BID_WARS +++ HOT DEALS ON VINTAGE GEAR +++ SIGN UP TODAY FOR 50 FREE CREDITS +++ DO NOT FEED THE BUGS +++
        </div>
      </div>

      {/* 2. SEARCH SECTION (Just below Navbar) */}
      <div className="bg-retro-orange border-b-4 border-retro-blue p-6 shadow-md relative z-10">
        <div className="max-w-4xl mx-auto">
          <form className="flex flex-col sm:flex-row gap-4 items-center bg-white p-2 border-4 border-black shadow-hard">
            <div className="flex-grow w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <input 
                type="text" 
                id="search"
                placeholder="SEARCH_FOR_TREASURES..." 
                className="w-full h-12 px-4 text-xl font-bold uppercase placeholder-gray-400 border-none focus:ring-0 outline-none bg-transparent"
              />
            </div>
            <button type="submit" className="w-full sm:w-auto bg-retro-blue text-retro-cream font-display text-2xl px-8 py-2 border-2 border-black hover:bg-retro-red hover:scale-95 transition-transform uppercase">
              Find_Item
            </button>
          </form>
        </div>
      </div>

      {/* 3. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="inline-block bg-retro-red text-white px-4 py-1 font-bold border-2 border-black transform -rotate-2 shadow-hard-sm">
              ★ EST. 1999
            </div>
            <h1 className="font-display text-6xl md:text-8xl leading-none text-retro-blue drop-shadow-[4px_4px_0_rgba(255,108,12,1)]">
              WIN THE<br/>WAR ON<br/>PRICES.
            </h1>
            <p className="text-xl md:text-2xl border-l-8 border-retro-orange pl-6 leading-relaxed bg-white/50 p-4">
              The internet's roughest auction house. Bid on rare collectibles, retro tech, and forgotten artifacts. 
              <span className="block mt-2 font-bold">No bots. No nonsense. Just bids.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/auctions" className="text-center bg-retro-blue text-retro-cream text-2xl font-display px-8 py-4 border-4 border-black shadow-hard hover:translate-y-1 hover:shadow-none hover:bg-retro-orange transition-all uppercase">
                Start_Bidding
              </Link>
              <Link to="/sell" className="text-center bg-transparent text-retro-blue text-2xl font-display px-8 py-4 border-4 border-retro-blue hover:bg-retro-blue hover:text-retro-cream transition-all uppercase">
                List_Item
              </Link>
            </div>
          </div>

          {/* Right: Retro Graphic / "Monitor" Look */}
          <div className="relative hidden lg:block">
            <div className="bg-white border-4 border-black p-2 shadow-hard transform rotate-2">
              <div className="bg-retro-blue p-1 border-b-2 border-black flex justify-between items-center text-white px-2 mb-2 font-mono text-xs">
                <span>C:\IMAGES\HERO.BMP</span>
                <span>[X]</span>
              </div>
              <div className="aspect-square bg-retro-cream pattern-grid-lg flex items-center justify-center border-2 border-gray-300 inset-0">
                 {/* CSS Art: A simple Gavel */}
                 <div className="text-9xl">🔨</div>
              </div>
              <div className="mt-2 text-center font-bold text-sm uppercase">
                File Size: 1.44 MB
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "HOW IT WORKS" INFO SECTION */}
      <section className="bg-retro-blue text-retro-cream py-16 border-y-8 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-5xl uppercase text-retro-orange mb-4">System Protocol</h2>
            <p className="font-mono text-xl">Follow these steps to initialize transaction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-retro-cream text-retro-blue p-6 border-4 border-black shadow-hard hover:scale-105 transition-transform">
              <div className="text-6xl mb-4 text-retro-red">01.</div>
              <h3 className="font-display text-3xl mb-2 uppercase">Create_Account</h3>
              <p>Register your codename. Secure your digital wallet. Prepare for combat.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-retro-cream text-retro-blue p-6 border-4 border-black shadow-hard hover:scale-105 transition-transform">
              <div className="text-6xl mb-4 text-retro-red">02.</div>
              <h3 className="font-display text-3xl mb-2 uppercase">Place_Bid</h3>
              <p>Find your target. Enter your amount. Watch the timer count down to zero.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-retro-cream text-retro-blue p-6 border-4 border-black shadow-hard hover:scale-105 transition-transform">
              <div className="text-6xl mb-4 text-retro-red">03.</div>
              <h3 className="font-display text-3xl mb-2 uppercase">Claim_Loot</h3>
              <p>Win the war. Pay the vendor. Receive your item via physical mail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOT ITEMS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8 border-b-4 border-retro-blue pb-4">
          <h2 className="font-display text-5xl text-retro-blue">Incoming_Signals</h2>
          <Link to="/auctions" className="text-retro-red font-bold hover:underline hover:text-retro-orange uppercase">
            View_All_Logs &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div key={item.id} className="bg-white border-4 border-retro-blue shadow-hard-sm hover:shadow-hard transition-all group">
              {/* Image Container */}
              <div className="relative border-b-4 border-retro-blue h-64 overflow-hidden">
                <div className="absolute top-2 right-2 bg-retro-red text-white px-2 py-1 text-sm font-bold border-2 border-white z-10 animate-pulse">
                  LIVE
                </div>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              
              {/* Card Body */}
              <div className="p-4">
                <h3 className="font-display text-3xl truncate">{item.title}</h3>
                <div className="flex justify-between items-center mt-4 font-bold font-mono">
                  <div className="text-retro-blue text-xl">{item.price}</div>
                  <div className="bg-black text-retro-orange px-2 py-1 rounded-sm">
                    {item.time}
                  </div>
                </div>
                <button className="w-full mt-4 bg-retro-cream border-2 border-black py-2 font-bold hover:bg-retro-blue hover:text-white transition-colors uppercase">
                  Bid_Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;