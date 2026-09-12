import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';

export default function Register() {
    const { register, token } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('cashier');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== password_confirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await register({ 
                name, 
                email, 
                password, 
                password_confirmation, 
                role 
            });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Registration Error:', err);
            if (err.response) {
                if (err.response.status === 422 && err.response.data && err.response.data.errors) {
                    const msgs = Object.values(err.response.data.errors).flat().join(', ');
                    setError(msgs || 'Validation error.');
                } else {
                    setError(err.response.data?.message || `Server error: ${err.response.status}`);
                }
            } else if (err.request) {
                setError('Network error: Could not reach the server. Please check your connection.');
            } else {
                setError(`An error occurred: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans bg-white">
            
            {/* Left Sidebar (Dark Blue/Purple) */}
            <div className="hidden lg:flex lg:w-1/3 bg-[#0f0b29] text-white flex-col relative overflow-hidden">
                {/* Glowing effects */}
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-violet-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

                <div className="flex p-12 flex-grow flex-col justify-center items-center z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/40 mb-6 border border-violet-400/30">
                        <span className="text-3xl">🍽️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white font-[Poppins] tracking-tight mb-2">Mini Restaurant POS</h1>
                    <p className="text-slate-300 text-sm mb-12">Your restaurant in one secure place.</p>
                    
                    <div className="w-full max-w-xs space-y-4">
                        {/* Step 1 Active */}
                        <div className="bg-[#1e1a3b] border border-violet-500/30 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-[#252145]">
                            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-600/30">1</div>
                            <span className="text-sm font-semibold text-white">Account Details</span>
                        </div>
                        {/* Step 2 Inactive */}
                        <div className="border border-slate-700/50 rounded-xl p-4 flex items-center gap-4 opacity-50">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold">2</div>
                            <span className="text-sm font-semibold text-slate-300">Dashboard Access</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 text-center text-xs text-slate-500 z-10">
                    &copy; {new Date().getFullYear()} Mini Restaurant POS.
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-y-auto">
                <div className="w-full max-w-3xl">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold font-[Poppins] text-slate-900 mb-2 tracking-tight">Register your account</h2>
                            <p className="text-slate-500 text-sm">Fill out the form below to create your restaurant workspace</p>
                        </div>
                        <div className="px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                            Step 1 / 2
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">👤</span>
                                    <input 
                                        type="text"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none text-slate-700 text-sm font-medium"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">✉️</span>
                                    <input 
                                        type="email"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none text-slate-700 text-sm font-medium"
                                        placeholder="user@restaurant.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🔒</span>
                                    <input 
                                        type="password"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none text-slate-700 text-sm font-medium"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🔒</span>
                                    <input 
                                        type="password"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none text-slate-700 text-sm font-medium"
                                        placeholder="••••••••"
                                        value={password_confirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                                Account Role <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🎭</span>
                                <select 
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none cursor-pointer appearance-none text-slate-700 text-sm font-medium"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="cashier">Cashier</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-600/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Creating Account...' : 'Next — Create Account'} 
                                {!loading && <span>&rarr;</span>}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-600 font-bold hover:text-violet-700 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
