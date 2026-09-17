import React from 'react';

export default function OrderTable({ orders, onViewDetails }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="text-center p-8 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-slate-500 font-medium mb-0">No orders found.</p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed': 
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Completed</span>;
            case 'cancelled': 
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
            case 'pending': 
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pending</span>;
            default: 
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Order ID</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Date</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Customer</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Cashier</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Total</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Status</th>
                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 text-sm font-bold text-slate-800">#{order.id}</td>
                            <td className="py-4 text-sm font-medium text-slate-600">{new Date(order.created_at).toLocaleString()}</td>
                            <td className="py-4 text-sm font-medium text-slate-600">{order.customer?.name || 'Walk-in'}</td>
                            <td className="py-4 text-sm font-medium text-slate-600">{order.user?.name || '-'}</td>
                            <td className="py-4 text-sm font-bold text-slate-800">Rs {parseFloat(order.total_amount).toFixed(2)}</td>
                            <td className="py-4 text-sm">{getStatusBadge(order.status)}</td>
                            <td className="py-4 text-sm text-right">
                                <button 
                                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-1.5 px-3 rounded-xl shadow-sm transition-all text-xs"
                                    onClick={() => onViewDetails(order)}
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
