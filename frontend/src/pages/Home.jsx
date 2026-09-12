import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen font-sans text-slate-900 selection:bg-violet-500 selection:text-white relative overflow-hidden bg-white">
            
            {/* Background sweeping waves and gradients (OmniAI Style) */}
            <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[150px] opacity-70"></div>
                <div className="absolute top-[10%] left-[-20%] w-[700px] h-[700px] bg-violet-100 rounded-full mix-blend-multiply filter blur-[150px] opacity-70"></div>
                <div className="absolute top-[40%] right-[20%] w-[600px] h-[600px] bg-pink-50 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
            </div>

            {/* Top Navbar */}
            <nav className="relative z-50 px-8 py-6 max-w-7xl mx-auto w-full flex justify-between items-center">
                <div className="flex items-center gap-3 font-extrabold text-2xl font-[Poppins] text-slate-800 tracking-tight">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-xl text-cyan-400">🤖</span>
                    </div>
                    <div>
                        <div className="leading-none text-slate-900">MiniPOS</div>
                        <div className="text-[10px] uppercase tracking-widest text-violet-600 font-bold mt-1">Restaurant System</div>
                    </div>
                </div>

                {/* Pill Navbar */}
                <div className="hidden md:flex items-center gap-2 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-full p-1.5 shadow-sm">
                    <Link to="/" className="px-5 py-2 bg-violet-600 text-white rounded-full text-sm font-bold shadow-sm">Home</Link>
                    <a href="#features" className="px-5 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors rounded-full hover:bg-slate-100/50">Features</a>
                    <a href="#about" className="px-5 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors rounded-full hover:bg-slate-100/50">About</a>
                    <a href="#pricing" className="px-5 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors rounded-full hover:bg-slate-100/50">Pricing</a>
                </div>

                <div className="flex gap-3">
                    <Link to="/login" className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 rounded-full font-bold text-sm shadow-sm transition-all hover:bg-slate-50">
                        Sign In
                    </Link>
                    <Link to="/register" className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-bold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2">
                        Get Started
                        <span>&rarr;</span>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 flex flex-col lg:flex-row items-center gap-16">
                
                {/* Left Content */}
                <div className="flex-1 text-left">
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 font-bold text-xs uppercase tracking-wider shadow-sm">
                        <span className="text-violet-500">✨</span>
                        The future of restaurant management
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 font-[Poppins] tracking-tighter leading-[1.1]">
                        Experience the Power of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">
                            Modern Restaurant POS
                        </span>
                    </h1>
                    
                    <p className="text-lg text-slate-500 mb-10 max-w-xl leading-relaxed">
                        Transform the way you connect with customers and manage your restaurant.
                        Manage orders across Dine-in, Takeaway, and Delivery from a single 
                        workspace. Create your own organization, track inventory, and 
                        deliver fast, consistent experiences.
                    </p>
                    
                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 max-w-lg">
                        <div>
                            <div className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Seamless Operations</div>
                            <div className="text-sm font-semibold text-slate-700">Connect all restaurant channels with one POS</div>
                        </div>
                        <Link to="/register" className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap">
                            Get Start &rarr;
                        </Link>
                    </div>

                    {/* Removed supported channels dummy data */}
                </div>

                {/* Right Content / Featured Card */}
                <div className="flex-1 w-full max-w-lg relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-pink-50 transform rotate-3 rounded-[40px] shadow-lg"></div>
                    
                    <div className="relative bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-white flex flex-col items-center text-center">
                        <div className="absolute top-6 right-6 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            Online 24/7
                        </div>

                        <div className="w-32 h-32 bg-slate-900 rounded-3xl mb-8 flex items-center justify-center shadow-2xl shadow-slate-900/30">
                            <span className="text-6xl text-cyan-400">🤖</span>
                        </div>

                        <h3 className="text-2xl font-extrabold text-slate-900 mb-3 font-[Poppins]">Smart POS Assistant</h3>
                        <p className="text-sm text-slate-500 mb-10 leading-relaxed px-4">
                            Automating restaurant operations with fast order taking, live inventory, and seamless billing.
                        </p>

                        <div className="w-full flex justify-center mt-4">
                            <Link to="/login" className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2">
                                Launch Terminal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
