import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../../services/api';

export default function ProductForm({ show, handleClose, productToEdit, onSaveSuccess }) {
    const isEditMode = !!productToEdit;

    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category_id: '',
        price: '',
        stock_quantity: '',
        description: '',
        is_active: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch categories on mount
    useEffect(() => {
        const fetchCats = async () => {
            setLoadingCats(true);
            try {
                // Fetch up to 100 categories for the dropdown, assuming it's enough for a small POS.
                const res = await categoryService.getAll({ per_page: 100 });
                setCategories(res.data.data);
            } catch (err) {
                console.error("Failed to load categories.");
            } finally {
                setLoadingCats(false);
            }
        };
        fetchCats();
    }, []);

    useEffect(() => {
        if (show) {
            if (isEditMode) {
                setFormData({
                    name: productToEdit.name || '',
                    sku: productToEdit.sku || '',
                    category_id: productToEdit.category_id || '',
                    price: productToEdit.price || '',
                    stock_quantity: productToEdit.stock_quantity ?? '',
                    description: productToEdit.description || '',
                    is_active: productToEdit.is_active ?? true
                });
            } else {
                setFormData({
                    name: '',
                    sku: '',
                    category_id: '',
                    price: '',
                    stock_quantity: '',
                    description: '',
                    is_active: true
                });
            }
            setError(null);
            setValidationErrors({});
        }
    }, [show, productToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear specific validation error on change
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});

        // Prepare payload, convert values where necessary
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: formData.stock_quantity === '' ? null : parseFloat(formData.stock_quantity),
            category_id: parseInt(formData.category_id)
        };

        try {
            if (isEditMode) {
                await productService.update(productToEdit.id, payload);
            } else {
                await productService.create(payload);
            }
            onSaveSuccess();
            handleClose();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError('Validation failed. Please correct the highlighted fields.');
                setValidationErrors(err.response.data.errors || {});
            } else {
                setError('Failed to save product. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Product' : 'Add Product'}</h2>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        {error && (
                            <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-6 text-sm font-medium">
                                {error}
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="prodName">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="prodName"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all`}
                                />
                                {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="prodSKU">
                                    SKU <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="prodSKU"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.sku ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all`}
                                />
                                {validationErrors.sku && <p className="text-red-500 text-xs mt-1">{validationErrors.sku}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                            <div className="md:col-span-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="prodCat">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="prodCat"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loadingCats}
                                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.category_id ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all disabled:opacity-75`}
                                >
                                    <option value="">{loadingCats ? 'Loading...' : 'Select Category'}</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {validationErrors.category_id && <p className="text-red-500 text-xs mt-1">{validationErrors.category_id}</p>}
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="prodPrice">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="prodPrice"
                                    step="0.01"
                                    min="0"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.price ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all`}
                                />
                                {validationErrors.price && <p className="text-red-500 text-xs mt-1">{validationErrors.price}</p>}
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="prodStock">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    id="prodStock"
                                    min="0"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    disabled={isEditMode}
                                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.stock_quantity ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all disabled:bg-slate-50 disabled:text-slate-500`}
                                />
                                {isEditMode && (
                                    <p className="text-slate-400 text-xs mt-1">Use Stock module to adjust.</p>
                                )}
                                {validationErrors.stock_quantity && <p className="text-red-500 text-xs mt-1">{validationErrors.stock_quantity}</p>}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="prodDesc">
                                Description (Optional)
                            </label>
                            <textarea
                                id="prodDesc"
                                rows="2"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${validationErrors.description ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'} bg-white focus:ring-2 outline-none text-slate-700 text-sm font-medium transition-all`}
                            ></textarea>
                            {validationErrors.description && <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>}
                        </div>

                        <div className="flex items-center mt-2">
                            <input 
                                type="checkbox"
                                id="prodActive"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="w-5 h-5 text-violet-600 bg-white border-slate-300 rounded focus:ring-violet-500 focus:ring-2"
                            />
                            <label className="ml-2 text-sm font-bold text-slate-700 cursor-pointer" htmlFor="prodActive">
                                Product is Active
                            </label>
                        </div>
                    </div>
                    
                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            disabled={loading}
                            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
