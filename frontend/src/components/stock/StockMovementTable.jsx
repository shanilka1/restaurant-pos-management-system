import React from 'react';

export default function StockMovementTable({ movements }) {
    if (!movements || movements.length === 0) {
        return (
            <div className="text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-slate-500 font-medium mb-0">No stock movements found.</p>
            </div>
        );
    }

    const getTypeBadge = (type) => {
        switch(type) {
            case 'in': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">IN</span>;
            case 'out': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">OUT</span>;
            case 'adjustment': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">ADJUSTMENT</span>;
            default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{type}</span>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">ID</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Date</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Product</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Type</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Quantity</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Prev Stock</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">New Stock</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">Reason</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-4">User</th>
                    </tr>
                </thead>
                <tbody>
                    {movements.map((mov, idx) => (
                        <tr key={mov.id} className={`hover:bg-slate-50/50 Rs {idx !== movements.length - 1 ? 'border-b border-slate-100' : ''}`}>
                            <td className="py-4 text-sm font-semibold text-slate-700 px-4 align-middle">{mov.id}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700 px-4 align-middle">{new Date(mov.created_at).toLocaleString()}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700 px-4 align-middle">
                                {mov.product?.name || '-'} <br/><small className="text-slate-400 font-medium">{mov.product?.sku}</small>
                            </td>
                            <td className="py-4 text-sm font-semibold text-slate-700 px-4 align-middle">{getTypeBadge(mov.type)}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700 px-4 align-middle">
                                {mov.type === 'out' ? '-' : (mov.type === 'in' ? '+' : '')}{mov.quantity}
                            </td>
                            <td className="py-4 text-sm font-semibold text-slate-700 px-4 align-middle">{mov.previous_stock}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700 px-4 align-middle">{mov.new_stock}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700 px-4 align-middle">{mov.reason || '-'}</td>
                            <td className="py-4 text-sm font-semibold text-slate-700 px-4 align-middle">{mov.user?.name || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
