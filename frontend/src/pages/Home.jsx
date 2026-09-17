import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen font-sans bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
            
            {/* Ambient Background Glowing Orbs */}
            <div className="absolute top-0 left-0 w-full h-[900px] pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-amber-500/20 rounded-full filter blur-[150px]"></div>
                <div className="absolute top-[25%] left-[-10%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-orange-600/20 rounded-full filter blur-[150px]"></div>
                <div className="absolute top-[55%] right-[15%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-red-600/15 rounded-full filter blur-[130px]"></div>
            </div>

            {/* Top Navbar */}
            <nav className="relative z-50 px-4 sm:px-8 py-4 max-w-7xl mx-auto w-full flex justify-between items-center border-b border-amber-500/20 bg-slate-950/80 backdrop-blur-xl">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <span className="text-2xl sm:text-3xl">🍔</span>
                    </div>
                    <div>
                        <div className="font-extrabold text-xl sm:text-2xl font-[Poppins] tracking-tight text-amber-400">
                            GRAND POS
                        </div>
                        <div className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-200 font-bold">
                            Restaurant & Billing Suite
                        </div>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-amber-500/30 rounded-full p-1.5 shadow-inner">
                    <Link to="/" className="px-5 py-2 bg-amber-500 text-slate-950 rounded-full text-sm font-extrabold shadow-md">Home</Link>
                    <a href="#features" className="px-5 py-2 text-slate-200 hover:text-amber-400 text-sm font-bold transition-colors rounded-full hover:bg-amber-950/50">Features</a>
                    <a href="#kds" className="px-5 py-2 text-slate-200 hover:text-amber-400 text-sm font-bold transition-colors rounded-full hover:bg-amber-950/50">Kitchen KDS</a>
                    <a href="#billing" className="px-5 py-2 text-slate-200 hover:text-amber-400 text-sm font-bold transition-colors rounded-full hover:bg-amber-950/50">Receipts</a>
                </div>

                {/* Right Action Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    <Link to="/login" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-full font-bold text-sm transition-all shadow-sm">
                        Sign In
                    </Link>
                    <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 rounded-full font-extrabold text-sm shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2">
                        Get Started &rarr;
                    </Link>
                </div>

                {/* Mobile Hamburger Toggle Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-amber-400 bg-slate-900 border border-amber-500/30 rounded-xl focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile Navigation Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden relative z-50 bg-slate-900 border-b border-amber-500/30 px-6 py-4 space-y-3">
                    <Link to="/" className="block py-2 text-amber-400 font-bold border-b border-slate-800" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <a href="#features" className="block py-2 text-slate-200 font-semibold border-b border-slate-800" onClick={() => setMobileMenuOpen(false)}>Features</a>
                    <a href="#kds" className="block py-2 text-slate-200 font-semibold border-b border-slate-800" onClick={() => setMobileMenuOpen(false)}>Kitchen KDS</a>
                    <div className="pt-2 flex flex-col gap-2">
                        <Link to="/login" className="w-full text-center py-2.5 bg-slate-950 text-amber-400 border border-amber-500/40 rounded-xl font-bold text-sm">
                            Sign In
                        </Link>
                        <Link to="/register" className="w-full text-center py-2.5 bg-amber-500 text-slate-950 rounded-xl font-extrabold text-sm shadow-md">
                            Get Started
                        </Link>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24 flex flex-col lg:flex-row items-center gap-12 sm:gap-16">
                
                {/* Left Hero Content */}
                <div className="flex-1 text-left">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 font-extrabold text-xs uppercase tracking-wider shadow-inner">
                        <span className="text-amber-400">🔥</span>
                        High-Performance Restaurant Management System
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 font-[Poppins] tracking-tight leading-[1.15]">
                        Streamline Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500">
                            Restaurant & POS Billing
                        </span>
                    </h1>
                    
                    <p className="text-base sm:text-lg text-slate-200 mb-8 max-w-xl leading-relaxed">
                        Effortlessly manage Dine-In tables, Takeaway counters, and Delivery orders. 
                        Features live Kitchen Display System (KDS), 80mm thermal receipt printing, 
                        shift Z-reports, and raw ingredient stock tracking.
                    </p>
                    
                    <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl max-w-xl mb-8">
                        <div>
                            <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-1">⚡ Fast POS Terminal</div>
                            <div className="text-sm font-bold text-white">Table switching, split bill & instant cash change calculation</div>
                        </div>
                        <Link to="/pos" className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-xl font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center">
                            Launch POS Terminal &rarr;
                        </Link>
                    </div>

                    {/* Stats badges */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg pt-4 border-t border-slate-800 text-center sm:text-left">
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
                            <div className="text-xs text-slate-300 font-bold mt-1">Stock Precision</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">0.2s</div>
                            <div className="text-xs text-slate-300 font-bold mt-1">Fast Checkout</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">80mm</div>
                            <div className="text-xs text-slate-300 font-bold mt-1">Thermal Print</div>
                        </div>
                    </div>
                </div>

                {/* Right Hero Card */}
                <div className="flex-1 w-full max-w-md sm:max-w-lg relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-600/30 transform rotate-2 rounded-[32px] filter blur-xl"></div>
                    
                    <div className="relative bg-slate-900 rounded-[32px] p-6 sm:p-8 shadow-2xl border-2 border-amber-500/40 flex flex-col items-center text-center">
                        <div className="w-full flex justify-between items-center mb-6">
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
                                Active Terminal
                            </span>
                            <span className="text-xs text-slate-300 font-bold font-mono">V2.0 PRO</span>
                        </div>

                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl mb-6 flex items-center justify-center shadow-xl shadow-amber-500/25">
                            <span className="text-4xl sm:text-5xl">🍽️</span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-extrabold text-amber-400 mb-2 font-[Poppins]">Gourmet POS Suite</h3>
                        <p className="text-xs sm:text-sm text-slate-200 mb-6 leading-relaxed">
                            Complete billing terminal with Dine-In table maps, live KDS kitchen tickets, and cash shift control.
                        </p>

                        <div className="w-full space-y-2 mb-6 text-left text-xs bg-slate-950 p-4 rounded-2xl border border-amber-500/30 font-mono text-slate-200">
                            <div className="flex justify-between font-bold">
                                <span className="text-amber-400">Order #104 (Dine-In)</span>
                                <span className="text-emerald-400">READY</span>
                            </div>
                            <div className="flex justify-between text-slate-200">
                                <span>2x Margherita Pizza</span>
                                <span className="font-bold">Rs 28.00</span>
                            </div>
                            <div className="flex justify-between text-slate-200">
                                <span>1x Fresh Mango Smoothie</span>
                                <span className="font-bold">Rs 5.50</span>
                            </div>
                            <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-amber-300 text-sm">
                                <span>Total Paid (Cash):</span>
                                <span>Rs 33.50</span>
                            </div>
                        </div>

                        <div className="w-full">
                            <Link to="/login" className="block w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-sm transition-all shadow-md">
                                Sign In & Launch Terminal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* High-Contrast Features Highlight Section */}
            <div id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 mb-3 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                        Core Capabilities
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-[Poppins] mb-3">
                        Built Specifically for Modern Restaurants & Cafes
                    </h2>
                    <p className="text-slate-200 max-w-2xl mx-auto text-sm sm:text-base font-medium">
                        Everything you need to run high-volume service with speed, accuracy, and customer satisfaction.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-3xl mb-5">
                                🛒
                            </div>
                            <h3 className="text-xl font-extrabold text-amber-400 mb-3 font-[Poppins]">
                                Thermal Billing & Receipts
                            </h3>
                            <p className="text-slate-200 text-sm leading-relaxed font-medium">
                                Generate itemized receipts with tax, service charges, discounts, and tendered cash change. Built-in 80mm/58mm printing preview.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800">
                            <span className="text-xs font-bold text-amber-300">✓ Auto Tax & Change Due Math</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-3xl mb-5">
                                🍽️
                            </div>
                            <h3 className="text-xl font-extrabold text-amber-400 mb-3 font-[Poppins]">
                                Interactive Floor Tables
                            </h3>
                            <p className="text-slate-200 text-sm leading-relaxed font-medium">
                                Visual floor map across Main Dining, Outdoor, VIP, and Bar sections. Real-time table status and instant guest table switching.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800">
                            <span className="text-xs font-bold text-amber-300">✓ Floor Map & Table Switch</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-3xl mb-5">
                                🍳
                            </div>
                            <h3 className="text-xl font-extrabold text-amber-400 mb-3 font-[Poppins]">
                                Kitchen Display (KDS)
                            </h3>
                            <p className="text-slate-200 text-sm leading-relaxed font-medium">
                                Live tickets queue for kitchen staff with item preparation status tracking, cooking timers, and special instructions.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800">
                            <span className="text-xs font-bold text-amber-300">✓ Live Preparation Timers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-400 font-semibold">
                <p>© 2026 Grand Restaurant POS & Billing Management System. All rights reserved.</p>
            </footer>
        </div>
    );
}
