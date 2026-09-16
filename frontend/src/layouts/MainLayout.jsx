import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavItem = ({ to, icon, label, isActive, onClick }) => (
    <Link 
        to={to} 
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-sm ${
            isActive 
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-lg shadow-amber-500/25' 
            : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800/80'
        }`}
    >
        <span className="text-lg opacity-90">{icon}</span>
        {label}
    </Link>
);

const MainLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Auto-close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-amber-500/20 shadow-2xl">
            <div className="p-5 sticky top-0 bg-slate-900 z-10 border-b border-amber-500/20 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center gap-3 font-extrabold text-xl font-[Poppins] tracking-tight">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <span className="text-lg">🍔</span>
                    </div>
                    <span className="text-amber-400">GRAND POS</span>
                </Link>
                <button 
                    onClick={() => setMobileOpen(false)} 
                    className="lg:hidden text-slate-400 hover:text-white text-xl p-1"
                >
                    ✕
                </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
                <div>
                    <div className="text-[11px] font-extrabold text-amber-400/80 uppercase tracking-wider mb-2 px-3">Terminal & Floor</div>
                    <div className="space-y-1">
                        <NavItem to="/pos" icon="🛒" label="POS Terminal" isActive={location.pathname === '/pos'} />
                        <NavItem to="/tables" icon="🍽️" label="Floor Map & Tables" isActive={location.pathname === '/tables'} />
                        <NavItem to="/kitchen" icon="🍳" label="Kitchen Display (KDS)" isActive={location.pathname === '/kitchen'} />
                        <NavItem to="/reservations" icon="📅" label="Reservations" isActive={location.pathname === '/reservations'} />
                    </div>
                </div>

                <div>
                    <div className="text-[11px] font-extrabold text-amber-400/80 uppercase tracking-wider mb-2 px-3">Management</div>
                    <div className="space-y-1">
                        <NavItem to="/dashboard" icon="📊" label="Dashboard" isActive={location.pathname === '/dashboard'} />
                        <NavItem to="/orders" icon="🧾" label="Order Bills History" isActive={location.pathname.startsWith('/orders')} />
                        <NavItem to="/reports" icon="📈" label="Sales Analytics" isActive={location.pathname.startsWith('/reports')} />
                        <NavItem to="/customers" icon="👥" label="Customer CRM & Loyalty" isActive={location.pathname.startsWith('/customers')} />
                    </div>
                </div>

                <div>
                    <div className="text-[11px] font-extrabold text-amber-400/80 uppercase tracking-wider mb-2 px-3">Inventory & Recipes</div>
                    <div className="space-y-1">
                        <NavItem to="/ingredients" icon="🥩" label="Raw Ingredients & BOM" isActive={location.pathname.startsWith('/ingredients')} />
                        <NavItem to="/products" icon="🍔" label="Menu Products" isActive={location.pathname.startsWith('/products')} />
                        <NavItem to="/categories" icon="📁" label="Categories" isActive={location.pathname.startsWith('/categories')} />
                        <NavItem to="/stock" icon="📦" label="Stock Movement Log" isActive={location.pathname.startsWith('/stock')} />
                    </div>
                </div>
            </nav>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col h-full flex-shrink-0">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div 
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative flex-1 max-w-xs w-full">
                        {sidebarContent}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
                {/* Top Header */}
                <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 px-4 lg:px-6 flex items-center justify-between z-10 sticky top-0 shadow-md">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 text-amber-400 hover:bg-slate-800 rounded-xl transition-colors border border-amber-500/20"
                            aria-label="Open Navigation Menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="text-sm sm:text-lg font-extrabold text-amber-400 font-[Poppins] truncate">
                            Grand Restaurant POS
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 bg-slate-950 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-inner border border-amber-500/30">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="hidden sm:flex flex-col pr-1">
                                <span className="text-xs font-bold text-amber-300 leading-tight">{user?.name || 'User'}</span>
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">{user?.role || 'Staff'}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-slate-950 hover:bg-red-950 text-slate-300 hover:text-red-400 rounded-xl text-xs font-bold transition-colors border border-amber-500/20 hover:border-red-500/40"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-950 relative text-slate-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
