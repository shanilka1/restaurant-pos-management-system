import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';

import OrderTable from '../components/orders/OrderTable';
import OrderFilters from '../components/orders/OrderFilters';
import OrderDetails from '../components/orders/OrderDetails';

export default function Orders() {
    // Data State
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Filter State
    const [filters, setFilters] = useState({ search: '', customer_id: '', status: '', date: '' });
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getAll({ 
                ...filters,
                page: currentPage,
                per_page: 10
            });
            const p = response.data;
            setOrders(p.data || []);
            setPagination({
                current_page: p.current_page || 1,
                last_page: p.last_page || 1
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch orders.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (currentPage === 1) {
            fetchOrders();
        } else {
            setCurrentPage(1); // Effect triggers fetch
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrderId(order.id);
        setShowDetails(true);
    };

    const onUpdateSuccess = () => {
        setSuccessMsg('Order updated successfully.');
        fetchOrders();
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    return (
        <div className="w-full px-4 py-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 m-0">Order Management</h2>
            </div>

            {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium">
                    {successMsg}
                </div>
            )}
            
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 mb-6">
                <OrderFilters 
                    filters={filters} 
                    setFilters={setFilters} 
                    onSearch={handleSearch} 
                />

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-violet-600 border-r-transparent align-[-0.125em]"></div>
                    </div>
                ) : (
                    <>
                        <OrderTable 
                            orders={orders} 
                            onViewDetails={handleViewDetails} 
                        />
                        
                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-end mt-6">
                                <nav className="flex items-center gap-1">
                                    <button 
                                        disabled={pagination.current_page === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition-colors"
                                    >
                                        Prev
                                    </button>
                                    <button className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-sm font-bold shadow-md">
                                        {pagination.current_page}
                                    </button>
                                    <button 
                                        disabled={pagination.current_page === pagination.last_page}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition-colors"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <OrderDetails 
                show={showDetails} 
                handleClose={() => setShowDetails(false)}
                orderId={selectedOrderId}
                onUpdateSuccess={onUpdateSuccess}
            />
        </div>
    );
}