import React, { useState, useEffect } from 'react';
import { stockService, productService } from '../../services/api';

export default function StockMovementForm({ show, handleClose, onSaveSuccess }) {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [formData, setFormData] = useState({
        product_id: '',
        type: 'in',
        quantity: '',
        reason: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch active products on mount
    useEffect(() => {
        if (show) {
            setFormData({
                product_id: '',
                type: 'in',
                quantity: '',
                reason: ''
            });
            setError(null);
            setValidationErrors({});
            fetchProducts();
        }
    }, [show]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await productService.getAll({ per_page: 100 });
            setProducts(res.data.data.filter(p => p.is_active));
        } catch (err) {
            console.error("Failed to load products.");
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});

        // Validate quantity locally first
        const qty = parseFloat(formData.quantity);
        if (isNaN(qty) || qty <= 0) {
            setValidationErrors({ quantity: 'Quantity must be a positive number greater than zero.' });
            setLoading(false);
            return;
        }

        const payload = {
            product_id: parseInt(formData.product_id),
            type: formData.type,
            quantity: qty,
            reason: formData.reason
        };

        try {
            await stockService.create(payload);
            onSaveSuccess();
            handleClose();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                if (err.response.data.error) {
                    setError(err.response.data.error);
                } else {
                    setError('Validation failed. Please correct the highlighted fields.');
                    setValidationErrors(err.response.data.errors || {});
                }
            } else if (err.response && (err.response.status === 400 || err.response.status === 403)) {
                setError(err.response.data.message || 'The stock operation was rejected by the server.');
            } else {
                setError('Failed to record stock movement. Please try again.');
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
                    <h2 className="text-xl font-bold text-slate-800">Add Stock Movement</h2>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {error && <div className="bg-red-100 text-red-800 p-4 rounded-xl font-medium text-sm">{error}</div>}
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="product_id">
                                Product <span className="text-red-500">*</span>
                            </label>
                            <select 
                                id="product_id"
                                name="product_id"
                                value={formData.product_id}
                                onChange={handleChange}
                                required
                                disabled={loadingProducts}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all Rs {validationErrors.product_id ? 'border-red-500' : 'border-slate-200'}`}
                            >
                                <option value="">{loadingProducts ? 'Loading...' : 'Select Product'}</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>
                                ))}
                            </select>
                            {validationErrors.product_id && <p className="text-red-500 text-xs font-semibold mt-1">{validationErrors.product_id}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="type">
                                    Movement Type <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all Rs {validationErrors.type ? 'border-red-500' : 'border-slate-200'}`}
                                >
                                    <option value="in">IN (Add Stock)</option>
                                    <option value="out">OUT (Remove Stock)</option>
                                    <option value="adjustment">ADJUSTMENT (Audit/Correct)</option>
                                </select>
                                {validationErrors.type && <p className="text-red-500 text-xs font-semibold mt-1">{validationErrors.type}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="quantity">
                                    Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="quantity"
                                    type="number"
                                    min="0.01"
                                    step="any"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all Rs {validationErrors.quantity ? 'border-red-500' : 'border-slate-200'}`}
                                />
                                {validationErrors.quantity && <p className="text-red-500 text-xs font-semibold mt-1">{validationErrors.quantity}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="reason">
                                Reason
                            </label>
                            <textarea
                                id="reason"
                                rows={2}
                                name="reason"
                                placeholder="Optional reason for the movement (e.g. Received new shipment)"
                                value={formData.reason}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 text-sm font-medium transition-all Rs {validationErrors.reason ? 'border-red-500' : 'border-slate-200'}`}
                            />
                            {validationErrors.reason && <p className="text-red-500 text-xs font-semibold mt-1">{validationErrors.reason}</p>}
                        </div>

                    </div>
                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            disabled={loading}
                            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2 px-4 rounded-xl shadow-sm transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || !formData.product_id || !formData.quantity}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Record Movement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
