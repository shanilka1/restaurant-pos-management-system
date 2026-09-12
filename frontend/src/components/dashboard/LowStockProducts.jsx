import React from 'react';
import { Link } from 'react-router-dom';

export default function LowStockProducts({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-4 font-[Poppins]">Low Stock Alerts</h3>
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <span className="text-4xl mb-3">✅</span>
                    <p>All stock levels are good!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 font-[Poppins] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Low Stock Alerts
                </h3>
            </div>
            
            <div className="flex-1 space-y-4">
                {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50/60 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{product.sku}</p>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-red-100 text-red-700">
                                {product.stock_quantity} left
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
                <Link to="/products" className="block w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-sm text-center rounded-xl transition-colors border border-slate-200">
                    Manage Inventory
                </Link>
            </div>
        </div>
    );
}
