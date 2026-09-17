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
            const registeredUser = await register({ 
                name, 
                email, 
                password, 
                password_confirmation, 
                role 
            });
            if (registeredUser && registeredUser.role === 'cashier') {
                navigate('/pos', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            console.error('Registration Error:', err);
            if (err.response) {
                if (err.response.status === 422 && err.response.data && err.response.data.errors) {
                    const msgs = Object.values(err.response.data.errors).flat().join(', ');
                    setError(msgs || 'Validation error.');
                } else {
                    setError(err.response.data?.message || `Server error: Rs {err.response.status}`);
                }
            } else if (err.request) {
                setError('Network error: Could not reach the server. Please check your connection.');
            } else {
                setError(`An error occurred: Rs {err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
            
            {/* Left Sidebar (Dark Amber Theme) */}
            <div className="hidden lg:flex lg:w-1/3 bg-slate-900 text-white flex-col relative overflow-hidden border-r border-amber-500/20">
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-amber-500/20 rounded-full filter blur-[120px] pointer-events-none"></div>

                <div className="flex p-12 flex-grow flex-col justify-center items-center z-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 mb-6 border border-amber-400/30">
                        <span className="text-3xl">🍔</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-amber-400 font-[Poppins] tracking-tight mb-2">GRAND RESTAURANT POS</h1>
                    <p className="text-slate-300 text-sm mb-12 font-medium">Create your store account</p>
                    
                    <div className="w-full max-w-xs space-y-4">
                        <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 flex items-center gap-4 text-left">
                            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-sm font-extrabold shadow-md">1</div>
                            <span className="text-sm font-extrabold text-amber-300">Account Registration</span>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-4 flex items-center gap-4 opacity-60 text-left">
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-sm font-bold">2</div>
                            <span className="text-sm font-bold text-slate-400">Launch Terminal & KDS</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 text-center text-xs text-slate-400 z-10 font-semibold border-t border-slate-800">
                    &copy; {new Date().getFullYear()} Grand Restaurant Suite.
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-y-auto">
                <div className="w-full max-w-2xl">
                    <div className="mb-8 text-left">
                        <span className="inline-block px-3 py-1 mb-3 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-extrabold uppercase">
                            Store Registration
                        </span>
                        <h2 className="text-3xl font-extrabold font-[Poppins] text-white mb-2 tracking-tight">Create your account</h2>
                        <p className="text-slate-300 text-sm font-medium">Fill out the details to register your staff account</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-sm font-semibold">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wide mb-2">
                                    Full Name <span className="text-amber-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-amber-400">👤</span>
                                    <input 
                                        type="text"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-amber-500/30 bg-slate-900 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all outline-none text-white text-sm font-semibold"
                                        placeholder="Chef John"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wide mb-2">
                                    Email Address <span className="text-amber-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-amber-400">✉️</span>
                                    <input 
                                        type="email"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-amber-500/30 bg-slate-900 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all outline-none text-white text-sm font-semibold"
                                        placeholder="staff@restaurant.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wide mb-2">
                                    Password <span className="text-amber-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-amber-400">🔒</span>
                                    <input 
                                        type="password"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-amber-500/30 bg-slate-900 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all outline-none text-white text-sm font-semibold"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wide mb-2">
                                    Confirm Password <span className="text-amber-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-amber-400">🔒</span>
                                    <input 
                                        type="password"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-amber-500/30 bg-slate-900 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all outline-none text-white text-sm font-semibold"
                                        placeholder="••••••••"
                                        value={password_confirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-wide mb-2">
                                Account Role <span className="text-amber-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-amber-400">🎭</span>
                                <select 
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-amber-500/30 bg-slate-900 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all outline-none text-white text-sm font-semibold cursor-pointer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="cashier">Cashier Staff</option>
                                    <option value="admin">Administrator Manager</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold py-4 rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Creating Account...' : 'Complete Registration'} 
                                {!loading && <span>&rarr;</span>}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-400 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-amber-400 font-extrabold hover:text-amber-300 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
