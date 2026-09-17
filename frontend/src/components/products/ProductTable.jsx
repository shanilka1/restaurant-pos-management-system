import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function ProductTable({ products, onEdit, onDelete }) {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    if (!products || products.length === 0) {
        return (
            <div className="text-center p-8 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-slate-500 font-medium mb-0">No products found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">ID</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Name</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">SKU</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Category</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Price</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Stock</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Status</th>
                        {isAdmin && <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 text-sm font-semibold text-slate-700">{prod.id}</td>
                            <td className="py-4 px-4 text-sm font-bold text-slate-900">{prod.name}</td>
                            <td className="py-4 px-4 text-sm font-semibold text-slate-700">{prod.sku}</td>
                            <td className="py-4 px-4 text-sm font-semibold text-slate-700">{prod.category?.name || '-'}</td>
                            <td className="py-4 px-4 text-sm font-semibold text-slate-700">Rs {parseFloat(prod.price).toFixed(2)}</td>
                            <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                                {prod.stock_quantity !== null && prod.stock_quantity !== undefined 
                                    ? prod.stock_quantity 
                                    : '-'}
                            </td>
                            <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium Rs {prod.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                                    {prod.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            {isAdmin && (
                                <td className="py-4 px-4 text-sm font-semibold text-slate-700 text-right">
                                    <button 
                                        className="bg-white border border-slate-200 text-violet-600 hover:bg-violet-50 font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all text-xs mr-2"
                                        onClick={() => onEdit(prod)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="bg-white border border-slate-200 text-red-600 hover:bg-red-50 font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all text-xs"
                                        onClick={() => onDelete(prod)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
