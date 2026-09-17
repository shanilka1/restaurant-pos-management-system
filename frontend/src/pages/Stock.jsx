import React, { useState, useEffect, useContext } from 'react';
import { stockService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

import StockMovementTable from '../components/stock/StockMovementTable';
import StockMovementForm from '../components/stock/StockMovementForm';
import StockFilters from '../components/stock/StockFilters';

export default function Stock() {
    const { role } = useContext(AuthContext);
    const isAdmin = role === 'admin';

    // Data State
    const [movements, setMovements] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Filter State
    const [filters, setFilters] = useState({ product_id: '', type: '' });
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchMovements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const fetchMovements = async () => {
        try {
            setLoading(true);
            const response = await stockService.getAll({ 
                ...filters,
                page: currentPage,
                per_page: 10
            });
            setMovements(response.data.data || response.data);
            
            const p = response.data;
            setPagination({
                current_page: p.current_page || 1,
                last_page: p.last_page || 1
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch stock movements.');
            setMovements([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (currentPage === 1) {
            fetchMovements();
        } else {
            setCurrentPage(1); // Effect triggers fetch
        }
    };

    const onActionSuccess = () => {
        setSuccessMsg('Stock movement recorded successfully!');
        if (currentPage === 1) {
            fetchMovements();
        } else {
            setCurrentPage(1);
        }
        setTimeout(() => setSuccessMsg(null), 4000);
    };

    return (
        <div className="w-full px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-700">Stock Management</h2>
                {isAdmin && (
                    <button 
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all"
                        onClick={() => setShowForm(true)}
                    >
                        + Record Movement
                    </button>
                )}
            </div>

            {successMsg && (
                <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 font-medium">
                    {successMsg}
                </div>
            )}
            {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-6 font-medium">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 mb-6">
                <StockFilters 
                    filters={filters} 
                    setFilters={setFilters} 
                    onSearch={handleSearch} 
                />

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                    </div>
                ) : (
                    <>
                        <StockMovementTable movements={movements} />
                        
                        {/* Pagination Controls */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-end mt-6 space-x-2">
                                <button 
                                    disabled={pagination.current_page === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)} 
                                    className={`bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm transition-all ${pagination.current_page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                                >
                                    Previous
                                </button>
                                <span className="flex items-center px-4 font-bold text-slate-700">
                                    {pagination.current_page} / {pagination.last_page}
                                </span>
                                <button 
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className={`bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm transition-all ${pagination.current_page === pagination.last_page ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <StockMovementForm 
                show={showForm} 
                handleClose={() => setShowForm(false)} 
                onSaveSuccess={onActionSuccess}
            />
        </div>
    );
}