import React from 'react';

const variantConfig = {
    primary: 'from-indigo-500 to-indigo-600 shadow-indigo-500/30',
    success: 'from-emerald-400 to-emerald-500 shadow-emerald-500/30',
    info: 'from-cyan-400 to-cyan-500 shadow-cyan-500/30',
    warning: 'from-amber-400 to-amber-500 shadow-amber-500/30',
    dark: 'from-slate-700 to-slate-800 shadow-slate-700/30',
    secondary: 'from-purple-500 to-purple-600 shadow-purple-500/30'
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
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1 group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgClass} flex items-center justify-center text-xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
            
            {/* Soft background reflection */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${bgClass} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
        </div>
    );
}
