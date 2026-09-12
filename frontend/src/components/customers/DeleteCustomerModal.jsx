import React, { useState } from 'react';
import { customerService } from '../../services/api';

export default function DeleteCustomerModal({ show, handleClose, customerToDelete, onDeleteSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        if (!customerToDelete) return;
        
        setLoading(true);
        setError(null);

        try {
            await customerService.delete(customerToDelete.id);
            onDeleteSuccess();
            handleClose();
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('You do not have permission to delete customers.');
            } else {
                setError('Failed to delete customer. They might be linked to existing orders.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-red-600">Delete Customer</h2>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-800 border border-red-200 px-4 py-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <p className="text-slate-700 font-medium">Are you sure you want to delete the customer <strong className="font-bold text-slate-900">{customerToDelete?.name}</strong>?</p>
                    <p className="text-slate-500 text-sm">This action cannot be undone. You may not be able to delete them if they have active orders in the system.</p>
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50">
                    <button type="button" onClick={handleClose} disabled={loading} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all">
                        Cancel
                    </button>
                    <button type="button" onClick={handleDelete} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
