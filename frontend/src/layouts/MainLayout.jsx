import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavItem = ({ to, icon, label, isActive }) => (
    <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
            isActive 
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
        }`}
    >
        <span className="text-xl opacity-90">{icon}</span>
        {label}
    </Link>
);

const MainLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 selection:bg-violet-500 selection:text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-white text-slate-600 flex flex-col h-full overflow-y-auto border-r border-slate-100 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
                <div className="p-6 sticky top-0 bg-white z-10 border-b border-slate-100">
                    <Link to="/dashboard" className="flex items-center gap-3 font-extrabold text-2xl font-[Poppins] text-slate-800 tracking-tight">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/30">
                            <span className="text-xl">🍽️</span>
                        </div>
                        Mini POS
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-8">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-4">Menu</div>
                        <div className="space-y-1">
                            <NavItem to="/dashboard" icon="📊" label="Dashboard" isActive={location.pathname === '/dashboard'} />
                            <NavItem to="/pos" icon="💻" label="POS Terminal" isActive={location.pathname === '/pos'} />
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-4">Operations</div>
                        <div className="space-y-1">
                            <NavItem to="/orders" icon="🧾" label="Orders" isActive={location.pathname.startsWith('/orders')} />
                            <NavItem to="/customers" icon="👥" label="Customers" isActive={location.pathname.startsWith('/customers')} />
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-4">Inventory</div>
                        <div className="space-y-1">
                            <NavItem to="/categories" icon="📁" label="Categories" isActive={location.pathname.startsWith('/categories')} />
                            <NavItem to="/products" icon="🍔" label="Products" isActive={location.pathname.startsWith('/products')} />
                            <NavItem to="/stock" icon="📦" label="Stock Movement" isActive={location.pathname.startsWith('/stock')} />
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-10 sticky top-0 shadow-sm">
                    <div className="text-xl font-bold text-slate-800 font-[Poppins]">
                        {/* Dynamic Title could go here */}
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all">
                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm border border-violet-200">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex flex-col pr-2">
                                <span className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'User'}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{user?.role || 'Role'}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-sm font-bold transition-colors border border-slate-200 hover:border-red-200"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
