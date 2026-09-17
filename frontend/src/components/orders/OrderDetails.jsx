import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import OrderStatusControl from './OrderStatusControl';

export default function OrderDetails({ show, handleClose, orderId, onUpdateSuccess }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && orderId) {
            fetchOrderDetails();
        }
    }, [show, orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await orderService.getById(orderId);
            setOrder(res.data.data);
        } catch (err) {
            setError('Failed to load order details.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = () => {
        // Refresh details after a status change (e.g. cancelled)
        fetchOrderDetails();
        onUpdateSuccess();
    };

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

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 m-0">Order Details #{orderId}</h2>
                    <button 
                        onClick={handleClose} 
                        className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-violet-600 border-r-transparent align-[-0.125em]"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 font-medium text-center py-4">{error}</div>
                    ) : order ? (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <div className="text-sm mb-2"><strong className="text-slate-700">Date:</strong> <span className="text-slate-600">{new Date(order.created_at).toLocaleString()}</span></div>
                                    <div className="text-sm"><strong className="text-slate-700">Status:</strong> {getStatusBadge(order.status)}</div>
                                </div>
                                <div className="md:text-right">
                                    <div className="text-sm mb-2"><strong className="text-slate-700">Customer:</strong> <span className="text-slate-600">{order.customer?.name || 'Walk-in'}</span></div>
                                    <div className="text-sm"><strong className="text-slate-700">Cashier:</strong> <span className="text-slate-600">{order.user?.name || '-'}</span></div>
                                </div>
                            </div>

                            <OrderStatusControl 
                                order={order} 
                                onStatusUpdated={handleStatusUpdate} 
                            />

                            <h6 className="mt-8 mb-4 font-bold text-slate-800 border-b border-slate-100 pb-2">Order Items</h6>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Product</th>
                                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Qty</th>
                                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right">Unit Price</th>
                                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {order.orderItems?.map(item => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3 text-sm font-semibold text-slate-700">
                                                    {item.product?.name || `Product #${item.product_id}`}
                                                    <div className="text-xs text-slate-400 font-normal mt-0.5">{item.product?.sku}</div>
                                                </td>
                                                <td className="py-3 text-sm font-medium text-slate-600 text-center">{item.quantity}</td>
                                                <td className="py-3 text-sm font-medium text-slate-600 text-right">Rs {parseFloat(item.unit_price).toFixed(2)}</td>
                                                <td className="py-3 text-sm font-bold text-slate-800 text-right">Rs {parseFloat(item.subtotal).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3" className="py-4 text-right font-bold text-slate-600">Total:</td>
                                            <td className="py-4 text-right font-bold text-slate-800 text-lg">Rs {parseFloat(order.total_amount).toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    ) : null}
                </div>
                
                <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50 shrink-0">
                    <button 
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2 px-4 rounded-xl shadow-sm transition-all text-sm"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
