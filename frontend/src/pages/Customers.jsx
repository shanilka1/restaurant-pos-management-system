import React, { useState, useEffect } from 'react';
import { customerService } from '../services/api';

import CustomerTable from '../components/customers/CustomerTable';
import CustomerForm from '../components/customers/CustomerForm';
import DeleteCustomerModal from '../components/customers/DeleteCustomerModal';

export default function Customers() {
    // Data State
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Filter State
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, search]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await customerService.getAll({ 
                search,
                page: currentPage,
                per_page: 10
            });
            setCustomers(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch customers.');
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to page 1 on new search
        fetchCustomers();
    };

    // Modal Handlers
    const openAddModal = () => {
        setSelectedCustomer(null);
        setShowForm(true);
    };

    const openEditModal = (customer) => {
        setSelectedCustomer(customer);
        setShowForm(true);
    };

    const openDeleteModal = (customer) => {
        setSelectedCustomer(customer);
        setShowDelete(true);
    };

    // Action Handlers
    const onActionSuccess = (message) => {
        setSuccessMsg(message);
        fetchCustomers();
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Customers</h2>
                <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all" onClick={openAddModal}>
                    + Add Customer
                </button>
            </div>

            {successMsg && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl mb-6 font-medium">
                    {successMsg}
                </div>
            )}
            {error && (
                <div className="bg-red-50 text-red-800 border border-red-200 px-4 py-3 rounded-xl mb-6 font-medium">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 mb-6">
                <form onSubmit={handleSearch} className="flex mb-6 space-x-3">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all max-w-md"
                    />
                    <button type="submit" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2 px-4 rounded-xl shadow-sm transition-all">
                        Search
                    </button>
                </form>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <svg className="animate-spin h-8 w-8 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <>
                        <CustomerTable 
                            customers={customers} 
                            onEdit={openEditModal} 
                            onDelete={openDeleteModal} 
                        />
                        
                        {/* Pagination Controls */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-end mt-6">
                                <div className="flex items-center space-x-2">
                                    <button 
                                        disabled={pagination.current_page === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)} 
                                        className={`px-3 py-1.5 rounded-xl font-bold transition-all text-sm ${pagination.current_page === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                                    >
                                        Prev
                                    </button>
                                    <span className="px-4 py-1.5 font-bold text-violet-600 bg-violet-50 rounded-xl text-sm">
                                        {pagination.current_page}
                                    </span>
                                    <button 
                                        disabled={pagination.current_page === pagination.last_page}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className={`px-3 py-1.5 rounded-xl font-bold transition-all text-sm ${pagination.current_page === pagination.last_page ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <CustomerForm 
                show={showForm} 
                handleClose={() => setShowForm(false)} 
                customerToEdit={selectedCustomer}
                onSaveSuccess={() => onActionSuccess(selectedCustomer ? 'Customer updated successfully!' : 'Customer created successfully!')}
            />

            <DeleteCustomerModal
                show={showDelete}
                handleClose={() => setShowDelete(false)}
                customerToDelete={selectedCustomer}
                onDeleteSuccess={() => onActionSuccess('Customer deleted successfully!')}
            />
        </div>
    );
}