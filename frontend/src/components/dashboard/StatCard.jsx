import React from 'react';

const variantConfig = {
    primary: 'from-amber-400 to-amber-600 shadow-amber-500/30 text-slate-950',
    success: 'from-emerald-400 to-emerald-600 shadow-emerald-500/30 text-slate-950',
    info: 'from-amber-500 to-orange-600 shadow-orange-500/30 text-slate-950',
    warning: 'from-yellow-400 to-amber-500 shadow-yellow-500/30 text-slate-950',
    dark: 'from-slate-700 to-slate-800 shadow-slate-700/30 text-white',
    secondary: 'from-amber-600 to-amber-800 shadow-amber-600/30 text-white'
};

const iconConfig = {
    primary: '💰',
    success: '📈',
    info: '🛍️',
    warning: '📋',
    dark: '🍔',
    secondary: '👥'
};

export default function StatCard({ title, value, variant = 'primary' }) {
    const bgClass = variantConfig[variant] || variantConfig.primary;
    const icon = iconConfig[variant] || '✨';

    return (
        <div className="relative overflow-hidden bg-slate-900 p-6 rounded-2xl shadow-xl border border-amber-500/30 hover:border-amber-400 transition-all hover:-translate-y-1 group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2">{title}</p>
                    <h3 className="text-3xl font-extrabold text-white font-[Poppins]">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br Rs {bgClass} flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
            
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br Rs {bgClass} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
        </div>
    );
}
