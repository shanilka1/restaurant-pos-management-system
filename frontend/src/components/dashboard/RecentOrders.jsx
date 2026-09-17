import React from 'react';
import { Link } from 'react-router-dom';

export default function RecentOrders({ orders }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-amber-500/30 p-6">
                <h3 className="text-lg font-extrabold text-amber-400 mb-4 font-[Poppins]">Recent Orders</h3>
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <span className="text-4xl mb-3">🧾</span>
                    <p className="font-semibold">No recent orders found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-amber-500/30 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-extrabold text-amber-400 font-[Poppins]">Recent Orders</h3>
                <Link to="/orders" className="text-sm font-extrabold text-amber-300 hover:text-amber-200 transition-colors">
                    View All &rarr;
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-amber-500/20">
                            <th className="pb-3 text-xs font-extrabold text-amber-400 uppercase tracking-wider">Order ID</th>
                            <th className="pb-3 text-xs font-extrabold text-amber-400 uppercase tracking-wider">Customer</th>
                            <th className="pb-3 text-xs font-extrabold text-amber-400 uppercase tracking-wider">Status</th>
                            <th className="pb-3 text-xs font-extrabold text-amber-400 uppercase tracking-wider text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="py-4 text-sm font-bold text-white">#{order.id}</td>
                                <td className="py-4 text-sm text-slate-200 font-medium">{order.customer?.name || 'Walk-in'}</td>
                                <td className="py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase Rs {
                                        order.status === 'completed' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' :
                                        order.status === 'pending' ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40' :
                                        'bg-red-900/60 text-red-300 border border-red-500/40'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 text-sm font-extrabold text-amber-300 text-right">Rs {parseFloat(order.total_amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
