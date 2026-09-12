import React from 'react';
import { Link } from 'react-router-dom';

export default function RecentOrders({ orders }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 font-[Poppins]">Recent Orders</h3>
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <span className="text-4xl mb-3">🧾</span>
                    <p>No recent orders found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 font-[Poppins]">Recent Orders</h3>
                <Link to="/orders" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                    View All &rarr;
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="py-4 text-sm font-semibold text-slate-700">#{order.id}</td>
                                <td className="py-4 text-sm text-slate-600">{order.customer?.name || 'Walk-in'}</td>
                                <td className="py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 text-sm font-bold text-slate-800 text-right">${parseFloat(order.total_amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
