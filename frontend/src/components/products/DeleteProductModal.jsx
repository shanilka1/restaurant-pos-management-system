import React, { useState } from 'react';
import { productService } from '../../services/api';

export default function DeleteProductModal({ show, handleClose, productToDelete, onDeleteSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!show) return null;

    const handleDelete = async () => {
        if (!productToDelete) return;
        
        setLoading(true);
        setError(null);

        try {
            await productService.delete(productToDelete.id);
            onDeleteSuccess();
            handleClose();
        } catch (err) {
            setError('Failed to delete product. It might be linked to existing order items.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-red-600">Delete Product</h2>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">&times;</button>
                </div>
                <div className="p-6">
                    {error && (
                        <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-4 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <p className="text-slate-700 text-sm mb-2">
                        Are you sure you want to delete <strong>{productToDelete?.name}</strong> (SKU: {productToDelete?.sku})?
                    </p>
                    <p className="text-slate-500 text-xs">
                        This action cannot be undone. You may not be able to delete it if it is linked to past orders.
                    </p>
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button 
                        onClick={handleClose} 
                        disabled={loading}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDelete} 
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all disabled:opacity-50"
                    >
                        {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
