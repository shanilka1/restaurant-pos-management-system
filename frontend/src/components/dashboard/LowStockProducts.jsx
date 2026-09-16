import React from 'react';
import { Link } from 'react-router-dom';

export default function LowStockProducts({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-amber-500/30 p-6 h-full">
                <h3 className="text-lg font-extrabold text-amber-400 mb-4 font-[Poppins]">Low Stock Alerts</h3>
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <span className="text-4xl mb-3">✅</span>
                    <p className="font-semibold text-slate-300">All stock levels are optimal!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-amber-500/30 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-extrabold text-amber-400 font-[Poppins] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Low Stock Alerts
                </h3>
            </div>
            
            <div className="flex-1 space-y-4">
                {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 rounded-xl border border-red-500/40 bg-red-950/40 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-white">{product.name}</p>
                            <p className="text-xs text-amber-300 font-mono mt-0.5">{product.sku}</p>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-extrabold bg-red-900 text-red-200 border border-red-500/50">
                                {product.stock_quantity} left
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800">
                <Link to="/products" className="block w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-sm text-center rounded-xl transition-colors border border-amber-500/30">
                    Manage Inventory
                </Link>
            </div>
        </div>
    );
}
